<template>
    <v-container fluid>
        <div class="mb-3 d-flex justify-end" :class="{ 'justify-space-between': isQuest }">
            <v-tabs :color="Constants.STYLE.SUCCESS" style="width: 500px" v-if="isQuest">
                <v-tab>Состояние задания</v-tab>
                <v-tab disabled>Запланированные задания</v-tab>
                <v-tabs-slider :color="'tabs-slider-success'"></v-tabs-slider>
            </v-tabs>
            <div class="btn-groups">
                <v-btn icon class="mr-2">
                    <v-icon color="black">mdi-reload</v-icon>
                </v-btn>
                <v-btn icon class="mr-2">
                    <v-icon color="black">mdi-filter</v-icon>
                </v-btn>
                <v-btn icon class="mr-2">
                    <v-icon color="black">mdi-download</v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon color="black">mdi-cog</v-icon>
                </v-btn>
            </div>
        </div>

        <v-data-table
            dense
            fixed-header
            loading-text="Данные загружаются с сервера"
            no-data-text="Данных нет"
            :loading="loading"
            :headers="headers"
            :items="items"
            :items-per-page="30"
            item-key="name"
            class="elevation-0"
        ></v-data-table>
    </v-container>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    data: () => ({ Constants }),
    props: {
        headers: {
            type: Array,
            required: true,
        },

        items: {
            type: Array,
            required: true,
        },

        isQuest: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    computed: {
        loading() {
            return !!(this.headers.length && this.items.length);
        },
    },
};
</script>
