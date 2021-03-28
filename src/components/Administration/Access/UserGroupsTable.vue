<template>
    <v-data-table
        :no-data-text="$tableMessage['no-data-text']"
        :loading-text="$tableMessage['loading-text']"
        :loading="loading"
        :headers="headers"
        :items="items"
        disable-sort
        hide-default-footer
        class="access-datatable"
    >
        <template v-slot:[`item.groupName`]="{ item }">
            <span>{{ item.nameRu }}</span>
        </template>
        <template v-slot:[`item.users`]="{ item }">
            <v-select
                v-model="item.users"
                :items="users"
                :menu-props="{ maxHeight: '400' }"
                item-text="fullName"
                item-value="userEmail"
                hide-details
                multiple
                dense
                outlined
                @change="e => setSelected(e, item)"
            >
                <template v-slot:append>
                    <v-icon size="16" class="mt-1">mdi-pencil</v-icon>
                </template>
            </v-select>
        </template>
    </v-data-table>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    /**
     *  Инициализация данныйх для компанента
     */
    data: () => ({
        loading: true,
        headers: [
            {
                text: 'Имя группы',
                value: 'groupName',
                align: 'left',
                width: '200px',
            },
            {
                text: 'Пользователи',
                value: 'users',
            },
        ],
        users: [],
        items: [],
    }),

    methods: {
        async initData() {
            //@TODO вынести в константы

            const NAME_RU = {
                SuperAdmin: Constants.ROLE.SUPER_ADMIN.ruName,
                Admin: Constants.ROLE.ADMIN.ruName,
                Operator: Constants.ROLE.OPERATOR.ruName,
            };

            const roles = (await this.$api.rolesManagement.getAllRoles()) || [];
            this.users = (await this.$api.usersManagement.getAllUsers()) || [];
            this.items = roles.map(role => {
                const _users = this.users.filter(user => user.role === role.name);
                return {
                    id: role.id,
                    name: role.name,
                    nameRu: NAME_RU[role.name],
                    users: _users.map(user => user.userEmail),
                    isLocked: _users && _users.length > 0 ? _users.every(user => !user.isLocked) : false,
                };
            });
        },

        async setSelected(usersEmail, value) {
            /**
             *  Убрать выбранный элементы из других групп
             */
            this.items = this.items.map(_items => {
                if (_items.name !== value.name) {
                    _items.users = _items.users.filter(e => {
                        return usersEmail.indexOf(e) === -1;
                    });
                }
                return _items;
            });

            /**
             * Формирование обьекта для отправки на сервер
             */
            const data = this.users.map(user => {
                let userRole;
                this.items.forEach(item => {
                    const role = item.users.findIndex(userEmail => userEmail === user.userEmail);
                    if (role > -1 && !userRole) userRole = item.name;
                });
                if (!userRole) {
                    userRole = Constants.ROLE.OPERATOR.value; //@TODO вынести в константы
                }
                return {
                    userEmail: user.userEmail,
                    userRole: userRole,
                };
            });
            await this.putUsersManagement(data);
            await this.initData();
        },

        async putUsersManagement(usersManagement) {
            await this.$api.usersManagement.putUsersManagement(usersManagement);
        },
    },

    async mounted() {
        await this.$load(async () => {
            await this.initData();
        });
        this.loading = false;
    },
};
</script>

<style scoped>
.access-datatable {
    width: 100%;
    border-top: 1px solid #e6e6e6;
}
</style>
