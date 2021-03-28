<template>
    <v-container fluid>
        <div class="d-flex justify-space-between align-center align">
            <span style="display: inline-block" class="my-4">Результаты поиска:</span>
            <!-- Пакетный режим -->
            <PackageAdding v-if="$store.getters.getIcmpResult.length > 1" @addAll="addAll" @changeMode="changeMode" />
            <!--  -->
        </div>

        <table class="table">
            <thead class="table-head">
                <tr class="table-head-title table-row">
                    <td>IP-адрес</td>
                    <td>Протоколы</td>
                    <td v-if="!roleClaims.find(cl => cl === 'c/Control')">Действия</td>
                </tr>
            </thead>
            <tbody>
                <tr class="table-row" v-for="(item, i) of icmpResult" :key="i">
                    <td>{{ item.ip }}</td>
                    <td class="td-data">
                        <TableProtocol v-for="(prot, j) of item.protocols" :key="j" :ip="item.ip" :prot="prot" />
                    </td>
                    <td v-if="!roleClaims.find(cl => cl === 'c/Control')">
                        <v-btn
                            class="btn btn-success"
                            @click="addDevice(i)"
                            :disabled="item.ipmiProcess"
                            v-if="!disableSingleAdd"
                        >
                            <v-progress-circular
                                indeterminate
                                color="#fff"
                                :size="20"
                                :width="3"
                                v-if="item.ipmiProcess"
                            ></v-progress-circular>
                            <span v-else>Добавить</span>
                        </v-btn>
                        <v-btn class="btn btn-cancel" @click="$store.commit('deleteIp', i)" :disabled="item.ipmiProcess"
                            >Удалить</v-btn
                        >
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Инициализация icmp -->
        {{ setIcmpResult }}
    </v-container>
</template>

<script>
export default {
    components: {
        TableProtocol: () => import('@/components/Control/Detection/TableProtocol'),
        PackageAdding: () => import('@/components/Control/Detection/PackageAdding'),
    },

    data: () => ({
        icmpResult: [],
        disableSingleAdd: false,
    }),

    methods: {
        /** Добавление девайса
         *
         * @param i
         * @returns {Promise<void>}
         */
        async addDevice(i) {
            this.$router.push({
                name: 'DetectionDevice',
                params: { icmpResult: [this.icmpResult[i]] },
            });
        },
        /** Добавить все девайсы
         *
         */
        addAll() {
            this.$router.push({
                name: 'DetectionDevice',
                params: { icmpResult: this.icmpResult },
            });
        },

        changeMode(mode) {
            mode === 1 ? (mode = true) : (mode = false);
            this.disableSingleAdd = mode;
        },
    },

    computed: {
        setIcmpResult() {
            this.icmpResult = this.$store.getters.getIcmpResult;
        },

        dataLength() {
            return this.$store.getters.getIcmpResult.length;
        },

        roleClaims() {
            return this.$store.getters['auth/getRoleClaims'];
        },
    },

    watch: {
        dataLength(len) {
            len <= 1 ? (this.disableSingleAdd = false) : null;
        },
    },
};
</script>

<style scoped>
.table {
    width: 100%;
    border-spacing: unset;
    border-bottom: 1px solid #dfdfdf;
}

.table-head {
    width: 100%;
}

.table-head-title {
    font-weight: 700;
    font-size: 14px;
}

.table-row {
    display: flex;
}

.tr-item:hover {
    background-color: #f1f1f1;
    transition: 0.1s;
}

tr:hover {
    background-color: #f6f6f6;
    transition: 0.05s;
}

.table-row > td {
    padding: 5px 15px;
    border-top: 1px solid #dfdfdf;
    border-right: 1px solid #dfdfdf;
}

.table-row > td:nth-child(1) {
    flex: 0 0 20%;
    display: flex;
    align-items: center;
}
.table-row > td:nth-child(2) {
    flex-basis: 65%;
    display: flex;
    align-items: center;
}
.table-row > td:nth-child(3) {
    flex-basis: 300px;
    border-right: none;
}

.td-data {
    display: flex;
    flex-direction: column;
}

.align {
    align-items: flex-end !important;
}
</style>
