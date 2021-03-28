<template>
    <div>
        <v-btn-toggle v-model="addingMode" mandatory dense>
            <v-btn class="btn-mode">Одиночное добавление</v-btn>
            <v-btn class="btn-mode">Пакетное добавление</v-btn>
        </v-btn-toggle>
        <div class="panel mb-1 pb-2 pt-2 pl-1" v-if="addingMode === 1">
            <div class="panel-top">
                <div class="panel-left">
                    <div class="panel-control" v-for="(prot, i) of prots" :key="prot.name">
                        <a class="mr-1 action">
                            <!-- Loading -->
                            <div class="loading" v-if="prot.testing">
                                <v-progress-circular
                                    indeterminate
                                    color="#fff"
                                    :size="12"
                                    :width="2"
                                ></v-progress-circular>
                            </div>
                            <!-- Start test -->

                            <v-icon
                                size="24px"
                                color="#a9a9a9"
                                v-else-if="prot.test === 'none' && !prot.testing && statusProtocolsCount[i] === 0"
                                @click="startProtocolTest(prot, i)"
                            >
                                mdi-play-circle
                            </v-icon>
                            <!-- Test ok -->
                            <v-icon
                                size="24px"
                                color="#00be6e"
                                v-else-if="statusProtocolsCount[i] === icmpData.length"
                                @click="clearProtocolTest(prot)"
                            >
                                mdi-check-circle
                            </v-icon>
                            <!-- Test middle-ok -->
                            <v-icon
                                size="24px"
                                color="#F57F17"
                                v-else-if="statusProtocolsCount[i] > 0 && statusProtocolsCount[i] < icmpData.length"
                                @click="clearProtocolTest(prot)"
                            >
                                mdi-check-circle
                            </v-icon>
                            <!-- Test bad -->
                            <v-icon
                                size="24px"
                                :color="Constants.STYLE.SUCCESS"
                                v-else-if="statusProtocolsCount[i] === 0 && prot.test !== 'none'"
                                @click="clearProtocolTest(prot)"
                            >
                                mdi-close-circle
                            </v-icon>
                        </a>
                        <span>{{ prot.name }}</span>
                    </div>
                </div>
                <div class="panel-right">
                    <div class="panel-status" v-for="(s, i) of statusProtocolsCount" :key="i">
                        <span
                            :style="{
                                color:
                                    statusProtocolsCount[i] === icmpData.length
                                        ? '#00be6e'
                                        : statusProtocolsCount[i] === 0
                                        ? '#e21a1a'
                                        : '#F57F17',
                            }"
                            >Тест: {{ statusProtocolsCount[i] }} из {{ icmpData.length }}</span
                        >
                    </div>
                </div>
            </div>
            <div class="panel-bottom">
                <hr />
                <div class="mb-1">Добавление протоколов:</div>
                <div>
                    <button class="btn btn-success btn-opt" @click="$emit('addAll')" :disabled="disableAdd">
                        Добавить все
                    </button>
                    <button class="btn btn-cancel btn-opt" @click="$store.commit('clearIcmp')">Удалить все</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    data: () => ({
        Constants,
        addingMode: 0,
        prots: [],
        disableAdd: false,
    }),

    watch: {
        addingMode(v) {
            this.$emit('changeMode', v);
        },

        protsTesting(arrStatusTesting) {
            this.disableAdd = !!arrStatusTesting.some(v => v);
        },
    },

    computed: {
        icmpData() {
            return this.$store.getters.getIcmpResult;
        },

        protsTesting() {
            return this.prots.map(v => v.testing);
        },

        statusProtocolsTest() {
            return this.icmpData.map(v => v.protocols.map(v => ({ name: v.name, test: v.test })));
        },
        statusProtocolsCount() {
            const arr = this.statusProtocolsTest.map(v => v.map(v => v.test));
            let reverseArr = [];

            for (let i = 0; i < arr[0].length; i++) {
                let mediarr = [];
                for (let j = 0; j < arr.length; j++) {
                    mediarr.push(arr[j][i] === 'ok' ? 1 : 0);
                }
                reverseArr.push(mediarr.reduce((a, b) => a + b));
            }
            return reverseArr;
        },
    },

    methods: {
        /** Запуск тестирования протокола
         *
         * @param prot
         * @param idx
         * @returns {Promise<void>}
         */
        async startProtocolTest(prot, idx) {
            prot.testing = true;
            prot.test = '';
            this.$store.getters.getIcmpResult.forEach(v => (v.protocols[idx].testing = true));
            for (let i = 0; i < this.$store.getters.getIcmpResult.length; i++) {
                const sendData = {
                    prot: this.$store.getters.getIcmpResult[i].protocols[idx],
                    ip: this.$store.getters.getIcmpResult[i].ip,
                };
                await this.$store.dispatch('startTestProtocols', sendData);
            }
            prot.testing = false;
        },
        /** Очищение статуса проходил ли тестировани протокол
         *
         * @param prot
         */
        clearProtocolTest(prot) {
            if (!prot.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_01)) {
                this.icmpData.forEach(v => {
                    v.protocols.find(v => v.name === prot.name).test = Constants.STATUS_TEXT.NONE;
                    prot.test = Constants.STATUS_TEXT.NONE;
                });
            }
        },
    },

    mounted() {
        this.prots = JSON.parse(JSON.stringify(this.$store.getters.getIcmpResult[0].protocols));
        // this.icmpResult = this.$store.getters.getIcmpResult
    },
};
</script>

<style scoped>
.btn-mode {
    text-transform: unset !important;
    letter-spacing: unset !important;
}
.panel {
    width: 100%;
    border-radius: 0 0 10px 10px;
    position: relative;
    top: 0;
    margin-bottom: 10px;
    opacity: 1;
    background-color: #f6f6f6;
    font-size: 14px;
}

.panel-top {
    display: flex;
}

.panel-bottom {
    margin-top: 10px;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
}

.panel-control {
    display: flex;
}

.panel-left {
    flex: 0 1 50%;
}
.panel-right {
    flex: 0 1 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.panel-status {
    font-weight: 500;
}

.loading {
    background-color: #a9a9a9;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 2px;
}

.action {
    display: inline-flex;
    justify-content: center;
    align-items: center;
}

.btn-opt {
    margin: 0 !important;
    margin-right: 10px !important;
}
</style>
