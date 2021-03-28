import router from '@/router';

export default {
    state: {
        deviceData: {},
    },

    mutations: {
        setDeviceData(state, device) {
            state.deviceData = {
                ip: device.ipAddressString,
                type: device.deviceType.name,
                boardMfg: device.boardMfg,
                productName: device.productName,
            };
        },
    },

    actions: {
        /** Запрос данных графика для устройства
         *
         * @param ctx
         * @param device
         */
        buildGraph(ctx, device) {
            router.push(`/monitoring/equipment/device_charts?uuid=${device.uuid}`);
            ctx.commit('setDeviceData', device);
        },
    },

    getters: {
        getDeviceData: state => state.deviceData,
    },
};
