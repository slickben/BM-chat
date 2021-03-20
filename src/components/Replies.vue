<template>
    <div class="flex items-end mb-4 justify-end">
        <div class="w-4/5 md:w-3/4 lg:w-2/4 flex items-end">
            
            <div class="px-2 flex-grow">
                <p class="text-xs mb-2 text-right">{{ time }}</p>
                <div class="flex justify-between items-center bg-gray-300 px-4 py-3 
                rounded-tl-3xl rounded-bl-3xl rounded-tr-3xl">
                    <p class="font-semibold text-sm">{{message }} </p>
                </div>    
            </div>
            <img class="flex-grow-0 w-10 h-10 rounded rounded-full" :src="avatar" alt="" srcset="">
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            message: {
                required: false
            },
            time: {
                required: false
            },
            avatar: {
                required: false
            }
        },
        
    }
</script>

<style scoped>

</style>