<template>
    <v-container style="padding:0" fluid>
        <v-row no-gutters>
            <v-col sm="12" md="12" lg="12" xl="12">
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
                            >mdi-alert-circle-outline</v-icon
                        >
                    </template>

                    <template v-slot:[`item.osItem`]="{ item }">
                        <v-autocomplete
                            v-model="item.valueOsItem"
                            :items="osItemTable"
                            label="Выбор ОС"
                            item-value="uuid"
                            item-text="name"
                            :required="!valueOsItem"
                            :rules="inputRules"
                            :disabled="item.osItemDisabled"
                        >
                            <template slot="item" slot-scope="data">
                                {{ data.item.name }} {{ data.item.type }} - {{ data.item.architecture }}
                            </template>
                            <template slot="selection" slot-scope="data">
                                {{ data.item.name }} {{ data.item.type }} - {{ data.item.architecture }}
                            </template>
                        </v-autocomplete>
                    </template>

                    <template v-slot:[`item.valueOsItem`]="{ item }">
                        <v-text-field
                            dense
                            class="mt-3"
                            :disabled="item.nameOSdisabled"
                            v-model="item.valueOsItem"
                        ></v-text-field>
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
                            <v-icon small class="mr-2 iconTable" v-show="item.btnEditShow" @click="editOS(item)"
                                >mdi-pencil</v-icon
                            >
                            <ProgressCircular
                                v-if="item.loaderProgressCircular"
                                :progressCircularProps="progressCircularProps"
                            />
                            <v-icon
                                v-else
                                small
                                class="mr-2 iconTable"
                                v-show="item.btnSaveShow"
                                @click="saveEditedOs(item)"
                                >mdi-content-save-settings</v-icon
                            >
                            <v-icon small class="mr-2 iconTable" @click="deleteOS(item)">mdi-minus</v-icon>
                        </div>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
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
        propsTable: {},
    },

    data: () => ({
        typeItems: [],
        architectureItems: [],
        // show
        actionShow: true,
        radioBtnShow: true,
        radio: true,
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
            { text: 'Название ОС', value: 'valueOsItem' },
            { text: 'ОС', value: 'osItem' },
            { text: 'Версия ОС', value: 'versionOS' },
            { text: 'Тип образа', value: 'type' },
            { text: 'Архитектура', value: 'architecture' },
            { text: 'Комментарий', value: 'comment' },
            { text: '', value: 'actions' },
        ],
        itemsTable: [],
        osItemTable: [],
        valueOsItem: [],
        inputRules: [v => !!v || 'Заполните поле!'],
    }),

    methods: {
        ...mapActions(['fillingTableOS', 'deleteOSrequest', 'snackAlert']),

        async deleteOS(item) {
            this.activItem = item;
            let objAlert = {
                text: `Вы уверены, что хотите удалить файл __${this.activItem.name}__?`,
                sheet: null,
            };
            this.$store.dispatch('snackAlert', objAlert);
        },

        async editOS(item) {
            console.log('!!!!!!!', item);
            item.loaderProgressCircular = true;
            item.btnSaveShow = item.btnEditShow = false;

            // если не привязан osList - разблокировать только его
            if (item.nameOS == null) {
                item.osItemDisabled = false;
            } else {
                item.commentDisabled = item.nameOSdisabled = item.osItemDisabled = false;
            }

            // тут был асинхронный запрос
            item.osItemTable = this.osItemTable;

            item.btnSaveShow = true;
            item.loaderProgressCircular = false;
        },

        async saveEditedOs(item) {
            item.btnEditShow = item.commentDisabled = item.nameOSdisabled = true;
            item.btnSaveShow = false;

            // меняем icon на green
            this.itemsTable.find(f => item.uuid == f.uuid).colorStatusIcon = false;

            // связываем ОС с osList
            await this.$api.isoImages.putEdit({
                uuidFile: item.uuid,
                uuidOS: item.valueOsItem,
            });

            this.$store.dispatch('snackSuccess', `Объект __ ${item.name}__ успешно отредактирован!`);
        },

        async startRequest() {
            this.itemsTable = this.dataTableAllGetter = [];
            await this.fillingTableOS();

            this.$store.commit('fillingTableAll', this.installedOSGetter);
            this.itemsTable = this.dataTableAllGetter;
            this.tableLoader = false;
            //  !При создании новой сущности - создать поля)
            console.log(this.installedOSGetter);
            this.installedOSGetter.map(m =>
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

            console.log(' this.installedOSGetter', this.installedOSGetter);

            this.installedOSGetter.map(m =>
                this.itemsTable.push({
                    // иконка состояния
                    warningNewFile: m.os.name === null ? true : false,
                    colorStatusIcon: true,

                    file: m.name,
                    // nameOS: m.os.name,
                    versionOS: m.os.version || '-',
                    comment: m.os.comment || '-',
                    type: m.os.type || 'нет типа',
                    architecture: m.os.architecture || '-',
                    // disabled
                    osItemDisabled: true,
                    commentDisabled: true,
                    nameOSdisabled: true,

                    osItemTable: [],
                    valueOsItem: m.os.name || '-',
                    // show
                    btnEditShow: true,
                    btnSaveShow: false,
                    loaderProgressCircular: false,
                    // uuidFile
                    uuid: m.uuid,
                }),
            );

            this.tableLoader = false;
        },
    },

    watch: {
        async alertUserResponseGetter() {
            if (!this.alertUserResponseGetter.alertUserResponse) {
                return;
            }

            this.$store.dispatch('alertUserResponse', false);

            await this.deleteOSrequest(this.activItem.uuid);
            this.itemsTable.splice(
                this.itemsTable.indexOf(this.itemsTable.find(i => i.uuid === this.activItem.uuid)),
                1,
            );

            this.$store.dispatch('snackSuccess', `Операционная система ${this.activItem.name} удалена из репозитория`);
        },
    },

    computed: {
        ...mapGetters(['installedOSGetter', 'alertUserResponseGetter', 'dataTableAllGetter']),
    },

    created() {
        this.$parent.$on('updateISOTable', () => this.startRequest());
    },

    async mounted() {
        this.osItemTable = await this.$api.osItems.getAllOsItems();
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
