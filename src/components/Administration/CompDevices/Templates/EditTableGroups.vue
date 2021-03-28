<template>
    <v-container fluid>
        <v-row>
            <v-col cols="10" sm="8" md="10">
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th>Группировка</th>
                                <th><v-checkbox small></v-checkbox></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in groups" :key="item.name">
                                <td>{{ item.name }}</td>
                                <td><v-checkbox small v-model="item.checkbox"></v-checkbox></td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
        <v-btn class="btn btn-cancel" style="left: 70%" @click="backComponent()">Отмена</v-btn>
        <v-btn class="btn btn-success" style="left: 70%">Сохранить</v-btn>
    </v-container>
</template>
<script>
export default {
    data: () => ({
        groups: [
            {
                name: 'Ракурс-1',
                checkbox: true,
            },
            {
                name: 'Ракурс-2',
                checkbox: true,
            },
            {
                name: 'Ракурс-3',
                checkbox: true,
            },
            {
                name: 'Ракурс-4',
                checkbox: true,
            },
            {
                name: 'Ракурс-5',
                checkbox: true,
            },
            {
                name: 'Ракурс-6',
                checkbox: true,
            },
        ],
    }),
    methods: {
        backComponent() {
            this.$emit('CallEditTableGroups', false);
        },
    },
};
</script>
