import { HubConnectionBuilder } from '@microsoft/signalr';
import { HttpTransportType } from '@microsoft/signalr';
import store from '../index';

export default {
    state: {
        connectSocket: '',
    },
    actions: {
        async openSocket(ctx) {
            let connectSocket = new HubConnectionBuilder()
                .withUrl(this.$api.socketsUrl.aUrl, {
                    skipNegotiation: true,
                    transport: HttpTransportType.WebSockets,
                    accessTokenFactory: () => {
                        return store.getters['auth/getJwtToken'];
                    },
                })
                .withAutomaticReconnect()
                .build();

            ctx.commit('connectSocket', connectSocket);

            return connectSocket;
        },

        async startSocket(ctx) {
            const connection = await ctx.dispatch('openSocket');

            await this.dispatch('startProtocolsDetection');

            try {
                await connection.start();
                console.log('%c%s', 'color: green; ', '!соединение с сокетом  успешно установлено!');
            } catch (err) {
                throw err;
            }
        },

        async stopSocket(ctx) {
            console.log('%c%s', 'color: red; ', '!соединение с сокетом остановлено!');
            const connection = await ctx.getters.getConnectSocket;

            await connection.stop();

            ctx.commit('connectSocket', '');
        },
    },
    mutations: {
        connectSocket(state, connect) {
            state.connectSocket = connect;
        },
    },
    getters: {
        getConnectSocket(state) {
            return state.connectSocket;
        },
    },
};
