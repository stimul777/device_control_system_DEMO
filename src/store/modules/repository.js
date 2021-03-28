export default {
    actions: {
        // *получение процента загрузки файла
        async uploadProgressSystem(ctx, progressEvent) {
            let uploadProgressValue = await parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
            ctx.commit('updateProgressValue', uploadProgressValue);
        },

        //* Операционные системы(Get)
        async fillingTableOS(ctx) {
            const installedOS = await this.$api.isoImages.get();
            // console.log(installedOS.data);
            ctx.commit('updateInstalledOS', installedOS.data);
        },

        // Удаление ОС из Репозитория
        async deleteOSrequest(ctx, uuid) {
            await this.$api.isoImages.delete(uuid);
        },

        //* Програмное обеспечение(Get)
        async fillingTableSoft(ctx) {
            const soft = await this.$api.softFile.get();
            console.log(soft);
            ctx.commit('updateSoft', soft.data);
        },

        // изменение параметров ПО
        async editSoftRequest(obj) {
            await this.$api.isoImages.putEdit(obj);
        },

        // Удаление ПО из Репозитория
        async deleteTableSoft(ctx, uuid) {
            await this.$api.softFile.delete(uuid);
        },
    },

    state: {
        uploadProgressValue: '',
        installedOS: [],
        soft: [],

        // static
        dataTableAll: [],
    },

    mutations: {
        updateProgressValue(state, value) {
            state.uploadProgressValue = value;
        },
        updateInstalledOS(state, value) {
            state.installedOS = value;
        },

        updateSoft(state, value) {
            state.soft = value;
        },
    },

    getters: {
        uploadProgressSystemGet(state) {
            return state.uploadProgressValue;
        },

        installedOSGetter(state) {
            return state.installedOS;
        },

        softGetter(state) {
            return state.soft;
        },
    },
};
