<template>
    <div class="bg-gray-200 rounded-xl w-full h-screen md:h-full flex flex-col ">
        <!-- heading -->
        <div class="flex-grow-0 flex justify-between items-center px-6 py-3 border-b border-gray-400">
            <div class="flex items-center">
                <button @click="toggleChat" class="md:hidden">
                    <font-awesome-icon icon="arrow-left" />
                </button>
                <p class="text-sm md:text-base lg:text-lg font-semibold capitalize ml-3">{{ selectedRoom }} 
                    <!-- <span v-show="selectedUser.isTyping" class="text-xs text-green-400"> is typing.... </span> -->
                </p>
            </div>
            <div class="flex justify-between items-center">
                <span class="px-4 py-1 text-sm md:text-base rounded-3xl text-purple-600 bg-purple-300">Messages</span>

            </div>
        </div>

        <!-- messages -->
        <div id="container" class="scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-300 overflow-y-scroll scrollbar-thumb-rounded flex-grow px-6 py-4 overflow-auto h-full max-h-70vh">
            <!-- message -->

            <div v-for="message in messages" :key="message.index">
                <Replies v-if="message.user === user"  :message="message.msg" :time="message.time" :avatar="message.avatar"/>
                <Messages v-else :message="message.msg" :time="message.time" :avatar="message.avatar"/>    
            </div>

        </div>

        <!-- send message input -->

        <div class="flex-grow-0 px-6 py-4">
            <SendGroupMessageInput/>
        </div>
    </div>
</template>

<script>
    import Messages from './Messages.vue';
    import Replies from './Replies.vue';
    import SendGroupMessageInput from './SendGroupMessageInput.vue';
    import { mapState } from 'vuex'

    export default {
        name: "MessagesCard",

        computed: mapState({
            // arrow functions can make the code very succinct!
            selectedRoom: state => state.room,
            user: state => state.username,
            messages: state => state.selectedRoomMessages,

        }),
        components: {
            Messages,
            Replies,
            SendGroupMessageInput
        },
        methods: {
            scrollToEnd () {    	
                let container = this.$el.querySelector("#container");
                container.scrollTop = container.scrollHeight;
            },
            toggleChat () {
                this.$store.commit('TOGGLE_ROOM_CHAT')
            }
        },
        mounted () {
            console.log('selectedRoom')
        },
        updated () {
            this.scrollToEnd()
        }


    }
</script>

<style scoped>

</style>