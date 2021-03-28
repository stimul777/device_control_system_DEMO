export default {
    actions: {
        async requestAllSaveConfigs(ctx, uuid) {
            const response = await this.$api.saveConfigs.getAllSaveConfigs(uuid);
            ctx.commit('updateSaveConfigs', response.data);
        },
        async requestConfig(ctx, uuid) {
            const response = await this.$api.saveConfigs.getConfig(uuid);
            ctx.commit('updateSaveConfigTable', response.data);
        },
        closeShowTableConfigs(ctx) {
            ctx.commit('updateShowTable');
        },
        selectedRowConfigs(ctx, item) {
            ctx.commit('selectedConf', item);
        },
    },
    getters: {
        getItemsMenuSaveConfigs(state) {
            return state.itemsMenu;
        },
        getAllConfigs(state) {
            return state.tableItems;
        },

        getStateConfigs(state) {
            return state;
        },
    },
    mutations: {
        updateSaveConfigs(state, response) {
            state.tableItems = response;
            state.openTableConfigs = true;
        },
        updateSaveConfigTable(state, response) {
            state.tableItems = response;
        },
        updateShowTable(state) {
            state.openTableConfigs = false;
        },
        selectedConf(state, item) {
            state.selectedRowConf = item;
        },
    },
    state: {
        itemsMenu: {
            id: 1,
            name: 'Сохраненные конфигурации',
        },
        showFormConfig: false,
        typeForm: '',
        selectedRowConf: [],
        textHeader: '',
        tableItems: [],
        openTableConfigs: false,
    },
};
