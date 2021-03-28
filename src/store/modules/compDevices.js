export default {
    actions: {
        /**  Получение профилей мониторинга(GET)
         * 3-сервера
         * 4-коммутаторы
         * 5-хранилища
         *
         * @param ctx
         * @param filter
         * @returns {*}
         */
        startRequestCompDevices(ctx, filter) {
            return this.$load(async () => {
                const response = await this.$api.parameters.get(filter);
                ctx.commit('startRequestComp', response);
            });
        },

        /** Сохранение измененных значений(PATCH)
         *
         * @param ctx
         * @param arr
         * @returns {Promise<*>}
         */
        async patchCompParam(ctx, arr) {
            return this.$load(async () => {
                await this.$api.monitoringProfiles.patch(arr);
            });
        },
    },

    state: {
        components: [],
    },

    mutations: {
        startRequestComp(state, comp) {
            state.components = comp;
        },
    },

    getters: {
        getComponent(state) {
            return state.components;
        },
    },
};
