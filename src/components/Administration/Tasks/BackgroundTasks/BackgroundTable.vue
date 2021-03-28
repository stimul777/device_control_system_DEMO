<template>
    <v-col cols="3" sm="9" md="9">
        <v-simple-table dense v-show="showEquipment">
            <template v-slot:default>
                <thead>
                    <tr>
                        <th style="width: 70%">Тип оборудования</th>
                        <th>Частота опроса</th>
                        <th>Период хранения</th>
                        <td>
                            <v-checkbox v-model="checkAll" @click="checkboxAll" v-show="checkBoxShow"></v-checkbox>
                            <ProgressCircular :progressCircularProps="progressCircularProps" v-show="loaderShow" />
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <p>Серверы</p>
                        </td>
                        <td>
                            <v-text-field
                                :disabled="disabledServer"
                                style="width: 90px"
                                label="чч:мм"
                                append-icon="mdi-clock-time-eight-outline"
                                :rules="inputRules"
                                v-model="timeServer"
                                v-mask="'##:##'"
                            ></v-text-field>
                        </td>
                        <td>
                            <v-select
                                :disabled="disabledServer"
                                append-icon=" mdi-calendar-month"
                                style="width: 100px"
                                :items="comboBoxPeriodServer"
                                v-model="storagePeriodServer"
                            ></v-select>
                        </td>
                        <td>
                            <v-checkbox
                                v-model="checkboxServer"
                                @click="checkboxState"
                                v-show="checkBoxShow"
                                disabled
                            ></v-checkbox>
                            <ProgressCircular :progressCircularProps="progressCircularProps" v-show="loaderShow" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>Хранилища</p>
                        </td>
                        <td>
                            <v-text-field
                                :disabled="disabledStore"
                                style="width: 90px"
                                label="чч:мм"
                                append-icon="mdi-clock-time-eight-outline"
                                :rules="inputRules"
                                v-mask="'##:##'"
                                v-model="timeStorage"
                            ></v-text-field>
                        </td>
                        <td>
                            <v-select
                                :disabled="disabledStore"
                                style="width: 100px"
                                append-icon="mdi-calendar-month"
                                :items="comboBoxPeriodStore"
                                v-model="storagePeriodStore"
                            ></v-select>
                        </td>
                        <td>
                            <v-checkbox
                                v-model="checkboxStore"
                                @click="checkboxState"
                                v-show="checkBoxShow"
                                disabled
                            ></v-checkbox>
                            <ProgressCircular :progressCircularProps="progressCircularProps" v-show="loaderShow" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>Коммутаторы</p>
                        </td>
                        <td>
                            <v-text-field
                                :disabled="disabledSwitch"
                                style="width: 90px"
                                label="чч:мм"
                                append-icon="mdi-clock-time-eight-outline"
                                :rules="inputRules"
                                v-mask="'##:##'"
                                v-model="timeSwitches"
                            ></v-text-field>
                        </td>
                        <td>
                            <v-select
                                :disabled="disabledSwitch"
                                style="width: 100px"
                                append-icon="mdi-calendar-month"
                                :items="comboBoxPeriodSwitch"
                                v-model="storagePeriodSwitch"
                            ></v-select>
                        </td>
                        <td>
                            <v-checkbox
                                v-model="checkboxSwitch"
                                @click="checkboxState"
                                v-show="checkBoxShow"
                                disabled
                            ></v-checkbox>
                            <ProgressCircular :progressCircularProps="progressCircularProps" v-show="loaderShow" />
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>

        <v-btn
            class="btn btn-success"
            style="left: 90%; top: 10%"
            :disabled="disabledSaveBtn"
            v-show="showEquipment"
            :color="Constants.STYLE.SUCCESS"
            @click="startSave()"
        >
            <span v-show="!btnLoader">Сохранить</span>

            <v-progress-circular
                indeterminate
                :color="Constants.STYLE.SUCCESS"
                size="20"
                v-show="btnLoader"
            ></v-progress-circular>
        </v-btn>
    </v-col>
</template>

<script>
import { TheMask } from 'vue-the-mask';
import { mapGetters, mapActions } from 'vuex';
import { filterTimeTasks } from '@/filters/filterTasks';
import { filterPeriodStorage } from '@/filters/filterTasks';
import { Constants } from '@/plugins/constants';

