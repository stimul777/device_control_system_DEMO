<template>
    <div style="height: 100%">
        <!-- Табы -->
        <v-container fluid style="padding-bottom: unset">
            <div class="mb-3 d-flex justify-end justify-space-between">
                <v-tabs :color="Constants.STYLE.SUCCESS" style="width: 500px" v-model="tab">
                    <v-tab>Оповещения</v-tab>
                    <v-tab>Автоматическая отправка уведомлений</v-tab>
                    <v-tabs-slider :color="'tabs-slider-success'"></v-tabs-slider>
                </v-tabs>
            </div>

            <!-- ТАБ 1 -->
            <div v-if="tab === 0">
                <v-data-table
                    class="notif-datatable"
                    no-data-text="Нет данных"
                    disable-sort
                    dense
                    hide-default-footer
                    :headers="tableHeaders"
                    :items="tableData"
                    calculate-widths
                >
                    <!-- Событие -->
                    <template v-slot:[`item.event`]="{ item }">
                        <v-select hide-details dense outlined :items="item.events" v-model="item.event"></v-select>
                    </template>

                    <!-- Отправка -->
                    <template v-slot:[`item.sendBy`]="{ item }">
                        <v-select
                            hide-details
                            dense
                            outlined
                            multiple
                            :items="item.sendByItems"
                            v-model="item.sendBy"
                        ></v-select>
                    </template>

                    <!-- Способ -->
                    <template v-slot:[`item.method`]="{ item }">
                        <v-select
                            hide-details
                            dense
                            outlined
                            multiple
                            :items="item.methods"
                            v-model="item.method"
                        ></v-select>
                    </template>

                    <!-- Кнопки -->
                    <template v-slot:[`item.action`]="{ item }">
                        <div class="notif-show-actions">
                            <v-btn icon small class="mr-2" @click="addRow(item)">
                                <v-icon size="16">mdi-plus</v-icon>
                            </v-btn>
                            <v-btn icon small @click="deleteRow(item)">
                                <v-icon size="16">mdi-minus</v-icon>
                            </v-btn>
                        </div>
                    </template>

                    <!-- Футер сохранения -->
                    <template v-slot:footer="{ item }">
                        <div class="d-flex justify-end mt-3">
                            <button class="btn btn-success" @click="save()">Сохранить</button>
                        </div>
                    </template>
                </v-data-table>
            </div>
        </v-container>

        <!-- ТАБ 2 -->
        <v-row style="height: 100%" v-if="tab === 1">
            <v-col cols="3" class="notif-col">
                <v-list dense style="padding: unset">
                    <v-list-item-group v-model="listItem">
                        <v-list-item v-for="(item, i) in listItems" :key="i">
                            <v-list-item-icon>
                                <v-icon v-text="item.icon"></v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.text"></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-col>
            <v-col style="padding: unset; margin-right: 32px">
                <v-data-table
                    class="notif-datatable"
                    no-data-text="Нет данных"
                    dense
                    disable-sort
                    hide-default-footer
                    :headers="tableHeaders"
                    :items="tableData"
                >
                    <!-- Email -->
                    <template v-slot:[`item.email`]="{ item }">
                        <v-text-field dense outlined hide-details v-model="item.email"></v-text-field>
                    </template>
                    <!-- Телефон -->
                    <template v-slot:[`item.phone`]="{ item }">
                        <v-text-field
                            type="tel"
                            dense
                            outlined
                            hide-details
                            v-model="item.phone"
                            v-mask="'+7(###) ###-##-##'"
                        ></v-text-field>
                    </template>
                    <!-- Чекбокс смс -->
                    <template v-slot:[`item.sms`]="{ item }">
                        <v-checkbox
                            dense
                            style="margin: unset"
                            hide-details
                            color="success"
                            v-model="item.sms"
                        ></v-checkbox>
                    </template>
                    <!-- Кнопки -->
                    <template v-slot:[`item.action`]="{ item }">
                        <div class="notif-show-actions">
                            <v-btn icon small class="mr-2" @click="addRow(item)">
                                <v-icon size="16">mdi-plus</v-icon>
                            </v-btn>
                            <v-btn icon small @click="deleteRow(item)">
                                <v-icon size="16">mdi-minus</v-icon>
                            </v-btn>
                        </div>
                    </template>
                    <!-- Сохранение -->
                    <template v-slot:footer="{ item }">
                        <div class="d-flex justify-end mt-3">
                            <button class="btn btn-success" @click="save()">Сохранить</button>
                        </div>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <!--  -->
    </div>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    data: () => ({
        Constants,
        // данные для таблицы
        tableHeaders: [],
        tableData: [],

        // активная вкладка
        tab: null,

        // 2 вкладка
        // меню
        listItems: [
            {
                icon: 'mdi-account-star',
                text: 'Суперадминистраторы',
            },
            {
                icon: 'mdi-headset',
                text: 'Администраторы',
            },
            {
                icon: 'mdi-account-tie',
                text: 'Операторы',
            },
        ],
        // выбранный список меню
        listItem: null,
    }),

    methods: {
        /** Добавление строки в таблицу оповещений
         *
         * @param item
         */
        addRow(item) {
            if (this.tab === 1) {
                this.tableData.splice(this.tableData.indexOf(item) + 1, 0, {
                    sms: false,
                });
            } else {
                this.tableData.splice(this.tableData.indexOf(item) + 1, 0, {
                    events: [
                        'Загружена новая версия BIOS',
                        'Предупреждения',
                        'Информационный',
                        'Превышение пороговых значений',
                    ],

                    sendByItems: ['Суперадминистраторы', 'Администраторы', 'Операторы'],

                    methods: ['Email', 'SMS'],
                });
            }
        },
        /** Удаление строки из таблицы оповещений
         *
         * @param item
         */
        deleteRow(item) {
            if (this.tab === 1) {
                if (this.tableData.length === 1) {
                    this.tableData = [{ sms: false }];
                } else {
                    this.tableData.splice(this.tableData.indexOf(item), 1);
                }
            } else {
                if (this.tableData.length === 1) {
                    this.tableData = [
                        {
                            events: [
                                'Загружена новая версия BIOS',
                                'Предупреждения',
                                'Информационный',
                                'Превышение пороговых значений',
                            ],

                            sendByItems: ['Суперадминистраторы', 'Администраторы', 'Операторы'],

                            methods: ['Email', 'SMS'],
                        },
                    ];
                } else {
                    this.tableData.splice(this.tableData.indexOf(item), 1);
                }
            }
        },

        save() {
            this.$store.dispatch('snackSuccess', 'Успешно сохранено');
        },
    },

    watch: {
        // Табы
        tab(v) {
            if (v === 0) {
                this.tableHeaders = [
                    { text: 'Событие', value: 'event', width: '25%' },
                    { text: 'Отправлять группе', value: 'sendBy' },
                    { text: 'Способ', value: 'method', width: '15%' },
                    { text: '', value: 'action', width: '10%' },
                ];
                this.tableData = [
                    {
                        event: 'Загружена новая версия BIOS',
                        sendBy: ['Администраторы'],
                        method: ['Email'],

                        events: [
                            'Загружена новая версия BIOS',
                            'Предупреждения',
                            'Информационный',
                            'Превышение пороговых значений',
                        ],

                        sendByItems: ['Суперадминистраторы', 'Администраторы', 'Операторы'],

                        methods: ['Email', 'SMS'],
                    },
                ];
                this.listItem = null;
            }
            if (v === 1) {
                this.listItem = 0;
            }
        },

        // Вкладка 2 - МЕНЮ
        listItem(v) {
            if (v === 0) {
                this.tableHeaders = [
                    { text: 'Email', value: 'email' },
                    { text: 'Телефон', value: 'phone' },
                    { text: 'Смс на личный номер', value: 'sms' },
                    { text: '', value: 'action' },
                ];
                this.tableData = [
                    { email: 'email@email.com', phone: '+7(952) 413-22-21', sms: true },
                    {
                        email: 'nikolaipetrovitch@email.com',
                        phone: '+7(912) 413-22-21',
                        sms: true,
                    },
                    { email: 'email@email.com', phone: '+7(942) 413-22-21', sms: false },
                ];
            }

            if (v === 1 || v === 2) {
                this.tableData = [
                    { email: 'email@email.com', phone: '+7(922) 413-22-31', sms: false },
                    {
                        email: 'nikolaipetrovitch@email.com',
                        phone: '+7(982) 413-22-21',
                        sms: false,
                    },
                    { email: 'email@email.com', phone: '+7(922) 413-22-21', sms: false },
                ];
            }
        },
    },

    mounted() {
        this.tab = 0;
    },
};
</script>

<style scoped>
.notif-col {
    border-right: 1px solid #e0e0e0;
    margin: 0px 0 0 32px;
    padding: unset;
}

.notif-datatable {
    width: 100%;
    border-top: 1px solid #e6e6e6;
}

.notif-datatable td {
    padding: unset !important;
    padding-left: 16px !important;
}

.notif-show-actions {
    opacity: 0;
}

tr:hover .notif-show-actions {
    opacity: 1;
    transition: 0.1s linear;
}
</style>
