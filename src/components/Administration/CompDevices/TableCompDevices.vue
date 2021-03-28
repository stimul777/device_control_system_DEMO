<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" sm="12" md="12">
                <v-simple-table dense height="25em">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">Параметр</th>
                                <th class="text-left">Пороговое значение</th>
                                <th class="text-left">Единица измерения</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in tableCompProps.monitoringProfile">
                                <td style="width: 70%">{{ item.name }}</td>
                                <td>
                                    <v-text-field
                                        style="width: 50px"
                                        v-model="item.thresholdValue"
                                        :disabled="item.disabled"
                                    ></v-text-field>
                                </td>
                                <td>{{ item.parameterType.unitCaption }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
        <v-btn class="btn btn-success" style="left: 90%; top: 10%" :disabled="btnSave" @click="saveComponent()">
            <span v-show="!btnLoader">Сохранить</span>
            <v-progress-circular
                indeterminate
                :color="Constants.STYLE.SUCCESS"
                size="20"
                v-show="btnLoader"
            ></v-progress-circular>
        </v-btn>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import { Constants } from '@/plugins/constants';

export default {
    props: {
        tableCompProps: {},
    },
    data: () => ({
        Constants,
        allCheckboxModel: false,
        disabledCheckbox: false,
        dataCheck: '',
        sendRequestObj: [],
        btnSave: false,
        btnLoader: false,
    }),

    methods: {
        ...mapActions(['patchCompParam']),

        /** Кнопка "сохранить"
         *
         * @returns {Promise<void>}
         */
        async saveComponent() {
            this.btnSave = this.btnLoader = true;

            let arrSaveServer = [];
            this.tableCompProps &&
                this.tableCompProps.monitoringProfile.forEach(i =>
                    arrSaveServer.push({
                        uuid: i.uuid,
                        thresholdValue: Number(i.thresholdValue),
                    }),
                );

            /** Отправка на сервер параметров компонентов:
             *
             */
            this.patchCompParam(arrSaveServer)
                .then(() => this.$store.dispatch('snackSuccess', 'Параметры компонента успешно изменены!'))
                .then(() =>
                    setTimeout(() => {
                        this.btnSave = false;
                        this.btnLoader = false;
                    }, 2000),
                );
        },
    },
};
</script>
