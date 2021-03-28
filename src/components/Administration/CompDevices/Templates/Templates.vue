<template>
    <v-row>
        <v-col sm="12" md="12">
            <v-treeview
                activatable
                :color="Constants.STYLE.SUCCESS"
                dense
                transition
                :items="treeViewTemplates"
                item-key="name"
                open-on-click
                :open.sync="openTab"
                :load-children="fetchTemplates"
                :active.sync="active"
                @update:open="btnAddShow = !btnAddShow"
            >
                <template v-slot:prepend="{ item, open }">
                    <v-icon v-if="!item.file">{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
                    <v-icon v-else>{{ files[item.file] }}</v-icon>
                </template>
                <template v-slot:[`prepend`]="{ item }">
                    <div @click="selectedActiv(item)">
                        <template v-if="item.name !== 'Шаблоны' && item.name !== 'Добавить'">
                            <v-row>
                                <v-text-field
                                    style="width: 200px"
                                    :disabled="item.disabled"
                                    v-model="item.name"
                                ></v-text-field>

                                <v-btn class="btn-icon-group mt-5" small rounded depressed @click="addTemplat(item)">
                                    <v-icon>mdi-plus-box</v-icon>
                                </v-btn>
                                <v-btn
                                    class="btn-icon-group mt-5"
                                    type="button"
                                    small
                                    rounded
                                    depressed
                                    v-show="!item.showBtn"
                                    @click="editTemplate(item)"
                                >
                                    <v-icon>mdi-file-edit-outline</v-icon>
                                </v-btn>
                                <v-btn
                                    class="btn-icon-group mt-5"
                                    v-show="item.showBtn"
                                    type="button"
                                    small
                                    rounded
                                    depressed
                                    @click="saveTemplate(item)"
                                >
                                    <v-icon>mdi-content-save-settings</v-icon>
                                </v-btn>
                                <v-btn
                                    class="btn-icon-group mt-5"
                                    type="button"
                                    small
                                    rounded
                                    depressed
                                    @click="deleteTemplate(item)"
                                >
                                    <v-icon>mdi-minus-circle-outline</v-icon>
                                </v-btn>
                            </v-row>
                        </template>
                    </div>
                </template>
            </v-treeview>
            <v-btn class="btn-add" style="left: 25%" v-show="btnAddShow">+ Добавить</v-btn>
        </v-col>
    </v-row>
</template>
<script>
import { mapActions } from 'vuex';
import { Constants } from '@/plugins/constants';

export default {
    data: () => ({
        Constants,
        openTab: [],
        active: [],
        files: {},
        btnAddShow: true,
        itemStor: {},
        treeViewTemplates: [
            {
                name: 'Шаблоны',
                children: [
                    {
                        name: 'Шаблон-1',
                        file: 'template',
                        disabled: true,
                        showBtn: false,
                    },
                    {
                        name: 'Шаблон-2',
                        file: 'template',
                        disabled: true,
                        showBtn: false,
                    },
                ],
            },
        ],
    }),
    methods: {
        ...mapActions(['snackError']),

        fetchTemplates(item) {
            console.log('ITEM!!!', item);
        },

        addTemplat(item) {
            if (item.name === 'Новый шаблон') {
                return this.snackError('Заполните шаблон!');
            }

            this.treeViewTemplates[0].children.unshift({
                name: 'Новый шаблон',
                file: 'template',
                disabled: false,
                showBtn: true,
            });
        },

        deleteTemplate(item) {
            this.treeViewTemplates[0].children.splice(this.treeViewTemplates[0].children.indexOf(item), 1);
        },

        saveTemplate(item) {
            item.showBtn = !item.showBtn;
            item.disabled = !item.disabled;
        },

        editTemplate(item) {
            item.showBtn = !item.showBtn;
            item.disabled = !item.disabled;
        },

        selectedActiv(i) {
            console.log('Click: ', i);
            this.$emit('clickTemplates', i);
        },

        test(item) {
            console.log('клик по элементу', item);
        },
    },

    computed: {
        selected() {
            return this.active;
        },
    },

    watch: {
        selected: 'selectedActiv',
    },
};
</script>

<style></style>
