<template>
    <v-container>
        <ItemCards :cards="controlCards.base" />
        <ItemCards :cards="controlCards.extra" />
        <ItemCards :cards="controlCards.userProfiles" />
    </v-container>
</template>

<script>
import ItemCards from '@/components/app/ItemCards';
import { controlCards } from '@/backbones/cards.menu';

export default {
    components: {
        ItemCards,
    },

    data: () => ({
        controlCards,
    }),
};
</script>
