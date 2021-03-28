export default function(instance) {
    return {
        getArchitecture() {
            return instance.get('DEMO_VERSION');
        },

        getOstype() {
            return instance.get('DEMO_VERSION');
        },
    };
}
