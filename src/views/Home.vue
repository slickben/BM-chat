<template>
    <div class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
        <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
        
        <div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            
            <div class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
                <svg class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                </svg>
                <span class="text-sm">(Esc)</span>
            </div>

            <!-- Add margin if you want to see some of the overlay behind the modal-->
            <div class="modal-content py-4 text-left px-6">
                <!--Title-->
                <div class="flex justify-between items-center pb-3">
                <p class="text-xl  md:text-2xl font-bold">Enter Your Username</p>
                    <div class="modal-close cursor-pointer z-50">
                        <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                        </svg>
                    </div>
                </div>

                <!--Body-->
                <form @submit.prevent="onSubmit">
                    <div class="relative my-6">
                        <input v-model="username" type="text" id="name" name="name" placeholder="username"
                            class="focus:outline-none border focus:border-purple-600 w-full px-4 py-2 bg-gray-100 border-transparent rounded-lg focus:border-gray-500 focus:bg-white focus:ring-0">
                    </div>
                    <div class="flex justify-end pt-2">
                        <button type="submit" class="modal-close px-4 bg-indigo-500 p-2 rounded-lg
                        text-white hover:bg-indigo-400">Submit</button>
                    </div>
               </form>

                <!--Footer-->
                
                
            </div>
        </div>
    </div>
</template>

<script>
    import randomProfile  from 'random-profile-generator';
    import { createLogger } from 'vuex'

    export default {
        name: "Home",
        data () {
            return {
                username: ""
            }
        },
        methods: {
            getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            },
            generateAvatar(text, foregroundColor, backgroundColor) {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                canvas.width = 200;
                canvas.height = 200;

                // Draw background
                context.fillStyle = backgroundColor;
                context.fillRect(0, 0, canvas.width, canvas.height);

                // Draw text
                context.font = "bold 100px Assistant";
                context.fillStyle = foregroundColor;
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillText(text, canvas.width / 2, canvas.height / 2);

                return canvas.toDataURL("image/png");
            },
            
            async onSubmit() {

                let randomPro = randomProfile.profile()
                console.log(createLogger)

                let res = randomPro.firstName.charAt(0) + randomPro.lastName.charAt(0)

                let userData = {
                    username: this.username,
                    fullname: randomPro.fullName,
                    avatar: this.generateAvatar(res, 'white', this.getRandomColor())
                }

                try {

                    let response = await this.$http.post("/login", userData);
                    console.log(response.data)

                    let token = response.data.username  

                    localStorage.setItem('user-token', token)

                    localStorage.setItem('user-profile', JSON.stringify(response.data))

                    this.$store.commit('AUTH_SUCCESS', token)

                    this.$store.commit('ADD_USERNAME', response.data.username)

                    this.$store.commit('ADD_USER_PROFILE', response.data)

                    // navigate to a protected resource 
                    this.$router.push("/chat");
                } catch (err) {

                     this.$store.commit("AUTH_ERROR", err)

                    localStorage.removeItem('user-token')
                }
            },
        },
    }
</script>

<style scoped>

</style>