<template>
    <v-col sm="4" md="3">
        <v-data-table
            height="75vh"
            style="margin-top: 16px; border-right: thin solid rgba(0, 0, 0, 0.12)"
            fixed-header
            dense
            :hide-default-footer="true"
            :loading="loaderData"
            loading-text="Загрузка данных..."
            loader-height="2"
            no-data-text="Нет данных"
            single-select
            :headers="headers"
            :items="itemsDirectoryData"
            item-key="itemsDirectoryData.uuid"
            :item-class="item => item.name === selectedString && 'active-string'"
            class="elevation-1"
        >
            <template v-slot:[`item.name`]="{ item }">
                <div style="cursor: pointer" @click="pushDataTable(item)">
                    <v-row class="ml-0 mr-0">
                        <v-text-field
                            :class="{ activText: item.name === selectedString }"
                            style="max-width: 250px"
                            v-model="item.name"
                            :disabled="item.disabled"
                        ></v-text-field>
                    </v-row>
                    <v-row class="ml-0 mb-3" :class="{ activText: item.name === selectedString }">
                        <v-btn type="button" icon v-show="!item.showBtn" @click="editItem(item)">
                            <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn type="button" icon v-if="item.showBtn" @click="saveItem(item)">
                            <v-icon small>mdi-content-save-settings</v-icon>
                        </v-btn>
                        <v-btn type="button" icon @click="addNewCard()">
                            <v-icon small>mdi-plus-thick</v-icon>
                        </v-btn>
                        <v-btn type="button" icon @click="removeItemTable(item)">
                            <v-icon small>mdi-minus</v-icon>
                        </v-btn>
                    </v-row>
                    <v-row class="ml-0 mr-1">
                        <v-textarea
                            :class="{ activText: item.name === selectedString }"
                            auto-grow
                            rows="1"
                            dense
                            counter="120"
                            label="Комментарий"
                            class="textArea-Table"
                            :disabled="item.disabled"
                            v-model="item.comment"
                        ></v-textarea>
                    </v-row>
                </div>
            </template>
        </v-data-table>
    </v-col>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { newFrameValidation } from '@/assistant/assistant';

const ACTIVATED_TAB = {
    RACKS: 'Racks',
    GROUPS: 'Groups',
    ANGLES: 'Angles',
};
export default {
    props: {
        activatedTabProps: {
            type: String,
            required: true,
        },
    },

    components: {},

    data: () => ({
        selectedString: '',
        loaderData: false,
        comment: '',
        activatedTab: '',
        borderItemActiv: false,
        headers: [{ text: 'Справочник', value: 'name', sortable: false }],
        itemsDirectoryData: [],
    }),

    methods: {
        ...mapActions(['fetchRequest', 'removeItem', 'editItemRequest', 'addNewDirectory', 'removeDevice']),

        /**Заполнение карточки
         *
         * @param item
         * @returns {Promise<void>}
         */
        async requestStart(item) {
            if (!item) return;

            this.deviceTypeShow = false;
            this.directoryDataShow = this.tableShow = true;
            this.loaderData = true;
            this.itemsDirectoryData = [];
            // this.getDirectory = []
            this.activatedTab = item;

            // item == Racks,Groups, Angles

            await this.fetchRequest(item);
            this.loaderData = false;
            this.$emit('requestDisabled', false);

            this.getDirectory.map(i =>
                this.itemsDirectoryData.push({
                    name: i.name,
                    uuid: i.uuid,
                    comment: i.comment,
                    disabled: true,
                }),
            );
            this.itemsDirectoryData.reverse();
            this.checkingTable(this.activatedTabProps);
        },

        /**удаление карточки
         * @param item
         * @returns {Promise<void>}
         */
        async removeItemTable(item) {
            event.stopPropagation();
            this.itemsDirectoryData.splice(
                this.itemsDirectoryData.indexOf(this.itemsDirectoryData.find(i => i.name === item.name)),
                1,
            );

            await this.removeDevice({ activatedTab: this.activatedTab, uuid: item.uuid });

            console.log('itemsDirectoryData', this.itemsDirectoryData);

            switch (this.activatedTab) {
                case ACTIVATED_TAB.RACKS:
                    this.$store.dispatch('snackError', 'Стойка удалена!');
                    break;
                case ACTIVATED_TAB.GROUPS:
                    this.$store.dispatch('snackError', 'Группа удалена!');
                    break;
                case ACTIVATED_TAB.ANGLES:
                    this.$store.dispatch('snackError', 'Ракурс удален!');
                    break;
            }
            this.checkingTable(this.activatedTabProps);
        },

        editItem(item) {
            event.stopPropagation();
            item.disabled = false;
            item.showBtn = true;
        },

        /** сохранение отредактированной карточки
         * @param item
         * @returns {Promise<void>}
         */
        async saveItem(item) {
            event.stopPropagation();

            /**Store: Сохранение карточки

       */
            await this.editItemRequest({
                uuid: item.uuid,
                activatedTab: this.activatedTab,
                item: {
                    name: item.name,
                    comment: item.comment,
                },
            });

            item.disabled = true;
            item.showBtn = false;
        },

        pushDataTable(item) {
            this.$emit('btnShowTable');

            if (item.disabled !== false) {
                this.$emit('dataTable', this.activatedTab, item);
                // Оставляем активное выделение на рабочей строке
                this.selectedString = item.name;
                this.$set(item, 'selected', true);
            }
        },
        /**Добавление новой карты
         * @returns {Promise<void>}
         */
        async addNewCard() {
            event.stopPropagation();

            let newCard = {
                name: 'Введите имя...',
                comment: 'Введите комментарий...',
            };

            // assistant.js - валидация карточки
            const resultValid = newFrameValidation(
                newCard,
                this.itemsDirectoryData,
                this.$store,
                'Заполните новую карточку!',
            );

            if (resultValid !== true) return;

            // Store: добавление новой гр, стойки или ракурса
            await this.addNewDirectory({ activatedTabProps: this.activatedTabProps, newCard: newCard });

            switch (this.activatedTab) {
                case ACTIVATED_TAB.RACKS:
                    this.$store.dispatch('snackSuccess', 'Стойка добавлена!');
                    break;
                case ACTIVATED_TAB.GROUPS:
                    this.$store.dispatch('snackSuccess', 'Группа добавлена!');
                    break;
                case ACTIVATED_TAB.ANGLES:
                    this.$store.dispatch('snackSuccess', 'Ракурс добавлен!');
                    break;
            }

            // обновить карточки(GET)
            await this.requestStart(this.activatedTabProps);
        },

        /**Проверка таблицы на пустоту(открыть новую карточку)
         *
         * @param item
         */
        checkingTable(item) {
            this.itemsDirectoryData.length === 0 ? this.$emit('newDirectory', item) : false;
        },
    },

    created() {
        this.$parent.$on(ACTIVATED_TAB.RACKS, () => this.requestStart(ACTIVATED_TAB.RACKS));
        this.$parent.$on(ACTIVATED_TAB.GROUPS, () => this.requestStart(ACTIVATED_TAB.GROUPS));
        this.$parent.$on(ACTIVATED_TAB.ANGLES, () => this.requestStart(ACTIVATED_TAB.ANGLES));
    },

    mounted() {
        this.requestStart(this.activatedTabProps);
    },

    computed: mapGetters(['getDirectory']),
};
</script>

<style>
.active-string {
    background: #eeeeee;
}
</style>
