import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
    state () {
      return {
        token: localStorage.getItem('user-token') || '',
        status: '',
        users: [],
        username: localStorage.getItem('user-token') || '',
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
        ADD_USERNAME (state, username) {
            state.username = username
        }
    },
    
})

export default {
    store
}