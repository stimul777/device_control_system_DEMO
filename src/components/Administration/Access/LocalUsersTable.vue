<template>
    <v-container style="padding: 0" fluid>
        <v-data-table
            :no-data-text="$tableMessage['no-data-text']"
            :loading-text="$tableMessage['loading-text']"
            :loading="loading"
            :headers="headers"
            :items="items"
            disable-sort
            class="access-datatable"
        >
            <template v-slot:[`item.fullName`]="{ item }">
                <v-text-field dense hide-details outlined v-model="item.fullName" v-if="item.editing"></v-text-field>
                <span v-else>{{ item.fullName }}</span>
            </template>
            <!-- Слот роли -->
            <template v-slot:[`item.role`]="{ item }">
                <v-select
                    dense
                    hide-details
                    outlined
                    v-model="item.role"
                    :items="roles"
                    item-text="name"
                    v-if="item.editing"
                ></v-select>
                <span v-else>{{ item.role }}</span>
            </template>
            <!-- Слот описания -->
            <template v-slot:[`item.depiction`]="{ item }">
                <v-text-field dense hide-details outlined v-model="item.depiction" v-if="item.editing"></v-text-field>
                <span v-else>{{ item.depiction }}</span>
            </template>
            <!-- Слот состояния -->
            <template v-slot:[`item.isLocked`]="{ item }">
                <v-select
                    dense
                    hide-details
                    outlined
                    v-model="item.isLocked"
                    :items="stateLock"
                    item-text="name"
                    v-if="item.editing"
                ></v-select>
                <span v-else>{{ lockName(item.isLocked) }}</span>
            </template>
            <!-- Слот логина -->
            <template v-slot:[`item.userEmail`]="{ item }">
                <v-text-field dense hide-details outlined v-model="item.userEmail" v-if="item.editing"></v-text-field>
                <span v-else>{{ item.userEmail }}</span>
            </template>
            <!-- Слот пароля -->
            <template v-slot:[`item.password`]="{ item }">
                <v-text-field
                    dense
                    hide-details
                    outlined
                    v-model.trim="item.password"
                    :append-icon="!item.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="item.showPassword ? 'text' : 'password'"
                    @click:append="item.showPassword = !item.showPassword"
                    v-if="item.editing"
                ></v-text-field>
                <span v-else-if="!item.password.length">******</span>
                <span v-else>{{ '*'.repeat(item.password.length) }}</span>
            </template>
            <!-- Слот действия -->
            <template v-slot:[`item.action`]="{ item }">
                <div class="access-show-actions" v-if="!someoneEditing">
                    <v-btn icon small class="mr-2" @click="editUserData(item)">
                        <v-icon size="16">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon small @click="deleteUser(item)" v-if="!currentUser(item)">
                        <v-icon size="16">mdi-minus</v-icon>
                    </v-btn>
                </div>
                <div v-if="item.editing">
                    <v-btn icon small class="mr-2" @click="controlUser(item)">
                        <v-icon size="16" :color="Constants.STYLE.PRIMARY">mdi-content-save</v-icon>
                    </v-btn>
                    <v-btn icon small class="mr-2" v-if="addedNewLocalUser" @click="cancelCreateUser">
                        <v-icon size="16" :color="Constants.STYLE.SUCCESS">mdi-close-circle</v-icon>
                    </v-btn>
                </div>
            </template>
        </v-data-table>

        <div class="d-flex mt-3">
            <button
                style="width: 200px"
                class="btn btn-success"
                @click="newLocalUser()"
                :style="someoneEditing ? { opacity: 0.5 } : ''"
                :disabled="someoneEditing"
            >
                Добавить пользователя
            </button>
        </div>
    </v-container>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    data: () => ({
        Constants,
        loading: true,
        items: [],
        headers: [
            {
                text: 'Имя пользователя',
                value: 'fullName',
            },
            {
                text: 'Роль',
                value: 'role',
            },
            {
                text: 'Описание',
                value: 'depiction',
            },
            {
                text: 'Состояние',
                value: 'isLocked',
            },
            {
                text: 'Почта',
                value: 'userEmail',
            },
            {
                text: 'Пароль',
                value: 'password',
            },
            {
                text: '',
                value: 'action',
            },
        ],

        stateLock: [
            {
                name: 'Активна',
                value: false,
            },
            {
                name: 'Откл.',
                value: true,
            },
        ],

        roles: [],

        someoneEditing: false,
        addedNewLocalUser: false,
    }),

    methods: {
        newLocalUser() {
            this.someoneEditing = true;
            this.addedNewLocalUser = true;

            this.items.unshift({
                depiction: '',
                editing: true,
                fullName: '',
                isLocked: false,
                password: '',
                role: Constants.ROLE.OPERATOR.value,
                showPassword: false,
                userEmail: '',
            });
        },

        cancelCreateUser() {
            this.items.shift();
            this.someoneEditing = false;
            this.addedNewLocalUser = false;
        },

        editUserData(item) {
            item.editing = true;
            this.someoneEditing = true;
        },

        async controlUser(item) {
            item.editing = false;
            this.someoneEditing = false;

            const userData = JSON.parse(JSON.stringify(item));

            const [firstName, secondName, lastName] = userData.fullName.split(' ');
            userData.firstName = firstName;
            userData.secondName = secondName;
            userData.lastName = lastName;

            delete userData.fullName;
            delete userData.showPassword;
            delete userData.editing;

            if (!item.password.length) {
                delete userData.password;
            }

            /** Добавление пользователя
             *
             */
            if (this.addedNewLocalUser) {
                await this.$load(async () => {
                    await this.$api.usersManagement.addUser(userData);
                    this.$store.dispatch('snackSuccess', `Пользователь ${userData.userEmail} создан `);
                });

                this.addedNewLocalUser = false;
            } else {
                /** Обновление пользователя
                 *
                 */
                await this.$load(async () => {
                    await this.$api.usersManagement.updateUser(userData);
                    this.$store.dispatch('snackSuccess', `Данные для пользователя ${item.userEmail} обновлены`);
                });
            }

            await this.$load(async () => {
                await this.loadUsers();
            });
        },

        async deleteUser(item) {
            await this.$load(async () => {
                await this.$api.usersManagement.deleteUser({ userEmail: item.userEmail });
                this.$store.dispatch('snackSuccess', `Пользователь ${item.userEmail} успешно удалён`);
            });

            await this.$load(async () => {
                await this.loadUsers();
            });
        },

        lockName(isLocked) {
            return this.stateLock.find(v => v.value === isLocked).name;
        },

        async loadUsers() {
            this.items = (await this.$api.usersManagement.getAllUsers()).reverse().map(item => {
                return {
                    ...item,
                    editing: false, // находится ли в данный момент в режиме
                    showPassword: false, // показывать пароль
                    password: '', // текущий пароль пользователя не подгружается
                };
            });
        },

        currentUser(item) {
            return item.userEmail === this.$store.getters['auth/getJwtDecodeData'].nameid;
        },
    },

    async mounted() {
        await this.$load(async () => {
            await this.loadUsers();
            this.roles = await this.$api.rolesManagement.getAllRoles();
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

.access-datatable td {
    padding: unset !important;
    padding-left: 16px !important;
}

.access-show-actions {
    opacity: 0;
}

tr:hover .access-show-actions {
    opacity: 1;
    transition: 0.1s linear;
}
</style>
