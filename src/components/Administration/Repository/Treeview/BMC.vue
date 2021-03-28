<template>
    <v-treeview v-model="tree" :open="initiallyOpen" :items="items" activatable item-key="name" open-on-click>
        <template v-slot:prepend="{ item, open }">
            <v-icon v-if="!item.file">{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
            <v-icon v-else>{{ files[item.file] }}</v-icon>
        </template>
    </v-treeview>
</template>

<script>
export default {
    data: () => ({
        initiallyOpen: ['public'],
        files: {
            png: 'mdi-file-image',
        },
        tree: [],
        items: [
            {
                name: 'Версии BMC',
                children: [
                    {
                        name: 'static',
                        children: [
                            {
                                name: 'file',
                                file: 'png',
                            },
                        ],
                    },
                ],
            },
        ],
    }),
};
</script>

<style></style>
