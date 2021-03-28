<template>
    <v-container>
        <ItemCards :cards="monitoringCards.main" />
    </v-container>
</template>

<script>
import ItemCards from '@/components/app/ItemCards';
import { monitoringCards } from '@/backbones/cards.menu';

export default {
    components: {
        ItemCards,
    },

    data: () => ({
        monitoringCards,
    }),
};
</script>
