export default function(instance) {
    return {
        patch(payload) {
            return instance.patch(`DEMO_VERSION`, payload);
        },
    };
}
