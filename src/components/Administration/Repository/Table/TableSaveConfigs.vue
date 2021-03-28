<template>
    <v-container style="padding:0" fluid>
        <v-row no-gutters>
            <v-col>
                <div v-if="this.stateConfigs.openTableConfigs" style="text-align: start">
                    <v-btn color="#e21a1a" dark icon @click="goBackTable">
                        <v-icon color="black">mdi-keyboard-backspace</v-icon>
                    </v-btn>
                    <p>{{ 'Просмотр сохраненных конфигураций IP: ' + this.ipShowCong }}</p>
                </div>
                <div v-show="!this.showTextConfig">
                    <v-data-table
                        :headers="this.stateConfigs.openTableConfigs ? headersTable : headersTableConfig"
                        :items="this.stateConfigs.openTableConfigs ? itemsTable : filterDevice"
                        :items-per-page="100"
                        class="elevation-1"
                        item-key="id"
                        dense
                        :loading-text="$tableMessage['loading-text']"
                        loader-height="2"
                        :no-data-text="$tableMessage['no-data-text']"
                        height="50vh"
                        fixed-header
                        :loading="loaderTable"
                        hide-default-footer
                    >
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon class="mr-2" small icon @click="showConfigsItem(item)">mdi-eye</v-icon>
                        </template>
                    </v-data-table>
                </div>
                <div v-show="this.showTextConfig">
                    <div>
                        {{ this.stateConfigs.selectedRowConf.configuration }}
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import scriptsTableMixin from '@/mixins/scriptstable.mixin';
import DeviceGroup from '../../../Control/DeviceGroup/DeviceGroup';

export default {
    mixins: [scriptsTableMixin],

    data: () => ({
        selectedFile: null,
        isSelecting: false,
        headersTable: [
            { text: 'Название', value: 'name' },
            { text: 'Конфигурация', value: 'configuration' },
            { text: 'Дата создания', value: 'dateCreate' },
            { text: '', value: 'actions' },
        ],
        headersTableConfig: [
            { text: 'IP-адрес', value: 'ipAddressString' },
            { text: 'SKU/Part №', value: 'productPartNumber' },
            { text: 'Производитель', value: 'boardMfg' },
            { text: 'Модель/Серия', value: 'productName' },
            { text: 'BMC', value: 'firmwareRevision' },
            { text: '', value: 'actions' },
        ],
        stateConfigs: {},
        showConfigs: false,
        showTextConfig: false,
        filterDevice: [],
        ipShowCong: '',
    }),
    computed: {
        ...mapGetters(['getStateConfigs', 'getAllConfigs', 'getDevicesManagementFilter']),
    },
    methods: {
        ...mapActions([
            'requestAllSaveConfigs',
            'showCopyTable',
            'actionDevicesManagementFilter',
            'requestConfig',
            'closeShowTableConfigs',
            'selectedRowConfigs',
        ]),

        async getRows() {
            await this.actionDevicesManagementFilter('?FilterType=4');
            this.filterDevice = this.getDevicesManagementFilter;
            this.loaderTable = false;
        },
        async showConfigsItem(item) {
            if (!this.stateConfigs.openTableConfigs) {
                this.ipShowCong = item.ipAddressString;
                await this.requestAllSaveConfigs(item.uuid);
                this.itemsTable = this.getAllConfigs;
            } else {
                console.log(item);
                this.showTextConfig = true;
                this.selectedRowConfigs(item);
            }
        },
        goBackTable() {
            this.closeShowTableConfigs();
            this.showTextConfig = false;
        },
    },

    async mounted() {
        this.stateConfigs = this.getStateConfigs;
    },
};
</script>

<style scoped></style>
