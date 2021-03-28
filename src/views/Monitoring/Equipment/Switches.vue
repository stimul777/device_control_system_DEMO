<template>
    <Loader v-if="loading" />
    <DevicesTable v-else :statuses="statuses" :deviceData="deviceData" :racks="racks" :isUserGroup="false" />
</template>

<script>
import equiptableMixin from '@/mixins/equiptable.mixin';
import { Constants } from '@/plugins/constants';

export default {
    mixins: [equiptableMixin],
    data: () => ({
        deviceData: [],
    }),

    methods: {
        /** Вывод девайсов из deviceType
         *
         * @returns {Promise<void>}
         */
        async generateDeviceData() {
            this.deviceData = this.devices
                .filter(v => v.ipAddressNumber !== 0) // ! Убрать, когда починят БД.
                .filter(v => v.deviceType?.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_4));
        },
    },
};
</script>
