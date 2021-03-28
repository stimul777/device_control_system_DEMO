export default function(instance) {
    return {
        getAllSaveConfigs(uuidDev) {
            return instance.get(`DEMO_VERSION/${uuidDev}`);
        },
        getConfig(uuidDev) {
            return instance.get(`DEMO_VERSION/${uuidDev}`);
        },
        // postCreateKickstart(payload){
        //     return instance.post('/json/repository/KickStart', payload);
        // },
        // deleteKickstartFile(uuid) {
        //     return instance.delete(`/json/repository/KickStart/${uuid}`);
        // },
        // updateKickstartFile(payload){
        //     return instance.put(`/json/repository/KickStart`, payload);
        //
        // },
        // getKickstart(uuid){
        //     return instance.get(`/json/repository/KickStart/${uuid}`);
        //
        // }
    };
}
