<template>
    <v-card class="mx-auto notification">
        <v-navigation-drawer permanent width="700px">
            <v-app-bar dense flat fixed width="695px">
                <div>Панель уведомлений</div>

                <v-spacer></v-spacer>

                <v-btn icon @click="$store.dispatch('changeNotificationVisible')">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-app-bar>

            <v-list dense class="mt-10">
                <v-list-item
                    v-for="(item, idx) in items"
                    :key="idx"
                    link
                    @click="pushToGraph(item.deviceUuid, idx, item)"
                >
                    <v-list-item-icon>
                        <v-badge dot overlap left :color="Constants.STYLE.SUCCESS" :value="item.show">
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-badge>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title style="font-size: 10px">
                            <div>
                                {{ `${item.date} - ip: ${item.ip}. ${item.compName} - ${item.parameter}.` }}
                                <b class="red--text">
                                    {{ `Превышение на ${item.currentValue - item.thresholdValue}` }}
                                </b>
                                {{ `Порог: ${item.thresholdValue} ${item.unit}` }}
                            </div>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <template v-slot:append>
                <div class="pa-2">
                    <v-btn small block outlined @click="$store.commit('removeDotAll')">Отметить все</v-btn>
                </div>
            </template>
        </v-navigation-drawer>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { Constants } from '@/plugins/constants';

export default {
      data: () => ({ Constants }),
    computed: {
        ...mapGetters({ items: 'getNotificationItems' }),
    },

    methods: {
        /** Обновление графика мониторинга
         *
         * @param uuid
         * @param idx
         * @param compName
         * @param parameter
         * @param unixDate
         */
        pushToGraph(uuid, idx, { compName, parameter, unixDate }) {
            setTimeout(() => {
                this.$store.commit('setSelectedCompAndParam', { compName, parameter, unixDate });
            }, 100);

            this.$store.dispatch('changeNotificationVisible');
            this.$store.commit('removeDot', idx);

            this.$router.push('//monitoring/equipment/device_cnarts?uuid=8e1c1f10-21e9-4d16-a1b6-ff16e10b773d');
            setTimeout(() => {
                this.$router.push(`/monitoring/equipment/device_charts?uuid=${uuid}`);
            }, 200);
        },
    },
};
</script>

<style>
.notification {
    position: absolute !important;
    top: 10px !important;
    right: 10px !important;
    height: 500px !important;
    z-index: 10000 !important;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
}
</style>
