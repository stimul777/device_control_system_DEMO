export default function(instance) {
    return {
        getAll() {
            return instance.get('DEMO_VERSION');
        },
        patch(uuid, payload) {
            return instance.patch(`DEMO_VERSION/${uuid}`, payload);
        },
    };
}
