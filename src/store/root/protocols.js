import { Constants } from '@/plugins/constants';

export default {
    namespace: true,

    state: {
        // протоколы из справочника
        // формат:
        // [{ "uuid": "00000000-0000-0000-0000-000000000000",
        // "name": "undefinded",
        // "comment": "Неопределенный протокол взаимодействия",
        // "version": "1",
        // "community": "",
        // "login": "admin",
        // "password": "admin" }...]
        protocolList: [],
        protocolData: [],

        protocolsDetection: [],
    },

    mutations: {
        setProtocolList(state, json) {
            state.protocolList = json;
        },
        setProtocolData(state, data) {
            state.protocolData = data;
        },
        setProtocolsDetection(state, data) {
            state.protocolsDetection = data;
        },
    },

    actions: {
        /** Получение списка протоколов
         *
         * @param ctx
         */
        fetchProtocols(ctx) {
            this.$load(async () => {
                const protocols = await this.$api.protocols.getAll();
                ctx.commit(
                    'setProtocolList',
                    protocols.filter(v => v.uuid !== Constants.CODE_STATUSES.CODE_STATUSES_6),
                );
            });
        },
        /**Начало проверки протоколов
         *
         * @param ctx
         * @returns {Promise<void>}
         */
        async startProtocolsDetection(ctx) {
            this.$load(async () => {
                const protocols = await this.$api.protocols.getAll();

                let resultData = protocols
                    .filter(v => delete v.comment)
                    .filter(v => v.uuid !== Constants.CODE_STATUSES.CODE_STATUSES_6)
                    .map(v => ({
                        uuid: v.uuid,
                        name: `${v.name} ${v.version ? 'v.' + v.version : ''}`.trim(),
                        login: v.community || v.login,
                        password: v.password || '',
                    }));

                ctx.commit('setProtocolsDetection', resultData);
            });
        },
    },

    getters: {
        getProtocolList: s => s.protocolList,
        getProtocolData: s => s.protocolData,
        getProtocolsDetection: s => s.protocolsDetection,
    },
};
