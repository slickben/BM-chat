<template>
    <div class="bg-gray-200 rounded-xl w-full h-full flex flex-col">
        <!-- heading -->
        <div class="flex-grow-0 flex justify-between items-center px-6 py-3 border-b border-gray-400">
            <p class="text-sm md:text-base lg:text-lg font-semibold">Group Chat</p>
            <div class="flex justify-between items-center">
                <span class="px-4 py-1 text-sm md:text-base rounded-3xl text-purple-600 bg-purple-300">Messages</span>

            </div>
        </div>

        <!-- messages -->
        <div class="flex-grow px-6 py-4 overflow-auto h-full max-h-70vh">
            <!-- message -->
            <Messages/>    

            <!-- reply -->
            <Replies/>

            <!-- message -->
            <Messages/>    

            <!-- reply -->
            <Replies/>

            <!-- reply -->
            <Replies/>

            <!-- message -->
            <Messages/>    

            <!-- reply -->
            <Replies/>

            <!-- reply -->
            <Replies/>

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

    export default {
        name: "MessagesCard",
        components: {
            Messages,
            Replies,
            SendMessageInput
        }


    }
</script>

<style scoped>

</style>