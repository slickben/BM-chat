<template>
    <div class="bg-gray-200 rounded-xl w-full h-full flex flex-col">
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

        <!-- messages -->
        <div id="container" class="scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-300 overflow-y-scroll scrollbar-thumb-rounded flex-grow px-6 py-4 overflow-auto h-full max-h-70vh">
            <!-- message -->

            <div v-for="message in messages" :key="message.index">
                <Replies v-if="message.sender === user"  :message="message.message" :time="message.time" :avatar="message.avatar"/>
                <Messages v-else :message="message.message" :time="message.time" :avatar="message.avatar"/>    
            </div>

        </div>

        <!-- send message input -->

        <div class="flex-grow-0 px-6 py-4">
            <SendMessageInput/>
        </div>
    </div>
</template>

<script>
    import Messages from './Messages.vue';
    import Replies from './Replies.vue';
    import SendMessageInput from './SendMessageInput.vue';
    import { mapState } from 'vuex'

    export default {
        name: "MessagesCard",

        computed: mapState({
            // arrow functions can make the code very succinct!
            selectedUser: state => state.receiver,
            user: state => state.username,
            messages: state => state.selectedUserMessages,

        }),
        components: {
            Messages,
            Replies,
            SendMessageInput
        },
        methods: {
            scrollToEnd () {    	
                let container = this.$el.querySelector("#container");
                container.scrollTop = container.scrollHeight;
            },
        },
        updated () {
            this.scrollToEnd()
        }


    }
</script>

<style scoped>

</style>