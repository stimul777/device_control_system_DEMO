export default function(instance) {
    return {
        getAllUsers() {
            return instance.get('DEMO_VERSION');
        },

        addUser(payload) {
            return instance.post('DEMO_VERSION', payload);
        },

        updateUser(payload) {
            return instance.patch('DEMO_VERSION', payload);
        },

        deleteUser(data) {
            return instance.delete('DEMO_VERSION', { data });
        },

        putUsersManagement(payload) {
            return instance.put('DEMO_VERSION', payload);
        },
    };
}
