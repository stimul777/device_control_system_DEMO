<template>
    <v-container style="padding: 0" fluid>
        <v-data-table
            loading-text="Загрузка данных..."
            loader-height="2"
            :loading="tableLoader"
            no-data-text="Нет данных"
            class="elevation-1"
            item-key="uuid"
            dense
            height="60vh"
            fixed-header
            disable-pagination
            :headers="headers"
            :items="itemsTable"
            :items-per-page="100"
            :hide-default-footer="true"
        >
            <template v-slot:[`item.newFileIcon`]="{ item }">
                <v-icon :color="item.colorStatusIcon ? 'red' : 'green'" v-if="item.warningNewFile"
                    >mdi-alert-circle-outline
                </v-icon>
            </template>

            <template v-slot:[`item.osItem`]="{ item }">
                <!-- {{ item.valueSelectItem }} -->
                <v-autocomplete
                    v-model="item.valueSelectItem"
                    :items="tableOsItems"
                    label="Выбор ОС"
                    item-value="uuid"
                    item-text="name"
                    :required="!valueSelectItem"
                    :rules="inputRules"
                    :disabled="item.osItemDisabled"
                    :multiple="selectMultiple"
                    v-if="!item.osItemDisabled"
                >
                    <template slot="item" slot-scope="data">
                        {{ data.item.name }} {{ data.item.version }}, {{ data.item.type }} -
                        {{ data.item.architecture }}
                    </template>
                    <template slot="selection" slot-scope="data">
                        {{ data.item.name }}, {{ data.item.version }}, {{ data.item.type }} -
                        {{ data.item.architecture }}
                    </template>
                </v-autocomplete>
                <div v-else>
                    {{
                        item.valueSelectItem instanceof Array
                            ? item.valueSelectItem.map(i => i.name + ' ' + i.type + '-' + i.architecture).toString()
                            : item.valueSelectItem.name + ' ' + item.valueSelectItem.type + '-' + item.architecture
                    }}
                </div>
            </template>

            <template v-slot:[`item.comment`]="{ item }">
                <v-text-field
                    v-if="!item.commentDisabled"
                    dense
                    style="min-width: 200px"
                    class="mt-3"
                    :disabled="item.commentDisabled"
                    v-model="item.comment"
                ></v-text-field>
                <div v-else>{{ item.comment }}</div>
            </template>

            <template v-slot:[`item.architecture`]="{ item }">
                <p>{{ item.architecture }}</p>
            </template>

            <template v-slot:[`item.type`]="{ item }">
                <p>{{ item.type }}</p>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
                <div class="access-show-actions">
                    <v-icon small class="mr-2 iconTable" v-show="item.btnEditShow" @click="editItem(item)"
                        >mdi-pencil
                    </v-icon>
                    <ProgressCircular
                        v-if="item.loaderProgressCircular"
                        :progressCircularProps="progressCircularProps"
                    />
                    <v-icon v-else small class="mr-2 iconTable" v-show="item.btnSaveShow" @click="saveEditedOs(item)"
                        >mdi-content-save-settings
                    </v-icon>
                    <v-icon small class="mr-2 iconTable" @click="deleteOS(item)">mdi-minus</v-icon>
                </div>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ProgressCircular from '@/components/app/ProgressCircular';
import { Constants } from '@/plugins/constants';

