<template>
    <v-row class="pa-4" style="height: 100%">
        <v-col cols="3" class="access-col">
            <v-treeview
                dense
                :active.sync="active"
                :items="itemsTree"
                item-key="name"
                :load-children="fetchChildren"
                activatable
                color="gray"
                open-on-click
                style="font-size: 13px; font-weight: 500"
            >
                <template v-slot:prepend="{ item }">
                    <v-icon class="mr-3">{{ item.icon }}</v-icon>
                </template>
            </v-treeview>
        </v-col>

        <v-col class="d-flex text-center" style="padding: unset; margin: 16px 32px 0 0">
            <LocalUsersTable v-if="active.includes('Локальные пользователи')" v-show="showLocalUsersTable" />
            <UserGroupsTable v-if="active.includes('Группы пользователей')" v-show="showUserGroupsTable" />
            <RoleAccessTable
                v-if="
                    active.includes(
                        active.find(
                            f =>
                                f === Constants.ROLE.SUPER_ADMIN.value ||
                                Constants.ROLE.ADMIN.value ||
                                Constants.ROLE.OPERATOR.value,
                        ),
                    )
                "
                v-show="showRoleAccessTable"
                :propsRoleAccTable="propsRoleAccTable"
            />
        </v-col>
    </v-row>
</template>

<script>
import LocalUsersTable from '@/components/Administration/Access/LocalUsersTable';
import UserGroupsTable from '@/components/Administration/Access/UserGroupsTable';
import RoleAccessTable from '@/components/Administration/Access/RoleAccessTable';
import { Constants } from '@/plugins/constants';

export default {
    components: {
        LocalUsersTable,
        UserGroupsTable,
        RoleAccessTable,
    },
    data: () => ({
        propsRoleAccTable: [],
        showLocalUsersTable: true,
        showUserGroupsTable: true,
        showRoleAccessTable: false,
        active: ['Локальные пользователи'],
        itemsTree: [
            {
                icon: 'mdi-account',
                name: 'Локальные пользователи',
            },
            {
                icon: 'mdi-account-multiple',
                name: 'Группы пользователей',
            },
            {
                icon: 'mdi-key',
                name: 'Права доступа',
                children: [],
            },
        ],
        Constants,
    }),

    methods: {
        /** Получение детей в дереве ролей
         *
         * @returns {Promise<void>}
         */
        async fetchChildren() {
            await this.$load(async () => {
                const roles = await this.$api.rolesManagement.getAllRoles();
                this.itemsTree[2].children.push(...roles);
            });
        },
    },

    watch: {
        active() {
            if (this.active[0] === 'Локальные пользователи' || this.active[0] === 'Группы пользователей') {
                this.showLocalUsersTable = this.showUserGroupsTabletrue = true;
                this.showRoleAccessTable = false;
            } else {
                this.showLocalUsersTable = this.showUserGroupsTabletrue = false;
                this.showRoleAccessTable = true;
                this.propsRoleAccTable = this.active;
            }
        },
    },
};
</script>

<style scoped>
.access-col {
    border-top: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    margin: 16px 0 0 32px;
    padding: unset;
}

.access-show-actions {
    opacity: 0;
}

tr:hover .access-show-actions {
    opacity: 1;
    transition: 0.1s linear;
}
</style>
