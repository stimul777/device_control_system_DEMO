<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" lg="12" md="12">
                <v-simple-table dense>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th>Методы аутентификации</th>
                                <th>Второй фактор</th>
                                <th>Описание</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Только локальная</td>
                                <td style="width: 12%">
                                    <v-select
                                        :items="itemsSelect"
                                        item-value="value"
                                        item-text="name"
                                        multiple
                                        v-model="select"
                                        return-object
                                    ></v-select>
                                </td>
                                <td>
                                    Аутентификация пользователей выполняется путем поиска локальной учетной записи
                                    пользователя
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        itemsSelect: [
            { name: 'Email', value: 'email' },
            { name: 'SMS', value: 'sms' },
            { name: 'Отсутсвует', value: 'none' },
        ],
        select: [{ name: 'Отсутсвует', value: 'none' }],
    }),
    computed: {
        select() {
            return this.select;
        },
    },
};
</script>

<style></style>
