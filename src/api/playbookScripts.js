export default function(instance) {
    return {
        getAllScript() {
            return instance.get('DEMO_VERSION');
        },
        postCreateScript(payload) {
            return instance.post('DEMO_VERSION', payload);
        },
        deleteScriptFile(uuid) {
            return instance.delete(`DEMO_VERSION?uuid=${uuid}`);
        },
        updateScriptFile(payload) {
            return instance.patch(`DEMO_VERSION`, payload);
        },
        getScript(uuid) {
            return instance.get(`DEMO_VERSION/${uuid}`);
        },
    };
}
