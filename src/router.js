import { createWebHistory, createRouter} from "vue-router";
import Home from "./views/Home.vue";
import Chat from "./views/Chat.vue"
import SignUp from "./views/SignUp.vue"

const history = createWebHistory();

const routes = [
    {
        path: "/",
        name: "home",
        component: Home
    },

    {
        path: "/chat",
        name: "chat",
        component: Chat
    },
    {
        path: "/register",
        name: "register",
        component: SignUp
    }
];

const router = createRouter({
    history, routes
});

export default router;