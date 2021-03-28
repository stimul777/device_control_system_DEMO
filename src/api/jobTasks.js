export default function(instance) {
    return {
        getAll() {
            return instance.get('DEMO_VERSION');
        },
        get(uuid) {
            return instance.get(`DEMO_VERSION${uuid}`);
        },
        patch(payload) {
            return instance.patch(`DEMO_VERSION`, payload);
        },
    };
}
