export default function(instance) {
    return {
        putPingTest(payload) {
            return instance.put(`DEMO_VERSION'`, payload);
        },
        putInventary(payload) {
            console.log('putInventary   ' + payload);
            return instance.put(`DEMO_VERSION'`, payload);
        },
        putTestDev(payload) {
            return instance.put(`DEMO_VERSION'`, payload);
        },
    };
}
