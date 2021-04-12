<template>
    <v-container style="padding: 0" fluid>
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

                    <template v-slot:[`item.name`]="{ item }">
                        <v-text-field
                            v-if="!item.disabledName"
                            dense
                            :disabled="item.disabledName"
                            v-model="item.name"
                        ></v-text-field>
                        <div v-else>{{ item.name }}</div>
                    </template>

                    <template v-slot:[`item.comment`]="{ item }">
                        <v-text-field
                            v-if="!item.commentDisabled"
                            dense
                            solo
                            style="min-width: 200px"
                            class="mt-3"
                            :disabled="item.commentDisabled"
                            v-model="item.comment"
                        ></v-text-field>
                        <div v-else>{{ item.comment }}</div>
                    </template>

                    <template v-slot:[`item.architecture`]="{ item }">
                        <v-select
                            v-if="!item.architectureDisabled"
                            dense
                            single-line
                            :disabled="item.architectureDisabled"
                            :items="architectureItems"
                            :label="item.architecture"
                            v-model="item.architecture"
                        ></v-select>
                        <div v-else>{{ item.architecture }}</div>
                    </template>

                    <template v-slot:[`item.type`]="{ item }">
                        <v-select
                            v-if="!item.typeDisabled"
                            dense
                            single-line
                            :disabled="item.typeDisabled"
                            :items="typeItems"
                            :label="item.type"
                            v-model="item.type"
                        ></v-select>
                        <div v-else>{{ item.type }}</div>
                    </template>

                    <template v-slot:[`item.actions`]="{ item }">
                        <div class="access-show-actions">
                            <v-icon small class="mr-2 iconTable" v-show="item.btnEditShow" @click="editSoft(item)"
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
                                @click="saveEditedSoft(item)"
                                >mdi-content-save-settings</v-icon
                            >
                            <v-icon small class="mr-2 iconTable" @click="deleteSoft(item)">mdi-minus</v-icon>
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
        tableLoader: true,
        typeItems: [],
        architectureItems: [],
        // show
        actionShow: true,
        radioBtnShow: true,
        radio: true,
        // loader
        loader: true,
        progressCircularProps: {
            size: 20,
            color: Constants.STYLE.SUCCESS,
        },
        loaderProgressCircular: false,
        activItem: {},
        headers: [
            { text: '', value: 'newFileIcon' },

            { text: 'Название ПО', value: 'name' },
            { text: 'Тип пакета', value: 'type' },
            { text: 'Название пакета', value: 'fileId' },
            { text: 'Версия', value: 'version' },
            { text: 'Архитектура', value: 'architecture' },
            { text: 'URL-репозитория', value: 'urlAdress' },
            { text: 'SSH-ключи', value: 'sshKey' },
            { text: '', value: 'actions' },
        ],
        itemsTable: [],
    }),

    methods: {
        ...mapActions(['fillingTableSoft', 'deleteTableSoft', 'snackAlert']),

        async deleteSoft(item) {
            this.activItem = item;
            let objAlert = {
                text: `Вы уверены, что хотите удалить файл __${this.activItem.name}__?`,
                sheet: null,
            };
            this.$store.dispatch('snackAlert', objAlert);
        },

        async editSoft(item) {
            item.loaderProgressCircular = true;
            item.btnSaveShow = item.btnEditShow = false;

            // типы
            const type = await this.$api.enums.getOstype();
            type.map(m => this.typeItems.push(m.name));

            item.loaderProgressCircular = false;

            // архитектура
            const architecture = await this.$api.enums.getArchitecture();
            architecture.map(m => this.architectureItems.push(m.name));

            item.btnSaveShow = true;
            this.loaderProgressCircular =
                item.commentDisabled =
                item.disabledName =
                item.typeDisabled =
                item.architectureDisabled =
                    false;
        },

        async saveEditedSoft(item) {
            item.btnEditShow =
                item.commentDisabled =
                item.disabledName =
                item.architectureDisabled =
                item.typeDisabled =
                    true;
            item.btnSaveShow = false;

            // меняем icon на green
            this.itemsTable.find(f => item.uuid == f.uuid).colorStatusIcon = false;

            const res = {
                uuid: item.uuid,
                osList: [
                    {
                        comment: item.comment,
                        name: item.name,
                        architecture: item.architecture,
                        type: item.type,
                    },
                ],
            };

            await this.$api.softFile.patch(res);

            this.$store.dispatch('snackSuccess', `Объект __ ${item.name}__ успешно отредактирован!`);
        },

        async startRequest() {
            this.itemsTable = [];
            await this.fillingTableSoft();

            //  !ОС не пришла:
            this.softGetter.map(m =>
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

            this.softGetter.map(m =>
                this.itemsTable.push({
                    // иконка состояния
                    warningNewFile: m.os.name === null ? true : false,
                    colorStatusIcon: true,

                    name: m.os.name || '---',
                    versionOS: m.os.version || '-',
                    comment: m.os.comment || '-',
                    type: m.os.type || 'нет типа',
                    architecture: m.os.architecture || '-',
                    dataMB: '-',
                    urlAdress: '-',
                    sshKey: '-',
                    // uuid
                    uuid: m.uuid,
                    // disabled
                    commentDisabled: true,
                    typeDisabled: true,
                    architectureDisabled: true,
                    disabledName: true,
                    // show
                    btnEditShow: true,
                    btnSaveShow: false,

                    loaderProgressCircular: false,
                }),
            );
            this.tableLoader = false;
        },
    },

    computed: {
        ...mapGetters(['softGetter', 'alertUserResponseGetter']),
    },

    watch: {
        async alertUserResponseGetter() {
            if (!this.alertUserResponseGetter.alertUserResponse) {
                return;
            }

            this.$store.dispatch('alertUserResponse', false);

            await this.deleteTableSoft(this.activItem.uuid);
            this.itemsTable.splice(
                this.itemsTable.indexOf(this.itemsTable.find(i => i.uuid === this.activItem.uuid)),
                1,
            );

            this.$store.dispatch('snackSuccess', `Программа ${this.activItem.name} удалена из репозитория`);
        },
    },

    created() {
        this.$parent.$on('updateSoftTable', () => this.startRequest());
    },

    async mounted() {
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
