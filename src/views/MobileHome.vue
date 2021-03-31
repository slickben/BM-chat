<template>
    <div class="flex-grow md:border-l rounded-xl grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:pr-6 md:pr-3">   
       <!-- heading -->
        <div class="flex-grow-0 flex justify-between items-center px-6 py-3 border-b border-gray-400">
            <div class="flex items-center">
                <router-link to="/" class="md:hidden">
                    <font-awesome-icon icon="arrow-left" />
                </router-link>
                <p class="text-sm md:text-base lg:text-lg font-semibold capitalize ml-3">{{ selectedUser}}</p>
            </div>
            <div class="flex justify-between items-center">
                <span class="px-4 py-1 text-sm md:text-base rounded-3xl text-purple-600 bg-purple-300">Messages</span>

            </div>
        </div>   
        <UsersList/>
    </div>
</template>

<script>

    import UsersList from '../components/UsersList.vue';
    import { mapState} from "vuex"
    import io from 'socket.io-client';

    export default {
        name: "Chat",
        components: {
            UsersList,
        },
        data () {
            return {
                socket: io("http://localhost:3000", {transports: ['websocket']}),
            }
        },
        methods: {
            joinServer () {
                this.socket.on("loggedIn", data => {
                    let alluser = data.users.map( user => {
                        return {
                            user: user.username,
                            avatar: user.avatar,
                            hasNewMessage: false,
                            newMessage: "",
                            read: false,
                            online: false
                        }
                    })

                    data.usersOnline.map( userOnline => {
                        // update user status
                        alluser.map( user => {
                            if(user.user === userOnline) {
                                user.online = true
                            }
                        })
                    })
                    
                    this.$store.commit('ADD_USERS', alluser)

                    // console.log(this.$store.state.users)
                    // console.log(this.$store.state.userProfile)

                    this.socket.emit("newuser", this.$store.state.username)
                })

                this.$store.commit('ADD_SOCKET_IO', this.socket)

                this.socket.on('previous_messages', messages => {
                    this.$store.commit('PRIVATE_MESSAGE', messages)
                })
                
                this.socket.on("connect_error", (err) => {
                    // console.log(`connect_error due to ${err}`);
                });

                this.listen()
            }, 
            listen () {
                this.socket.on("userOnline", user => {
                    let newUser = {
                        user: user,
                        hasNewMessage: false,
                        newMessage: "",
                        read: false,
                        online: true
                    }
                    this.$store.commit('ADD_USERS', newUser)
                    // console.log(this.$store.state.users)
                })
                this.socket.on("userLeft", user => {
                    console.log(user)
                    this.$store.commit('UPDATE_USER_WHO_HAS_GONE_OFFLINE', user)
                    
                })

                this.socket.on("new_message", message => {
                    this.$store.commit('NOTIFY_USER_WHO_HAS_NEW_MESSAGE', message)

                    this.$store.commit('PRIVATE_MESSAGE', message)

                    this.$store.commit('GET_ALL_MESSAGE_OF_THE_SELECTED_USER', this.$store.state.receiver)

                })

                this.socket.onAny((event, ...args) => {
                    console.log(event, args);
                });
            }
        },
        computed: mapState({
            // arrow functions can make the code very succinct!
            selectedUser: state => state.receiver,
            user: state => state.username,
            messages: state => state.selectedUserMessages,

        }),
        mounted () {
            this.joinServer()
        }
    }
</script>

<style scoped>

</style>