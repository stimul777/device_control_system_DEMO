<template>
    <v-container fluid>
        <v-row dense no-gutters v-show="mainControlTable">
            <v-col cols="12" lg="12" md="12">
                <v-data-table
                    :loading="loaderTable"
                    :headers="showSaveConfigsTable ? configsHeaders : headers"
                    :items="itemsTable"
                    :show-select="showSelect"
                    :hide-default-footer="true"
                    :items-per-page="100"
                    item-key="uuid"
                    class="elevation-1"
                    dense
                    loading-text="Загрузка данных..."
                    loader-height="2"
                    no-data-text="Нет данных"
                    height="60vh"
                    fixed-header
                    disable-pagination
                    v-model="selectedCheck"
                >
                    <template v-slot:[`item.state`]="{ item }" v-if="!showSaveConfigsTable">
                        <v-icon :color="item.status.color">{{ item.status.icon }}</v-icon>
                    </template>
                    <template v-slot:[`item.state`]="{ item }" v-else>
                        <v-icon v-if="item.loaderReboot" :color="item.status.color">{{ item.status.icon }}</v-icon>
                        <v-progress-circular v-else indeterminate color="green" size="25"></v-progress-circular>
                    </template>
                    <template v-slot:[`item.powerIcon`]="{ item }">
                        <v-icon v-if="item.loaderReboot" :color="item.powerIcon.color">{{
                            item.powerIcon.icon
                        }}</v-icon>
                        <v-progress-circular v-else indeterminate color="green" size="25"></v-progress-circular>
                    </template>

                    <template v-slot:[`item.installSoftware`]="{ item }">
                        <v-btn
                            class="btn btn-success"
                            style="max-width: 10%"
                            :disabled="item.btnInstallDisable"
                            @click="goInstallTable(item, 'installSoftware')"
                        >
                            <v-icon>mdi-harddisk-plus</v-icon>
                            <p style="margin: 0;">Развертывание ПО</p>
                        </v-btn>
                    </template>
                    <template v-slot:[`item.protocols`]="{ item }">
                        {{
                            item.protocols
                                .filter(f => f.name !== 'undefined')
                                .map(m => m.name + (m.version ? ` v.${m.version}` : ''))
                                .toString()
                        }}
                    </template>
                </v-data-table>

                <v-container>
                    <v-row>
                        <v-select
                            v-if="!roleClaims.find(cl => cl === 'c/Control')"
                            :label="selectLabel"
                            style="max-width: 60%"
                            :items="Object.values(itemsComboBox)"
                            v-model="ComboBoxModel"
                        ></v-select>
                        <v-btn
                            v-show="showBtnStart"
                            :disabled="disabledBtnStart"
                            class="btn btn-success ml-10"
                            style="min-width: 25%"
                            @click="startAction()"
                            >{{ nameStartBtn }}
                        </v-btn>
                    </v-row>

                    <v-row>
                        <Calendar v-if="calendarShow" :activComponent="'deviceGroup'" />
                        <TimeValidator v-if="timeValidatorShow" :activComponent="'deviceGroup'" />
                        <v-btn disabled v-show="startPlanBtnShow" class="btn btn-success ml-10" style="min-width: 20%"
                            >Запустить по плану
                        </v-btn>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
        <v-row>
            <InstallationTable
                v-if="showInstallationTable"
                :propsDataTableInstall="propsDataTableInstall"
                @cancelInstallTable="cancelInstallTable"
            />
        </v-row>
        <v-row>
            <MacAddresses v-if="showMacAddresses" @cancelInstallTable="cancelInstallTable" />
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
/** вспомогательные функции
 *
 */
import { messageUserDeviceGroup } from '@/assistant/assistant';
import { Constants } from '@/plugins/constants';

/** компоненты
 *
 */
import Calendar from '@/components/app/Calendar';
import TimeValidator from '@/components/app/TimeValidator';
import InstallationTable from '@/components/Control/DeviceGroup/InstallationTable';
import MacAddresses from '@/components/Control/DeviceGroup/MacAddresses';
import SaveConfigsTable from './SaveConfigsTable';
import { dateTransformationUTC } from '@/assistant/assistant';

