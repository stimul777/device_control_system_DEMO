<template>
    <v-container style="padding:0" fluid>
        <v-row no no-gutters>
            <v-col sm="12" md="12" lg="12" xl="12">
                <v-data-table
                    :headers="headers"
                    :items="itemsTable"
                    :items-per-page="100"
                    class="elevation-1"
                    :hide-default-footer="true"
                    item-key="uuid"
                    dense
                    loading-text="Загрузка данных..."
                    loader-height="2"
                    no-data-text="Нет данных"
                    height="50vh"
                    fixed-header
                    disable-pagination
                >
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon small class="mr-2 iconTable">mdi-pencil</v-icon>
                        <v-icon small class="mr-2 iconTable">mdi-minus</v-icon>
                    </template>
                </v-data-table>
            </v-col>
            <v-col style="margin-left: 85%">
                <v-btn class="btn btn-success" color="gray" @click="cancel()">Отмена</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        // show
        radioBtnShow: true,
        radio: true,

        headers: [
            { text: 'Название', value: 'name' },
            { text: 'Значение', value: 'value' },
            { text: 'Описание', value: 'description' },
            { text: '', value: 'actions' },
        ],
        itemsTable: [
            {
                name: '-',
                value: '-',
                description: '-',
            },
        ],
    }),
    methods: {
        cancel() {
            this.$emit('cancel');
        },
    },
};
</script>
