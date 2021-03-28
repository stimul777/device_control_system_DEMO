<template>
    <v-container fluid>
        <v-tabs align-with-title v-if="showTabs">
            <v-tab @click="selectedTab('paramComp')">Параметры компонентов</v-tab>
            <v-tab @click="selectedTab('eventMessage')">Сообщения о событиях</v-tab>
            <v-tabs-slider :color="'tabs-slider-success'"></v-tabs-slider>
        </v-tabs>
        <v-row no-gutters>
            <v-col cols="12" sm="3" md="3">
                <!-- V-TREEVIEW -->
                <v-treeview
                    class="mt-10"
                    activatable
                    color="black"
                    dense
                    transition
                    v-model="tree"
                    :items="TreeViewEquipment"
                    item-key="name"
                    open-on-click
                    return-object
                    :active.sync="addCompTable"
                    :open.sync="openTreeview"
                    v-if="showDeviceTreeview"
                    open-all
                >
                    <template v-slot:prepend="{ item, open }">
                        <v-icon v-if="!item.file">{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
                        <v-icon v-else>{{ files[item.file] }}</v-icon>
                    </template>
                </v-treeview>

                <Templates v-if="showTemplates" @clickTemplates="loadTemplates" />

                <v-list dense style="padding: unset">
                    <v-list-item-group v-model="settingParameters">
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-wrench</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Настройки параметров</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-col>
            <v-col cols="12" sm="9" md="9">
                <v-container fluid>
                    <TableTemplates v-if="showTableTemplates" @CallEditTableGroups="CallEditTableGroups" />
                    <TableCompDevices :tableCompProps="tableCompProps" v-else-if="showTableCompDevices" />
                    <EventMessages v-if="showEventMessages" />
                    <EditTableGroups v-else-if="showEditTableGroups" @CallEditTableGroups="CallEditTableGroups" />
                    <SettingParameters v-else-if="settingParameters === 0" />
                </v-container>
                <ProgressCircular
                    v-show="progressCircularShow"
                    style="top: 40%; left: 50%;"
                    :progressCircularProps="progressCircularProps"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import TableCompDevices from '@/components/Administration/CompDevices/TableCompDevices';
import EventMessages from '@/components/Administration/CompDevices/EventMessages';
import Templates from '@/components/Administration/CompDevices/Templates/Templates';
import TableTemplates from '@/components/Administration/CompDevices/Templates/TableTemplates';
import SettingParameters from '@/components/Administration/CompDevices/SettingParameters';
import ProgressCircular from '@/components/app/ProgressCircular';
import { Constants } from '@/plugins/constants';

export default {
    components: {
        TableCompDevices,
        EventMessages,
        Templates,
        TableTemplates,
        SettingParameters,
        ProgressCircular,
    },

    data: () => ({
        // массив с отсортированными комп
        components: [],
        // progressCircular(лоадер)
        progressCircularProps: {
            size: 50,
            color: Constants.STYLE.SUCCESS,
        },
        progressCircularShow: true,

        showTabs: true,
        showDeviceTreeview: true,
        showEditTableGroups: false,
        showTemplates: true,
        showTableCompDevices: false,
        showEventMessages: false,
        showTableTemplates: false,
        tableCompProps: [],
        addCompTable: [],
        openTreeview: [],
        selectedTable: [],
        settingParameters: null,
        // иконки
        files: {
            template: 'mdi-file-document-outline',
            add: 'mdi-plus-thick ',
            case: 'mdi-briefcase-outline',
            CPU: 'mdi-cpu-64-bit',
            dimm: 'mdi-memory',
            PS: 'mdi-power-plug-outline',
            server: 'mdi-server',
            switch: 'mdi-resistor-nodes ',
            network: 'mdi-access-point-network',
            desktop: 'mdi-desktop-tower',
        },
        tree: [],
        // Оборудование
        TreeViewEquipment: [
            {
                name: 'Оборудование',
                children: [
                    {
                        name: Constants.EQUIPMENT.SERVERS,
                        children: [],
                        file: 'server',
                    },
                    {
                        name: Constants.EQUIPMENT.NETWORK_STORAGES,
                        children: [],
                        file: 'network',
                    },
                    {
                        name: Constants.EQUIPMENT.SWITCHES,
                        children: [],
                        file: 'switch',
                    },
                ],
            },
        ],
    }),

    methods: {
        ...mapActions(['startRequestCompDevices']),

        /** принимаем данные из watch и формируем дерево устройств компонентов
         *
         * @param component
         */
        dataInTree(component) {
            this.startRequestCompDevices(component.filter)
                .then(() => {
                    this.getComponent.map(m =>
                        this.TreeViewEquipment[0].children[component.positionArr].children.push({
                            name: m.componentType.name,
                            uuid: m.componentType.uuid,
                            file: 'desktop',
                            componentType: m.componentType,
                            monitoringProfile: m.monitoringProfile,
                        }),
                    );
                })
                .then(() => (this.progressCircularShow = false))
                .then(() =>
                    this.getComponent.length === 0
                        ? this.$store.dispatch('snackError', 'У оборудования нет компонентов!')
                        : false,
                );

            this.openTreeview.push(this.TreeViewEquipment[0].children[component.positionArr].children);
        },

        selectedTab(param) {
            param === 'paramComp'
                ? ((this.showEventMessages = this.showTableTemplates = this.showTableCompDevices = false),
                  (this.showTableCompDevices = true))
                : ((this.showTableCompDevices = this.showTableTemplates = false), (this.showEventMessages = true));
        },

        loadTemplates(i) {
            this.showTableTemplates = true;
            this.showTableCompDevices = this.showEventMessages = this.EventMessages = false;
        },

        CallEditTableGroups(i) {
            this.showEditTableGroups = i;
            this.showEventMessages = this.showTableCompDevices = false;
            this.showTabs = this.showDeviceTreeview = this.showTemplates = this.showTableTemplates = !i;
        },
    },

    computed: {
        ...mapGetters(['getComponent']),
    },

    watch: {
        // клик по оборудованию
        addCompTable(item) {
            if (!item.length) {
                return;
            }

            // Скрыть 'настройки параметров'
            this.settingParameters = null;

            item = item.reduce((acc, i) => (acc += i));

            /** Заполнение TreeView дерева компонентами
             * девайсы(filter):
             * 3-сервера
             * 4-коммутаторы
             * 5-хранилища
             * positionArr нужен для отстройки по дереву v-TreeViewVue
             * @param item.name
             */
            switch (item.name) {
                case Constants.EQUIPMENT.SERVERS:
                    this.dataInTree({ filter: 3, positionArr: 0 });
                    this.showTableCompDevices = false;
                    break;
                case Constants.EQUIPMENT.SWITCHES:
                    this.$store.dispatch('snackError', 'Оборудование отсутствует');
                    break;
                case Constants.EQUIPMENT.NETWORK_STORAGES:
                    this.$store.dispatch('snackError', 'Оборудование отсутствует');
                    break;
                default:
                    item.type = 'component';
                    this.tableCompProps = item;
                    this.showTableCompDevices = true;
                    break;
            }
        },

        settingParameters(val) {
            if (val === 0) {
                this.showTableTemplates = this.showTableCompDevices = this.showEventMessages = this.showEditTableGroups = false;
                this.addCompTable = [];
            }
        },
    },
    // Открыть сервера при рендере
    mounted() {
        this.dataInTree({ filter: 3, positionArr: 0 });
    },
};
</script>
