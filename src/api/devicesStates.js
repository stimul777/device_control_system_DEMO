export default function(instance) {
    return {
        getAll() {
            return instance.get('DEMO_VERSION');
        },
    };
}
