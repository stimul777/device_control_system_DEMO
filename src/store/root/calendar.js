export default {
    actions: {
        setPeriodStore({ commit }, data) {
            commit('period', data);
        },
    },

    state: {
        periodArr: [],
    },

    mutations: {
        period(state, data) {
            state.periodArr = data;
        },
    },

    getters: {
        getPeriodStore(state) {
            return state.periodArr;
        },
    },
};
