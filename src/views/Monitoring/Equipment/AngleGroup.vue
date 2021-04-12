<template>
    <Loader v-if="loading" />
    <DevicesTable v-else :statuses="statuses" :deviceData="deviceData" :racks="racks" :isUserGroup="true" />
</template>

<script>
import equitableMixin from '@/mixins/equiptable.mixin';

export default {
    mixins: [equitableMixin],
    data: () => ({
        deviceData: [],
    }),

    methods: {
        /** Вывод девайса из userPerspectives
         *
         * @returns {Promise<void>}
         */
        async generateDeviceData() {
            this.deviceData = this.devices
                .filter(v => v.ipAddressNumber !== 0)
                .filter(v => v.userPerspectives?.find(v => v.uuid === this.queryUuid));
        },
    },
};
</script>
