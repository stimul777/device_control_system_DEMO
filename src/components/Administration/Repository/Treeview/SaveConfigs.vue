<template>
    <v-list-item @click="selectedTabConfigs">
        <v-list-item-icon>
            <v-icon>{{ 'mdi-content-copy' }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
            <v-list-item-title v-text="items.name"></v-list-item-title>
        </v-list-item-content>
    </v-list-item>
</template>

<script>
import Templates from '../../CompDevices/Templates/Templates';
import { mapGetters } from 'vuex';

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
        selectedTabConfigs() {
            const obj = { dataTable: this.dataTable, showTable: true, nameTreview: 'saveConfigs' };

            this.$emit('transferDataTable', obj);
        },
    },
    computed: {
        ...mapGetters(['getItemsMenuSaveConfigs']),
    },
    mounted() {
        this.items = this.getItemsMenuSaveConfigs;
    },
};
</script>

<style></style>
