export default {
    actions: {
        /**Получение стоек в карточки(GET)
         * Получение групп(GET)
         * Получение ракурсов(GET)
         *
         * @param ctx
         * @param nameDirectory
         * @returns {Promise<void>}
         */
        async fetchRequest(ctx, nameDirectory) {
            const response = await this.$api[nameDirectory.toLowerCase()].getAll();
            ctx.commit('updateRequest', response);
        },

        /**Клик по карточке оборудования
         * getInRack, getInGroup, getInAngle
         *
         * @param ctx
         * @param obj
         * @returns {Promise<void>}
         */
        async clickOnCard(ctx, obj) {
            obj.patch = 'getIn' + obj.patch.slice(0, -1);
            const response = this.$api.devices[obj.patch] ? await this.$api.devices[obj.patch](obj.uuid) : [];
            ctx.commit('updateDevice', response ? response : []);
        },

        /**Получение нераспределенного оборудования
         *
         * @param ctx
         * @param param
         * @returns {Promise<void>}
         */
        async requestUnknownDevices(ctx, param) {
            this.$load(async () => {
                const response = await this.$api.device.get(param);
                ctx.commit('updateUnknownDevices', response);
            });
        },

        /**Получение типов оборудования
         *
         * @param ctx
         * @returns {Promise<*>}
         */
        async requestTypeDevices(ctx) {
            return this.$load(async () => {
                const response = await this.$api.devicesTypes.getAll();
                ctx.commit('updateTypeDevices', response);
            });
        },

        /**Типы оборудования: Отправка типов оборудование с юзер комментариями
         *
         * @param ctx
         * @param param
         * @returns {Promise<void>}
         */
        async userTypeDevices(ctx, param) {
            this.$load(async () => {
                await this.$api.devicesTypes.patch(param.uuid, { comment: param.comment });
            });
        },

        /**Создание новой стойки, ракурса или группы
         *
         * @param ctx
         * @param obj
         * @returns {Promise<void>}
         */
        async addNewDirectory(ctx, obj) {
            await this.$load(async () => {
                await this.$api[obj.activatedTabProps.toLowerCase()].post(obj.newCard);
            });
        },

        /**Удаление оборудования внутри групп или стоек
         *
         * @param ctx
         * @param obj
         * @returns {Promise<void>}
         */
        async removeDevice(ctx, obj) {
            this.$load(async () => {
                await this.$api[obj.activatedTab.toLowerCase()].delete(obj.uuid);
            });
        },

        /**Редактирование групп, ракурсов или стоек
         *
         * @param ctx
         * @param obj
         * @returns {Promise<void>}
         */
        async editItemRequest(ctx, obj) {
            this.$load(async () => {
                await this.$api[obj.activatedTab.toLowerCase()].patch(obj.uuid, {
                    name: obj.item.name,
                    comment: obj.item.comment,
                });
            });
        },
    },

    state: {
        // Стойки, группы или ракурсы
        directoryDevices: [],
        // Прищедшее оборудование в группу, стойку или ракурс
        device: [],
        // Нераспределенное оборудование
        unknownDevices: [],
        // Типы оборудования
        typeDevices: [],
    },

    mutations: {
        updateDevice(state, response) {
            state.device = response;
        },

        updateRequest(state, directory) {
            state.directoryDevices = directory;
        },

        updateUnknownDevices(state, unknownDevices) {
            state.unknownDevices = unknownDevices;
        },

        updateTypeDevices(state, typeDevices) {
            state.typeDevices = typeDevices;
        },
    },

    getters: {
        getDirectory: state => state.directoryDevices,

        getDevice: state => state.device,

        getUnknownDevices: state => state.unknownDevices,

        getTypeDevices: state => state.typeDevices,
    },
};
