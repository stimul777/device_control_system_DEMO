export default function(instance) {
    return {
        get(filter) {
            return instance.get(`DEMO_VERSION ${filter}`);
        },
    };
}
