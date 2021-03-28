<template>
    <v-container fluid xs="12" sm="12" mg="12" lg="12" xl="12">
        <v-alert dense type="info"
            >{{
                propsDataTableInstall.typeInstall == 'installOS'
                    ? 'Развернуть выбранную ОС на оборудовании:'
                    : 'Развернуть выбранное ПО на оборудовании:'
            }}
            <strong>{{ propsDataTableInstall.selectedDevece.map(m => m.ipAddressString) }}</strong>
        </v-alert>
        <v-data-table
            class="elevation-1"
            :headers="headers"
            :items="itemsTable"
            :hide-default-footer="true"
            loading-text="Загрузка данных..."
            loader-height="2"
            loader
            no-data-text="Нет данных"
            height="60vh"
            fixed-header
            disable-pagination
            :loading="tableLoader"
        >
            <template v-slot:[`item.radioButton`]="{ item }">
                <v-radio-group v-model="radioBtnSelect">
                    <v-radio v-model="item.radioBtn"> </v-radio>
                </v-radio-group>
            </template>

            <template v-slot:[`item.architecture`]="{ item }"> {{ item.architecture }} </template>

            <template v-slot:[`item.type`]="{ item }">
                {{ item.type }}
            </template>

            <template v-slot:[`item.comment`]="{ item }"> {{ item.comment }} </template>

            <template v-slot:[`item.kickstartFile`]="{ item }" v-if="propsDataTableInstall.typeInstall === 'installOS'">
                <v-select
                    class="mt-2"
                    style="max-width:170px"
                    :items="item.itemsSelect"
                    :value="item.kickstartFile"
                    v-model="kickstartFileModel"
                    no-data-text="Kikstart файлы отсутствуют"
                    dense
                    outlined
                    @change="currentSelectItem = kickstartFileModel"
                ></v-select>
            </template>
        </v-data-table>

        <v-container style="margin-left: 70%">
            <v-btn class="btn btn-success" style="min-width:140px" @click="cancel()"> Отмена </v-btn>
            <v-btn
                class="btn btn-success"
                style="min-width:140px"
                :disabled="disabledInstallBtn"
                @click="goInstallTable()"
            >
                {{ propsDataTableInstall.typeInstall == 'installOS' ? 'Развернуть ОС' : 'Развернуть ПО' }}
            </v-btn>
        </v-container>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { dateTransformationUTC } from '@/assistant/assistant';
import { Constants } from '../../../plugins/constants';

export default {
    props: {
        propsDataTableInstall: {
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
        disabledInstallBtn: true,
        kickstartFileModel: [],
        playbooksFileModel: [],
    }),

    methods: {
        ...mapActions(['fillingTableOS', 'fillingTableSoft', 'requestAllScript']),

        async pushDataTable() {
            if (this.propsDataTableInstall.typeInstall == 'installOS') {
                this.headers.push(
                    {
                        text: '',
                        align: 'start',
                        sortable: false,
                        value: 'radioButton',
                    },
                    { text: 'ISO', value: 'name' },
                    { text: 'Версия ОС', value: 'version' },
                    { text: 'Комментарий', value: 'comment' },
                    { text: 'Тип', value: 'type' },
                    { text: 'Архитектура', value: 'architecture' },
                    { text: 'Выберите Kikstart file ', value: 'kickstartFile' },
                );

                await this.fillingTableOS();

                // заполнение таблицы

                // если к ОС не привязан osList - удалить такую ОС из списка
                let localInstalledOSGetter = JSON.parse(JSON.stringify(this.installedOSGetter));
                localInstalledOSGetter = localInstalledOSGetter.filter(v => v.os !== null);

                localInstalledOSGetter.map(m =>
                    this.itemsTable.push({
                        radiobtn: true,
                        name: m.os.name,
                        version: m.os.version || '-',
                        comment: m.comment || '-',
                        type: m.os.type || 'нет типа',
                        architecture: m.os.architecture || '-',
                        kickstartFile: m.os.kickStartFiles || '-',
                        // uuid
                        uuid: m.uuid == null ? (m.uuid = '---') : m.uuid,
                        // radioBtn(для уникального key и выбора объекта)
                        radioBtn: m,
                        //заполнение select
                        itemsSelect: m.os.kickStartFiles.map(m => m.name),
                    }),
                );
            } else if (this.propsDataTableInstall.typeInstall == 'installSoft') {
                // await this.fillingTableSoft();
                await this.requestAllScript();
                this.headers.push(
                    {
                        text: '',
                        align: 'start',
                        sortable: false,
                        value: 'radioButton',
                    },
                    { text: 'Название установочного скрипта', value: 'name' },
                    { text: 'Связь с ПО', value: 'softwareFiles' },
                    { text: 'Связь с ОС', value: 'osList' },
                );

                this.getAllScripts.map(m => {
                    this.itemsTable.push({
                        radiobtn: true,
                        name: m.name || '-',
                        softwareFiles: m.softwareFiles.map(i => i.name).toString() || '-',
                        osList: m.osList.map(i => i.name).toString() || '-',

                        // uuid
                        uuid: m.uuid,
                        // radioBtn(для уникального key и выбора объекта)
                        radioBtn: m,
                    });
                });
            }
            this.tableLoader = false;
        },

        // Начать установку
        async goInstallTable() {
            const macAdress = [];
            this.propsDataTableInstall.selectedDevece.map(m =>
                macAdress.push({
                    uuid: m.uuid,
                    param: m.macAddress,
                }),
            );
            if (this.propsDataTableInstall.typeInstall === 'installOS') {
                const res = {
                    deviceUuidParams: macAdress,
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
                await this.$api.scheduleJob.installos(res);
            } else {
                const res = {
                    script: this.radioBtnSelect.text.length ? this.radioBtnSelect.text : null,
                    hosts: this.propsDataTableInstall.selectedDevece.map(i => {
                        let objHost = {
                            ip: i.ipAddressString,
                            user:
                                i.protocols.filter(i => i.uuid === Constants.CODE_STATUSES.CODE_STATUSES_7).login || '',
                            password:
                                i.protocols.filter(i => i.uuid === Constants.CODE_STATUSES.CODE_STATUSES_7).password ||
                                '',
                            uuid: i.uuid,
                        };
                        return objHost;
                    }),
                    startAt: dateTransformationUTC(),
                };
                await this.$api.scheduleJob.installsoft(res);
            }
            this.cancel();
            this.$store.dispatch('snackSuccess', `Развертывание системы запущено успешно!`);
        },

        cancel() {
            this.$emit('cancelInstallTable');
        },
    },

    computed: {
        ...mapGetters(['installedOSGetter', 'softGetter', 'getAllScripts']),
    },

    watch: {
        radioBtnSelect() {
            this.radioBtnSelect ? (this.disabledInstallBtn = false) : (this.disabledInstallBtn = true);
        },
    },

    mounted() {
        this.pushDataTable();
    },
};
</script>
