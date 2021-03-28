import DevicesTable from '@/components/Monitoring/Equipment/DevicesTable.vue';

export default {
    components: {
        DevicesTable,
    },

    data: () => ({
        loading: true,
        statuses: [],
        racks: [],
        queryUuid: null,
        devices: [],
    }),

    async mounted() {
        this.queryUuid = this.$el.baseURI.substr(this.$el.baseURI.indexOf('=') + 1); // * uuid группы/стойки/ракурса

        this.$load(async () => {
            this.statuses = await this.$api.devicesStates.getAll();
            this.racks = await this.$api.racks.getAll();
            this.devices = await this.$api.devices.getAll({
                filterStatuses: [1, 7, 8],
            });

            /** Метод запроса девайсов с заданными фильтрами в миксине @/components/Monitoring/Equipment/DevicesTable.vue
             *
             */
            await this.generateDeviceData();
            this.loading = false;
        });
    },
};
