export default {
    actions: {
        snackError({ commit }, text) {
            commit('setSnackError', text);
        },

        snackSuccess({ commit }, text) {
            commit('setSnackSuccess', text);
        },

        snackAlert({ commit }, text) {
            commit('setSnackAlert', text);
        },

        alertUserResponse({ commit }, action) {
            commit('setUserActionAlert', action);
        },
    },

    state: {
        show: false,
        message: '',
        timeout: 5000,
        color: null,
        alertShow: false,
        alertUserResponse: false,
        typeSheet: null,
    },
    mutations: {
        setSnackError(state, text) {
            state.show = true;
            state.message = text;
            state.color = 'red';
            state.alertShow = false;
            state.timeout = 5000;
        },
        setSnackSuccess(state, text) {
            state.show = true;
            state.message = text;
            state.color = '#00BE6E';
            state.alertShow = false;
            state.timeout = 5000;
        },

        setSnackAlert(state, objAlert) {
            state.show = true;
            state.message = objAlert.text;
            state.typeSheet = objAlert.sheet;
            state.timeout = 15000;
            state.color = 'red';
            state.alertShow = true;
        },

        setUserActionAlert(state, action) {
            state.alertUserResponse = action;
        },

        clearSnack(state) {
            state.show = false;
            state.message = '';
        },
    },

    getters: {
        snackSettings(state) {
            return state;
        },

        alertUserResponseGetter(state) {
            let objResponseSnack = {
                alertUserResponse: state.alertUserResponse,
                typeSheet: state.typeSheet,
            };
            return objResponseSnack;
        },
    },
};
