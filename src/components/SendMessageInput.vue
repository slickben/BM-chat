<template>
    <form @submit.prevent="submitMessage" class="bg-white rounded-3xl px-4 pr-6 py-1 flex justify-between items-center">
        <input v-model="msg" class="py-2 focus:outline-none" type="text" 
        placeholder="Type your message here...">

        <button :disabled="!msg" type="submit" class="focus:outline-none text-xl text-purple-600">
            <font-awesome-icon icon="paper-plane" />
        </button>
    </form>
</template>

<script>
    export default {
        name: "sendMessageInput",
        data () {
            return {
                msg: ""
            }
        },
        methods: {
            submitMessage () {
                if(!this.msg) {
                    alert('please text a message')
                    return
                }else if(!this.$store.state.receiver){
                    alert('please pls select who to send the message to ')
                    return
                }
                this.$store.dispatch("sendMessage", this.msg)
                console.log(this.msg)
                this.msg = ""
            }
        },
    }
</script>

<style scoped>

</style>