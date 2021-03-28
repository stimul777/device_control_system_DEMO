<template>
    <v-container style="padding:0" fluid>
        <v-row no-gutters>
            <v-col v-if="!this.stateScripts.showFormScript">
                <div style="text-align: start">
                    <v-btn color="#e21a1a" dark icon @click="onNewScript">
                        <v-icon color="black">mdi-plus</v-icon>
                    </v-btn>
                </div>
                <div>
                    <v-data-table
                        :headers="headersTable"
                        :items="itemsTable"
                        :items-per-page="100"
                        class="elevation-1"
                        item-key="id"
                        dense
                        :loading-text="$tableMessage['loading-text']"
                        loader-height="2"
                        :no-data-text="$tableMessage['no-data-text']"
                        height="50vh"
                        fixed-header
                        :loading="loaderTable"
                        hide-default-footer
                    >
                        <template v-slot:[`item.softwareFiles`]="{ item }">
                            {{ item.softwareFiles ? item.softwareFiles.map(i => i.name).toString() : '-' }}
                        </template>
                        <template v-slot:[`item.osList`]="{ item }">
                            {{
                                item.osList
                                    ? item.osList.map(i => i.name + ' ' + i.type + '-' + i.architecture).toString()
                                    : '-'
                            }}
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon class="mr-2" small icon @click="editScript(item)">mdi-pencil</v-icon>
                            <v-icon small class="mr-2" icon @click="removeScript(item)">mdi-minus</v-icon>
                            <v-icon small class="mr-2" icon @click="copyScript(item)">mdi-content-copy</v-icon>
                        </template>
                    </v-data-table>
                </div>
            </v-col>

            <ScriptForm
                v-else
                :textHeader="this.stateScripts.textHeader"
                :rowIndex="this.stateScripts.selectedRowScript"
                :typeForm="this.stateScripts.typeForm"
                @updateTable="updateTable"
                :typeTable="'script'"
            />
        </v-row>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import scriptsTableMixin from '@/mixins/scriptstable.mixin';

export default {
    mixins: [scriptsTableMixin],

    props: {
        propsPlaybookTable: {},
    },
    data: () => ({
        selectedFile: null,
        isSelecting: false,
        bodyScript: '',
        headersTable: [
            { text: 'Название установочного скрипта', value: 'name' },
            { text: 'Связь с ПО', value: 'softwareFiles' },
            { text: 'Связь с ОС', value: 'osList' },
            { text: '', value: 'actions' },
        ],
        singleSelect: false,
        selected: [],
        stateScripts: [],
    }),
    computed: {
        ...mapGetters(['getScript', 'getAllScripts', 'getStateScripts', 'alertUserResponseGetter']),
    },
    methods: {
        ...mapActions(['requestAllScript']),
        onNewScript() {
            let obj = {
                show: true,
                typeForm: 'addNew',
                textHeader: 'Добавление установочного скрипта',
            };
            this.$store.dispatch('showFormScript', obj);
        },
        editScript(item) {
            this.$store.dispatch('selectedRowScript', item);
            let obj = {
                show: true,
                typeForm: 'edit',
                textHeader: 'Редактирование установочного скрипта',
            };
            this.$store.dispatch('showFormScript', obj);
        },
        removeScript(item) {
            this.selectedRemoveItem = item;
            let objAlert = {
                text: `Вы уверены, что хотите удалить скрипт __${this.selectedRemoveItem.name}__?`,
                sheet: null,
            };
            this.$store.dispatch('snackAlert', objAlert);
        },
        copyScript(item) {
            this.$store.dispatch('selectedRowScript', item);
            let obj = {
                show: true,
                typeForm: 'copy',
                textHeader: 'Копирование установочного скрипта ',
            };
            this.$store.dispatch('showFormScript', obj);
        },

        showDialogRemove(show) {
            this.openDialog = show.closeDialog;
            if (!show.closeDialog && show.agree) {
                this.$store.dispatch('removeScript', show.item);
                this.updateTable();
            }
        },
        async getRows() {
            await this.requestAllScript();
            this.itemsTable = this.getAllScripts;
            this.loaderTable = false;
        },
    },
    watch: {
        async alertUserResponseGetter() {
            if (!this.alertUserResponseGetter.alertUserResponse) {
                return;
            }
            this.$store.dispatch('removeScript', this.selectedRemoveItem);
            this.updateTable();
            this.$store.dispatch('alertUserResponse', false);
        },
    },
    mounted() {
        this.stateScripts = this.getStateScripts;
    },
};
</script>

<style scoped></style>
