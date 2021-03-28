<template>
    <v-col sm="3" md="3">
        <v-treeview
            v-show="showCustomTasks"
            v-model="tree"
            :open="open"
            :items="itemsTreeView"
            :active.sync="active"
            activatable
            item-key="name"
            open-on-click
            :color="Constants.STYLE.SUCCESS"
            transition
        >
            <template v-slot:prepend="{ item, open }">
                <v-icon v-if="!item.file">{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
                <v-icon v-else>{{ files[item.file] }}</v-icon>
            </template>
        </v-treeview>
    </v-col>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    // Tree View custom tasks
    data: () => ({
        Constants,
        active: [0],
        showCustomTasks: true,
        open: ['public'],
        selectedTable: [],
        files: {
            template: 'mdi-file-document-outline',
            action: 'mdi-menu-right-outline',
        },
        tree: [],
        itemsTreeView: [
            {
                name: 'Серверы',
                children: [
                    {
                        name: 'HPE',
                        children: [
                            {
                                name: 'ProLiant DL',
                                file: 'template',
                            },
                            {
                                name: 'ProLiant DL-2',
                                file: 'template',
                            },
                        ],
                    },
                    {
                        name: 'IBM',
                        children: [
                            {
                                name: 'test',
                            },
                        ],
                    },
                ],
            },
            {
                name: 'Сетевые хранилища',
            },
            {
                name: 'Коммутаторы',
            },
        ],
    }),
};
</script>

<style></style>
