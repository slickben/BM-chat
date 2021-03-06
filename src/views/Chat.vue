<template>
    <div class="flex-grow md:border-l rounded-xl grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:pr-6 pr-3">
      <div class="hidden md:block py-6 max-h-65vh col-span-2 lg:col-span-1">
        <div class="">
            <!-- breadcumb -->
            <BreadCumb/>
            <!-- user profile -->
            <UserProfile/>

            <SearchBar/>

            <ChatHistoryBar/>
        </div>

        <div class="max-h-30vh overflow-auto">
            <ChatHistory/>
        </div>
      </div>
      <div class="col-span-4 lg:col-span-3 py-3 max-h-full">
          <MassegeCard/>
      </div>
      <div class="py-6 hidden lg:block ">
          <!-- breadcumb -->
        <BreadCumb/>
        <!-- user profile -->
        <UserProfile/>
      </div>
    </div>
</template>

<script>
    import BreadCumb from '../components/BreadCumb.vue';
    import UserProfile from '../components/UserProfile.vue';
    import SearchBar from '../components/SearchBar.vue';
    import ChatHistoryBar from '../components/ChatHistoryBar.vue';
    import ChatHistory from '../components/ChatHistory.vue';
    import MassegeCard from '../components/MassegeCard.vue';

    export default {
        name: "Chat",
        components: {
            BreadCumb,
            UserProfile,
            SearchBar,
            ChatHistoryBar,
            ChatHistory,
            MassegeCard,
        }
    }
</script>

<style scoped>

</style>