<template>
    <v-data-table
        :no-data-text="$tableMessage['no-data-text']"
        :loading-text="$tableMessage['loading-text']"
        :loading="loading"
        :headers="headers"
        :items="loading ? [] : items"
        disable-sort
        hide-default-footer
        class="access-datatable"
    >
        <template v-slot:[`item.viewing`]="{ item }">
            <div class="d-flex justify-center">
                <v-checkbox
                    dense
                    style="margin: unset"
                    hide-details
                    color="success"
                    v-model="item.viewing.value"
                    :disabled="item.viewing.disabled"
                    v-if="item.viewing !== undefined"
                    @change="handlerChange"
                ></v-checkbox>
            </div>
        </template>

        <template v-slot:[`item.controlDevices`]="{ item }">
            <div class="d-flex justify-center">
                <v-checkbox
                    dense
                    style="margin: unset"
                    hide-details
                    color="success"
                    v-model="item.controlDevices.value"
                    :disabled="item.controlDevices.disabled"
                    v-if="item.controlDevices !== undefined"
                    @change="handlerChange"
                ></v-checkbox>
            </div>
        </template>
    </v-data-table>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    props: {
        propsRoleAccTable: {
            type: Array,
            required: true,
        },
    },
    data: () => ({
        loading: false,
        roleName: '',
        headers: [
            { text: '', value: 'name' },
            { text: 'Просмотр', value: 'viewing', align: 'center', width: '200px' },
            { text: 'Управление оборудованием', value: 'controlDevices', align: 'center', width: '200px' },
        ],
        items: [
            {
                name: 'Главная',
                viewing: {
                    value: false,
                    claims: Constants.CLAIMS.R_HOME,
                    disabled: true,
                    url: [
                        'get/json/devicetypes/statesall',
                        'get/json/deviceracks/statesall',
                        'get/json/devicegroups/statesall',
                        'get/json/deviceangles/statesall',
                    ],
                },
            },
            {
                name: 'Мониторинг',
                viewing: {
                    value: false,
                    claims: Constants.CLAIMS.R_MONITORING,
                    disabled: true,
                    url: ['get/json/device-timestamp-states', 'get/json/component-parameter-measurements'],
                },
            },
            {
                name: 'Управление',
                viewing: {
                    value: false,
                    claims: Constants.CLAIMS.R_CONTROL,
                    disabled: true,
                    url: [
                        'get/json/DevicesManagement',
                        'get/json/DevicesManagement/racksDevices',
                        'get/json/DevicesManagement/groupsDevices',
                        'get/json/DevicesManagement/anglesDevices',
                        'post/json/DevicesManagement/stop',
                        'post/json/DevicesManagement/start',
                        'post/json/DevicesManagement/reboot',
                        'post/json/DevicesManagement/serviceon',
                        'post/json/DevicesManagement/serviceoff',
                    ],
                },
                controlDevices: {
                    value: false,
                    claims: Constants.CLAIMS.C_CONTROL,
                    disabled: true,
                    url: [
                        'post/json/DevicesManagement/stop',
                        'post/json/DevicesManagement/start',
                        'post/json/DevicesManagement/reboot',
                        'post/json/DevicesManagement/serviceon',
                        'post/json/DevicesManagement/serviceoff',
                    ],
                },
            },
            {
                name: 'Администратирование',
                viewing: {
                    value: false,
                    claims: Constants.CLAIMS.R_ADMINISTRATION,
                    disabled: true,
                    url: [
                        'patch/json/protocols',
                        'get/identity/UsersManagement',
                        'get/identity/RolesManagement',
                        'patch/json/JobTasks/arr',
                        'delete/json/Devices',
                        'patch/json/Devices',
                        'patch/json/Racks',
                        'post/json/Racks',
                        'delete/json/Racks',
                        'patch/json/devices/devices-racks',
                        'patch/json/devices/devices-groups',
                        'delete/json/devices/devices-groups',
                        'patch/json/devices/devices-angles',
                        'delete/json/devices/devices-angles',
                        'patch/json/DevicesTypes',
                    ],
                },
            },
            {
                name: `Карточка "Права Доступа"`,
                viewing: {
                    value: false,
                    claims: Constants.CLAIMS.R_ADMINISTRATION_ACCESS,
                    disabled: true,
                    url: [
                        'get/identity/UsersManagement',
                        'get/identity/UsersManagement/CheckUserLock',
                        'get/identity/UsersManagement/GetAllLockUser',
                        'get/identity/UsersManagement/GetAllNotLockUser',
                        'post/identity/UsersManagement',
                        'patch/identity/UsersManagement',
                        'delete/identity/UsersManagement',
                        'put/identity/UsersManagement',
                        'put/identity/UsersManagement/UserLock',
                        'put/identity/UsersManagement/UserUnlock',
                        'delete/identity/UsersManagement/removeFromUserToRoles',
                        'get/identity/RolesManagement',
                        'patch/identity/RolesManagement/AddFrontClaims',
                        'delete/identity/RolesManagement/RemoveFrontClaims',
                        'put/identity/RolesManagement/ChangeFrontClaims',
                    ],
                },
            },
        ],
        currentClaims: [],
    }),
    watch: {
        propsRoleAccTable() {
            this.roleName = this.propsRoleAccTable[0];
            this.getFrontClaims();
        },
    },
    methods: {
        /**
         * Получение всех Claims от сервера
         * @returns {Promise<void>}
         */
        async getFrontClaims() {
            this.loading = true;
            if (this.roleName) {
                this.currentClaims =
                    (await this.$api.rolesManagement.getFrontClaims({ roleName: this.roleName })) || {};
                if (this.currentClaims && this.currentClaims.frontRole) {
                    this.updateRoleAccess();
                }
            }

            this.loading = false;
        },

        /**
         * Изменение прав доступа для ролей
         * @returns {Promise<void>}
         */
        async putChangeFrontClaims() {
            const data = this.items.reduce(
                (prev, currItem) => {
                    if (currItem.viewing && !currItem.viewing.value) {
                        prev.frontRole.push(currItem.viewing.claims);
                        prev.queryRole = prev.queryRole.concat(...currItem.viewing.url);
                    }
                    if (currItem.controlDevices && !currItem.controlDevices.value) {
                        prev.frontRole.push(currItem.controlDevices.claims);
                        prev.queryRole = prev.queryRole.concat(...currItem.controlDevices.url);
                    }
                    return prev;
                },
                { frontRole: [], queryRole: [] },
            );

            await this.$api.rolesManagement.putChangeFrontClaims(this.roleName, data);
        },

        /**
         * Обновить значение прав доступа для ролей
         */
        updateRoleAccess() {
            this.items.forEach(item => {
                if (item.viewing) {
                    item.viewing.disabled = this.roleName === Constants.ROLE.SUPER_ADMIN.value;
                    if (this.currentClaims && this.currentClaims.frontRole.length > 0) {
                        item.viewing.value = !this.currentClaims.frontRole.some(claim => claim === item.viewing.claims);
                    } else {
                        item.viewing.value = true;
                    }
                }

                if (item.controlDevices) {
                    item.controlDevices.disabled = this.roleName === Constants.ROLE.SUPER_ADMIN.value;
                    if (this.currentClaims && this.currentClaims.frontRole.length > 0) {
                        item.controlDevices.value = !this.currentClaims.frontRole.some(
                            claim => claim === item.controlDevices.claims,
                        );
                    } else {
                        item.controlDevices.value = true;
                    }
                }

                if (
                    item.viewing.claims === Constants.CLAIMS.R_ADMINISTRATION_ACCESS &&
                    this.roleName !== Constants.ROLE.SUPER_ADMIN.value
                ) {
                    if (item.viewing) item.viewing.disabled = !item.viewing.value;
                }

                if (
                    (item.viewing.claims === Constants.CLAIMS.R_CONTROL ||
                        item.viewing.claims === Constants.CLAIMS.R_ADMINISTRATION) &&
                    this.roleName === Constants.ROLE.OPERATOR.value
                ) {
                    item.viewing.disabled = !item.viewing.value;
                }

                if (item.viewing.claims === Constants.CLAIMS.R_HOME) {
                    item.viewing.disabled = item.viewing.value;
                }

                if (
                    item.controlDevices &&
                    item.controlDevices.claims === Constants.CLAIMS.C_CONTROL &&
                    this.roleName === Constants.ROLE.OPERATOR.value
                ) {
                    item.controlDevices.disabled = !item.controlDevices.value;
                }
            });
        },

        /**
         * Событие нажатия на чекбокс с правами
         * @returns {Promise<void>}
         */
        async handlerChange() {
            this.loading = true;
            await this.putChangeFrontClaims();
            await this.getFrontClaims();
        },
    },

    async mounted() {
        this.roleName = this.propsRoleAccTable[0];
        await this.getFrontClaims();
    },
};
</script>

<style scoped>
.access-datatable {
    width: 100%;
    border-top: 1px solid #e6e6e6;
}
</style>
