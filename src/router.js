import { createWebHistory, createRouter} from "vue-router";
import Home from "./views/Home.vue";
import Chat from "./views/Chat.vue"
import SignUp from "./views/SignUp.vue"
import Room from "./views/Room.vue"
import store from './store';

if(!store.store.getters.isAuthenticated) {
    console.log('not auth')
}else {
    console.log('auth', screen.width)
}

const ifNotAuthenticated = (to, from, next) => {
    if (!store.store.getters.isAuthenticated) {
        console.log('not authenticated')
      next()
      return
    }
    next('/chat')
  }
  
  const ifAuthenticated = (to, from, next) => {
    if (store.store.getters.isAuthenticated) {
        console.log(' authenticated')
        // if(screen.width > 500) {
        //     next('/chat')
        // }else {
        //     next('/home')
        // }
        next()
      return
    }
    next('/')
  }


const history = createWebHistory();

const routes = [
    {
        path: "/",
        name: "login",
        component: Home,
        beforeEnter: ifNotAuthenticated,
    },

    {
        path: "/chat",
        name: "chat",
        component: Chat,
        beforeEnter: ifAuthenticated,
    },
    {
        path: "/rooms",
        name: "rooms",
        component: Room,
        beforeEnter: ifAuthenticated,
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