import { storagePeriodDispatch, timeTranslit } from '@/filters/filterTasks';
import { Constants } from '@/plugins/constants';

export default {
    actions: {
        /**
         ** Получение времени опроса оборудования(GET)
         * @returns {Object}
         */
        jobTasks(ctx) {
            return this.$load(async () => {
                const response = await this.$api.jobTasks.getAll();
                ctx.commit('updateAllJobTasks', response);
            });
        },

        /**
         ** Отправка измененного времени опроса у оборудования(PATCH)
         * @returns {Object}
         */
        async saveParamValue(ctx, sendDataServer) {
            this.requestArr = [];
            switch (sendDataServer.activeTab) {
                // ОПРОС ДОСТУПНОСТИ ОБОРУДОВАНИЯ
                case 'pollingDevices':
                    this.requestArr = sendDataServer.getAllJobTasks.filter(
                        m => m.operationTypeUuid === Constants.CODE_STATUSES.CODE_STATUSES_1,
                    );

                    const deviceUUID = [
                        {
                            id: Constants.CODE_STATUSES.CODE_STATUSES_1,
                            name: 'storagePeriodServer',
                        },
                        {
                            id: Constants.CODE_STATUSES.CODE_STATUSES_2,
                            name: 'storagePeriodStore',
                        },
                        {
                            id: Constants.CODE_STATUSES.CODE_STATUSES_3,
                            name: 'storagePeriodSwitch',
                        },
                    ];

                    this.requestArr = storagePeriodDispatch(this.requestArr, sendDataServer, deviceUUID);

                    // сервера
                    this.requestArr.map(m =>
                        m.uuid === Constants.CODE_STATUSES.CODE_STATUSES_1
                            ? (m.interval = sendDataServer.timeServer)
                            : false,
                    );

                    // коммутаторы
                    this.requestArr.map(m =>
                        m.uuid === Constants.CODE_STATUSES.CODE_STATUSES_3
                            ? (m.interval = sendDataServer.timeSwitches)
                            : false,
                    );

                    // хранилище
                    this.requestArr.map(m =>
                        m.uuid === Constants.CODE_STATUSES.CODE_STATUSES_2
                            ? (m.interval = sendDataServer.timeStorage)
                            : false,
                    );
                    break;

                // ОПРОС ДОСТУПНОСТИ КОМПОНЕНТОВ ОБОРУДОВАНИЯ
                case 'pollingDevicesComponents':
                    this.requestArr = sendDataServer.getAllJobTasks.filter(
                        m => m.operationTypeUuid === Constants.CODE_STATUSES.CODE_STATUSES_2,
                    );

                    // Период хранения
                    const deviceUUIDPeriod = [
                        {
                            id: Constants.CODE_STATUSES.CODE_STATUSES_4,
                            name: 'storagePeriodServer',
                        },
                        {
                            id: Constants.CODE_STATUSES.CODE_STATUSES_6,
                            name: 'storagePeriodSwitch',
                        },
                        {
                            id: Constants.CODE_STATUSES.CODE_STATUSES_5,
                            name: 'storagePeriodStore',
                        },
                    ];

                    this.requestArr = storagePeriodDispatch(this.requestArr, sendDataServer, deviceUUIDPeriod);

                    // Частота опроса
                    // коммутаторы
                    this.requestArr.map(m =>
                        m.uuid === Constants.CODE_STATUSES.CODE_STATUSES_6
                            ? (m.interval = sendDataServer.timeSwitches)
                            : false,
                    );

                    // сервера
                    this.requestArr.map(m =>
                        m.uuid === Constants.CODE_STATUSES.CODE_STATUSES_4
                            ? (m.interval = sendDataServer.timeServer)
                            : false,
                    );

                    // хранилище
                    this.requestArr.map(m =>
                        m.uuid === Constants.CODE_STATUSES.CODE_STATUSES_5
                            ? (m.interval = sendDataServer.timeStorage)
                            : false,
                    );
                    break;
            }

            this.requestArrMap = [];
            this.requestArr.map(m => {
                this.requestArrMap.push({
                    uuid: m.uuid,
                    interval: timeTranslit(m.interval),
                    name: m.name,
                    depth: m.depth,
                });
            });

            // Отправка на сервер
            this.$load(async () => {
                await this.$api.jobTasks.patch(this.requestArrMap);
            });
        },
    },

    state: {
        allJobTasks: [],
    },

    mutations: {
        updateAllJobTasks(state, par) {
            state.allJobTasks = par;
        },
    },

    getters: {
        getAllJobTasks(state) {
            return state.allJobTasks;
        },
    },
};
