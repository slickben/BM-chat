import { createStore } from 'vuex'
import moment from 'moment';

// Create a new store instance.

const store = createStore({
    state () {
      return {
        token: localStorage.getItem('user-token') || '',
        status: '',
        users: [],
        username: localStorage.getItem('user-token') || '',
        receiver: '',
        privateMessage: [],
        selectedUserMessages: [],
        userProfile: JSON.parse(localStorage.getItem('user-profile')) || '',
        socket: '',
        isChat: false,
        typing: false,
        timeout : undefined,
        selectedUser: {}
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
        AUTH_ERROR (state, err) {
            state.status = err
        },
        ADD_USERS (state, data) {
            
            if(state.users.length <= 0) {
                state.users = data
            }else {

                // check if user exit
                console.log(data)
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
        timeoutFunction({commit, state}) {
            
        },
        isTyping ({commit, state, dispatch}) {

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