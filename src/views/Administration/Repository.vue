<template>
    <v-container fluid>
        <v-container fluid class="row row-table-repository">
            <v-row no-gutters>
                <v-checkbox
                    label="Оповещать об обновлениях"
                    :color="Constants.STYLE.DEFAULT"
                    hide-details
                    class="margin-left"
                    v-model="checkboxAlertUser"
                ></v-checkbox>
            </v-row>
            <DownloadFile
                :propsDownload="propsDataTable"
                v-show="showDownloadFile"
                @fileUploadedSuccess="fileUploadedSuccess"
            />
        </v-container>
        <v-container fluid style="padding: 0; margin: 0">
            <v-row no-gutters>
                <v-col sm="3" md="3" lg="2" xl="2">
                    <v-list>
                        <v-list-item-group v-model="selectItemList">
                            <template v-for="(item, i) in listItems">
                                <ISO @transferDataTable="transferDataTable" :keyItem="i" v-if="item.comp === 'iso'" />

                                <Software
                                    @transferDataTable="transferDataTable"
                                    :keyItem="i"
                                    v-if="item.comp === 'software'"
                                />

                                <Software
                                    @transferDataTable="transferDataTable"
                                    :keyItem="i"
                                    v-if="item.comp === 'soft'"
                                />
                                <KickstartFile
                                    @transferDataTable="transferDataTable"
                                    :keyItem="i"
                                    v-if="item.comp === 'kickstart'"
                                />
                                <Playbooks
                                    @transferDataTable="transferDataTable"
                                    :keyItem="i"
                                    v-if="item.comp === 'scripts'"
                                />
                                <SaveConfigs
                                    @transferDataTable="transferDataTable"
                                    :keyItem="i"
                                    v-if="item.comp === 'saveConfigs'"
                                />
                            </template>
                        </v-list-item-group>
                    </v-list>
                </v-col>
                <v-col sm="9" lg="10" md="9" xl="10">
                    <TableDownloadFile
                        :propsDataTable="propsDataTable"
                        v-bind:is="selectTable === 'ISO' || selectTable === 'software' ? showTable : null"
                    />

                    <TableScriptsPlaybooks
                        :propsDataTable="propsDataTable"
                        v-bind:is="selectTable === 'script' ? showTable : null"
                    />

                    <TableKickstart
                        :propsDataTable="propsDataTable"
                        v-bind:is="selectTable === 'kickstart' ? showTable : null"
                    />
                    <TableSaveConfigs
                        :propsDataTable="propsDataTable"
                        v-bind:is="selectTable === 'saveConfigs' ? showTable : null"
                    />
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script>
import { Constants } from '@/plugins/constants';
import DownloadFile from '@/components/Administration/Repository/Download/DownloadFile';
// tree view
import ISO from '../../components/Administration/Repository/Treeview/ISO';
import Software from '@/components/Administration/Repository/Treeview/Software';

import Bios from '@/components/Administration/Repository/Treeview/Bios';
import BMC from '@/components/Administration/Repository/Treeview/BMC';
import KeysStore from '@/components/Administration/Repository/Treeview/KeysStore';
import SaveConfigs from '@/components/Administration/Repository/Treeview/SaveConfigs';
import Playbooks from '@/components/Administration/Repository/Treeview/Playbooks';
import KickstartFile from '../../components/Administration/Repository/Treeview/KickstartFile';

// Table
import TableScriptsPlaybooks from '../../components/Administration/Repository/Table/TableScriptsPlaybooks';
// import TableOS from '@/components/Administration/Repository/Table/TableOS';
// import TableSoft from '@/components/Administration/Repository/Table/TableSoft';
import TableKickstart from '../../components/Administration/Repository/Table/TableKickstart';
import TableSaveConfigs from '../../components/Administration/Repository/Table/TableSaveConfigs';
import TableDownloadFile from '@/components/Administration/Repository/Table/TableDownloadFile';

export default {
    components: {
        TableSaveConfigs,
        TableKickstart,
        TableScriptsPlaybooks,
        DownloadFile,
        Bios,
        ISO,
        BMC,
        KeysStore,
        SaveConfigs,
        Software,
        // TableOS,
        // TableSoft,
        Playbooks,
        KickstartFile,
        TableDownloadFile,
    },

    data: () => ({
        Constants,
        // props:
        propsDownload: null,
        propsTable: null,

        selectOff: null,
        selectOffISO: null,
        selectItemList: 0,
        // Constants,
        propsDataTable: Object,
        propsPlaybookTable: Object,
        checkboxAlertUser: true,
        showDownloadFile: false,
        openScript: false,
        showGlobalTable: false,
        // activeTab
        // show
        showTableOS: false,
        showTableSoft: false,
        showTableKickstart: false,
        showTableDownloadFile: false,
        showTableScript: false,
        showTableConfigs: false,
        selectTable: null,

        listItems: [
            { comp: 'iso' },
            { comp: 'software' },
            { comp: 'kickstart' },
            { comp: 'scripts' },
            { comp: 'saveConfigs' },
        ],
    }),
    computed: {
        showTable() {
            console.log('!!!!!!!!!!this.selectTable', this.selectTable);

            switch (this.selectTable) {
                case 'ISO':
                    this.showDownloadFile = true;
                    this.propsDataTable = 'ISO';
                    return TableDownloadFile;
                case 'software':
                    this.showDownloadFile = true;
                    this.propsDataTable = 'software';
                    return TableDownloadFile;
                case 'kickstart':
                    this.showDownloadFile = false;
                    return TableKickstart;
                case 'script':
                    this.showDownloadFile = false;
                    return TableScriptsPlaybooks;
                case 'saveConfigs':
                    this.showDownloadFile = false;
                    return TableSaveConfigs;
                default:
                    return TableDownloadFile;
            }
        },
    },
    methods: {
        transferDataTable(objParams) {
            console.log('transferDataTable', objParams);
            this.selectItemList = objParams.key;
            this.selectTable = objParams.nameTreview;
        },

        fileUploadedSuccess(nameTreview) {
            this.$emit('updateDownloadTable', nameTreview);
        },
    },
};
</script>

<style>
.margin-left {
    margin-left: 20px;
}

.row-table-repository {
    /*padding: 0;*/
    /*margin: 0;*/
    height: 75px;
}

/* .v-application .primary--text {
            color: none !important;
            caret-color: greenyellow !important;
        } */
</style>
