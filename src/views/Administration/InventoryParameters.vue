<template>
    <v-container fluid>
        <v-container fluid v-show="showTable">
            <v-data-table
                dense
                :loading="loaderTable"
                loading-text="Загрузка данных..."
                loader-height="2"
                no-data-text="Нет данных"
                v-show="!showTableEdit"
                :items-per-page="100"
                :headers="headers"
                :items="itemsTable"
                item-key="itemsTable.identifier"
                class="elevation-1"
                height="75vh"
                fixed-header
            >
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn type="button" class="btn-icon-group" outlined small depressed @click="editDevice(item)">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn type="button" class="btn-icon-group" outlined small depressed @click="deleteDevice(item)">
                        <v-icon>mdi-minus</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-container>
        <v-container fluid>
            <DeviceEdit v-if="!showTable" :EditDeviceProps="EditDeviceProps" @showTableInventary="showTableInventory" />
        </v-container>
        <v-container fluid>
            <v-bottom-sheet v-model="confirm.isActive">
                <v-sheet class="text-center" height="200px">
                    <v-btn class="mt-6" text @click="confirm.isActive = !confirm.isActive" :disabled="confirm.isLoad">
                        Отменить
                    </v-btn>
                    <v-btn
                        class="mt-6"
                        text
                        :color="Constants.STYLE.SUCCESS"
                        @click="deleteDeviceConfirm"
                        :disabled="confirm.isLoad"
                    >
                        Удалить
                    </v-btn>
                    <div class="py-3">
                        Вы уверены, что хотите безвозвратно удалить {{ confirm.currentItem.deviceTypeTable }} с IP: "{{
                            confirm.currentItem.ipAddressString
                        }}" ?
                    </div>
                </v-sheet>
            </v-bottom-sheet>
        </v-container>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Constants } from '@/plugins/constants';

export default {
    components: {
        DeviceEdit: () => import('@/components/Administration/InventoryParameters/DeviceEdit'),
    },

    data: () => ({
        Constants,
        showTable: true,
        loaderTable: true,
        showTableEdit: false,
        itemsTable: [],
        EditDeviceProps: {},
        headers: [
            {
                text: 'IP-адрес',
                value: 'ipAddressString',
            },
            {
                text: 'Идентификатор',
                value: 'identifier',
            },
            {
                text: 'Тип оборудования',
                value: 'deviceTypeTable',
            },
            {
                text: 'Название',
                value: 'name',
            },
            {
                text: 'Производитель',
                value: 'boardMfg',
            },
            {
                text: 'Модель',
                value: 'productName',
            },
            {
                text: 'Серийный номер',
                value: 'productSerial',
            },
            {
                text: 'Протокол',
                value: 'protocolsTable',
            },
            {
                text: '',
                value: 'actions',
            },
        ],
        confirm: {
            isActive: false,
            currentItem: {},
            isLoad: false,
        },
    }),

    methods: {
        ...mapActions([
            'inventoryRequest',
            'inventoryDeviceType',
            'inventoryRacks',
            'inventoryProtocols',
            'inventoryRequestPatch',
            'inventoryDelete',
        ]),
        /** Запрос данных для таблицы
         *
         */
        startRequest() {
            this.inventoryRequest()
                .then(() =>
                    this.getInventoryDevice.map(item =>
                        this.itemsTable.push({
                            // поля для таблицы
                            identifier: item.identifier,
                            ipAddressString: item.ipAddressString,
                            productName: item.productName,
                            boardMfg: item.boardMfg,
                            productPartNumber: item.productPartNumber,
                            ipAddress: item.ipAddress,
                            biosRevision: item.biosRevision,
                            firmwareRevision: item.firmwareRevision,
                            macAddress: item.macAddress,
                            productSerial: item.productSerial,
                            rackUUID: item.rackUUID,
                            uuid: item.uuid,
                            name: item.name,
                            // комбобоксы
                            protocols: item.protocols,
                            rackMount: item.rackMount,
                            deviceType: item.deviceType,

                            // Для заполнения полей таблицы
                            deviceTypeTable:
                                // Тут мидл должен присваивать значение, если оно undefined
                                item.deviceType == null
                                    ? (item.deviceType = 'Неизвестно(front)')
                                    : item.deviceType.name,

                            protocolsTable: item.protocols
                                .filter(f => f.name !== 'undefined')
                                .map(m => m.name + (m.version ? `v.${m.version} ` : '')),
                        }),
                    ),
                )
                .then(() => (this.loaderTable = false));
        },

        /** Открытие формы редактирования устройства
         * @param item
         * */
        editDevice(item) {
            this.EditDeviceProps = item;
            this.showTable = false;
        },

        /** Вызов окна подтверждения об удалении записи
         *
         * @param item
         */
        deleteDevice(item) {
            this.confirm.isActive = true;
            this.confirm.currentItem = item;
        },

        /** Удаление строки в таблице с устройством
         *
         */
        deleteDeviceConfirm() {
            // удалить оборудование
            this.confirm.isLoad = true;
            this.inventoryDelete(this.confirm.currentItem.uuid).then(() => {
                this.confirm.isLoad = false;
                this.confirm.isActive = !this.confirm.isActive;

                this.itemsTable.splice(
                    this.itemsTable.indexOf(this.itemsTable.find(i => i.uuid === this.confirm.currentItem.uuid)),
                    1,
                );
                this.$store.dispatch('snackSuccess', 'Оборудование удалено');
            });
        },

        showTableInventory() {
            this.showTable = !this.showTable;
        },
    },

    computed: {
        ...mapGetters(['getInventoryDevice', 'getDeviceType', 'getInventoryRacks', 'getInventoryProtocols']),
    },

    async mounted() {
        this.startRequest();
        this.inventoryDeviceType();
        this.inventoryRacks();
        this.inventoryProtocols();
    },
};
</script>
