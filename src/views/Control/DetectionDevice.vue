<template>
    <v-container fluid>
        <div v-if="tableData">
            <EditDevice
                v-if="editingDevice"
                :rowData="tableData[edIdx]"
                :protocols="$route.params.icmpResult[edIdx].protocols"
                :typesData="typesData"
                :racksData="racksData"
                @cancelChange="cancelChange"
                @saveChange="saveChange"
            />
            <template v-else>
                <div>
                    <h2 class="device-title">Добавление устройств{{ tableData.length === 1 ? 'a' : null }}</h2>
                    <div class="device-subtitle">
                        <span v-if="tableData.length > 1">
                            IP-адреса: {{ tableData[0].ipAddress }} -
                            {{ tableData[tableData.length - 1].ipAddress }}
                        </span>
                        <span v-else>IP-адрес: {{ tableData[0].ipAddress }}</span>
                    </div>
                </div>
                <table class="device-table">
                    <thead class="device-head">
                        <tr>
                            <td>IP-адрес</td>
                            <td>SKU/Part №</td>
                            <td>Идентиф-р</td>
                            <td>Тип оборуд-ния</td>
                            <td>Произв-ль</td>
                            <td>Модель/Серия</td>
                            <td>Серийный №</td>
                            <td>Название</td>
                            <td>Стойка</td>
                            <td>Протоколы</td>
                            <td></td>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(item, idx) of tableData">
                            <template v-if="item.ipmiProcess">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <v-progress-circular
                                        :width="3"
                                        :color="Constants.STYLE.SUCCESS"
                                        indeterminate
                                    ></v-progress-circular>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </template>
                            <template v-else>
                                <td>{{ item.ipAddress }}</td>
                                <td>{{ item.productPartNumber }}</td>
                                <td>{{ item.identifier }}</td>
                                <td>
                                    <v-select
                                        clearable
                                        :items="typesData"
                                        item-text="name"
                                        item-value="uuid"
                                        v-model="item.deviceTypeUuid"
                                        persistent-hint
                                        single-line
                                        dense
                                        outlined
                                        hide-details
                                        style="max-width: 150px"
                                    ></v-select>
                                </td>
                                <td>{{ item.boardMfg }}</td>
                                <td>{{ item.productName }}</td>
                                <td>{{ item.nameofserial }}</td>
                                <td>{{ item.name }}</td>
                                <td>
                                    <v-select
                                        clearable
                                        :items="racksData"
                                        item-text="name"
                                        item-value="uuid"
                                        v-model="item.rackUUID"
                                        persistent-hint
                                        single-line
                                        dense
                                        outlined
                                        hide-details
                                        style="max-width: 150px"
                                    ></v-select>
                                </td>
                                <td>
                                    <div v-for="prot of item.protocols">{{ prot.name }}</div>
                                </td>
                                <td>
                                    <button class="btn-pencil" @click="editDevice(idx)">
                                        <v-icon dark size="20px">mdi-pencil</v-icon>
                                    </button>
                                </td>
                            </template>
                        </tr>
                    </tbody>
                </table>
                <div class="btn-group">
                    <v-btn class="btn btn-cancel" @click="$router.push('/control/detection')">Отмена</v-btn>
                    <v-btn class="btn btn-success" :disabled="disableAdd" @click="addDeviceAll">
                        {{ tableData.length === 1 ? 'Добавить' : 'Добавить все' }}
                    </v-btn>
                </div>
            </template>
        </div>
    </v-container>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    components: {
        EditDevice: () => import('@/components/Control/Detection/EditDevice.vue'),
    },
    data: () => ({
        Constants,
        tableData: null,

        types: [],
        racks: [],

        editingDevice: false,

        edIdx: 0,
    }),

    computed: {
        racksData() {
            return this.racks.map(v => ({ name: v.name, uuid: v.uuid }));
        },
        typesData() {
            return this.types.map(v => ({ name: v.name, uuid: v.uuid }));
        },
        disableAdd() {
            return this.tableData.map(rec => rec.ipmiProcess).find(v => v === true);
        },
    },

    methods: {
        /** Добавление устройств в систему
         *
         */
        addDeviceAll() {
            const cashTableData = JSON.parse(JSON.stringify(this.tableData));
            const postData = cashTableData.map(item => {
                delete item.ipmiProcess;
                delete item.isIpmiData;

                item.protocols = item.protocols.map(v => ({
                    protocolUUID: v.protocolUUID,
                }));
                return {
                    ...item,
                };
            });

            this.$load(async () => {
                await this.$api.devicesRacks.postDevicespack(postData);
                if (this.tableData.length > 1) {
                    this.$store.dispatch(
                        'snackSuccess',
                        `Добавлено ${postData.length} устройств в систему. Диапазон: ${this.tableData[0].ipAddress} - ${
                            this.tableData[this.tableData.length - 1].ipAddress
                        }`,
                    );
                } else {
                    this.$store.dispatch(
                        'snackSuccess',
                        `Устройство с ip ${this.tableData[0].ipAddress} добавлено в систему.`,
                    );
                }

                postData.forEach(item => {
                    this.$store.commit(
                        'deleteIp',
                        this.$store.getters.getIcmpResult.indexOf(
                            this.$store.getters.getIcmpResult.find(v => v.ip === item.ipAddress),
                        ),
                    );
                });

                this.$router.push('/control/detection');
            });
        },

        /** маппинг для построения элементов таблицы
         *
         */
        createDataForTable() {
            const icmpData = this.$route.params.icmpResult;

            this.tableData = icmpData.map(item => {
                const protocols = item.protocols
                    .filter(p => p.test === Constants.STATUS_TEXT.OK)
                    .map(v => ({
                        name: v.name,
                        protocolUUID: v.uuid,
                        login: v.login,
                        password: v.password,
                    }));

                let isIpmiData = false;
                if (protocols.some(v => v.protocolUUID.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_2))) {
                    isIpmiData = true;
                }

                let ipmiData = {
                    ipAddress: item.ip,
                    biosRevision: '', // v. BIOS
                    firmwareRevision: '', // v. BMC
                    boardMfg: '',
                    productName: '',
                    nameofserial: '',
                    productPartNumber: '',
                    identifier: '',
                    name: '',
                    deviceTypeUuid: '',
                    rackUUID: '',
                    protocols,
                    attributes: [],
                    macAddress: '', // mac
                    ipmiProcess: false,
                    isIpmiData,
                };

                if (protocols.some(v => v.protocolUUID.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_2))) {
                    const ipmiDataInv = {
                        ...ipmiData,
                        ipmiProcess: true,
                    };

                    this.$store.dispatch('startIpmi', {
                        ipmiData: ipmiDataInv,
                        mode: 'multiply-mode',
                    });

                    return ipmiDataInv;
                }
                return {
                    ...ipmiData,
                };
            });
        },
        /** Обновление данных о протоколах
         *
         * @returns {Promise<void>}
         */
        async updateProtocolsData() {
            const protocols = this.$route.params.icmpResult[this.edIdx].protocols
                .filter(p => p.test === Constants.STATUS_TEXT.OK)
                .map(v => ({
                    name: v.name,
                    protocolUUID: v.uuid,
                    login: v.login,
                    password: v.password,
                }));
            let currentRow = this.tableData[this.edIdx];
            currentRow.protocols = protocols;

            if (
                protocols &&
                protocols.some(v => v.protocolUUID.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_2)) &&
                !this.tableData[this.edIdx].isIpmiData
            ) {
                currentRow.ipmiProcess = true;
                const uuid = await this.$store.dispatch('uuidv4');

                const ipmiProtocol = protocols.find(v =>
                    v.protocolUUID.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_02),
                );

                const sendData = {
                    uuid,
                    type: 'request',
                    name: 'ipmi',
                    command: 'inv',
                    data: {
                        ip: currentRow.ipAddress,
                        login: ipmiProtocol.login,
                        password: ipmiProtocol.password,
                    },
                };

                const data = JSON.stringify(sendData);

                const connection = await ctx.getters.getConnectSocket;

                await connection.invoke('SendMessage', 'Front', data);

                connection.on('ReceiveMessage', async (name, message) => {
                    const response = JSON.parse(message);
                    if (response.status === '1') {
                        ctx.dispatch('snackError', `${ipDevice} - неверный логин или пароль у протокола IPMI v.2!`);
                        connection.off('ReceiveMessage');
                        currentRow.ipmiProcess = false;
                    } else {
                        connection.off('ReceiveMessage');

                        currentRow.biosRevision = response.data.biosRevision;
                        currentRow.boardMfg = response.data.boardMfg;
                        currentRow.firmwareRevision = response.data.firmwareRevision;
                        currentRow.productName = response.data.productName;
                        currentRow.productPartNumber = response.data.productPartNumber;
                        currentRow.nameofserial = response.data.productSerial;
                        currentRow.ipmiProcess = false;
                    }
                });
                this.tableData[this.edIdx].isIpmiData = true;
            }

            if (!protocols.some(v => v.protocolUUID.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_2))) {
                this.tableData[this.edIdx].isIpmiData = false;
                currentRow.biosRevision = '';
                currentRow.firmwareRevision = '';
            }
        },

        editDevice(i) {
            this.edIdx = i;
            this.editingDevice = true;
        },
        /** Отмена изменений по протоколам
         *
         * @param protocols
         * @param data
         */
        cancelChange(protocols, data) {
            this.tableData[this.edIdx].protocols = protocols.filter(v => v.test === Constants.STATUS_TEXT.OK);
            this.tableData[this.edIdx] = data;
            this.$route.params.icmpResult[this.edIdx].protocols = protocols;
            this.editingDevice = false;
        },
        /** Сохранение изменений по протоколам
         *
         * @param attr
         */
        saveChange(attr) {
            attr.forEach((v, i) => {
                if (!v.name || !v.value) {
                    delete attr[i];
                }
            });

            this.tableData[this.edIdx].attributes = attr.filter(v => v);
            this.editingDevice = false;
            this.updateProtocolsData();
        },
    },

    async mounted() {
        if (!this.$route.params.icmpResult) {
            this.$store.dispatch('snackError', 'Выполните операцию обнаружения повторно!');
            this.$router.push('/control/detection/');
            return;
        }

        await this.$load(async () => {
            const result = await this.$api.devicesTypes.getAll();
            this.types = result.filter(v => !v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1));
        });

        await this.$load(async () => {
            const result = await this.$api.racks.getAll();
            this.racks = result.filter(v => !v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1));
        });
        this.createDataForTable();
    },
};
</script>

<style scoped>
.device-title {
    font-size: 16px;
    margin: 38px 0 15px 0;
}

.device-subtitle {
    margin-bottom: 16px;
}

.device-table {
    width: 100%;
    border-top: 1px solid #dfdfdf;
    border-bottom: 1px solid #dfdfdf;
    border-spacing: unset !important;
}

.device-head {
    font-weight: 700;
    font-size: 14px;
}

.device-head > tr {
    height: 40px;
}

tbody > tr > td {
    height: 48px;
    border-top: 1px solid #dfdfdf;
    padding-right: 10px;
}

tbody > tr > td:last-child {
    text-align: end;
}

.btn-pencil {
    width: 36px;
    height: 36px;
    background-color: rgb(90, 90, 90);
    border-radius: 5px;
}

.btn-group {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
}
</style>
