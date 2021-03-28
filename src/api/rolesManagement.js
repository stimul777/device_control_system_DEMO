export default function(instance) {
    return {
        getAllRoles() {
            return instance.get('DEMO_VERSION');
        },

        getFrontClaims(params) {
            return instance.get('DEMO_VERSION', { params });
        },

        putChangeFrontClaims(role, payload) {
            return instance.put(`DEMO_VERSION?role=${role}`, payload);
        },
    };
}
