<template>
    <v-container fluid xs="12" sm="12" mg="12" lg="12" xl="12">
        <v-alert dense type="info"
            >{{ 'Резервное копирование:' }}
            <strong>{{ propsDataTableSaveConfigs.selectedDevece.map(m => m.ipAddressString) }}</strong>
        </v-alert>
        <v-data-table
            class="elevation-1"
            :headers="headers"
            :items="itemsTable"
            :hide-default-footer="true"
            :loading-text="$tableMessage['loading-text']"
            loader-height="2"
            loader
            :no-data-text="$tableMessage['no-data-text']"
            height="60vh"
            fixed-header
            disable-pagination
            :loading="tableLoader"
        >
            <template v-slot:[`item.radioButton`]="{ item }">
                <v-radio-group v-model="radioBtnSelect">
                    <v-radio v-model="item.radioBtn"></v-radio>
                </v-radio-group>
            </template>

            <template v-slot:[`item.architecture`]="{ item }"> {{ item.architecture }}</template>

            <template v-slot:[`item.type`]="{ item }">
                {{ item.type }}
            </template>

            <template v-slot:[`item.comment`]="{ item }"> {{ item.comment }}</template>

            <template v-slot:[`item.kickstartFile`]="{ item }">
                <v-select
                    class="mt-2"
                    style="max-width: 170px"
                    :items="item.itemsSelect"
                    :value="item.kickstartFile"
                    v-model="kickstartFileModel"
                    no-data-text="Файлы отсутствуют"
                    dense
                    outlined
                    @change="currentSelectItem = kickstartFileModel"
                ></v-select>
            </template>
        </v-data-table>

        <v-container style="margin-left: 70%">
            <v-btn class="btn btn-success btn-action-configs" @click="cancel()"> Отмена</v-btn>
            <v-btn
                class="btn btn-success btn-action-configs"
                :disabled="disabledSaveConfigsBtn"
                @click="goSaveConfigsTable()"
            >
                {{ 'Сохранить резервную копию' }}
            </v-btn>
        </v-container>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { dateTransformationUTC } from '@/assistant/assistant';

export default {
    props: {
        propsDataTableSaveConfigs: {
            type: Object,
            required: true,
        },
    },

    data: () => ({
        radioBtnSelect: [],
        currentSelectItem: [],
        tableLoader: true,
        headers: [],
        itemsTable: [],
        disabledSaveConfigsBtn: true,
        kickstartFileModel: [],
    }),

    methods: {
        ...mapActions(['fillingTableOS', 'fillingTableSoft']),

        async pushDataTable() {
            this.headers.push(
                {
                    text: '',
                    align: 'start',
                    sortable: false,
                    value: 'radioButton',
                },
                { text: 'Тип оборудования', value: 'name' },
                { text: 'Производитель', value: 'version' },
                { text: 'Модель', value: 'comment' },
                { text: 'Что копируем', value: 'kickstartFile' },
                { text: 'Периодичность', value: 'architecture' },
            );

            await this.fillingTableOS();
            // заполнение таблицы
            this.installedOSGetter.map(m =>
                this.itemsTable.push({
                    radiobtn: true,
                    name: m.os.name == null ? (m.os.name = '---') : m.os.name,
                    versionOS: m.os.version || '-',
                    comment: m.os.comment || '-',
                    type: m.os.type || 'нет типа',
                    architecture: m.os.architecture || '-',
                    kickstartFile: m.os.kickStartFiles || '-',
                    // uuid
                    uuid: m.uuid == null ? (m.uuid = '---') : m.uuid,
                    // radioBtn(для уникального key и выбора объекта)
                    radioBtn: m,
                    //заполнение select
                    itemsSelect: m.os.kickStartFiles.map(m => m.name),
                    // // ссылка
                    // fileId: m.fileId,
                }),
            );

            this.tableLoader = false;
        },

        // Начать установку
        async goSaveConfigsTable() {
            const macAddress = [];
            this.propsDataTableSaveConfigs.selectedDevece.map(m =>
                macAddress.push({
                    uuid: m.uuid,
                    param: m.macAddress,
                }),
            );

            const res = {
                deviceUuidParams: macAddress,
                isoUrl: this.radioBtnSelect.fileId,
                kickstartUuid: this.radioBtnSelect.os.kickStartFiles.length
                    ? this.radioBtnSelect.os.kickStartFiles.find(f => f.name == this.currentSelectItem).uuid
                    : null,
                kickstartText: this.radioBtnSelect.os.kickStartFiles.length
                    ? this.radioBtnSelect.os.kickStartFiles.find(f => f.name == this.currentSelectItem).text
                    : null,
                // UTC передавать '2021-03-16T07:19:37.663Z'
                // пока отключен, но при Планировании понадобится
                // startAt: dateTransformationUTC(),
                startAt: null,
            };

            // await this.$api.scheduleJob.installos(res);
            this.$store.dispatch('snackSuccess', `Развертывание системы запущено успешно!`);
        },

        cancel() {
            this.$emit('cancelSaveConfigsTable');
        },
    },

    computed: {
        ...mapGetters(['installedOSGetter', 'softGetter']),
    },

    watch: {
        radioBtnSelect() {
            this.radioBtnSelect ? (this.disabledSaveConfigsBtn = false) : (this.disabledSaveConfigsBtn = true);
        },
    },

    mounted() {
        this.pushDataTable();
    },
};
</script>
<style scoped>
.btn-action-configs {
    width: auto;
    height: 50px;
}
</style>
