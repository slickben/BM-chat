<template>
    <div class="flex-grow md:border-l rounded-xl grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:pr-6 pr-3">
      <div class="hidden md:block py-6 max-h-65vh col-span-2 lg:col-span-1">
        <div class="">
            <!-- breadcumb -->
            <BreadCumb/>
            <!-- user profile -->
            <UserProfile :profile="userProfile"/>

            <SearchBar/>

            <ChatHistoryBar/>
        </div>

        <div class="max-h-30vh overflow-auto">
            <UsersList/>
        </div>
      </div>
      <div class="col-span-4 lg:col-span-3 py-3 max-h-full">
          <MassegeCard/>
      </div>
      <div class="py-6 hidden lg:block ">
          <!-- breadcumb -->
        <BreadCumb/>
        <!-- user profile -->
        <!-- <UserProfile/> -->
      </div>
    </div>
</template>

<script>
    import BreadCumb from '../components/BreadCumb.vue';
    import UserProfile from '../components/UserProfile.vue';
    import SearchBar from '../components/SearchBar.vue';
    import ChatHistoryBar from '../components/ChatHistoryBar.vue';
    import UsersList from '../components/UsersList.vue';
    import MassegeCard from '../components/MassegeCard.vue';
    import io from 'socket.io-client';

    export default {
        name: "Chat",
        components: {
            BreadCumb,
            UserProfile,
            SearchBar,
            ChatHistoryBar,
            UsersList,
            MassegeCard,
        },
        data () {
            return {
                username: '',
                user: "",
                socket: io("http://localhost:3000", {transports: ['websocket']}),
                users: [],
                messages: [],
                notLogin: true,
                userProfile: {},
                receiver: "",
                privateMessage: [],
                selectedUserMessages: []
            }
        },
        methods: {
            joinServer () {
                this.socket.on("loggedIn", data => {
                    let alluser = data.users.map( user => {
                        return {
                            user: user,
                            hasNewMessage: false,
                            newMessage: "",
                            read: false
                        }
                    })
                    console.log(data)
                    this.$store.commit('ADD_USERS', alluser)

                    this.socket.emit("newuser", this.$store.state.username)
                })

                this.$store.commit('ADD_SOCKET_IO', this.socket)

                this.socket.on('previous_messages', messages => {
                    this.$store.commit('PRIVATE_MESSAGE', messages)
                })
                
                this.socket.on("connect_error", (err) => {
                    console.log(`connect_error due to ${err}`);
                });

                this.listen()
            }, 
            listen () {
                this.socket.on("userOnline", user => {
                    let newUser = {
                        user: user,
                        hasNewMessage: false,
                        newMessage: "",
                        read: false
                    }
                    this.$store.commit('ADD_USERS', newUser)
                    console.log(this.$store.state.users)
                })
                this.socket.on("userLeft", user => {

                    this.commit('REMOVE_USER_WHO_HAS_GONE_OFLINE', user)
                    
                })

                this.socket.on("new_message", message => {
                    this.$store.commit('NOTIFY_USER_WHO_HAS_NEW_MESSAGE', message)

                    this.notifyUserWhoHasSendMessage(message)

                    this.$store.commit('PRIVATE_MESSAGE', message)

                    this.$store.commit('GET_ALL_MESSAGE_OF_THE_SELECTED_USER', this.$store.state.receiver)

                })

                this.socket.onAny((event, ...args) => {
                    console.log(event, args);
                });
            }
        },
        computed: {
            usersOnline() {
                return this.users.length
            },
        },
        mounted () {
            this.joinServer()
        }
    }
</script>

<style scoped>

</style>