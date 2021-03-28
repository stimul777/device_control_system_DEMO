<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" sm="6" md="8">
                <v-treeview
                    v-model="tree"
                    :items="items"
                    transition
                    @update:open="btnShow = !btnShow"
                    item-key="name"
                    :active.sync="activ"
                    :open-all="open"
                >
                    <template v-slot:prepend="{ item, open }">
                        <v-icon v-if="!item.file">{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
                        <v-icon v-else>{{ files[item.file] }}</v-icon>
                    </template>

                    <template v-slot:append="{ item }">
                        <template v-if="item.name !== 'Типы оборудования'">
                            <v-text-field
                                class="inputTypeDevices"
                                v-model="item.comment"
                                @input="userComment(item)"
                            ></v-text-field>
                        </template>
                    </template>
                </v-treeview>
            </v-col>
        </v-row>
        <v-btn class="btn btn-success" style="left: 60%" v-show="btnShow" @click="requestServer()">Сохранить</v-btn>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data: () => ({
        open: false,
        activ: [{ name: 'Типы оборудования' }],
        btnShow: true,
        userCommentObj: {},
        files: {
            servers: 'mdi-lan-connect',
            storage: 'mdi-server ',
            switches: 'mdi-electric-switch',
        },
        tree: [],
        items: [],
        initiallyOpen: [0],
    }),

    computed: mapGetters(['getTypeDevices']),

    methods: {
        ...mapActions(['requestTypeDevices', 'userTypeDevices']),

        selectTab(item) {
            // this.$emit('selectTabEmit', item)
        },
        /** Получение данных для устройств
         *
         */
        startRequest() {
            this.items.push({
                name: 'Типы оборудования',
                children: [
                    {
                        name: 'Серверы',
                        file: 'servers',
                        comment: this.getTypeDevices
                            .filter(i => i.uuid == '00000000-0000-0000-0000-000000000003')
                            .map(i => i.comment),
                    },
                    {
                        name: 'Сетевые хранилища',
                        file: 'storage',
                        comment: this.getTypeDevices
                            .filter(i => i.uuid == '00000000-0000-0000-0000-000000000005')
                            .map(i => i.comment),
                    },
                    {
                        name: 'Коммутаторы',
                        file: 'switches',
                        comment: this.getTypeDevices
                            .filter(i => i.uuid == '00000000-0000-0000-0000-000000000004')
                            .map(i => i.comment),
                    },
                ],
            });
        },
        /** Добавление пользовательских комментариев
         *
         * @param i
         */
        userComment(i) {
            switch (i.file) {
                case 'servers':
                    this.userCommentObj.servers = i.comment;
                    break;
                case 'storage':
                    this.userCommentObj.storage = i.comment;
                    break;
                case 'switches':
                    this.userCommentObj.switches = i.comment;
                    break;
            }
        },
        /** Запрос к серверу для получения типов устройств с комментариями
         *
         */
        requestServer() {
            if (this.userCommentObj.hasOwnProperty('servers')) {
                this.userTypeDevices({
                    comment: this.userCommentObj.servers,
                    uuid: '00000000-0000-0000-0000-000000000003',
                });
            }

            if (this.userCommentObj.hasOwnProperty('storage')) {
                this.userTypeDevices({
                    comment: this.userCommentObj.storage,
                    uuid: '00000000-0000-0000-0000-000000000005',
                });
            }

            if (this.userCommentObj.hasOwnProperty('switches')) {
                this.userTypeDevices({
                    comment: this.userCommentObj.switches,
                    uuid: '00000000-0000-0000-0000-000000000004',
                });
            }

            this.$store.dispatch('snackSuccess', 'Успешно отредактировано!');
        },
    },

    async mounted() {
        await this.requestTypeDevices();
        this.startRequest();
    },
};
</script>

<style scoped>
.inputTypeDevices {
    /* margin: 0;
  padding: 0; */
    width: 55em;
}
</style>
