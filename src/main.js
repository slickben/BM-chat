import { createApp } from 'vue';
import App from './App.vue';
import './index.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faUserSecret, faUsers, faSms, faHome, faChevronLeft, 
    faSearch, faPlus, faPaperPlane
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret, faUsers, faSms, faHome, faChevronLeft, faSearch, 
    faPlus, faPaperPlane
)

import router from "./router.js"

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router).mount('#app')
