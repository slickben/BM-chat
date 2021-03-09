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
            <ChatHistory/>
        </div>
      </div>
      <div class="col-span-4 lg:col-span-3 py-3 max-h-full">
          <MassegeCard :user="username" :messages="messages" v-on:send-message="sendMessage"/>
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
    import ChatHistory from '../components/ChatHistory.vue';
    import MassegeCard from '../components/MassegeCard.vue';
    import io from 'socket.io-client';
    import randomProfile  from 'random-profile-generator';

    export default {
        name: "Chat",
        components: {
            BreadCumb,
            UserProfile,
            SearchBar,
            ChatHistoryBar,
            ChatHistory,
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
                userProfile: {}
            }
        },
        methods: {
            sendMessage (message) {
                console.log(message)
                this.socket.emit("msg", message)
            },
            joinServer () {
                this.socket.on("loggedIn", data => {
                    this.users = data.users
                    this.messages = data.messages
                    this.socket.emit("newuser", this.userProfile)
                })
                
                this.socket.on("connect_error", (err) => {
                    console.log(`connect_error due to ${err}`);
                });

                this.listen()
            }, 
            listen () {
                this.socket.on("userOnline", user => {
                    this.users.push(user)
                })
                this.socket.on("userLeft", user => {
                    this.users.splice(this.users.indexOf(user), 1)
                    console.log('here.....')
                })
                this.socket.on("msg", message => {
                    this.messages.push(message)
                })
            }
        },
        computed: {
            usersOnline() {
                return this.users.length
            },
        },
        mounted () {
            this.user = randomProfile.profile()
            this.username = this.$route.params.username

            let userData = {
                username: this.username,
                fullName: this.user.fullName,
                avatar: this.user.avatar
            }

            this.userProfile = userData

            this.joinServer()

            console.log(this.userProfile)
            console.log(this.user)
            
        }
    }
</script>

<style scoped>

</style>