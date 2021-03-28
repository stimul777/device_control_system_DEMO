<template>
    <v-list-item @click="selectedTabScript">
        <v-list-item-icon>
            <v-icon>{{ ' mdi-script-text-outline' }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
            <v-list-item-title v-text="items.name"></v-list-item-title>
        </v-list-item-content>
    </v-list-item>
</template>

<script>
import Templates from '../../CompDevices/Templates/Templates';
import { mapActions, mapGetters } from 'vuex';

export default {
    components: { Templates },
    data: () => ({
        initiallyOpen: ['public'],
        files: {
            png: 'mdi-file-image',
        },
        nameScript: '',
        tree: [],
        items: [],
        active: [],
    }),
    methods: {
        selectedTabScript() {
            const obj = { dataTable: this.dataTable, showTable: true, nameTreview: 'script' };

            this.$emit('transferDataTable', obj);
        },
    },
    computed: {
        ...mapGetters(['getItemsMenuPlaybooks']),
    },
    mounted() {
        this.items = this.getItemsMenuPlaybooks;
        this.$store.dispatch('fillingTableSoft');
        this.$store.dispatch('requestOsItems');
    },
};
</script>

<style scoped></style>
