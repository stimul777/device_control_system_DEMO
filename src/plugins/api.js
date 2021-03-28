import Vuex from 'vuex';
import api from '../api/index';

export default {
    install(Vue) {
        Vue.prototype.$api = Vuex.Store.prototype.$api = api;
    },
};
