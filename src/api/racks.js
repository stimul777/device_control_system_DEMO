export default function(instance) {
    return {
        getAll() {
            return instance.get('DEMO_VERSION');
        },
        patch(uuid, payload) {
            return instance.patch(`DEMO_VERSION${uuid}`, payload);
        },
        post(payload) {
            return instance.post(`DEMO_VERSION`, payload);
        },
        delete(uuid) {
            return instance.delete(`DEMO_VERSION ${uuid}`);
        },
    };
}
