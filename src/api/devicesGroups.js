export default function(instance) {
    return {
        getAll() {
            return instance.get(`DEMO_VERSION'`);
        },
        patch(payload) {
            return instance.patch(`DEMO_VERSION'`, payload);
        },
    };
}
