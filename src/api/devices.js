export default function (instance) {
    return {
        getAll(params) {
            return instance.get(`DEMO_VERSION'`, { params });
        },

        // * Получить компоненты
        get(uuid, params) {
            return instance.get(`DEMO_VERSION'${uuid}`, { params });
        },
        delete(uuid) {
            return instance.delete(`DEMO_VERSION'${uuid}`);
        },
        patch(obj) {
            return instance.patch(`DEMO_VERSION'${obj.uuid}`, obj.devices);
        },
        post(payload) {
            return instance.patch(`DEMO_VERSION'`, payload);
        },
        getInRack(uuid) {
            return instance.get(`DEMO_VERSION'${uuid}`);
        },
        getInGroup(uuid) {
            return instance.get(`DEMO_VERSION'${uuid}`);
        },
        getInAngle(uuid) {
            return instance.get(`DEMO_VERSION'${uuid}`);
        },
    };
}
