import './styles/app.scss'

import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue'
import FontAwesome from '@fortawesome/fontawesome'
import SolidFontAwesome from '@fortawesome/fontawesome-free-solid'
import RegularFontAwesome from '@fortawesome/fontawesome-free-regular'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

// @ts-ignore
import App from './App.vue';

FontAwesome.library.add(SolidFontAwesome, RegularFontAwesome)

Vue.use(BootstrapVue)
Vue.component('fa', FontAwesomeIcon)

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
