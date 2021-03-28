<template>
    <v-container>
        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th>Оборудование</th>
                        <th>Компонент</th>
                        <th>Параметр</th>
                        <th>Назначеннеы группировки</th>
                        <th></th>
                        <th><v-checkbox small></v-checkbox></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in options" :key="options.groupings">
                        <td>
                            <v-select
                                style="width: 15em"
                                persistent-hint
                                single-line
                                dense
                                hide-details
                                :items="item.equipment"
                            >
                            </v-select>
                        </td>
                        <td>
                            <v-select style="width: 15em" persistent-hint single-line dense hide-details> </v-select>
                        </td>
                        <td>
                            <v-select style="width: 15em" persistent-hint single-line dense hide-details> </v-select>
                        </td>
                        <td>Назначенные группировки текстексттексттекст</td>
                        <td style="width: 30px">
                            <v-btn small rounded depressed class="btn-icon-group" @click="editItem(item)">
                                <v-icon>mdi-pencil</v-icon></v-btn
                            >
                        </td>
                        <td style="width: 30px"><v-checkbox small></v-checkbox></td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
        <v-btn class="btn btn-success" style="left: 90%">Сохранить</v-btn>
    </v-container>
</template>
<script>
export default {
    data() {
        return {
            options: [
                {
                    equipment: ['fdgdg-', 'fdgdg-', 'fdgdg-', 'fdgdg-'],
                    component: 'iiidgdgdg',
                    parameter: 159,
                    groupings: 4343,
                },
                {
                    equipment: ['fdgdg-', 'fdgdg-', 'fdgdg-', 'fdgdg-'],
                    component: 'iiidgdgdg',
                    parameter: 159,
                    groupings: 4343,
                },
                {
                    equipment: ['fdgdg-', 'fdgdg-', 'fdgdg-', 'fdgdg-'],
                    component: 'iiidgdgdg',
                    parameter: 159,
                    groupings: 4343,
                },
                {
                    equipment: ['fdgdg-', 'fdgdg-', 'fdgdg-', 'fdgdg-'],
                    component: 'iiidgdgdg',
                    parameter: 159,
                    groupings: 4343,
                },
                {
                    equipment: ['fdgdg-', 'fdgdg-', 'fdgdg-', 'fdgdg-'],
                    component: 'iiidgdgdg',
                    parameter: 159,
                    groupings: 4343,
                },
            ],
        };
    },

    methods: {
        editItem(i) {
            this.$emit('CallEditTableGroups', true);
        },
    },
};
</script>
