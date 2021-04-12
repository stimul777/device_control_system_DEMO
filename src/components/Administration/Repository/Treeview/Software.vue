<template>
    <v-list-item @click="selectTabSoftware">
        <v-list-item-icon>
            <v-icon>{{ 'mdi-microsoft-onenote' }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
            <v-list-item-title v-text="items.name"></v-list-item-title>
        </v-list-item-content>
    </v-list-item>
</template>

<script>
export default {
    props: { selectOff: {}, keyItem: Number },

    data: () => ({
        // активная вкладка
        activTab: [],
        files: {
            png: 'mdi-file-image',
        },
        tree: [],
        items: {
            name: 'Каталог ПО',
        },
    }),

    methods: {
        selectTabSoftware() {
            const obj = { dataTable: this.dataTable, showTable: true, nameTreview: 'software', key: this.keyItem };
            this.$emit('transferDataTable', obj);
        },
    },

    watch: {
        selectOff() {
            return (this.activeTab = []);
        },
    },
};
</script>

<style></style>
