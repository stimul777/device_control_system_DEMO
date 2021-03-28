<template>
    <v-col class="d-flex justify-center">
        <Loader v-if="loading" />
        <v-card v-else class="mx-auto py-6" style="width: 800px">
            <v-card-title>График текущих значений параметров компонентов</v-card-title>
            <v-card-text>
                <v-simple-table dense>
                    <thead>
                        <tr>
                            <th class="table-th-graph">Компонент</th>
                            <th class="table-th-graph">Параметр</th>
                            <th class="table-th-graph">Ед. измерения</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <v-select
                                    style="max-width: 160px; position: relative; z-index: 2000"
                                    hide-details
                                    dense
                                    :items="components"
                                    item-text="name"
                                    return-object
                                    v-model="selectedComponent"
                                ></v-select>
                            </td>
                            <td>
                                <v-select
                                    style="max-width: 160px; position: relative; z-index: 2000"
                                    hide-details
                                    dense
                                    :items="parameters"
                                    item-text="name"
                                    return-object
                                    v-model="selectedParameter"
                                ></v-select>
                            </td>
                            <td>{{ this.selectedParameter.unit }}</td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </v-card-text>

            <div>
                <highcharts :constructorType="'stockChart'" class="hc px-4" :options="chartOptions"></highcharts>
            </div>
        </v-card>
    </v-col>
</template>

<script>
export default {
    data() {
        return {
            loading: true,

            components: null,

            selectedComponent: null,
            selectedParameter: null,
            chartOptions: {
                credits: { enabled: false },
                // rangeSelector: {
                //     selected: 1,
                // },
                yAxis: {
                    plotLines: [
                        {
                            value: this.thresholdValue,
                            color: 'red',
                            dashStyle: 'line',
                            width: 1,
                            label: {
                                text: 'Пороговое значение',
                            },
                        },
                    ],
                },
                series: [
                    {
                        data: [],
                        tooltip: {
                            valueDecimals: 1,
                        },
                    },
                ],
            },
        };
    },

    methods: {
        async loadComponentsWithParameters() {
            await this.$load(async () => {
                const deviceInfo = await this.$api.devices.get(this.deviceUuid);
                const deviceComponentsInfo = deviceInfo[0].componentTypeParameters;

                this.components = deviceComponentsInfo.map(d => ({
                    uuid: d.componentType.uuid,
                    name: d.componentType.name,
                    parameters: d.monitoringProfile.map(p => ({
                        uuid: p.uuid,
                        name: p.name,
                        unit: p.parameterType.unit,
                        thresholdValue: p.thresholdValue,
                    })),
                }));
            });
        },

        async loadChartInfo() {
            await this.$load(async () => {
                const params = {
                    DeviceUuid: this.deviceUuid,
                    ComponentTypeUuid: this.selectedComponent.uuid,
                    monitoringProfileUuid: this.selectedParameter.uuid,
                };

                const chartInfo = await this.$api.statistics.componentParameterMeasurements(params);

                this.chartOptions.series[0].data = chartInfo.measurements.map(m => {
                    return [m.date, m.value];
                });

                this.chartOptions.yAxis.plotLines[0].value = this.thresholdValue;
            });
        },

        setSelectedValues() {
            if (this.$store.getters.getSelectedCompAndParam) {
                const compName = this.$store.getters.getSelectedCompAndParam.compName;
                const paramName = this.$store.getters.getSelectedCompAndParam.parameter;
                this.selectedComponent = this.components.find(c => c.name == compName);
                this.selectedParameter = this.parameters.find(p => p.name == paramName);
            } else {
                this.selectedComponent = this.components[0];
            }
        },
    },

    computed: {
        parameters() {
            return this.selectedComponent.parameters;
        },

        deviceUuid() {
            return this.$route.query.uuid;
        },

        thresholdValue() {
            return this.selectedParameter.thresholdValue;
        },
    },

    watch: {
        selectedComponent() {
            if (!this.$store.getters.getSelectedCompAndParam) {
                this.selectedParameter = this.parameters[0];
            } else {
                this.$store.commit('clearSelectedCompAndParam');
            }
        },

        async selectedParameter() {
            await this.loadChartInfo();
        },
    },

    async mounted() {
        await this.loadComponentsWithParameters();
        this.setSelectedValues();
        this.loading = false;
    },
};
</script>

<style></style>
