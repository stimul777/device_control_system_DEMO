export default function(instance) {
    return {
        getAllOsItems() {
            return instance.get('DEMO_VERSION');
        },
        filterOsItems(payload) {
            return instance.get(`DEMO_VERSION${payload}`);
        },
    };
}
