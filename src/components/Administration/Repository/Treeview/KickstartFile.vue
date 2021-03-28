<template>
    <v-list-item @click="selectTabKickstart">
        <v-list-item-icon>
            <v-icon>{{ ' mdi-rocket-launch ' }}</v-icon>
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
    props: ['keyItem'],
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
        ...mapActions(['addNewItemKickstart', 'removeKickstart', 'editNameKickstartInput', 'requestAllKickstart']),
        selectTabKickstart() {
            const obj = { dataTable: this.dataTable, showTable: true, nameTreview: 'kickstart', key: this.keyItem };
            this.$emit('transferDataTable', obj);
        },

        selectedScript(item) {
            this.$emit('addSettingsPlaybooks', item);
        },
    },
    computed: {
        ...mapGetters(['getItemsMenuKickstart', 'getAllKickstart']),
    },
    mounted() {
        this.items = this.getItemsMenuKickstart;

        this.$store.dispatch('requestOsItems');
    },
};
</script>

<style scoped></style>
