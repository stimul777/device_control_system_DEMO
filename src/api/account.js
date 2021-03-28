export default function(instance) {
    return {
        login(payload) {
            return instance.post('DEMO_VERSION', payload);
        },
        logout() {
            return instance.post('DEMO_VERSION');
        },
    };
}
