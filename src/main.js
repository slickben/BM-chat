import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import axios from "axios";
import store from './store';

const base = axios.create({
    baseURL: "https://pacific-ocean-92747.herokuapp.com" // replace on production env
});

const token = localStorage.getItem('user-token')

if (token) {
  axios.defaults.headers.common['Authorization'] = token
}

import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faUserSecret, faUsers, faSms, faHome, faChevronLeft, 
    faSearch, faPlus, faPaperPlane, faCircle, faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret, faUsers, faSms, faHome, faChevronLeft, faSearch, 
    faPlus, faPaperPlane, faCircle, faArrowLeft
)

import router from "./router.js"

const app = createApp(App)



app.config.globalProperties.$http = base;

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(store.store)

app.use(router)

app.mount('#app')
