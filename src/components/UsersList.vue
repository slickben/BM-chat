<template>
    <div class="py-6 px-4">
        <button :class="{'bg-gray-200': user.hasNewMessage && !user.read }" @click="selectReceiver(user.user)" 
        v-for="user in users" :key="user.user" 
        class="px-2 py-2 focus:outline-none hover:bg-gray-200 w-full flex items-center mb-1">
            <img class="flex-grow-0 w-7 h-7 xl:w-10 xl:h-10 rounded rounded-full" src="../assets/ben.jpg" alt="" srcset="">
            <div class="px-2 flex-grow">
                <div class="flex justify-between items-center">
                    <p class="font-semibold text-xs xl:text-sm">{{ user.user }}</p>
                    <span v-show="user.hasNewMessage" class="text-xs hidden xl:block text-gray-400">New Message</span>
                </div>
                <p class="text-xxs xl:text-xs text-gray-400 text-left">{{ user.message }}</p>
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
            users: state => state.users,
        }),
        methods: {
            selectReceiver(user) {
                this.$store.dispatch('selectReceiver', user)
                console.log(this.$store.state.receiver)
            }
        },
        mounted() {
            console.log(this.$store.state.users)
        }
    }
</script>

<style scoped>

</style>