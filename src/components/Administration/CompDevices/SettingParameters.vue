<template>
    <v-container fluid>
        <v-data-table disable-sort dense :headers="tableHeaders" :items="tableItems" hide-default-footer>
            <!-- Чекбокс хэдера -->
            <template #header[`checked`]="{item}">
                <!-- @TODO Нужно править-->
                <v-checkbox
                    hide-details
                    dense
                    style="margin: unset"
                    @change="changeHeaderCheck"
                    v-model="checkedAll"
                    color="success"
                ></v-checkbox>
            </template>

            <!-- Селект производителей -->
            <template #item.boardMfg="{item}">
                <!-- @TODO Нужно править-->
                <v-select hide-details dense v-model="boardMfg" :items="boardMfgs"></v-select>
            </template>

            <!-- Чекбокс строки -->
            <template #item.checked="{item}">
                <!-- @TODO Нужно править-->
                <v-checkbox
                    hide-details
                    dense
                    style="margin: unset"
                    v-model="item.checked"
                    color="success"
                ></v-checkbox>
            </template>
        </v-data-table>

        <v-row>
            <v-col>
                <v-radio-group v-model="regExpRadio" dense hide-details>
                    <v-radio value="default" :color="Constants.STYLE.SUCCESS" label="Значение по умолчанию"></v-radio>
                    <v-radio
                        value="custom"
                        :color="Constants.STYLE.SUCCESS"
                        label="Какое-то регулярное выражение"
                    ></v-radio>
                </v-radio-group>

                <v-text-field
                    class="mt-4"
                    style="width: 75%"
                    dense
                    outlined
                    placeholder="Введите значение"
                    hide-details
                    v-if="regExpRadio === 'custom'"
                ></v-text-field>

                <button
                    class="btn btn-cancel mt-4"
                    style="background-color: #F6F6F6 !important; color: black !important; margin-left: 0 !important"
                >
                    Проверить
                </button>
            </v-col>
            <v-col>
                <div class="regResult">
                    <div class="mb-4">Результат проверки:</div>
                    <div v-for="(item, idx) of regResult" :key="idx">{{ item }}</div>
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col class="text-right">
                <button class="btn btn-success">Сохранить</button>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    data() {
        return {
            Constants,
            checkedAll: false,
            regExpRadio: 'default',

            // * Динамически заполнить с мидла
            boardMfg: 'Intel',
            boardMfgs: ['Intel', 'Dell', 'Asus'],

            // * Результирующий массив после проверки регулярного выражения
            regResult: [
                'Temp | 40 degrees C | ok',
                'Temp | 39 degrees C | ok',
                'Temp | 40 degrees C | ok',
                'Temp | 39 degrees C | ok',
                'Temp | 40 degrees C | ok',
                'Temp | 39 degrees C | ok',
                'Temp | 40 degrees C | ok',
                'Temp | 39 degrees C | ok',
            ],

            tableItems: [],

            tableHeaders: [
                {
                    text: 'Производитель',
                    value: 'boardMfg',
                    width: '20%',
                },
                {
                    text: 'Компонент',
                    value: 'component',
                },
                {
                    text: 'Параметр',
                    value: 'parameter',
                },
                {
                    text: 'Пороговое значение',
                    value: 'thresholdValue',
                },
                {
                    text: 'Ед. измерения',
                    value: 'unit',
                },
                {
                    text: '',
                    value: 'checked',
                },
            ],
        };
    },

    methods: {
        /** Проставление чекбоксов для всех записей таблицы
         *
         * @param check
         */
        changeHeaderCheck(check) {
            this.checkedAll = !this.checkedAll;
            if (check) {
                this.tableItems.map(item => {
                    item.checked = true;
                });
            } else {
                this.tableItems.map(item => {
                    item.checked = false;
                });
            }
        },
    },

    watch: {
        tableItems: {
            deep: true,
            handler(tableItems) {
                const isOneUncheck = tableItems.find(item => !item.checked);
                // * Если хотя бы один чекбокс не выбран, то снимаем чек с хэдера, иначе ставим
                if (isOneUncheck) {
                    this.checkedAll = false;
                } else {
                    this.checkedAll = true;
                }
            },
        },
    },

    mounted() {
        this.tableItems = [
            {
                boardMfg: this.boardMfg,
                component: this.boardMfg,
                parameter: 3,
                thresholdValue: 4,
                unit: 5,
                checked: false,
            },
            {
                boardMfg: this.boardMfg,
                component: this.boardMfg,
                parameter: 33,
                thresholdValue: 44,
                unit: 55,
                checked: false,
            },
        ];
    },
};
</script>

<style>
.regResult {
    background-color: #f6f6f6;
    width: 100%;
    height: 300px;
    border-radius: 5px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    padding: 10px;
    font-size: 12px;
    overflow: auto;
}
</style>
