export default {
    actions: {
        /** WebSocket создание подключения для девайсов
         *
         * @param ctx
         * @returns {Promise<void>}
         */
        async deviceStateWatcher(ctx) {
            // Конфиг коннекта
            const connection = await ctx.getters.getConnectSocket;

            // Запуск коннекта веб-сокета

            // Слушатели
            connection.on('Pwroff', async (name, message) => {
                setTimeout(async () => {
                    ctx.state.powerOffSocket = await JSON.parse(message);
                    ctx.state.powerOffSocket.uuid = name;

                    ctx.commit('updatePowerOffSocket', ctx.state.powerOffSocket);
                }, 0);
            });

            connection.on('Pwron', async (name, message) => {
                setTimeout(async () => {
                    ctx.state.powerOnSocket = await JSON.parse(message);
                    ctx.state.powerOnSocket.uuid = name;
                    ctx.commit('updatePowerOnSocket', ctx.state.powerOnSocket);
                }, 0);
            });

            connection.on('Rbt', async (name, message) => {
                setTimeout(async () => {
                    ctx.state.powerRebotSocket = await JSON.parse(message);
                    ctx.state.powerRebotSocket.uuid = name;

                    ctx.commit('updatePowerOnSocket', ctx.state.powerRebotSocket);
                }, 0);
            });

            connection.onclose(async message => {
                console.error('!!!!!!!!!!!!!!СОЕДИНЕНИЕ ЗАКРЫТО!!!!!!!!!!', message);
            });
        },

        /** ФИЛЬТРА по типам оборудования и статусам
         * -Сервера FilterType=3
         * -Коммутаторы FilterType=4
         * -Хранилища FilterType=5
         * -Неизвестный FilterType=1
         * -Включенное-отключенное оборудование FilterType=3&powerFilter=true
         *
         * @param ctx
         * @param filter
         * @returns {Promise<*>}
         */
        async actionDevicesManagementFilter(ctx, filter) {
            return this.$load(async () => {
                const response = await this.$api.devicesManagement.get(filter);
                ctx.commit('upGetDevicesManagementFilter', response);
            });
        },

        // REST request
        async serversDevices(ctx) {
            async () => {
                const response = await this.$api.devicesManagement.get();
                ctx.commit('updateServersDevices', response);
            };
        },

        /** Отправка выбранных чекбоксов на сервер(PATCH)
         *
         * @param ctx
         * @param obj
         * @returns {Promise<void>}
         * @constructor
         */
        async StartDeviceGroup(ctx, obj) {
            this.$load(async () => {
                await this.$api.devicesManagement.post(obj);
            });
        },

        async SavingConf(ctx, obj) {
            this.$load(async () => {
                await this.$api.scheduleJob.startSaveConfigs(obj);
                ctx.dispatch('snackSuccess', `Резервная копия конфигурации создана`);
            });
        },
    },

    state: {
        devicesManagement: [],
        statusDevice: [],

        // new request
        serversDevices: [],
        // racksDevice: [],
        devicesManagementFilter: [],

        // webSoket
        powerOffSocket: [],
        powerOnSocket: [],
        powerResetSocket: [],
    },

    mutations: {
        // webSoket
        updatePowerOffSocket(state, val) {
            state.powerOffSocket = val;
        },
        updatePowerOnSocket(state, val) {
            state.powerOnSocket = val;
        },
        updatePowerRebotSocket(state, val) {
            state.powerResetSocket = val;
        },

        updateServersDevices(state, par) {
            state.serversDevices = par;
        },

        updateDevicesManagement(state, par) {
            state.devicesManagement = par;
        },

        upGetDevicesManagementFilter(state, par) {
            state.devicesManagementFilter = par;
        },
    },

    getters: {
        // WebSocket
        gettPowerOffSocket(state) {
            return state.powerOffSocket;
        },
        gettPowerOnSocket(state) {
            return state.powerOnSocket;
        },
        gettPowerResetSocket(state) {
            return state.powerResetSocket;
        },

        getServersDevices(state) {
            return state.serversDevices;
        },
        // getRacksDevice(state) {
        //     return state.racksDevice
        // },

        getStatusDevice(state) {
            return state.statusDevice;
        },

        getDevicesManagement(state) {
            return state.devicesManagement;
        },

        // фильтра по типу оборудования
        getDevicesManagementFilter(state) {
            return state.devicesManagementFilter;
        },
    },
};
