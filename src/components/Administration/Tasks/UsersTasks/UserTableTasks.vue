<template>
    <v-col sm="9" md="9">
        <v-data-table
            :headers="headers"
            :items="items"
            disable-pagination
            dense
            :show-select="showSelect"
            :hide-default-footer="true"
            item-key="action"
            v-model="selectedCheck"
        ></v-data-table>
        <v-btn
            class="btn btn-success"
            style="left: 90%; top: 10%"
            :disabled="disabledBtnStart"
            :color="Constants.STYLE.SUCCESS"
            @click="startRequestBtn()"
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
import { Constants } from '@/plugins/constants';

export default {
    data: () => ({
        Constants,
        showSelect: true,
        selectedCheck: [],
        disabledBtnStart: true,
        btnLoader: false,
        headers: [
            {
                text: 'Действиe',
                sortable: false,
                value: 'action',
            },
            {
                text: '',
                sortable: false,
                value: 'loader',
            },
        ],
        items: [
            {
                action: 'Запуск консоли BMC',
                id: 'какой то айди для запроса тут может быть',
            },
            {
                action: 'Включение электропитания',
            },
            {
                action: 'Выключение электропитания',
            },
            {
                action: 'Загрузка ПО',
            },
            {
                action: 'Развертывание ОС',
            },
            {
                action: 'Обновление микрокода BMC',
            },
            {
                action: 'Восстановление конфигурации',
            },
            {
                action: 'Удаленная настройка и конфигурация',
            },
            {
                action: 'Постановка на плановое обслуживание',
            },
            {
                action: 'Снятие с планового обслуживания',
            },
        ],
    }),

    methods: {
        /** Запрос на сохранение
         *
         */
        startRequestBtn() {
            this.disabledBtnStart = this.btnLoader = true;
            setTimeout(() => {
                this.disabledBtnStart = this.btnLoader = false;
                this.$store.dispatch('snackSuccess', 'Действие к оборудованию применено');
            }, 3000);
        },
    },

    watch: {
        selectedCheck() {
            this.selectedCheck.length !== 0 && this.btnLoader === false
                ? (this.disabledBtnStart = false)
                : (this.disabledBtnStart = true);
        },
    },
};
</script>
