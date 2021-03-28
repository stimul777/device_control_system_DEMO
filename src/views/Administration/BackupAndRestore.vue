<template>
    <v-container>
        <v-row>
            <v-tabs>
                <v-tab @click="copying('copying')"> Резервное копирование </v-tab>
                <v-tab @click="recovery()"> Восстановление системы </v-tab>
                <v-tabs-slider :color="'tabs-slider-success'"></v-tabs-slider>
            </v-tabs>
        </v-row>

        <v-row>
            <v-col sm="3" md="3">
                <v-simple-table dense>
                    <thead>
                        <tr>
                            <th><v-checkbox></v-checkbox></th>
                            <th>{{ dataTableText.nameText }}</th>
                        </tr>
                    </thead>
                    <tbody class="table-body-menu">
                        <tr v-for="item in objTable" :key="item.name">
                            <td><v-checkbox></v-checkbox></td>
                            <td>{{ item.name }}</td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </v-col>

            <v-col>
                <v-simple-table dense class="mt-9">
                    <thead>
                        <tr>
                            <th class="text-left">{{ dataTableText.patchText }}</th>
                            <th>{{ this.dataTableText.periodText }}</th>
                            <th>{{ this.dataTableText.periodTime }}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>http/......</td>
                            <td>
                                <Calendar :activComponent="'backupAndRestore'" />
                            </td>
                            <td>
                                <v-text-field
                                    style="max-width: 90px"
                                    label="чч:мм"
                                    prepend-icon="mdi-clock-time-eight-outline"
                                    v-mask="'##:##'"
                                    :rules="inputRules"
                                    v-model="time"
                                >
                                </v-text-field>
                            </td>
                            <td>
                                <v-btn class="btn btn-success" color="green" v-show="shovRecovery"
                                    ><v-icon left> mdi-play </v-icon>Запуск</v-btn
                                >
                            </td>
                        </tr>
                    </tbody>
                </v-simple-table>
                <v-btn class="btn btn-success" style="left: 90%; top: 10%" v-show="showCopying">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    components: {
        Calendar: () => import('@/components/app/Calendar'),
    },

    data: () => ({
        radioDaily: false,
        radioWeek: false,
        radioMonth: false,
        activeTab: null,
        shovRecovery: false,
        showCopying: true,
        time: '',
        regTime: /^(?:0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
        date: new Date().toISOString().substr(0, 10),
        menu: false,
        inputRules: [v => !!v],
        dataTableText: {
            nameText: '',
            patchText: '',
            periodText: '',
            periodTime: '',
        },

        objTable: [
            {
                name: 'Пользователи',
            },
            {
                name: 'Профили',
            },
            {
                name: 'Объект',
            },
            {
                name: 'Пароли',
            },
        ],
    }),

    methods: {
        /** Функция копирования*/
        copying() {
            this.activeTab = 'copying';
            this.shovRecovery = false;
            this.showCopying = true;
            this.dataTableText.nameText = 'Что копируем';
            this.dataTableText.patchText = 'Куда копируем';
            this.dataTableText.periodText = 'Периодичность';
            this.dataTableText.periodTime = 'Время';
        },
        /** Функция восстановления
         * @param i
         */

        recovery() {
            this.activeTab = 'recovery';
            this.shovRecovery = true;
            this.showCopying = false;
            this.dataTableText.nameText = 'Что восстанавливаем';
            this.dataTableText.patchText = 'Файл конфигурации';
            this.dataTableText.periodText = 'Запланировать';
            this.dataTableText.periodTime = '';
        },
        /** Валидность времени для восстановления и резервного копирования
         *
         * @param val
         */
        timeValidation(val) {
            if (Array.isArray(val)) {
                return;
            }
            let regEx = val.match(this.regTime);

            if (regEx == null) {
                this.inputRules[0] = false;
                this.showBtnStart = true;
            } else {
                this.inputRules[0] = true;
                this.showBtnStart = false;
            }
        },
    },
    watch: {
        time(val) {
            this.timeValidation(val);
        },
    },

    mounted() {
        this.copying();
    },
};
</script>

<style scoped>
.table-body-menu > tr > td > p {
    margin: 10px !important;
    padding: 0 !important;
    height: 20px !important;
}

.table-body-menu > tr > td > div {
    margin: 0 !important;
    padding: 0 !important;
    height: 20px !important;
}

.table-body-menu > tr > th {
    margin: 0 !important;
    padding: 0 !important;
    height: 20px !important;
}
</style>
