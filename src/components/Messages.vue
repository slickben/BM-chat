<template>
    <div class="flex items-end mb-4 w-4/5 md:w-3/4 lg:w-2/4">
        <img class="flex-grow-0 w-10 h-10 rounded rounded-full" src="../assets/user2.jpg" alt="" srcset="">
        <div class="px-2 flex-grow">
            <p class="text-xs mb-2">12/34</p>
            <div class="flex justify-between items-center bg-white px-4 py-3 
            rounded-tl-3xl rounded-br-3xl rounded-tr-3xl">
                <p class="font-semibold text-sm">{{message}}</p>
            </div>    
        </div>
    </div>
</template>

<script>
    export default {
        name: "Message",
        props: {
            message: {
                required: false
            }
        }
        
    }
</script>

<style scoped>

</style>