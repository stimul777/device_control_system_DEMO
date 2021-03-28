<template>
    <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        min-width="290px"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="dateComboBox"
                label="Запланируйте действие"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                class="ml-10"
                style="max-width: 200px"
                disabled
            ></v-text-field>
        </template>
        <v-radio-group column v-model="radioGroup" v-if="showComponentCalendar">
            <v-radio value="Daily" label="Ежедневно"></v-radio>
            <v-radio value="Week" label="Раз в неделю"></v-radio>

            <v-btn-toggle
                :class="{ showCalendWeak: showCalendWeak }"
                v-model="toggle_exclusive"
                rounded
                class="btnGroup"
            >
                <v-btn @click="btnDaysWeek(Constants.LOCALIZATION_DATA.MONDAY.value)">
                    {{ $constants.LOCALIZATION_DATA.MONDAY.name }}
                </v-btn>
                <v-btn @click="btnDaysWeek(Constants.LOCALIZATION_DATA.TUESDAY.value)">
                    {{ $constants.LOCALIZATION_DATA.TUESDAY.name }}
                </v-btn>
                <v-btn @click="btnDaysWeek(Constants.LOCALIZATION_DATA.WEDNESDAY.value)">
                    {{ $constants.LOCALIZATION_DATA.WEDNESDAY.name }}
                </v-btn>
                <v-btn @click="btnDaysWeek(Constants.LOCALIZATION_DATA.THURSDAY.value)">
                    {{ $constants.LOCALIZATION_DATA.THURSDAY.name }}
                </v-btn>
                <v-btn @click="btnDaysWeek(Constants.LOCALIZATION_DATA.FRIDAY.value)">
                    {{ $constants.LOCALIZATION_DATA.FRIDAY.name }}
                </v-btn>
                <v-btn @click="btnDaysWeek(Constants.LOCALIZATION_DATA.SATURDAY.value)">
                    {{ $constants.LOCALIZATION_DATA.SATURDAY.name }}
                </v-btn>
                <v-btn @click="btnDaysWeek(Constants.LOCALIZATION_DATA.SUNDAY.value)">
                    {{ $constants.LOCALIZATION_DATA.SUNDAY.name }}
                </v-btn>
            </v-btn-toggle>

            <v-radio value="Month" label="Раз в месяц (выберите дату)"></v-radio>
        </v-radio-group>
        <v-date-picker
            locale="ru-RU"
            :weekday-format="weekDay"
            :title-date-format="titleDate"
            no-title
            v-model="date"
            :class="{ 'show-days-only': showComponentCalendar, showCalendar: showCalendar }"
        ></v-date-picker>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="menu = false">Отмена</v-btn>
        <v-btn text color="primary" @click="$refs.menu.save(date), saveStorCalendar()">OK</v-btn>
    </v-menu>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import { Constants } from '@/plugins/constants';

export default {
    //   В пропсы получаем инфу, откуда вызыван календарь
    props: {
        activComponent: null,
        Constants,
    },

    data: () => ({
        showCalendar: false,
        showCalendWeak: false,
        showComponentCalendar: true,
        radioGroup: 'Month',
        toggle_exclusive: undefined,
        dateComboBox: undefined,
        statusRadio: undefined,
        date: new Date().toISOString().substr(0, 10),
        menu: false,
    }),

    methods: {
        ...mapActions(['setPeriodStore']),
        /** Проверка выбранного radio button
         * @param item
         */
        callRadioBtn(item) {
            switch (item) {
                case 'Daily':
                    this.showCalendar = true;
                    this.showCalendWeak = true;
                    this.dateComboBox = 'ежедневно';
                    this.statusRadio = item;
                    break;
                case 'Week':
                    this.dateComboBox = 'Раз в неделю';
                    this.showCalendWeak = false;
                    this.showCalendar = true;
                    this.statusRadio = item;
                    break;
                case 'Month':
                    const [year, month, day] = this.date.split('-');
                    this.dateComboBox = `${day}-${month}-${year}`;
                    this.statusRadio = item;
                    this.showCalendar = false;
                    this.showCalendWeak = true;
                    break;
            }
        },

        btnDaysWeek(item) {
            console.log(item);
        },

        /** Изменяем компоненты календаря в зависимости от того, откуда он вызван */
        startRender() {
            switch (this.activComponent) {
                case 'backupAndRestore':
                    this.showComponentCalendar = true;
                    break;
                case 'deviceGroup':
                    this.showComponentCalendar = false;
                    break;
            }
        },
        /** Получение локализованного названия дня недели
         * @param date
         */
        weekDay(date) {
            return new Date(date).toLocaleString(Constants.LOCALIZATION_DATA.LANGUAGE, { weekday: 'short' });
        },

        /** Получение локализованного названия даты
         * @param dates
         */
        titleDate(dates) {
            return dates
                .map(n =>
                    new Date(n).toLocaleString(Constants.LOCALIZATION_DATA.LANGUAGE, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                    }),
                )
                .join(' - ');
        },

        /** Сохранение настроек календаря в store
         *
         */
        saveStorCalendar() {
            if (this.statusRadio === 'Month') {
                this.callRadioBtn('Month');
            }
            // save to storage
            this.setPeriodStore(this.dateComboBox);
            console.log('Отправляем в Storage:', this.dateComboBox);
        },
    },

    computed: {
        ...mapState(['period']),
        ...mapGetters(['getPeriodStore']),
    },

    watch: {
        radioGroup() {
            return this.callRadioBtn(this.radioGroup);
        },
    },
    mounted() {
        this.startRender();
        this.callRadioBtn(this.radioGroup);
    },
};
</script>

<style>
.show-days-only .v-picker__title,
.show-days-only .v-date-picker-header {
    display: none !important;
}

.v-menu__content {
    background-color: white !important;
}

.showCalendar {
    display: none !important;
}

.showCalendWeak {
    display: none !important;
}

.btnGroup {
    height: 20px;
    background-color: #f6f6f6 !important;
    margin: 5px;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

.btnGroup > button {
    height: 20px !important;
    border: none !important;
    background-color: #d4d4d4;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}
</style>
