<template>
    <v-container fluid>
        <!-- Вкладки -->
        <v-tabs align-with-title :color="'success'">
            <v-tab :disabled="disabledTab" @click="tabActiv(ACTIVATED_TAB.RACKS)">Стойки</v-tab>
            <v-tab :disabled="disabledTab" @click="tabActiv(ACTIVATED_TAB.GROUPS)">Группы</v-tab>
            <v-tab :disabled="disabledTab" @click="tabActiv(ACTIVATED_TAB.ANGLES)">Ракурсы</v-tab>
            <v-tab @click="tabActiv('deviceType')">Типы оборудования</v-tab>
            <v-tabs-slider :color="disabledTab ? 'default' : 'tabs-slider-success'"></v-tabs-slider>
        </v-tabs>
        <!-- Типы оборудования -->
        <DeviceType v-if="deviceTypeShow" />
        <v-row no-gutters>
            <!-- Компонент пустой таблицы -->
            <EnterTitle v-if="enterTitleShow" :activatedTabProps="activatedTabProps" @tabActiv="tabActiv" />
            <!-- Таблица с пришедшим оборудованием(Карточка) -->
            <DirectoryData
                v-if="directoryDataShow"
                @requestDisabled="requestDisabled"
                @dataTable="dataTable"
                @newDirectory="newDirectory"
                @newDirectoryShow="newDirectoryShow"
                @btnShowTable="btnShowTable"
                :activatedTabProps="activatedTabProps"
            />

            <!-- Таблица с оборудованием -->
            <v-col v-if="tableShow" sm="8" md="9">
                <v-data-table
                    height="70vh"
                    fixed-header
                    :hide-default-footer="true"
                    :loading="loaderTable"
                    loader-height="2"
                    loading-text="Загрузка данных..."
                    no-data-text="Нет данных"
                    :headers="headersTable"
                    :items="!loaderTable ? itemsTable : []"
                    item-key="key"
                >
                    <template v-slot:[`item.checkbox`]="{ item }">
                        <v-checkbox v-model="item.checkbox" :disabled="checkboxDisabled"></v-checkbox>
                    </template>
                </v-data-table>
                <v-btn class="btn btn-primary" style="left: 85%" v-show="btnEditShow && !loaderTable" @click="editTable"
                    >Изменить</v-btn
                >
                <v-btn
                    class="btn btn-success"
                    style="left: 85%"
                    v-show="btnSaveShow && !loaderTable"
                    @click="saveTable()"
                    >Сохранить</v-btn
                >
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import EnterTitle from '@/components/Administration/Directory/EnterTitle';
import DirectoryData from '@/components/Administration/Directory/DirectoryData';
import DeviceType from '@/components/Administration/Directory/DeviceType';
import { Constants } from '@/plugins/constants';

const ACTIVATED_TAB = {
    RACKS: 'Racks',
    GROUPS: 'Groups',
    ANGLES: 'Angles',
};

