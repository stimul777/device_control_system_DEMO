export default function(instance) {
    return {
        getAllKickstart() {
            return instance.get('DEMO_VERSION');
        },
        postCreateKickstart(payload) {
            return instance.post('DEMO_VERSION', payload);
        },
        deleteKickstartFile(uuid) {
            return instance.delete(`DEMO_VERSION ${uuid}`);
        },
        updateKickstartFile(payload) {
            return instance.put(`DEMO_VERSION`, payload);
        },
        getKickstart(uuid) {
            return instance.get(`DEMO_VERSION ${uuid}`);
        },
    };
}
