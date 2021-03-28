<template>
    <Loader v-if="loading" />
    <DevicesTable v-else :statuses="statuses" :deviceData="deviceData" :racks="racks" :isUserGroup="true" />
</template>

<script>
import equiptableMixin from '@/mixins/equiptable.mixin';

export default {
    mixins: [equiptableMixin],
    data: () => ({
        deviceData: [],
    }),

    methods: {
        /** Вывод дейвайся из rackUUID
         *
         * @returns {Promise<void>}
         */
        async generateDeviceData() {
            this.deviceData = this.devices
                .filter(v => v.ipAddressNumber !== 0) // ! Убрать, когда починят БД.
                .filter(v => v.rackUUID === this.queryUuid);
        },
    },
};
</script>
