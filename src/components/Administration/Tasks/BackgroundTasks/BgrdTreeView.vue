<template>
    <div>
        <v-treeview
            :items="backgroundTasks"
            activatable
            item-key="id"
            open-on-click
            :color="Constants.STYLE.SUCCESS"
            return-object
            hoverable
            :active.sync="activ"
            @update:active="selectTab"
        >
            <template v-slot:prepend="{ item }">
                <v-icon>mdi-clipboard-list</v-icon>
            </template>
            <template slot-scope="{ item }">
                <a @click="selectTab(item)"></a>
            </template>
        </v-treeview>
    </div>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    data: () => ({
        Constants,
        activ: [{ name: 'Опрос доступности оборудования', id: 'pollingDevices' }],
        backgroundTasks: [
            {
                name: 'Опрос доступности оборудования',
                id: 'pollingDevices',
            },
            {
                name: 'Опрос доступности компонентов оборудования',
                id: 'pollingDevicesComponents',
            },
            {
                name: 'Сбор сообщений о событиях',
                id: 'errorMessages',
            },
        ],
    }),

    methods: {
        /** Выбор вкладки
         *
         * @param item
         */
        selectTab(item) {
            this.$emit('selectTabEmit', item);
        },
    },

    mounted() {
        this.selectTab([
            {
                id: 'pollingDevices',
                name: 'Опрос доступности оборудования',
            },
        ]);
    },
};
</script>

<style></style>