export default {
    components: {
        ProgressCircular: () => import('@/components/app/ProgressCircular'),
    },
    name: 'tasks',
    directives: { TheMask },

    props: {
        activTabProps: {
            type: String,
        },
    },

    data: () => ({
        // v-modal частоты опроса и периода хранения
        Constants,
        timeServer: String,
        timeStorage: String,
        timeSwitches: String,
        storagePeriodServer: Number,
        storagePeriodStore: Number,
        storagePeriodSwitch: Number,
        // Отсортированный по задачам массив
        filterTabArr: [],

        regTime: /^(?:0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
        showEquipment: true,

        btnLoader: false,
        disabledSaveBtn: true,

        comboBoxPeriodServer: ['1мес', '2мес', '3мес', '6мес'],
        comboBoxPeriodStore: ['1мес', '2мес', '3мес', '6мес'],
        comboBoxPeriodSwitch: ['1мес', '2мес', '3мес', '6мес'],

        // progressCircular(лоадер)
        progressCircularProps: {
            size: 20,
            color: Constants.STYLE.SUCCESS,
        },
        loaderShow: true,

        // checkbox
        checkBoxShow: false,
        checkAll: false,
        checkboxServer: true,
        checkboxStore: true,
        checkboxSwitch: true,
        // disabledInput
        disabledServer: true,
        disabledStore: true,
        disabledSwitch: true,
        inputRules: [v => !!v],
    }),

    methods: {
        ...mapActions(['jobTasks', 'saveParamValue']),
        /** Начало опроса оборудования
         *
         */

        start(i) {
            this.timeServer = this.storagePeriodServer = '';
            this.timeStorage = this.storagePeriodStore = '';
            this.timeSwitches = this.storagePeriodSwitch = '';

            this.checkboxState();

            this.jobTasks().then(() => {
                switch (i) {
                    // ОПРОС ДОСТУПНОСТИ ОБОРУДОВАНИЯ
                    case 'pollingDevices':
                        const devicesUUUID = {
                            server: '00000000-0000-0000-0000-000000000001',
                            storage: '00000000-0000-0000-0000-000000000002',
                            switches: '00000000-0000-0000-0000-000000000003',
                        };

                        console.log('this.getAllJobTasks', this.getAllJobTasks);

                        this.filterTabArr = this.getAllJobTasks.filter(
                            m => m.operationTypeUuid == '00000000-0000-0000-0000-000000000001',
                        );

                        // Частота опроса
                        this.filterTime(devicesUUUID);
                        // период хранения
                        this.periodStorage(devicesUUUID);
                        break;

                    // ОПРОС ДОСТУПНОСТИ КОМПОНЕНТОВ ОБОРУДОВАНИЯ
                    case 'pollingDevicesComponents':
                        const devicesCompUUUID = {
                            server: '00000000-0000-0000-0000-000000000004',
                            storage: '00000000-0000-0000-0000-000000000005',
                            switches: '00000000-0000-0000-0000-000000000006',
                        };

                        this.filterTabArr = this.getAllJobTasks.filter(
                            m => m.operationTypeUuid == '00000000-0000-0000-0000-000000000002',
                        );

                        // Частота опроса
                        this.filterTime(devicesCompUUUID);

                        // период хранения
                        this.periodStorage(devicesCompUUUID);
                        break;

                    // ещё не реализовано
                    case 'errorMessages':
                        this.timeServer = '';
                        this.timeStorage = '';
                        this.timeSwitches = '';
                        this.$store.dispatch('snackError', 'Находится в разработке!');
                        break;
                }

                this.checkBoxShow = true;
                this.loaderShow = false;
            });
        },

        /** Возвращает в v-modal время частоты опроса
         * Обращаеться в импортированную функцию filterTimeTasks
         * @param deviceTime
         */
        filterTime(deviceTime) {
            this.timeServer = filterTimeTasks(this.filterTabArr, deviceTime.server);
            this.timeStorage = filterTimeTasks(this.filterTabArr, deviceTime.storage);
            this.timeSwitches = filterTimeTasks(this.filterTabArr, deviceTime.switches);
        },

        /** Возвращает в v-modal период хранения
         * Обращаеться в импортированную функцию filterPeriodStorage
         * @param deviceTime
         */
        periodStorage(deviceTime) {
            const arrPeriodDevices = [
                this.comboBoxPeriodServer[0],
                this.comboBoxPeriodServer[1],
                this.comboBoxPeriodServer[2],
                this.comboBoxPeriodServer[3],
            ];

            this.storagePeriodServer = filterPeriodStorage(arrPeriodDevices, this.filterTabArr, deviceTime.server);
            this.storagePeriodStore = filterPeriodStorage(arrPeriodDevices, this.filterTabArr, deviceTime.storage);
            this.storagePeriodSwitch = filterPeriodStorage(arrPeriodDevices, this.filterTabArr, deviceTime.switches);
        },
        /** Сохранение опроса
         *
         */
        startSave() {
            if (this.inputRules[0] == false) {
                return this.$store.dispatch('snackError', 'Неверный формат времени!');
            }

            this.btnLoader = this.disabledSaveBtn = true;

            // Собираем все данные и кидаем в store для обработки и отправки
            let sendDataServer = {
                activeTab: this.activTabProps,
                getAllJobTasks: this.getAllJobTasks,
                timeServer: this.timeServer,
                timeStorage: this.timeStorage,
                timeSwitches: this.timeSwitches,
                storagePeriodServer: this.storagePeriodServer,
                storagePeriodStore: this.storagePeriodStore,
                storagePeriodSwitch: this.storagePeriodSwitch,
            };

            // убираем все чекбоксы
            // this.checkAll = this.checkboxServer = this.checkboxStore = this.checkboxSwitch = false;
            // this.checkboxAll();
            this.checkboxState();

            this.saveParamValue(sendDataServer)
                .then(() => this.$store.dispatch('snackSuccess', 'Время опроса успешно изменено!'))
                .then(() => {
                    setTimeout(() => {
                        this.btnLoader = false;
                    }, 3000);
                });
        },
        /** Проставить все чекбоксы
         *
         */
        checkboxAll() {
            this.checkAll
                ? ((this.checkboxServer = this.checkboxStore = this.checkboxSwitch = true),
                  (this.disabledServer = this.disabledStore = this.disabledSwitch = this.disabledSaveBtn = false))
                : ((this.checkboxServer = this.checkboxStore = this.checkboxSwitch = false),
                  (this.disabledServer = this.disabledStore = this.disabledSwitch = this.disabledSaveBtn = true));
        },
        /** Полчучаем state у чекбоксов
         *
         */
        checkboxState() {
            //Todo расскоментировать для дальнейшей доработки, когда будет готов контракт с мидл со статусом запуска мониторинга
            // this.checkboxServer
            //     ? (this.disabledServer = this.disabledSaveBtn = false)
            //     : (this.disabledServer = this.disabledSaveBtn = true);
            // this.checkboxStore ? (this.disabledStore = this.disabledSaveBtn = false) : (this.disabledStore = true);
            // this.checkboxSwitch ? (this.disabledSwitch = this.disabledSaveBtn = false) : (this.disabledSwitch = true);
        },

        /** Проверка времени, введенном пользователем в input
         *
         * @param val
         * @param devices
         */
        timeValidation(val, devices) {
            let regEx = val.match(this.regTime);

            if (regEx == null) {
                this.inputRules[0] = false;
                return;
            } else {
                this.inputRules[0] = true;
            }

            switch (devices) {
                case 'server':
                    this.timeServer = val;
                    break;
                case 'storage':
                    this.timeStorage = val;
                    break;
                case 'switches':
                    this.timeSwitches = val;
                    break;
            }
        },
    },

    watch: {
        activTabProps() {
            this.start(this.activTabProps);
        },

        timeServer(val) {
            this.timeValidation(val, 'server');
        },
        timeStorage(val) {
            this.timeValidation(val, 'storage');
        },
        timeSwitches(val) {
            this.timeValidation(val, 'switches');
        },
    },

    computed: {
        ...mapGetters(['getAllJobTasks']),
    },

    mounted() {
        this.start(this.activTabProps);
    },
};
</script>
