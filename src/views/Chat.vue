<template>
    <div class="flex-grow md:border-l rounded-xl grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:pr-6 md:pr-3">
      <div class="md:py-6 max-h-65vh col-span-2 lg:col-span-1 hidden md:block">
        <div class="">
            <!-- breadcumb -->
            <BreadCumb/>
            <!-- user profile -->
            <UserProfile/>

            <SearchBar/>

            <ChatHistoryBar/>
        </div>

        <div class="scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-300 overflow-y-scroll scrollbar-thumb-rounded max-h-30vh overflow-auto">
            <UsersList/>
        </div>
      </div>
      <div class="col-span-4 lg:col-span-3 md:py-3 max-h-full hidden md:block">
          <MassegeCard/>
      </div>
      <div class="py-6 hidden lg:block ">
          <!-- breadcumb -->
        <BreadCumb/>
        <!-- user profile -->
        <!-- <UserProfile/> -->
      </div>
      <!-- mobile view -->
      <div v-show="!isChat" class="flex flex-col md:hidden md:py-10 h-screen">
          <!-- mobile header -->
            <div class="flex-none">
                <div class="py-2 px-6">
                    <Logo />
                </div>
                <div class="flex px-6 pt-1 items-end justify-between">
                    <!-- <img class="w-20 h-20 mx-auto rounded-full" :src="profile.avatar" alt=""> -->
                    <router-link to="" class="py-1">
                        <img class="w-10 h-10 rounded-full" :src="profile.avatar" alt="">
                    </router-link >
                    <router-link to="/chat" class="text-center text-xl font-semibold border-b-2 border-gray-400 px-6">
                        <span>Chat</span>
                    </router-link >
                    <router-link to="/rooms" class="text-center text-xl font-semibold">
                        <span>Rooms</span>
                    </router-link >
                </div>
            </div>
            <div class="scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-300 overflow-y-scroll        scrollbar-thumb-rounded md:max-h-30vh overflow-auto bg-white flex-grow">
                <UsersList/>
            </div>
      </div>

      <div v-show="isChat" class="md:py-3 max-h-full md:hidden block">
          <MassegeCard/>
      </div>
    </div>

    <div>

    </div>
</template>

<script>
    import BreadCumb from '../components/BreadCumb.vue';
    import UserProfile from '../components/UserProfile.vue';
    import SearchBar from '../components/SearchBar.vue';
    import ChatHistoryBar from '../components/ChatHistoryBar.vue';
    import UsersList from '../components/UsersList.vue';
    import MassegeCard from '../components/MassegeCard.vue';
    import Logo from '../components/Logo.vue'
    import { mapState } from 'vuex'

    export default {
        name: "Chat",
        components: {
            BreadCumb,
            UserProfile,
            SearchBar,
            ChatHistoryBar,
            UsersList,
            MassegeCard,
            Logo,
        },
        // https://pacific-ocean-92747.herokuapp.com
        // http://localhost:4000
        data () {
            return {
                toggleChat: true
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
                            online: false,
                            isTyping: false,
                            typing: false
                        }
                    })

                    console.log(data.socketRoom)

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
                    
                })

                this.socket.emit("newuser", {username: this.$store.state.userProfile.username, avatar: this.$store.state.userProfile.avatar })

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
                        user: user.username,
                        avatar: user.avatar,
                        hasNewMessage: false,
                        newMessage: "",
                        read: false,
                        online: true,
                        isTyping: false,
                        typing: false
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

                this.socket.on('isTyping', data => {
                    this.$store.commit('UPDATE_USER_TYPING', data)
                })

                this.socket.on('isNoLongerTyping', data => {
                    this.$store.commit('UPDATE_USER_TYPING', data)
                })

                this.socket.onAny((event, ...args) => {
                    console.log(event, args);
                });
            }
        },
        computed: mapState({
            // arrow functions can make the code very succinct!
            isChat: state => state.isChat,
            profile: state => state.userProfile,
            socket: state => state.socket,
        }),
        mounted () {
            console.log(screen.width)
            this.joinServer()
        }
    }
</script>

<style scoped>

</style>