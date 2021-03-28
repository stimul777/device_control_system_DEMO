import vuetify from '@/plugins/vuetify';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vuelidate from 'vuelidate';
import VueTheMask from 'vue-the-mask';
import VueIpInput from 'vue-ip-input';
import VueApexCharts from 'vue-apexcharts';

import Highcharts from 'highcharts';
import Stock from 'highcharts/modules/stock';
import HighchartsVue from 'highcharts-vue';

import TableMessages from './plugins/tableMessages';
import ApiPlugin from './plugins/api';
import LoadPlugin from './plugins/load';

import Loader from '@/components/app/Loader';
import Constants from './plugins/constants';

Vue.config.productionTip = false;

// Сторонняя либа для валидации форм
Vue.use(Vuelidate);
Vue.use(VueTheMask);
Vue.use(VueApexCharts);
Vue.use(TableMessages);
Vue.use(ApiPlugin);
Vue.use(LoadPlugin);

Stock(Highcharts);
Vue.use(HighchartsVue);

Vue.use(Constants);

Vue.component('apexchart', VueApexCharts);
Vue.component('Loader', Loader);
Vue.component('vue-ip-input', VueIpInput);

let app;

if (!app) {
    app = new Vue({
        vuetify,
        el: '#app',
        router,
        store,
        render: h => h(App),
    });
}
