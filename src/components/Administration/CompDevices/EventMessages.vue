<template>
    <v-container fluid>
        <v-data-table
            height="50vh"
            :headers="headers"
            :items="items"
            class="elevation-1 mt-5"
            dense
            item-key="code"
            hide-default-footer
        >
            <template v-slot:[`item.code`]="{ item }"> {{ item.code }} </template>
            <template v-slot:[`item.message`]="{ item }">
                {{ item.message }}
            </template>

            <template v-slot:[`item.danger`]="{ item }">
                <v-select
                    style="width: 15em"
                    persistent-hint
                    single-line
                    dense
                    outlined
                    hide-details
                    :items="itemsCmbBox"
                    v-model="selectCmbBox"
                >
                    <template v-slot:selection="data">
                        <v-avatar>
                            <v-icon left :color="warningIcons.color"> {{ warningIcons.icon }} </v-icon>
                        </v-avatar>
                        {{ data.item }}
                    </template>
                </v-select>
            </template>
        </v-data-table>

        <v-btn class="btn btn-success" style="left: 90%">Сохранить</v-btn>
    </v-container>
</template>

<script>
import { Constants } from '@/plugins/constants';

import { mapGetters } from 'vuex';

export default {
    data: () => ({
        selectCmbBox: Constants.EVENT_MESSAGES.CRITICAL.TEXT,
        itemsCmbBox: [
            Constants.EVENT_MESSAGES.CRITICAL.TEXT,
            Constants.EVENT_MESSAGES.ERROR.TEXT,
            Constants.EVENT_MESSAGES.WARNING.TEXT,
            Constants.EVENT_MESSAGES.INFORMATIONAL.TEXT,
        ],
        headers: [
            { text: 'Код события', value: 'code' },
            { text: 'Текст сообщения', value: 'message' },
            { text: 'Ур.серьезности', value: 'danger' },
        ],
        items: [
            {
                code: Constants.EVENT_MESSAGES.WARNING.CODE,
                message: 'Сервер не отвечает на запросы',
                danger: Constants.EVENT_MESSAGES.WARNING.TEXT,
            },
            {
                code: Constants.EVENT_MESSAGES.INFORMATIONAL.CODE,
                message: 'Сервер не отвечает на запросы',
                danger: Constants.EVENT_MESSAGES.INFORMATIONAL.TEXT,
            },
            {
                code: 'ffXX3323', // Дубликат Constants.EVENT_MESSAGES.WARNING.CODE,
                message: 'Сервер не отвечает на запросы',
                danger: Constants.EVENT_MESSAGES.WARNING.TEXT,
            },
        ],
    }),
    methods: {},
    computed: {
        ...mapGetters(['getStatuses']),

        warningIcons() {
            switch (this.selectCmbBox) {
                case Constants.EVENT_MESSAGES.CRITICAL.TEXT:
                    return this.getStatuses[Constants.CODE_STATUSES.CODE_STATUSES_4];
                case Constants.EVENT_MESSAGES.ERROR.TEXT:
                    return this.getStatuses[Constants.CODE_STATUSES.CODE_STATUSES_3];
                case Constants.EVENT_MESSAGES.WARNING.TEXT:
                    return this.getStatuses[Constants.CODE_STATUSES.CODE_STATUSES_3];
                case Constants.EVENT_MESSAGES.INFORMATIONAL.TEXT:
                    return this.getStatuses[Constants.CODE_STATUSES.CODE_STATUSES_7];
            }
        },
    },
};
</script>

<style></style>
