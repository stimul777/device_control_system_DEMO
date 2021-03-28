export default function(instance) {
    return {
        getParameterTracking(params) {
            return instance.get('DEMO_VERSION', { params });
        },
    };
}
