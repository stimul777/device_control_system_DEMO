<template>
    <v-container v-if="adminCards">
        <ItemCards :cards="adminCards.base" />
        <ItemCards :cards="adminCards.extra" />
    </v-container>
</template>

<script>
import ItemCards from '@/components/app/ItemCards';
import { adminCards as aCards } from '@/backbones/cards.menu';
import { Constants } from '@/plugins/constants';

export default {
    components: {
        ItemCards,
    },

    data: () => ({
        adminCards: null,
    }),

    computed: {
        userRole() {
            return this.$store.getters['auth/getUserRole'];
        },

        roleClaims() {
            return this.$store.getters['auth/getRoleClaims'];
        },
    },

    mounted() {
        /** Убрать карточку "Права доступа"
         *
         * @type {any}
         */
        // this.userRole !== 'SuperAdmin' &&
        this.adminCards = JSON.parse(JSON.stringify(aCards));

        if (this.roleClaims.find(cl => cl === Constants.CLAIMS.R_ADMINISTRATION_ACCESS)) {
            this.adminCards.base = this.adminCards.base.filter(card => card.name !== 'Права доступа');
        }
    },
};
</script>
