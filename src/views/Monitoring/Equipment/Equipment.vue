<template>
    <v-container>
        <Loader v-if="!monitoringCards.equipment.types.length" />
        <template v-else>
            <ItemCards :cards="monitoringCards.equipment.types" />
            <ItemCards :cards="monitoringCards.equipment.racks" noneMarginTop />
            <ItemCards :cards="monitoringCards.equipment.groups" noneMarginTop />
            <ItemCards :cards="monitoringCards.equipment.angles" />
        </template>
    </v-container>
</template>

<script>
import ItemCards from '@/components/app/ItemCards';
import { monitoringCards, loadEquipmentItems } from '@/backbones/cards.menu';

export default {
    components: {
        ItemCards,
    },

    data: () => ({
        monitoringCards,
    }),

    mounted() {
        loadEquipmentItems();
    },
};
</script>
