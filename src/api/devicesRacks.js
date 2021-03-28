export default function(instance) {
    return {
        postDevicespack(payload) {
            return instance.post('DEMO_VERSION', payload);
        },
        patchRacks(payload) {
            return instance.patch('DEMO_VERSION', payload);
        },

        patchGroup(payload) {
            return instance.patch('DEMO_VERSION', payload);
        },
        deleteGroups(payload) {
            return instance.delete('DEMO_VERSION', { data: payload });
        },
        patchAngles(payload) {
            return instance.patch('DEMO_VERSION', payload);
        },
        deleteAngles(payload) {
            return instance.delete('DEMO_VERSION', { data: payload });
        },
    };
}