export default {
    components: {
        EnterTitle,
        DirectoryData,
        DeviceType,
    },
    data: () => ({
        deviceTypeShow: false,
        enterTitleShow: false,
        directoryDataShow: true,
        btnEditShow: false,
        btnSaveShow: false,
        tableShow: true,
        activatedTab: '',
        loaderTable: false,
        checkboxDisabled: true,
        localGetDevice: [],
        localGetUnknownDevices: [],
        activatedTabProps: '',
        itemsTable: [],
        activItem: [],
        disabledTab: false,
        headersTable: [
            { text: '', value: 'checkbox', align: 'start', sortable: false },
            { text: 'Тип оборудования', value: 'name' },
            { text: 'Инвентарный номер', value: 'inventoryNumber' },
            { text: 'Модель', value: 'model' },
            { text: 'Производитель', value: 'manufacturer' },
            { text: 'Серийный номер', value: 'serialNumber' },
            { text: 'IP адрес ', value: 'IP' },
        ],
        ACTIVATED_TAB,
    }),

    methods: {
        ...mapActions([
            'clickOnCard',
            'requestDevices',
            'requestUnknownDevices',
            'requestEquipmentDirectory',
            'removeDeviceServer',
        ]),

        // *активная вкладка
        tabActiv(param) {
            if (param == null) {
                param = 'Racks';
            }

            console.log('param', param);

            this.itemsTable = [];
            this.deviceTypeShow = this.enterTitleShow = this.btnEditShow = false;
            this.directoryDataShow = this.tableShow = this.disabledTab = true;

            this.activatedTabProps = param;

            param !== 'deviceType'
                ? this.$emit(param)
                : ((this.deviceTypeShow = true), (this.directoryDataShow = this.tableShow = this.disabledTab = false));
        },

        /**Клик по карточке
         *
         * @param activatedTab
         * @param item
         * @returns {Promise<void>}
         */
        async dataTable(activatedTab, item) {
            this.itemsTable = [];
            this.loaderTable = this.btnEditShow = this.disabledTab = true;
            this.activItem = item;
            this.activatedTab = activatedTab;

            /**Store: Определяем тип справочника и передаем путь
             *
             */
            await this.clickOnCard({ patch: activatedTab, uuid: item.uuid });

            this.fillingTable(this.getDevice, true);

            this.checkboxDisabled = true;
            this.loaderTable = this.disabledTab = false;
        },

        /**заполнение таблицы
         *
         * @param itemAll
         * @param checkboxFlag
         */
        fillingTable(itemAll, checkboxFlag) {
            itemAll.map(item => {
                this.itemsTable.push({
                    name: item.deviceType.name,
                    inventoryNumber: item.productPartNumber,
                    model: item.productName,
                    manufacturer: item.boardMfg,
                    serialNumber: item.productSerial,
                    IP: item.ipAddressString,
                    rackMount: item.rackMount,
                    // для отрисовки таблицы - уникальный key
                    key: item.uuid,
                    //ставим чекед на все пришедшее оборудование
                    checkbox: checkboxFlag,
                });
            });
        },

        /**Добавить или убрать оборудования из справочника
         *
         * @returns {Promise<void>}
         */
        async editTable() {
            this.checkboxDisabled = this.btnEditShow = false;
            this.btnSaveShow = this.loaderTable = true;

            // Racks
            if (this.activatedTab === ACTIVATED_TAB.RACKS) {
                await this.$load(async () => {
                    this.getAllDevices = await this.$api.devices.getInRack(Constants.CODE_STATUSES.CODE_STATUSES_1);
                });
            }

            // Groups and Angles
            if (this.activatedTab === ACTIVATED_TAB.GROUPS || this.activatedTab === ACTIVATED_TAB.ANGLES) {
                await this.$load(async () => {
                    this.getAllDevices = await this.$api.devices.getAll();
                });

                for (let activKey of this.itemsTable) {
                    for (let newKey of this.getAllDevices) {
                        if (activKey.key === newKey.uuid) {
                            this.getAllDevices.splice(this.getAllDevices.indexOf(newKey), 1);
                        }
                    }
                }
            }

            this.fillingTable(this.getAllDevices, false);
            this.loaderTable = false;
        },
        /** Сохранение таблицы
         *
         * @returns {Promise<*>}
         */
        async saveTable() {
            this.btnEditShow = this.btnSaveShow = false;
            this.checkboxDisabled = true;

            // !Racks
            if (this.activatedTab === 'Racks') {
                this.itemsTable.map(m =>
                    m.checkbox === false
                        ? (m.rackMount.uuid = Constants.CODE_STATUSES.CODE_STATUSES_1)
                        : (m.rackMount.uuid = this.activItem.uuid),
                );

                let racksArr = [];
                this.itemsTable.map(m => {
                    racksArr.push({
                        rackUUID: m.rackMount.uuid,
                        deviceUUID: m.key,
                    });
                });

                /**Отправка стоек на сервер
                 *
                 */
                await this.$load(async () => {
                    await this.$api.devicesRacks.patchRacks(racksArr);
                });
            }

            // !Groups and !Angles
            let deviceCheckboxFalse = [];
            let deviceCheckboxTrue = [];
            let patchApi = {
                patch: '',
                deletePatch: '',
            };

            if (this.activatedTab === ACTIVATED_TAB.GROUPS) {
                this.itemsTable.map(i =>
                    i.checkbox === false
                        ? deviceCheckboxFalse.push({
                              groupUUID: this.activItem.uuid,
                              deviceUUID: i.key,
                          })
                        : deviceCheckboxTrue.push({
                              groupUUID: this.activItem.uuid,
                              deviceUUID: i.key,
                          }),
                );
                patchApi.patch = 'patchGroup';
                patchApi.deletePatch = 'deleteGroups';
            }

            if (this.activatedTab === ACTIVATED_TAB.ANGLES) {
                this.itemsTable.map(i =>
                    i.checkbox === false
                        ? deviceCheckboxFalse.push({
                              angleUUID: this.activItem.uuid,
                              deviceUUID: i.key,
                          })
                        : deviceCheckboxTrue.push({
                              angleUUID: this.activItem.uuid,
                              deviceUUID: i.key,
                          }),
                );
                patchApi.patch = 'patchAngles';
                patchApi.deletePatch = 'deleteAngles';
            }

            // сохранить с чекбоксами тру
            await this.$load(async () => {
                if (patchApi.patch.length > 0) await this.$api.devicesRacks[patchApi.patch](deviceCheckboxTrue);
            });

            // удалить оборудование
            await this.$load(async () => {
                if (patchApi.deletePatch.length > 0)
                    await this.$api.devicesRacks[patchApi.deletePatch](deviceCheckboxFalse);
            });

            this.dataTable(this.activatedTab, this.activItem);
        },

        requestDisabled(i) {
            this.disabledTab = i;
        },

        newDirectoryShow() {
            this.enterTitleShow = false;
        },

        /** Добавление новой директории
         *
         * @param itemDir
         */
        newDirectory(itemDir) {
            this.enterTitleShow = true;
            this.directoryDataShow = false;
            this.activatedTabProps = itemDir;
        },

        btnShowTable() {
            this.btnEditShow = true;
            this.btnSaveShow = false;
        },
    },

    computed: {
        ...mapGetters(['getDevice']),
    },

    mounted() {
        this.tabActiv();
    },
};
</script>
