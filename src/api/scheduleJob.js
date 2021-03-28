export default function(instance) {
    return {
        installos(payload) {
            return instance.post('DEMO_VERSION', payload);
        },
        installsoft(payload) {
            return instance.post('DEMO_VERSION', payload);
        },
        startSaveConfigs(payload) {
            return instance.post('DEMO_VERSION', payload);
        },
    };
}
