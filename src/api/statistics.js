export default function(instance) {
    return {
        deviceTypesStatesAll() {
            return instance.get('DEMO_VERSION');
        },
        deviceRacksStatesAll() {
            return instance.get('DEMO_VERSION');
        },
        deviceGroupsStatesAll() {
            return instance.get('DEMO_VERSION');
        },
        deviceAnglesStatesAll() {
            return instance.get('DEMO_VERSION');
        },

        // * Загрузка статистики

        /**
         * ComponentTypeUuid: "00000000-0000-0000-0000-000000000003"
         * DeviceUuid: "6bc5bb83-b8e0-4bd5-bc1f-26fcd44a2deb"
         * monitoringProfileUuid: "00000000-0000-0000-0000-000000000001"
         */
        componentParameterMeasurements(params) {
            return instance.get('DEMO_VERSION', { params });
        },
        deviceTimestampStates(params) {
            return instance.get('DEMO_VERSION', { params });
        },
    };
}
