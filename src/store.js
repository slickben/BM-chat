import { createStore } from 'vuex'

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
        userProfile: {},
        socket: ''
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
        AUTH_ERROR (state, err) {
            state.status = err
        },
        ADD_USERS (state, data) {
            if(state.users.length <= 0) {
                state.users = data
            }else {

                // check if user exit
                let ifUserExit = state.users.map((user) => {
                    if(user.user === data.user){
                        return  user
                    }else{
                        return null
                    }
                })

                if(ifUserExit) {
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
            state.receiver = receiver
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
                state.users = message
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

        REMOVE_USER_WHO_HAS_GONE_OFLINE (state, user) {

            let userToRM = state.users.filter((ele, index, array) => {
                return ele.user === user
            })
            state.users.splice(state.users.indexOf(userToRM), 1)
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
        },
        sendMessage ({ commit, state }, message) {
            let data = {
                sender: state.username,
                receiver: state.receiver,
                message: message
            }
            console.log(data)
            state.socket.emit("privateMessage", data)

            commit('PRIVATE_MESSAGE', data)

            commit('PRIVATE_MESSAGE', data)

            commit('GET_ALL_MESSAGE_OF_THE_SELECTED_USER', state.receiver,)
        },
    }
})

export default {
    store
}