export default {
    components: {
        ProgressCircular,
    },

    props: {
        propsDataTable: {
            type: String,
            require: true,
        },
    },

    data: () => ({
        // loader
        tableLoader: true,
        progressCircularProps: {
            size: 20,
            color: Constants.STYLE.SUCCESS,
        },
        loaderProgressCircular: false,
        activItem: {},
        headers: [
            { text: '', value: 'newFileIcon' },
            { text: 'Файл', value: 'file' },
            { text: 'Операционная система', value: 'osItem' },
            { text: 'Версия ОС', value: 'versionOS' },
            { text: 'Тип образа', value: 'type' },
            { text: 'Архитектура', value: 'architecture' },
            { text: 'Комментарий', value: 'comment' },
            { text: '', value: 'actions' },
        ],
        itemsTable: [],
        valueSelectItem: [],
        inputRules: [v => !!v || 'Заполните поле!'],
        itemTableGetter: [],
        selectMultiple: false,
    }),

    methods: {
        ...mapActions(['fillingTableOS', 'fillingTableSoft', 'deleteOSrequest', 'deleteTableSoft', 'snackAlert']),

        async deleteOS(item) {
            this.activItem = item;
            let objAlert = {
                text: `Вы уверены, что хотите удалить файл ${this.activItem.file}?`,
                sheet: null,
            };
            this.$store.dispatch('snackAlert', objAlert);
        },

        async editItem(item) {
            this.propsDataTable === 'ISO' ? (this.selectMultiple = false) : (this.selectMultiple = true);

            item.loaderProgressCircular = true;
            item.btnSaveShow =
                item.btnEditShow =
                item.commentDisabled =
                item.nameDisabled =
                item.osItemDisabled =
                    false;

            item.itemsTable = this.itemsTable;

            item.btnSaveShow = true;
            item.loaderProgressCircular = false;
        },

        async saveEditedOs(item) {
            item.btnEditShow = item.commentDisabled = item.nameDisabled = true;

            // меняем icon на green(успех)
            this.itemsTable.find(f => item.uuid === f.uuid).colorStatusIcon = item.btnSaveShow = false;

            let objActivTab = {
                patch: null,
                uuidFile: item.uuid,
                uuidOS:
                    !!item.valueSelectItem && item.valueSelectItem.constructor === String
                        ? [item.valueSelectItem]
                        : item.valueSelectItem,
            };

            // записать пути для отправки файлов
            this.propsDataTable === 'ISO' ? (objActivTab.patch = 'isoImages') : (objActivTab.patch = 'softFile');

            // !Бекенд должен сделать запрос на отправку файлов массивом.
            // !Пока запроса нет - отправляем циклом
            objActivTab.uuidOS.forEach(
                async m =>
                    // связываем ОС или ПО с osList
                    await this.$api[objActivTab.patch].putEdit({
                        uuidFile: objActivTab.uuidFile,
                        uuidOS: m,
                    }),
            );

            // комментарий к ОС или ПО
            await this.$api[objActivTab.patch].updateFile({
                uuid: item.uuid,
                comment: item.comment,
            });

            this.$store.dispatch('snackSuccess', `Объект __ ${item.file}__ успешно отредактирован!`);
            this.startRequest();
        },

        async startRequest() {
            this.itemsTable = this.itemTableGetter = [];

            switch (this.propsDataTable) {
                case 'ISO':
                    await this.fillingTableOS();
                    this.itemTableGetter = this.installedOSGetter;
                    break;
                case 'software':
                    await this.fillingTableSoft();
                    this.itemTableGetter = this.softGetter;
                    break;
            }

            this.tableLoader = false;

            //  !При создании новой сущности - создать поля OS)
            this.itemTableGetter.map(m =>
                m.os == null
                    ? (m.os = {
                          architecture: null,
                          comment: null,
                          kickStartFiles: null,
                          name: null,
                          type: null,
                          uuid: null,
                          version: null,
                      })
                    : false,
            );

            //  !При создании новой сущности - создать поля osList)
            this.itemTableGetter.map(m => (m.osList === undefined ? (m.osList = []) : false));

            this.itemTableGetter.map(m =>
                this.itemsTable.push({
                    // иконка состояния
                    warningNewFile: m.os.uuid === null && m.osList.length === 0 ? true : false,
                    colorStatusIcon: true,

                    file: m.name,
                    nameOS: m.os.name,
                    versionOS: m.os.version || '-',
                    comment: m.comment || '-',
                    type: m.os.type || 'нет типа',
                    architecture: m.os.architecture || '-',
                    // disabled
                    osItemDisabled: true,
                    commentDisabled: true,
                    nameDisabled: true,
                    // selectActiv
                    valueSelectItem: this.propsDataTable === 'ISO' ? m.os : m.osList.map(j => j),
                    itemsTable: [],
                    // show
                    btnEditShow: true,
                    btnSaveShow: false,
                    loaderProgressCircular: false,
                    // uuidFile
                    uuid: m.uuid,
                    // uuidOSList
                    uuidOsList: m.os.uuid,
                }),
            );

            this.tableLoader = false;
        },
    },

    watch: {
        // следим в каком дереве находимся
        propsDataTable() {
            this.startRequest();
        },

        async alertUserResponseGetter() {
            if (!this.alertUserResponseGetter.alertUserResponse) {
                return;
            }

            this.$store.dispatch('alertUserResponse', false);

            // записать пути для отправки файлов
            this.propsDataTable === 'ISO'
                ? await this.deleteOSrequest(this.activItem.uuid)
                : await this.deleteTableSoft(this.activItem.uuid);

            this.itemsTable.splice(
                this.itemsTable.indexOf(this.itemsTable.find(i => i.uuid === this.activItem.uuid)),
                1,
            );

            this.$store.dispatch('snackSuccess', `Объект ${this.activItem.file} удален из репозитория`);
        },
    },

    computed: {
        ...mapGetters(['installedOSGetter', 'softGetter', 'alertUserResponseGetter', 'dataTableAllGetter']),
    },

    created() {
        this.$parent.$on('updateDownloadTable', () => this.startRequest());
    },

    async mounted() {
        let response = await this.$api.osItems.getAllOsItems();
        this.tableOsItems = response.data;
        this.startRequest();
    },
};
</script>

<style scoped>
.iconTable {
    cursor: pointer;
}

.iconTable:hover {
    background-color: rgba(0, 0, 0, 0.172);
    border-radius: 20px;
}

.access-show-actions {
    opacity: 0;
}

tr:hover .access-show-actions {
    opacity: 1;
    transition: 0.1s linear;
}
</style>
