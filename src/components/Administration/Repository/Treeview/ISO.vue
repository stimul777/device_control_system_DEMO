<template>
    <v-list-item @click="selectTabISO">
        <v-list-item-icon>
            <v-icon>{{ 'mdi-linux' }}</v-icon>
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
        activTab: [
            {
                name: 'Каталог ISO-образов',
            },
        ],
        files: {
            png: 'mdi-file-image',
        },
        tree: [],
        items: {
            name: 'Каталог ISO-образов',
        },
    }),

    methods: {
        selectTabISO() {
            const obj = { dataTable: this.dataTable, showTable: true, nameTreview: 'ISO', key: this.keyItem };
            this.$emit('transferDataTable', obj);
        },
    },
    watch: {
        selectOff() {
            // console.log('PROPS!!!ISO', this.selectOff);
            return (this.activTab = []);
        },
    },
    mounted() {
        this.selectTabISO();
    },
};
</script>
