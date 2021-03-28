<template>
    <v-container style="padding:0" fluid>
        <v-row no-gutters>
            <v-col v-if="!this.stateKickstart.showFormKickstart">
                <div style="text-align: start">
                    <v-btn color="#e21a1a" dark icon @click="onNewKickstart">
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
                        <template v-slot:[`item.osInfo`]="{ item }">
                            {{ item.osInfo.osType + ' ' + item.osInfo.osName + ' ' + item.osInfo.osArch }}
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon class="mr-2" small icon @click="editKickstart(item)">mdi-pencil</v-icon>
                            <v-icon class="mr-2" small icon @click="removeKickstart(item)">mdi-minus</v-icon>
                            <v-icon class="mr-2" small icon @click="copyKickstart(item)">mdi-content-copy</v-icon>
                        </template>
                    </v-data-table>
                </div>
            </v-col>

            <ScriptForm
                v-else
                :textHeader="this.stateKickstart.textHeader"
                :rowIndex="this.stateKickstart.selectedRowKickstart"
                :typeForm="this.stateKickstart.typeForm"
                @updateTable="updateTable"
                :typeTable="'kickstart'"
            />
        </v-row>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import scriptsTableMixin from '@/mixins/scriptstable.mixin';

export default {
    mixins: [scriptsTableMixin],

    data: () => ({
        selectedFile: null,
        isSelecting: false,
        headersTable: [
            { text: 'Название kickstart', value: 'name' },
            { text: 'Комментарий', value: 'comment' },
            { text: 'Связь с OS', value: 'osInfo' },
            { text: '', value: 'actions' },
        ],
        stateKickstart: {},
    }),
    computed: {
        ...mapGetters(['getStateKickstart', 'getAllKickstart', 'alertUserResponseGetter']),
    },
    methods: {
        ...mapActions(['requestAllKickstart', 'showCopyTable']),
        onNewKickstart() {
            let obj = {
                show: true,
                typeForm: 'addNew',
                textHeader: 'Добавление kickstart',
            };
            this.$store.dispatch('showFormKikstart', obj);
        },
        editKickstart(item) {
            this.$store.dispatch('selectedRowKickstart', item);
            let obj = {
                show: true,
                typeForm: 'edit',
                textHeader: 'Редактирование kickstart',
            };
            this.$store.dispatch('showFormKikstart', obj);
        },
        removeKickstart(item) {
            this.selectedRemoveItem = item;
            let objAlert = {
                text: `Вы уверены, что хотите удалить файл __${this.selectedRemoveItem.name}__?`,
                sheet: null,
            };
            this.$store.dispatch('snackAlert', objAlert);
        },
        copyKickstart(item) {
            this.$store.dispatch('selectedRowKickstart', item);
            let obj = {
                show: true,
                typeForm: 'copy',
                textHeader: 'Копирование kickstart',
            };
            this.$store.dispatch('showFormKikstart', obj);
        },

        async getRows() {
            await this.requestAllKickstart();
            this.itemsTable = this.getAllKickstart;
            this.loaderTable = false;
        },
    },
    watch: {
        async alertUserResponseGetter() {
            if (!this.alertUserResponseGetter.alertUserResponse) {
                return;
            }
            this.$store.dispatch('removeKickstart', this.selectedRemoveItem);
            this.updateTable();
            this.$store.dispatch('alertUserResponse', false);
        },
    },
    async mounted() {
        this.stateKickstart = this.getStateKickstart;
    },
};
</script>

<style scoped></style>
