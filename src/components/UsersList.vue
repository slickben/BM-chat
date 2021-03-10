<template>
    <div class="py-6 px-4">
        <button @click="selectReceiver(user.user)" v-for="user in users" :key="user.user" class=" w-full flex items-center mb-4">
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
    export default {
        name: "UsersList",
        props: {
            users: {
                required: true
            }
        },
        methods: {
            selectReceiver(user) {
                this.$emit("select-receiver", user)
            }
        }
    }
</script>

<style scoped>

</style>