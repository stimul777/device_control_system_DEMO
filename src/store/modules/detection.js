import router from '@/router';
import { Constants } from '@/plugins/constants';

const UUID = 'uuidv4';
const MODE = {
    SINGLE: 'single-mode',
    MULTIPLY: 'multiply-mode',
};
const ATTITUDE = {
    ICMP: 'icmp',
    ipmi: 'ipmi',
    SNMPV1: 'snmpv1',
    SNMPV2C: 'snmpv2c',
    SNMPV3: 'snmpv3',
};

const ATTITUDE_NAME = {
    IPMI_V_2: 'IPMI v.2',
    SNMP_V_1: 'SNMP v.1',
    SNMP_V_2C: 'SNMP v.2c',
    SNMP_V_3: 'SNMP v.3',
};

export default {
    state: {
        icmpResult: [],
        connection: false,
    },
    mutations: {
        setIcmpResult(state, resIp) {
            state.icmpResult = resIp.map(v => ({
                ip: v,
                ipmiProcess: false,
                protocols: this.getters.getProtocolsDetection.map(v => ({
                    uuid: v.uuid,
                    name: v.name,
                    login: v.login,
                    password: v.password,
                    showPassword: false,
                    disableLogin: v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1),
                    disablePassword:
                        v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1) ||
                        v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_3),
                    testing: false,
                    test: v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1)
                        ? Constants.STATUS_TEXT.OK
                        : Constants.STATUS_TEXT.NONE,
                })),
            }));
        },

        clearIcmp(state) {
            state.icmpResult = [];
        },

        deleteIp(state, index) {
            state.icmpResult.splice(index, 1);
        },

        setConnection(state, connect) {
            state.connection = connect;
        },
    },
    actions: {
        /** Начало проверки протокола ICMP
         *
         * @param ctx
         * @param ipAdress
         * @returns {Promise<void>}
         */
        async startICMP(ctx, ipAdress) {
            ctx.commit('setConnection', true);
            ctx.commit('setIcmpResult', []);
            const uuid = await ctx.dispatch(UUID);
            const sendData = {
                uuid,
                type: 'request',
                name: 'icmp',
                command: 'ping',
                data: {
                    ip: ipAdress,
                },
            };
            // const data = JSON.stringify(sendData);
            const connection = await ctx.getters.getConnectSocket;
            await this.$api.backendCommunications.putPingTest(sendData);
            // await connection.invoke('SendMessage', 'Front', data);

            // Слушатель
            connection.on('IcmpPing', async (name, message) => {
                const response = JSON.parse(name);
                if (!response.data.length) {
                    if (ipAdress.length === 1) {
                        ctx.dispatch('snackError', `Адрес ${ipAdress} не найден!`);
                    } else {
                        ctx.dispatch(
                            'snackError',
                            `Адреса ${ipAdress[0]} - ${ipAdress[ipAdress.length - 1]} не найдены!`,
                        );
                    }
                    ctx.commit('setConnection', false);
                } else {
                    await ctx.commit('setIcmpResult', response.data);
                    ctx.commit('setConnection', false);
                }
                connection.off('IcmpPing');
            });
        },

        /** Начало проверки протокола Ipmi
         *
         * @param ctx
         * @param ipmiData
         * @param mode
         * @returns {Promise<void>}
         */
        async startIpmi(ctx, { ipmiData, mode = MODE.SINGLE }) {
            //todo Уточнить у Никиты какие актуальные статусы для запуска этой функции
            ipmiData.ipmiProcess = true;

            const ipDevice = ipmiData.ip || ipmiData.ipAddress;
            const ipmiProtocol =
                mode === MODE.SINGLE
                    ? ipmiData.protocols.find(v => v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_02))
                    : ipmiData.protocols.find(v => v.protocolUUID.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_02));
            const uuid = await ctx.dispatch(UUID);
            const sendData = {
                uuid,
                type: 'request',
                name: ATTITUDE.ipmi,
                command: 'inv',
                data: {
                    ip: ipDevice,
                    login: ipmiProtocol.login,
                    password: ipmiProtocol.password,
                },
            };

            const connection = await ctx.getters.getConnectSocket;
            await this.$api.backendCommunications.putInventary(sendData);

            // Слушатель
            connection.on('IpmiInv', async (name, message) => {
                const response = JSON.parse(name);

                if (response.status === '1') {
                    ctx.dispatch('snackError', `${ipDevice} - неверный логин или пароль у протокола IPMI v.2!`);
                    connection.off('IpmiInv');
                    ipmiData.ipmiProcess = false;
                } else {
                    if (mode === 'single-mode') {
                        connection.off('IpmiInv');

                        ipmiData.ipmiProcess = false;
                        router.push({
                            name: 'DetectionDevice',
                            params: { data: response.data, item: ipmiData },
                        });
                    } else if (mode === 'multiply-mode') {
                        console.log(response.data);
                        connection.off('IpmiInv');
                        ipmiData.biosRevision = response.data.biosRevision;
                        ipmiData.boardMfg = response.data.boardMfg;
                        ipmiData.firmwareRevision = response.data.firmwareRevision;
                        ipmiData.productName = response.data.productName;
                        ipmiData.productPartNumber = response.data.productPartNumber;
                        ipmiData.nameofserial = response.data.productSerial;
                        ipmiData.ipmiProcess = false;
                    } else {
                        console.error('MODE ERROR', mode);
                        ctx.commit('setConnection', false);
                        connection.off('IpmiInv');
                    }
                }
            });
        },

        /** Запуск тестирования протоколов
         *
         * @param ctx
         * @param payload
         * @returns {Promise<void>}
         */
        async startTestProtocols(ctx, payload) {
            const protAttitude = {
                ICMP: 'icmp',
                'IPMI v.2': 'ipmi',
                'SNMP v.1': 'snmpv1',
                'SNMP v.2c': 'snmpv2c',
                'SNMP v.3': 'snmpv3',
            };
            let credentials = {};

            if (payload.prot.name === ATTITUDE_NAME.IPMI_V_2) {
                credentials = {
                    login: payload.prot.login,
                    password: payload.prot.password,
                };
            } else if (payload.prot.name === ATTITUDE_NAME.SNMP_V_1 || payload.prot.name === ATTITUDE_NAME.SNMP_V_2C) {
                credentials = {
                    community: payload.prot.login,
                };
            } else if (payload.prot.name === ATTITUDE_NAME.SNMP_V_3) {
                credentials = {
                    community: payload.prot.login,
                    password: payload.prot.password,
                };
            } else {
                credentials = {};
            }
            const uuid = await ctx.dispatch(UUID);
            const sendData = {
                uuid,
                type: 'request',
                name: 'test',
                command: 'test-dev',
                data: {
                    ip: payload.ip,
                    protocols: [
                        {
                            name: payload.prot.name,
                            credentials,
                        },
                    ],
                },
            };

            const connection = await ctx.getters.getConnectSocket;
            await this.$api.backendCommunications.putTestDev(sendData);

            // Слушатель
            connection.on('TestDev', async (name, message) => {
                const response = JSON.parse(name);

                if (response.status === 1) {
                    ctx.dispatch('snackError', 'Ошибка теста');
                    payload.prot.test = Constants.STATUS_TEXT.BAD;
                } else {
                    if (response.data[protAttitude[payload.prot.name]] === 1) {
                        payload.prot.test = Constants.STATUS_TEXT.OK;
                    } else {
                        payload.prot.test = Constants.STATUS_TEXT.BAD;
                    }
                }
                payload.prot.testing = false;
                ctx.commit('setConnection', false);
                connection.off('TestDev');
            });
        },
    },
    getters: {
        getIcmpResult(state) {
            return state.icmpResult;
        },

        getIpmiResult(state) {
            return state.ipmiResult;
        },

        getConnection(state) {
            return state.connection;
        },
    },
};