export default {
    components: {
        SaveConfigsTable,
        Calendar,
        TimeValidator,
        InstallationTable,
        MacAddresses,
    },

    props: {
        propsDeviceType: {
            type: Object,
            require: true,
        },
    },

    data: () => ({
        // general
        Constants,
        // props to send
        propsDataTableInstall: {},
        propsDataTableSaveConfigs: {},
        // all
        calendarShow: false,
        timeValidatorShow: false,
        startPlanBtnShow: false,
        showInstallationTable: false,
        showSaveConfigsTable: false,
        showMacAddresses: false,
        mainControlTable: true,
        // buttons
        nameStartBtn: '',
        disabledBtnStart: false,
        showBtnStart: false,
        installDisabledBtn: true,
        // checked
        showSelect: false,
        selectedCheck: [],

        selectLabel: 'Действия',
        ComboBoxModel: '',
        showDeviceType: true,

        itemsTable: [],
        tableClone: [],
        // loader
        loaderTable: true,
        loaderStatus: true,
        progressCircularProps: {
            size: 50,
            color: Constants.STYLE.SUCCESS,
        },
        progressCircularShow: true,

        // Отфильтрованные девайсы в таблице:
        filterDevice: [],
        itemsComboBox: {
            back: 'Показать все устройства',
            start: 'Включение электропитания',
            stop: 'Выключение электропитания',
            reboot: 'Перезагрузка',
            serviceon: 'Постановка на обслуживание',
            serviceoff: 'Снятие с обслуживания',
            systemLoad: 'Развертывание ОС',
            software: 'Развертывание ПО',
            saveConfigs: 'Резервное копирование конфигураций',
        },

        headers: [
            { text: 'Стойка', value: 'rack' },
            { text: 'IP-адрес', value: 'ipAddressString' },
            { text: 'SKU/Part №', value: 'productPartNumber' },
            { text: 'Производитель', value: 'boardMfg' },
            { text: 'Идентификатор', value: 'identifier' },
            { text: 'Модель/Серия', value: 'productName' },
            { text: 'Серийный №', value: 'productSerial' },
            { text: 'Статус', value: 'state' },
            { text: 'BIOS', value: 'biosRevision' },
            { text: 'BMC', value: 'firmwareRevision' },
            { text: 'PXE', value: 'pxe' },
            { text: 'Протоколы', value: 'protocols' },
            { text: 'Электр. пит', value: 'powerIcon' },
        ],
        headersClone: [],
        configsHeaders: [],
    }),

    methods: {
        ...mapActions([
            'StartDeviceGroup',
            // сокет
            'deviceStateWatcher',
            // фильтра по типу оборудования и статусам
            'actionDevicesManagementFilter',
            'SavingConf',
        ]),

        /** Фильтр по компоненту, в котором мы находимся
         *
         * @param propsDeviceType
         * @returns {Promise<void>}
         */
        async startRequest(propsDeviceType) {
            this.itemsTable = [];
            this.filterDevice = [];
            this.actionDevicesManagementFilter(propsDeviceType.patch)
                .then(() => (this.filterDevice = this.getDevicesManagementFilter))
                .then(() => this.addTable());
            switch (propsDeviceType.id) {
                case 'server':
                    return (this.itemsComboBox = {
                        back: 'Показать все устройства',
                        start: 'Включение электропитания',
                        stop: 'Выключение электропитания',
                        reboot: 'Перезагрузка',
                        serviceon: 'Постановка на обслуживание',
                        serviceoff: 'Снятие с обслуживания',
                        systemLoad: 'Развертывание ОС',
                        software: 'Развертывание ПО',
                    });
                case 'storage':
                    return (this.itemsComboBox = {
                        back: 'Показать все устройства',
                        start: 'Включение электропитания',
                        stop: 'Выключение электропитания',
                        reboot: 'Перезагрузка',
                        serviceon: 'Постановка на обслуживание',
                        serviceoff: 'Снятие с обслуживания',
                        systemLoad: 'Развертывание ОС',
                        software: 'Развертывание ПО',
                    });
                case 'switches':
                    return (this.itemsComboBox = {
                        back: 'Показать все устройства',
                        // start: 'Включение электропитания',
                        // stop: 'Выключение электропитания',
                        // reboot: 'Перезагрузка',
                        serviceon: 'Постановка на обслуживание',
                        serviceoff: 'Снятие с обслуживания',
                        saveConfigs: 'Резервное копирование конфигураций',
                    });
            }
        },

        /** Заполнение таблицы
         *
         */
        addTable() {
            new Promise(() => {
                this.filterDevice.map(item =>
                    this.itemsTable.push({
                        rack: item.rack.name,
                        productPartNumber: item.productPartNumber,
                        deviceType: 'Тип устройства',
                        // id: '-',
                        boardMfg: item.boardMfg,
                        productName: item.productName,
                        productSerial: item.productSerial,
                        ipAddressString: item.ipAddressString,
                        status: this.getStatuses[item.state.uuid],
                        firmwareRevision: item.firmwareRevision,
                        biosRevision: item.biosRevision,
                        protocols: item.protocols,
                        pxe: item.pxe || '-',
                        macAddress: item.macAddress,
                        power: item.power,
                        powerIcon: item.power ? this.getPower.on : this.getPower.off,
                        // Для уникальных ключей
                        uuid: item.uuid,
                        // Иконка перезагрузки оборудования
                        loaderReboot: true,
                        // для ОС и ПО - блокировка кнопок
                        btnInstallDisable: true,
                    }),
                );
            }).then((this.loaderTable = this.progressCircularShow = false));
        },

        /** Фильтра по выбранным действим
         *
         * @param select
         */
        filterDevices(select) {
            this.calendarShow = this.timeValidatorShow = this.startPlanBtnShow = true;
            this.selectLabel = 'Применить действие';
            this.showSelect = this.loaderTable = true;
            this.currentFilter = '';
            this.nameStartBtn = 'Запустить сейчас';
            // удалиить заголовки
            this.editHeaders(
                'biosRevision',
                // 'protocols',
                'productSerial',
                'pxe',
                'identifier',
                'installSystem',
                'installSoftware',
            );

            switch (select) {
                case 'Показать все устройства':
                    this.progressCircularShow = true;
                    this.showBtnStart = this.showSelect = this.showSelect = this.calendarShow = this.showSaveConfigsTable = this.timeValidatorShow = this.startPlanBtnShow = false;

                    new Promise(() => {
                        if (this.headersClone.length === 0) {
                            return;
                        }
                        this.headers = Array.from(this.headersClone);
                        this.selectLabel = 'Действие';
                        this.showSelect = false;
                        this.itemsTable = [];
                        this.filterDevice = [];
                    })
                        .then(this.startRequest(this.propsDeviceType))
                        .then(() => (this.progressCircularShow = false));
                    break;

                case 'Включение электропитания':
                    this.showBtnStart = true;
                    this.showSaveConfigsTable = false;

                    this.currentFilter = `${this.propsDeviceType.patch}&FilterStatus=${Constants.FILTER_STATUS.STATUS_7}&IpmiOnly=true`;
                    break;

                case 'Выключение электропитания':
                    this.showBtnStart = true;
                    this.currentFilter = `${this.propsDeviceType.patch}&FilterStatus=${Constants.FILTER_STATUS.STATUS_1}&FilterStatus=${Constants.FILTER_STATUS.STATUS_2}&FilterStatus=${Constants.FILTER_STATUS.STATUS_3}&FilterStatus=${Constants.FILTER_STATUS.STATUS_4}&IpmiOnly=true`;
                    break;
                case 'Перезагрузка':
                    this.showBtnStart = true;
                    this.showSaveConfigsTable = false;

                    this.currentFilter = `${this.propsDeviceType.patch}&FilterStatus=${Constants.FILTER_STATUS.STATUS_1}&FilterStatus=${Constants.FILTER_STATUS.STATUS_2}&FilterStatus=${Constants.FILTER_STATUS.STATUS_3}&FilterStatus=${Constants.FILTER_STATUS.STATUS_4}&IpmiOnly=true`;
                    break;
                case 'Постановка на обслуживание':
                    this.showBtnStart = true;
                    this.showSaveConfigsTable = false;

                    this.currentFilter = `${this.propsDeviceType.patch}&FilterStatus=${Constants.FILTER_STATUS.STATUS_1}&FilterStatus=${Constants.FILTER_STATUS.STATUS_2}&FilterStatus=${Constants.FILTER_STATUS.STATUS_3}&FilterStatus=${Constants.FILTER_STATUS.STATUS_4}&FilterStatus=${Constants.FILTER_STATUS.STATUS_5}&FilterStatus=${Constants.FILTER_STATUS.STATUS_7}`;
                    break;
                case 'Снятие с обслуживания':
                    this.showBtnStart = true;
                    this.showSaveConfigsTable = false;
                    this.currentFilter = `${this.propsDeviceType.patch}&FilterStatus=${Constants.FILTER_STATUS.STATUS_6}`;
                    break;
                case 'Развертывание ОС':
                    this.currentFilter = `${this.propsDeviceType.patch}&powerFilter=true`;
                    this.showBtnStart = this.showSelect = true;
                    this.nameStartBtn = 'Указать MAC адреса вручную';
                    this.calendarShow = this.timeValidatorShow = this.startPlanBtnShow = false;
                    this.showSaveConfigsTable = true;

                    this.configsHeaders = [
                        { text: 'Стойка', value: 'rack' },
                        { text: 'IP-адрес', value: 'ipAddressString' },
                        { text: 'SKU/Part №', value: 'productPartNumber' },
                        { text: 'Производитель', value: 'boardMfg' },
                        { text: 'Модель/Серия', value: 'productName' },
                        { text: 'BMC', value: 'firmwareRevision' },
                        { text: 'Протоколы', value: 'protocols' },
                        { text: 'PXE', value: 'pxe' },
                        { text: 'Статус', value: 'state' },
                    ];
                    break;
                case 'Развертывание ПО':
                    this.currentFilter = `${this.propsDeviceType.patch}&powerFilter=true`;
                    this.showBtnStart = this.showSelect = true;
                    this.nameStartBtn = 'Развертывание ПО';
                    this.calendarShow = this.timeValidatorShow = this.startPlanBtnShow = false;
                    this.showSaveConfigsTable = true;

                    this.configsHeaders = [
                        { text: 'Стойка', value: 'rack' },
                        { text: 'IP-адрес', value: 'ipAddressString' },
                        { text: 'SKU/Part №', value: 'productPartNumber' },
                        { text: 'Производитель', value: 'boardMfg' },
                        { text: 'Модель/Серия', value: 'productName' },
                        { text: 'BMC', value: 'firmwareRevision' },
                        { text: 'Протоколы', value: 'protocols' },
                        { text: 'Статус', value: 'state' },
                    ];
                    break;
                case 'Резервное копирование конфигураций':
                    this.currentFilter = `${this.propsDeviceType.patch}&powerFilter=true`;
                    this.showBtnStart = this.showSelect = true;
                    this.showSaveConfigsTable = true;

                    this.configsHeaders = [
                        { text: 'Стойка', value: 'rack' },
                        { text: 'IP-адрес', value: 'ipAddressString' },
                        { text: 'SKU/Part №', value: 'productPartNumber' },
                        { text: 'Производитель', value: 'boardMfg' },
                        { text: 'Модель/Серия', value: 'productName' },
                        { text: 'BMC', value: 'firmwareRevision' },
                        { text: 'Протоколы', value: 'protocols' },
                        { text: 'Статус', value: 'state' },
                    ];
                    break;
            }

            this.progressCircularShow = true;
            this.itemsTable = [];
            this.filterDevice = [];
            this.selectedCheck = [];

            // Запрос на применение действия к оборудованию
            if (this.currentFilter !== '') {
                this.actionDevicesManagementFilter(this.currentFilter)
                    .then(() => (this.filterDevice = this.getDevicesManagementFilter))
                    .then(() => this.addTable())
                    .then(() => (this.progressCircularShow = this.loaderTable = false));
            }
        },

        /** Убираем поля в заголовке таблицы
         * Функция ждет массив со строками загловков, которые нужно удалить
         *
         * @param nameHeders
         */
        editHeaders(...nameHeders) {
            if (this.headersClone.length === 0) {
                this.headersClone = Array.from(this.headers);
            }

            this.headers = this.headers.reduce((acc, r) => {
                nameHeders.map(m => (r.value === m ? this.headers.splice(this.headers.indexOf(r), 1) : false));
                return this.headers;
            });
        },

        /** Запрос на сервер
         *
         * @returns {Promise<void>}
         */
        async startAction() {
            switch (this.ComboBoxModel) {
                case 'Перезагрузка':
                    this.loaderStatus = false;
                    this.selectedCheck.map(m => (m.loaderReboot = false));
                    break;
                case 'Включение электропитания':
                    this.loaderStatus = false;

                    this.selectedCheck.map(m => (m.loaderReboot = false));
                    break;
                case 'Выключение электропитания':
                    this.loaderStatus = false;

                    this.selectedCheck.map(m => (m.loaderReboot = false));
                    this.selectedCheck.map(
                        m =>
                            (m.powerIcon = this.getPower.off) &&
                            (m.status = this.getStatuses[Constants.CODE_STATUSES.CODE_STATUSES_1]),
                    );
                    break;
                case 'Постановка на обслуживание':
                case 'Снятие с обслуживания':
                    this.selectedCheck
                        .map(s => s.uuid)
                        .forEach(uuid => {
                            this.itemsTable = this.itemsTable.filter(v => v.uuid !== uuid);
                        });
                    break;

                case 'Развертывание ОС':
                    if (this.selectedCheck.length) {
                        this.mainControlTable = false;
                        this.selectedCheck.map(m => (m.loaderReboot = false));
                        this.showInstallationTable = true;
                        return (this.propsDataTableInstall = {
                            selectedDevece: this.selectedCheck,
                            typeInstall: 'installOS',
                        });
                    } else {
                        this.showMacAddresses = true;
                        this.mainControlTable = false;
                        return;
                    }

                case 'Развертывание ПО':
                    this.showInstallationTable = true;
                    this.mainControlTable = false;
                    this.selectedCheck.map(m => (m.loaderReboot = false));

                    return (this.propsDataTableInstall = {
                        selectedDevece: this.selectedCheck,
                        typeInstall: 'installSoft',
                    });
                case 'Резервное копирование конфигураций':
                    this.selectedCheck.map(m => (m.loaderReboot = false));
                // this.loaderStatus = false;
            }

            // assistant.js - сообщение пользователю о успехе операции
            this.selectedCheck.length !== 0
                ? messageUserDeviceGroup(this.ComboBoxModel, this.itemsComboBox, this.$store)
                : false;

            // запрос на сервер. Отправка выбранного чекбоксами оборудования
            if (this.ComboBoxModel !== 'Резервное копирование конфигураций') {
                await this.StartDeviceGroup({
                    patch: Object.entries(this.itemsComboBox).find(m => m.find(i => i === this.ComboBoxModel))[0],
                    elementArr: this.selectedCheck.map(m => m.uuid),
                })
                    // Для лока кнопки убираем все чекбоксы из массива
                    .then(() => (this.selectedCheck = []));
            } else {
                let obj = {
                    startAt: dateTransformationUTC(),
                    hosts: this.selectedCheck.map(item => {
                        let objHost = {
                            ip: item.ipAddressString,
                            user:
                                item.protocols.filter(i => i.uuid === Constants.CODE_STATUSES.CODE_STATUSES_7).login ||
                                '',
                            password:
                                item.protocols.filter(i => i.uuid === Constants.CODE_STATUSES.CODE_STATUSES_7)
                                    .password || '',
                            uuid: item.uuid,
                        };
                        return objHost;
                    }),
                };

                await this.SavingConf(obj).then(() => {
                    //todo временная заглущка по успешной загрузке
                    this.selectedCheck.map(m => setTimeout(() => (m.loaderReboot = true), 2000));
                    this.selectedCheck = [];
                });
            }
        },

        /**WEBSOCKET:  В зависимости от ответа сокета перерисовываем icon
         *
         * @param getSocket
         */
        socketEditTable(getSocket, statusPower) {
            getSocket = [getSocket];
            console.log('getSocket', getSocket);
            for (let item of this.itemsTable) {
                for (let itGet of getSocket) {
                    if (item.uuid === itGet.uuid) {
                        item.loaderReboot = true;

                        switch (itGet.data.power_state) {
                            case 'cycle':
                                item.powerIcon = this.getPower.on;
                                break;
                            case 'off':
                                item.powerIcon = this.getPower.off;
                                break;
                            case 'on':
                                item.powerIcon = this.getPower.on;
                                break;
                        }
                        // удаление элементов с таблицы
                        if (
                            (statusPower === 'PowerOn' && this.ComboBoxModel === 'Включение электропитания') ||
                            (statusPower === 'PowerOff' && this.ComboBoxModel === 'Выключение электропитания')
                        ) {
                            this.itemsTable.splice(this.itemsTable.indexOf(item), 1);
                        }
                    }
                }
            }
        },

        cancelInstallTable() {
            this.showInstallationTable = this.showMacAddresses = false;
            this.selectedCheck.map(m => setTimeout(() => (m.loaderReboot = true), 2000));
            this.mainControlTable = true;
        },
        cancelSaveConfigsTable() {
            this.showSaveConfigsTable = this.showMacAddresses = false;
            this.mainControlTable = true;
        },
    },

    computed: {
        ...mapGetters([
            'getStatuses',
            'getPower',
            'getDevicesManagement',
            // фильтра по типу оборудования и статусам
            'getDevicesManagementFilter',
            // webSocket(rest)
            'gettPowerOffSocket',
            'gettPowerOnSocket',
            'gettPowerResetSocket',
        ]),

        roleClaims() {
            return this.$store.getters['auth/getRoleClaims'];
        },
    },

    watch: {
        ComboBoxModel() {
            this.filterDevices(this.ComboBoxModel);
        },

        selectedCheck() {
            // Разлочить кнопку запуска при 'Развертывание ОС'
            if (this.ComboBoxModel == 'Развертывание ОС') {
                this.disabledBtnStart = false;
                !this.selectedCheck.length
                    ? (this.nameStartBtn = 'Указать MAC адреса вручную')
                    : (this.nameStartBtn = 'Развернуть ОС');
                return;
            }

            // для загрузки ПО (disabled button)
            this.itemsTable.map(m => (m.btnInstallDisable = true));
            this.selectedCheck.map(m => (m.btnInstallDisable = false));

            !this.selectedCheck.length ? (this.disabledBtnStart = true) : (this.disabledBtnStart = false);
        },

        // webSocket Event
        gettPowerOffSocket() {
            this.socketEditTable(this.gettPowerOffSocket, 'PowerOff');
        },
        gettPowerOnSocket() {
            this.socketEditTable(this.gettPowerOnSocket, 'PowerOn');
        },
        gettPowerResetSocket() {
            this.socketEditTable(this.gettPowerResetSocket, 'PowerReset');
        },
    },

    async mounted() {
        // Открытие сокета
        await this.deviceStateWatcher();
        // Определяем, в каком компоненте находимся
        await this.startRequest(this.propsDeviceType);
    },
};
</script>
