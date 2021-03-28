<template>
    <v-container fluid v-if="deviceData.length">
        <v-row>
            <v-col cols="12">
                <v-simple-table class="pa-2" dense>
                    <thead>
                        <tr>
                            <th class="table-th-graph">IP-адрес</th>
                            <th class="table-th-graph">Тип устройства</th>
                            <th class="table-th-graph">Производитель</th>
                            <th class="table-th-graph">Модель</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ deviceData[0].ip }}</td>
                            <td>{{ deviceData[0].dt }}</td>
                            <td>{{ deviceData[0].mfg }}</td>
                            <td>{{ deviceData[0].model }}</td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </v-col>
            <v-col class="d-flex justify-center">
                <v-card class="mx-auto py-6" style="width: 800px">
                    <v-card-title>График отказоустойчивости</v-card-title>
                    <v-row>
                        <v-col>
                            <FaultTolerance :styles="chartStyle" :chartdata="chartdata" />
                        </v-col>
                        <v-col>
                            <v-slider
                                v-model="slider"
                                :tick-labels="ticksLabels"
                                :max="5"
                                step="1"
                                ticks="always"
                                tick-size="5"
                                hide-details
                                vertical
                            ></v-slider>
                        </v-col>
                    </v-row>
                    <v-card-text>
                        <div style="font-size: 16px; color: #000" class="mb-2">Данные о графике:</div>
                        <div class="d-flex">
                            <div
                                style="margin-right: 10px"
                                v-for="(l, i) of chartdata.labels"
                                :key="l.id"
                                :style="'color:' + chartdata.datasets[0].backgroundColor[i]"
                            >
                                <v-icon size="20px" :style="'color:' + chartdata.datasets[0].backgroundColor[i]">
                                    {{ $store.getters.getStatuses[$store.getters.getUuidFromName[l]].icon }}
                                </v-icon>
                                {{ countData[i] }}
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- График компонент -->
            <Components />
        </v-row>
    </v-container>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    components: {
        FaultTolerance: () => import('@/components/Graphs/FaultTolerance.vue'),
        Components: () => import('@/components/Graphs/Components.vue'),
    },

    data: () => ({
        uuid: '',
        countData: [],
        slider: 0,
        labels: [],
        ticksLabels: ['1 Месяц', '2 Месяца', '3 Месяца', '4 месяца', '5 месяцев', '6 месяцев'],

        chartStyle: {
            width: '600px',
            height: '300px',
        },

        deviceData: [],
    }),

    watch: {
        slider() {
            this.fetchCount(this.uuid, this.slider + 1);
        },
    },

    methods: {
        /** Получение данных для графика отказоустойчивости
         *
         * @param uuid
         * @param month
         * @returns {Promise<void>}
         */
        async fetchCount(uuid, month) {
            this.$load(async () => {
                const response = await this.$api.statistics.deviceTimestampStates({
                    uuid,
                    time: month,
                });

                let resObj = response.states.filter(v => !v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1));

                this.countData = resObj.map(v => v.count);
                this.labels = resObj?.map(v => this.$store.getters.getLabels[v.name]);
            });
        },

        statusIcon(uuid) {
            return this.$store.getters.getStatuses[uuid].icon;
        },
    },

    computed: {
        chartdata() {
            return {
                labels: this.labels,
                datasets: [
                    {
                        backgroundColor: ['#999999', '#FFB017', '#E21A1A', '#00BE6E', '#0066A1'],
                        data: this.countData,
                    },
                ],
            };
        },
    },

    async mounted() {
        this.uuid = this.$route.fullPath.substr(this.$route.fullPath.indexOf('=') + 1);
        this.fetchCount(this.uuid, 1);

        this.$load(async () => {
            const device = await this.$api.devices.get(this.uuid);
            this.deviceData = device.map(d => {
                return {
                    ip: d.ipAddressString,
                    dt: d.deviceType.name,
                    mfg: d.boardMfg,
                    model: d.productName,
                };
            });
        });
    },
};
</script>

<style>
.v-slider--vertical {
    min-height: 270px !important;
    flex: 0 !important;
}

.table-th-graph {
    font-size: 14px !important;
    color: #000 !important;
    border-top: 1px solid #dfdfdf;
}
</style>
