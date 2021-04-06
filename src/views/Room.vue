<template>
    <AddRoom v-show="toggleAddRoom"/>
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
            <RoomList/>
        </div>
      </div>
      <div class="col-span-4 lg:col-span-3 md:py-3 max-h-full hidden md:block">
          <RoomMassegeCard/>
      </div>
      <div class="py-6 hidden lg:block ">
          <!-- breadcumb -->
        <BreadCumb/>
        <!-- user profile -->
        <!-- <UserProfile/> -->
      </div>
      <!-- mobile view -->
      <div v-show="!isRoomChat" class="flex flex-col md:hidden md:py-10 h-screen">
            <!-- list rooms to subscribe -->
            <div :class="{ hidden: !toggleSearch}" class="md:hidden absolute inset-0 bg-gray-100 z-10 bg-opacity-70 max-h-screen h-screen scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-300 overflow-y-scroll  scrollbar-thumb-rounded overflow-auto py-10 px-6">
                <div class="bg-white h-full px-4 py-3">
                    <div class="flex items-center justify-between pb-5">
                        <h3 class="font-bold text-gray-500">Click To Subscribe</h3>
                        <button  @click="toggleSearchFunc">x</button>
                    </div>
                    <!-- :class="{'bg-gray-200': room.hasNewMessage && !room.read }"  -->
                    <div class="py-6 px-4">
                        <button  @click="subscribe(room)" 
                        v-for="room in allRooms" :key="room._id" 
                        class="px-2 py-2 focus:outline-none hover:bg-gray-200 w-full flex items-center mb-1">
                            <span class="relative">
                                <img class="flex-grow-0 w-10 h-10 xl:w-10 xl:h-10 rounded rounded-full" :src="room.avatar" alt="" srcset="">
                                <!-- <span :class="{'text-green-500': user.online }" class="text-gray-500 absolute bottom-0 left-0 flex items-center">
                                    <font-awesome-icon icon="circle" size="xs" />
                                </span> -->
                            </span>
                            <div class="px-2 flex-grow">
                                <div class="flex justify-between items-center">
                                    <p class="font-semibold text-sm xl:text-sm">{{ room.name }}</p>
                                    <!-- <span v-show="user.isTyping" class="text-xs text-green-400"> is typing.... </span> -->
                                </div>
                                <!-- <p class="text-xxs xl:text-xs text-gray-400 text-left">{{ user.message }}</p> -->
                            </div>
                        </button>
                    </div>

                </div>


            </div>
            <!-- mobile header -->
            <div class="flex-none ">
                <div class="flex justify-between items-center px-6 py-2">
                    <Logo class="flex-none" />
                    <div class="flex-none">
                        <button @click="toggleSearchFunc" :class="{ hidden: toggleSearch}" class="px-2 py-2 mr-2 text-purple-600 rounded text-sm focus:outline-none">
                            <font-awesome-icon icon="search" />
                        </button>
                        <button @click="toggleAddRoomFunc" class="px-2 py-2 text-purple-600 rounded text-sm focus:outline-none">
                            <font-awesome-icon icon="plus" />
                        </button>
                    </div>
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
            <div class="scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-300 overflow-y-scroll  scrollbar-thumb-rounded md:max-h-30vh overflow-auto bg-white flex-grow">
                

                <RoomList/>
            </div>
      </div>

      <div v-show="isRoomChat" class="md:py-3 max-h-full md:hidden block">
          <RoomMassegeCard/>
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
    import RoomList from '../components/RoomList.vue';
    import RoomMassegeCard from '../components/RoomMassegeCard.vue';
    import AddRoom from '../components/AddRoom.vue';
    import Logo from '../components/Logo.vue'
    import { mapState } from 'vuex'

    export default {
        name: "Chat",
        components: {
            BreadCumb,
            UserProfile,
            SearchBar,
            ChatHistoryBar,
            RoomList,
            RoomMassegeCard,
            Logo,
            AddRoom
        },
        // https://pacific-ocean-92747.herokuapp.com
        // http://localhost:4000
        data () {
            return {
                toggleChat: true,
                rooms: []
            }
        },
        methods: {
            toggleSearchFunc() {
                this.$store.commit('TOGGLE_SEARCH')
            },
            toggleAddRoomFunc () {
                this.$store.commit('TOGGLE_ADD_ROOM')
            },
            subscribe (room) {
                this.socket.emit('subscribe_to_room', {roomId: room._id, userId: this.profile._id})

                let editedRoom = {
                    name: room.name,
                    createdBy: room.createdBy,
                    subscribers: room.subscribers,
                    avatar: room.avatar,
                    hasNewMessage: false,
                    newMessage: "",
                    read: false,
                    isTyping: false,
                    typing: false
                }

                this.$store.commit('UPDATE_ROOMS', editedRoom)

                this.$store.commit('REMOVE_ROOM_FROM_ALL_ROOMS', room)

                this.$store.dispatch('selectRoom', room.name)

                this.$store.commit('TOGGLE_ROOM_CHAT')

                this.toggleSearchFunc()
            },
            joinServer () {
                console.log('ben is here')
                this.socket.on('get_all_rooms', rooms => {

                    let allrooms = []

                    let userId = this.$store.state.userProfile._id

                    rooms.filter( room => room.createdBy != userId).map( function(room)  {
                        console.log('tag', 'here')  
                        if(room.subscribers.some( subscriber => subscriber.userId ===  userId)){
                            // console.log(room.subscribers, subscriber.userId, state.userProfile._id)
                            console.log('object find')
                        }else {
                            allrooms.push(room)
                        }
                    }), 
                    
                    this.$store.commit('ADD_TO_ALL_ROOMS', allrooms)

                })
                this.socket.emit('get_rooms', this.profile._id)

                this.socket.on('get_rooms', rooms => {

                    let editedRooms = rooms.map(room => {
                        return {
                            name: room.name,
                            createdBy: room.createdBy,
                            subscribers: room.subscribers,
                            avatar: room.avatar,
                            hasNewMessage: false,
                            newMessage: "",
                            read: false,
                            isTyping: false,
                            typing: false
                        }
                    })
                    this.$store.commit('ADD_ROOMS', editedRooms)
                })
                this.listen()
            }, 
            listen () {
                
                this.socket.on('get_room_msg', messages => {

                    this.$store.commit('ADD_SELECTED_ROOM_MSG', messages)

                })
                this.socket.on('newRoom', room => {

                    let editedRoom = {
                        name: room.name,
                        createdBy: room.createdBy,
                        subscribers: room.subscribers,
                        avatar: room.avatar,
                        hasNewMessage: false,
                        newMessage: "",
                        read: false,
                        isTyping: false,
                        typing: false
                    }

                    this.$store.commit('UPDATE_ROOMS', editedRoom)

                    this.$store.dispatch('selectRoom', room.name)

                    this.$store.commit('TOGGLE_ROOM_CHAT')

                })

                this.socket.on('message', message =>  {

                    this.$store.commit('NOTIFY_ROOM_THAT_HAS_NEW_MESSAGE', message)

                    if(message.room === this.$store.state.room){
                        this.$store.commit('UPDATE_SELECTED_ROOM_MSG', message)
                    }else {
                        this.$store.commit('UPDATE_ROOM_MESSAGE', message)
                    }
                   
                })
                
                this.socket.onAny((event, ...args) => {
                    console.log(event, args);
                });
            }
        },
        computed: {
            ...mapState({
                // arrow functions can make the code very succinct!
                isRoomChat: state => state.isRoomChat,
                profile: state => state.userProfile,
                toggleAddRoom: state => state.toggleAddRoom,
                toggleSearch: state => state.toggleSearch,
                socket: state => state.socket,
                allRooms: state => state.allRooms,
            }),
        },
        updated () {
            let rooms = []
            this.allRooms
            console.log(rooms)
        },
        mounted () {
            this.$store.state.filteredRoom = [];
            this.joinServer()
        }
    }
</script>

<style scoped>

</style>