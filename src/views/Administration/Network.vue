<template>
    <v-container fluid>
        <v-row>
            <v-col cols="3" class="network-col">
                <v-treeview
                    dense
                    :active.sync="active"
                    :items="itemsTree"
                    color="gray"
                    item-key="id"
                    activatable
                    open-on-click
                    style="font-size: 13px; font-weight: 500"
                >
                    <template v-slot:prepend="{ item }">
                        <v-icon class="mr-3">{{ item.icon }}</v-icon>
                    </template>
                </v-treeview>
            </v-col>

            <!-- Table -->
            <v-col class="d-flex text-center" style="padding: unset; margin: 16px 32px 0 0">
                <v-data-table
                    dense
                    :items="protocolData"
                    item-key="name"
                    :headers="headers"
                    :loading="loading"
                    loading-text="Загрузка данных"
                    class="network-datatable"
                    no-data-text="Данных нет"
                    disable-sort
                    hide-default-footer
                >
                    <template v-slot:[`item.login`]="{ item }">
                        <v-text-field
                            dense
                            outlined
                            hide-details
                            v-model="item.login"
                            :disabled="item.disableLogin"
                            style="max-width:250px"
                            @input="item.disableAction = false"
                        ></v-text-field>
                    </template>
                    <template v-slot:[`item.password`]="{ item }">
                        <v-text-field
                            :append-icon="item.show ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="item.show ? 'text' : 'password'"
                            @click:append="item.show = !item.show"
                            dense
                            outlined
                            hide-details
                            v-model="item.password"
                            :disabled="item.disablePassword"
                            style="max-width:250px"
                            @input="item.disableAction = false"
                        ></v-text-field>
                    </template>
                    <template v-slot:[`item.action`]="{ item }">
                        <v-btn small :disabled="item.disableAction" @click="patchProtocol(item)">
                            <v-icon>mdi-content-save</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import { Constants } from '@/plugins/constants';

export default {
    data: () => ({
        loading: true,

        itemsTree: [
            {
                id: 0,
                icon: 'mdi-account',
                name: 'Параметры IP',
            },
            {
                id: 1,
                icon: 'mdi-account-multiple',
                name: 'Расширенная маршрутизация',
            },
            {
                id: 2,
                icon: 'mdi-key',
                name: 'Настройка DNS',
            },
            {
                id: 3,
                icon: 'mdi-key',
                name: 'Пароли по умолчанию',
            },
        ],

        active: [3],

        headers: [
            { text: 'Протокол', value: 'name' },
            { text: 'Логин/Комьюнити', value: 'login' },
            { text: 'Пароль', value: 'password' },
            { text: '', value: 'action' },
        ],
    }),

    computed: {
        /** Получение списка протоколов
         */

        protocolsList() {
            return this.$store.getters.getProtocolList.filter(
                v => !v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_00),
            );
        },
        /** Формирование данных для каждого протокола
         */
        protocolData() {
            return this.protocolsList
                .filter(v => v.name !== 'undefinded')
                .map(v => ({
                    uuid: v.uuid,
                    name: v.version ? v.name + ' v.' + v.version : v.name,
                    login: v.login || v.community,
                    password: v.password,
                    comment: v.comment,
                    show: false,
                    disableLogin: v.name === 'ICMP',
                    disablePassword: v.name === 'ICMP' || (v.name === 'SNMP' && v.version === '1'),
                    disableAction: true,
                }));
        },
    },

    watch: {
        active(v) {
            if (!v.length) {
                this.active = [0];
            }
        },
    },

    methods: {
        ...mapActions(['fetchProtocols']),

        /**отправка данных протоколов
         *
         * @param item
         */
        patchProtocol(item) {
            item.disableAction = true;
            item.show = false;

            const patchData = {
                login: item.name !== 'SNMP v.2c' ? item.login : null,
                password: item.password,
                community: item.name === 'SNMP v.2c' ? item.login : null,
                comment: item.comment,
            };

            this.$load(async () => {
                await this.$api.protocols.patch(item.uuid, patchData);
                this.$store.dispatch('snackSuccess', 'Сохранено');
            });
        },
    },

    async mounted() {
        await this.fetchProtocols();
        this.loading = false;
    },

    created() {
        this.$store.commit('setProtocolData', this.protocolData);
    },
};
</script>

<style scoped>
.network-col {
    border-top: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    margin: 16px 0 0 32px;
    padding: unset;
}

.network-datatable {
    width: 100%;
    border-top: 1px solid #e6e6e6;
}

.network-datatable td {
    padding: unset !important;
    padding-left: 16px !important;
}

.network-show-actions {
    opacity: 0;
}

tr:hover .network-show-actions {
    opacity: 1;
    transition: 0.1s linear;
}
</style>
