import { createStore } from 'vuex'
import moment from 'moment';

import io from 'socket.io-client';
 

// Create a new store instance.

const store = createStore({
    state () {
      return {
        token: localStorage.getItem('user-token') || '',
        status: '',
        users: [],
        rooms: [],
        allRooms: [],
        room: '',
        username: localStorage.getItem('user-token') || '',
        receiver: '',
        privateMessage: [],
        roomMessages: [],
        selectedRoomMessages: [],
        selectedUserMessages: [],
        userProfile: JSON.parse(localStorage.getItem('user-profile')) || '',
        socket: io("http://localhost:4000", {transports: ['websocket']}),
        isChat: false,
        typing: false,
        toggleSearch: false,
        toggleAddRoom: false,
        timeout : undefined,
        selectedUser: {},
        isRoomChat: false,
        filteredRoom: [],
      }
    },
    getters: {
        isAuthenticated (state)  {
            return  !!state.token
        },
        authStatus (state)  {
            return   state.status
        },
        doneTodos (state) {
            return state.todos.filter(todo => todo.done)
        }
    },
    mutations: {
        AUTH_SUCCESS (state, username) {
            state.status = "sucess"
            state.token = username
        },
        TOGGLE_CHAT (state ) {
            state.isChat = !state.isChat
        },
        TOGGLE_ROOM_CHAT (state ) {
            state.isRoomChat = !state.isRoomChat
        },
        TOGGLE_SEARCH (state ) {
            state.toggleSearch = !state.toggleSearch
        },
        TOGGLE_ADD_ROOM (state ) {
            state.toggleAddRoom = !state.toggleAddRoom
        },
        AUTH_ERROR (state, err) {
            state.status = err
        },
        ADD_USERS (state, data) {
            
            if(state.users.length <= 0) {
                state.users = data
            }else {

                // check if user exit
                console.log(data)
                console.log(state.users)
                let ifUserExit = state.users.some( user => user.user === data.user)

                console.log(ifUserExit)
                if(ifUserExit) {
                    // update the user is exit
                    state.users.map( user => {
                        if(user.user == data.user) 
                        {
                            user.online = true
                        }
                    })
                    return
                }else {
                    state.users.push(data)
                }
                
                
            }
        },
        ADD_ROOMS (state, rooms) {
            state.rooms = rooms
            console.log(state.rooms)
        },
        UPDATE_ROOMS(state, room) {
            state.rooms.push(room)
        },
        ADD_TO_ALL_ROOMS (state, rooms) {
            state.allRooms = rooms
            console.log(state.allRooms)
        },
        REMOVE_ROOM_FROM_ALL_ROOMS (state, roomToRemove) {
            console.log('remove room', roomToRemove)
            state.allRooms = state.allRooms.filter( room => room._id !== roomToRemove._id)
        },
        ADD_USER_PROFILE (state, data) {

            state.userProfile = data
            
        },
        ADD_SOCKET_IO (state, socket) {

            state.socket = socket
            
        },
        ADD_USERNAME (state, username) {
            state.username = username
        },
        Add_RECEIVER(state, receiver) {
            state.receiver = receiver,
            state.users.map( user => {
                if(user.user === receiver) {
                    state.selectedUser = user
                }
            })

            console.log(state.selectedUser)
        },
        SELECT_ROOM(state, room) {
            state.room = room
        },
        GET_ALL_MESSAGE_OF_THE_SELECTED_USER (state, receiver) {
            state.selectedUserMessages = []

            state.privateMessage.map( message => {
                if(message.sender === receiver & message.receiver === state.username || message.sender === state.username & message.receiver === receiver ) {

                    state.selectedUserMessages.push(message)
                }
            })
        },
        PRIVATE_MESSAGE(state, message){
            if(state.privateMessage.length <= 0) {
                state.privateMessage = message
            }else {
                state.privateMessage.push(message)
            }
        },
        ROOM_MESSAGE (state, messages) {
            
            state.roomMessages = messages

            console.log(state.roomMessages)

        },
        UPDATE_ROOM_MESSAGE(state, message) {
            state.roomMessages.push(message)
        },
        ADD_SELECTED_ROOM_MSG(state, messages){
            state.selectedRoomMessages = messages
            console.log(state.selectedRoomMessages)
        },
        UPDATE_SELECTED_ROOM_MSG(state, message){
            state.selectedRoomMessages.push(message)
            console.log(state.selectedRoomMessages)
        },
        NOTIFY_USER_WHO_HAS_NEW_MESSAGE(state, message) {
            state.users.map(user => {
                if(user.user === message.sender){
                    user.message = message.message
                    user.hasNewMessage = true
                    if(state.receiver === message.sender){
                        user.read = true
                    }else {
                        user.read = false
                    }
                    
                }
            })
        },
        NOTIFY_ROOM_THAT_HAS_NEW_MESSAGE(state, message) {
            state.rooms.map(room => {
                if(room.name === message.room){
                    room.newMessage = message.msg
                    room.hasNewMessage = true
                    if(state.room === message.room){
                        room.read = true
                    }else {
                        room.read = false
                    }
                    
                }
            })
        },
        SET_TIMEOUT (state) {
            state.typing = false;
            state.socket.emit('noLongerTyping',{user:state.username, receiver:state.receiver, typing:false});
        },
        UPDATE_USER_TYPING(state, data) {
            
            if(data.typing === true) {

                if(data.user === state.selectedUser.user) {
                    state.selectedUser.isTyping = true
                }

                state.users.map( user => {
                    if(data.user === user.user) {
                        
                        user.isTyping = true
                    }
                })
                console.log(state.users)
            }
            else {

                if(data.user === state.selectedUser.user) {
                    state.selectedUser.isTyping = true
                }

                state.users.map( user => {
                    if(data.user === user.user) {
                        user.isTyping = false
                    }
                })
                console.log(state.users)
            }
        },
        UPDATE_USER_WHO_HAS_GONE_OFFLINE (state, userOffline) {

            state.users.map( user => {
                if(user.user == userOffline) 
                {
                    console.log(user)
                    user.online = false
                }
            })
        }
    },
    actions: {
        selectReceiver ({ commit, state }, receiver) {
          commit('Add_RECEIVER', receiver)

          commit('GET_ALL_MESSAGE_OF_THE_SELECTED_USER', receiver)

          state.users.map( user => {
                if(user.user === receiver && user.hasNewMessage){
                    user.read = true
                }
          })
          console.log(state.users)
        },
        selectRoom ({ commit, state }, room) {

            state.socket.emit('get_room_message', room)

            commit('SELECT_ROOM', room)
  
            // state.users.map( user => {
            //       if(user.user === receiver && user.hasNewMessage){
            //           user.read = true
            //       }
            // })
            // console.log(state.users)
        },
        sendMessage ({ commit, state}, message) {

            commit('SET_TIMEOUT')

            let currentTime = Date()

            let time = moment(currentTime).format("hh:mm A")

            let data = {
                sender: state.username,
                receiver: state.receiver,
                message: message,
                time: time,
                avatar: state.userProfile.avatar
            }
            console.log(data)
            state.socket.emit("privateMessage", data)

            commit('PRIVATE_MESSAGE', data)

            commit('GET_ALL_MESSAGE_OF_THE_SELECTED_USER', state.receiver,)
        },
        sendMessageToGroup ({commit, state}, message) {

            commit('SET_TIMEOUT')

            let currentTime = Date()

            let data = {
                user: state.username,
                room: state.room,
                msg: message,
                time: moment(currentTime).format("hh:mm A"),
                avatar: state.userProfile.avatar
            }
            // console.log(data)
            // commit('UPDATE_SELECTED_ROOM_MSG', data)
            state.socket.emit("msg", data)
        },
        isTyping ({commit, state}) {

            if(state.typing == false) {
                state.typing = true
                state.socket.emit('typingtoPrivate',{user:state.username, receiver:state.receiver, typing:true});
                
                state.timeout = setTimeout(function(){ 
                    commit('SET_TIMEOUT')
                 }, 5000);
                
            } 
            else {
                clearTimeout(state.timeout);
                state.timeout = setTimeout(function(){ 
                    commit('SET_TIMEOUT')
                 }, 5000);
            }
        }
    }
})

export default {
    store
}