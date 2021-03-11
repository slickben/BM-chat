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
            <UsersList v-on:select-receiver="receiverSelected" :users="users"/>
        </div>
      </div>
      <div class="col-span-4 lg:col-span-3 py-3 max-h-full">
          <MassegeCard :user="username" :selectedUser="receiver" :messages="selectedUserMessages" v-on:send-message="sendMessage"/>
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
    import randomProfile  from 'random-profile-generator';

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
            notifyUserWhoHasSendMessage(message){
                this.users.map(user => {
                    if(user.user === message.sender){
                        user.message = message.message
                        user.hasNewMessage = true
                        if(this.receiver === message.sender){
                            user.read = true
                        }else {
                            user.read = false
                        }
                        
                    }
                })
            },
            getAllMessageOfTheSelectedUser (receiver) {
                this.selectedUserMessages = []

                this.privateMessage.map( message => {
                    if(message.sender === receiver & message.receiver === this.username || message.sender === this.username & message.receiver === receiver ) {

                        this.selectedUserMessages.push(message)
                    }
                })
            },
            receiverSelected(receiver) {

                this.getAllMessageOfTheSelectedUser(receiver)

                this.receiver = receiver
                this.users.map( user => {
                    if(user.user === receiver && user.hasNewMessage){
                        user.read = true
                        console.log(this.user.read)
                    }
                })
            },
            sendMessage (message) {
                let data = {
                    sender: this.username,
                    receiver: this.receiver,
                    message: message
                }
                this.socket.emit("privateMessage", data)

                this.privateMessage.push(data)

                this.getAllMessageOfTheSelectedUser(this.receiver)
            },
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
                    this.users = alluser
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
                    let newUser = {
                        user: user,
                        hasNewMessage: false,
                        newMessage: "",
                        read: false
                    }
                    this.users.push(newUser)
                    console.log(user)
                })
                this.socket.on("userLeft", user => {
                    let userToRM = this.users.filter((ele, index, array) => {
                        return ele.user === user
                    })
                    this.users.splice(this.users.indexOf(userToRM), 1)
                    console.log('here.....')
                })
                this.socket.on("new_message", message => {
                    this.notifyUserWhoHasSendMessage(message)
                    this.privateMessage.push(message)
                    this.getAllMessageOfTheSelectedUser(this.receiver)
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
            console.log(this.users)
            
        }
    }
</script>

<style scoped>

</style>