import { createWebHistory, createRouter} from "vue-router";
import Home from "./views/Home.vue";
import Chat from "./views/Chat.vue"

const history = createWebHistory();

const routes = [
    {
        path: "/home",
        name: "home",
        component: Home
    },

    {
        path: "/chat",
        name: "chat",
        component: Chat
    }
];

const router = createRouter({
    history, routes
});

export default router;