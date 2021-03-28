<template>
    <v-container fluid>
        <template>
            <TableOptions />
            <v-data-table
                :headers="headers"
                :items="items"
                :loading="loading"
                item-key="item.uuid"
                dense
                fixed-header
                disable-sort
                :no-data-text="$tableMessage['no-data-text']"
                :loading-text="$tableMessage['loading-text']"
                height="100%"
                :items-per-page="30"
                class="elevation-0"
            >
                <template v-slot:[`item.chart`]="{ item }">
                    <v-btn @click="$store.dispatch('buildGraph', item)" :color="Constants.STYLE.SUCCESS" small dark>
                        <v-icon small>mdi-poll</v-icon>
                        <span style="text-transform: capitalize" class="ml-1">График</span>
                    </v-btn>
                </template>

                <template v-slot:[`item.deviceState`]="{ item }">
                    <v-icon :color="statusColor(item.deviceState.uuid)" size="20px">
                        {{ statusIcon(item.deviceState.uuid) }}
                    </v-icon>
                </template>
                <template v-slot:[`item.deviceType`]="{ item }">
                    {{ item.deviceType.name || '-' }}
                </template>
            </v-data-table>
        </template>
    </v-container>
</template>

<script>
// Костяки
import { headers } from '@/backbones/tables';
// Фильтры
import protocolFullName from '@/filters/protocolFullName';
// Компоненты
import TableOptions from '@/components/app/TableOptions';
import { Constants } from '@/plugins/constants';

export default {
    props: {
        deviceData: {
            type: Array,
            required: true,
            default: [],
        },

        statuses: {
            type: Array,
            required: true,
            default: [],
        },
        racks: {
            type: Array,
            required: true,
            default: [],
        },
        isUserGroup: {
            type: Boolean,
            default: false,
        },
    },

    data: () => ({
        Constants,
        headers: [...headers, { text: '', value: 'chart' }],
        items: [],
        loading: true,
    }),

    components: {
        TableOptions,
    },

    filters: {
        protocolFullName,
    },

    methods: {
        statusIcon(uuid) {
            return this.$store.getters.getStatuses[uuid]?.icon;
        },
        statusColor(uuid) {
            return this.$store.getters.getStatuses[uuid]?.color;
        },

        rackName(uuid) {
            if (this.racks.length) {
                return this.racks.find(v => v.uuid === uuid).name;
            }
        },
    },

    mounted() {
        this.items = this.deviceData.map(data => ({
            ...data,
            pxe: '',
            rack: data.rackMount?.name,
            protocols: protocolFullName(data.protocols),
        }));

        /**
         * * Убирает поле deviceType, когда это не пользовательские группы/ракурсы или стойки
         */
        if (!this.isUserGroup) {
            const delItem = this.headers.find(v => v.value === 'deviceType');
            this.headers.splice(this.headers.indexOf(delItem), 1);
        }

        this.loading = false;
    },
};
</script>

<style scoped>
th,
td {
    padding: 0 5px !important;
}

.find-control {
    flex-grow: 0;
    flex-basis: unset;
    padding: 12px 0 0 14px;
    position: relative;
    top: 10px;
}
</style>
