export default {
    actions: {
        /**Получить все девайсы(GET)
         *
         * @param ctx
         * @returns {*}
         */
        inventoryRequest(ctx) {
            return this.$load(async () => {
                const response = await this.$api.devices.getAll();
                ctx.commit('updateInventoryRequest', response);
            });
        },

        /**Тип оборудования(GET)
         *
         * @param ctx
         */
        inventoryDeviceType(ctx) {
            this.$load(async () => {
                const response = await this.$api.devicesTypes.getAll();
                ctx.commit('updateInventoryDeviceType', response);
            });
        },

        /**Получить Racks(GET)
         *
         * @param ctx
         * @returns {Promise<void>}
         */
        async inventoryRacks(ctx) {
            this.$load(async () => {
                const response = await this.$api.racks.getAll();
                ctx.commit('updateInventoryRacks', response);
            });
        },

        /**Удалить оборудование(Delete)
         *
         * @param uuid
         * @returns {Promise<void>}
         */
        async inventoryDelete(ctx, uuid) {
            this.$load(async () => {
                await this.$api.devices.delete(uuid);
            });
        },

        /**Отредактировать оборудование(PATCH)
         *
         * @param ctx
         * @param obj
         * @returns {Promise<void>}
         */
        async inventoryRequestPatch(ctx, obj) {
            this.$load(async () => {
                await this.$api.devices.patch(obj);
            });
        },

        /**Получить протоколы(GET)
         *
         * @param ctx
         * @returns {Promise<void>}
         */
        async inventoryProtocols(ctx) {
            this.$load(async () => {
                const response = await this.$api.protocols.getAll();
                ctx.commit('updateInventoryProtocols', response);
            });
        },
    },

    state: {
        devices: [],
        deviceType: [],
        racks: [],
        protocols: [],
    },

    mutations: {
        updateInventoryRequest(state, device) {
            state.devices = device;
        },

        updateInventoryDeviceType(state, deviceType) {
            state.deviceType = deviceType;
        },

        updateInventoryRacks(state, racks) {
            state.racks = racks;
        },

        updateInventoryProtocols(state, protocols) {
            state.protocols = protocols;
        },
    },

    getters: {
        getInventoryDevice(state) {
            return state.devices;
        },

        getDeviceType(state) {
            return state.deviceType;
        },

        getInventoryRacks(state) {
            return state.racks;
        },

        getInventoryProtocols(state) {
            return state.protocols;
        },
    },
};
