export default function(instance) {
    return {
        getAll() {
            return instance.get(`DEMO_VERSION'`);
        },
        get(filter) {
            return instance.get(`DEMO_VERSION'${filter}`);
        },
        post(command) {
            return instance.post(`DEMO_VERSION'${command.patch}`, command.elementArr);
        },
    };
}
