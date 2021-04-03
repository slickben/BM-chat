<template>
    <div class="py-6 px-4">
         
        <button :class="{'bg-gray-200': room.hasNewMessage && !room.read }" @click="selectRoom(room.name)" 
        v-for="room in rooms" :key="room._id" 
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
                    <span v-show="room.isTyping" class="text-xs text-green-400"> is typing.... </span>
                </div>
                <p class="text-xxs xl:text-xs text-gray-400 text-left">{{ room.newMessage }}</p>
            </div>
        </button>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        name: "UsersList",

        computed: mapState({
            // arrow functions can make the code very succinct!
            rooms: state => state.rooms,
            username: state => state.username,
        }),
        methods: {
            selectRoom(room) {
                this.$store.dispatch('selectRoom', room)
                this.$store.commit('TOGGLE_ROOM_CHAT')
                console.log(this.$store.state.room)
            }
        },
        mounted() {
            // console.log(this.$store.state.users)
        }
    }
</script>

<style scoped>

</style>