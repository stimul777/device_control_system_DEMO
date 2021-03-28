<template>
    <v-container>
        <v-row>
            <v-col>
                <span>Идентификатор</span>
                <v-text-field
                    class="mb-5"
                    dense
                    outlined
                    hide-details
                    v-model="EditDeviceProps.identifier"
                ></v-text-field>

                <span>Название</span>
                <v-text-field class="mb-5" dense outlined hide-details v-model="EditDeviceProps.name"></v-text-field>

                <span>Производитель</span>
                <v-text-field
                    class="mb-5"
                    dense
                    outlined
                    hide-details
                    v-model="EditDeviceProps.boardMfg"
                ></v-text-field>

                <span>Модель</span>
                <v-text-field
                    class="mb-5"
                    dense
                    outlined
                    hide-details
                    v-model="EditDeviceProps.productName"
                ></v-text-field>

                <span>Серийный номер</span>
                <v-text-field
                    class="mb-5"
                    dense
                    outlined
                    hide-details
                    v-model="EditDeviceProps.productSerial"
                ></v-text-field>

                <span>Версия Bios</span>
                <v-text-field
                    class="mb-5"
                    dense
                    outlined
                    hide-details
                    v-model="EditDeviceProps.biosRevision"
                ></v-text-field>
            </v-col>

            <v-col>
                <span>IP адрес</span>
                <v-text-field
                    class="mb-5"
                    dense
                    outlined
                    hide-details
                    v-model="EditDeviceProps.ipAddressString"
                ></v-text-field>

                <span>MAC адрес</span>
                <v-text-field
                    class="mb-5"
                    dense
                    outlined
                    hide-details
                    v-model="EditDeviceProps.macAddress"
                ></v-text-field>

                <span>Стойка</span>
                <v-select
                    class="mb-5"
                    hide-details
                    outlined
                    dense
                    :items="getInventoryRacks.map(i => i.name)"
                    v-model="EditDeviceProps.rackMount.name"
                ></v-select>

                <span>Тип оборудования</span>
                <v-select
                    class="mb-5"
                    persistent-hint
                    single-line
                    dense
                    outlined
                    hide-details
                    :items="getDeviceType.map(i => i.name)"
                    v-model="EditDeviceProps.deviceType.name"
                ></v-select>

                <div style="border: 1px solid #a9a9a9; padding: 10px;">
                    <span>Протокол</span>
                    <TableProtocol
                        v-for="(prot, j) of protocols"
                        :key="j"
                        :prot="prot"
                        :testSuccess="EditDeviceProps.protocols"
                        :ip="EditDeviceProps.ipAddressString"
                        style="max-width: 400px"
                    />
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="d-flex justify-end">
                <v-btn class="btn btn-cancel" @click="showTableInventary()">Отмена</v-btn>
                <div @click="saveDevice()">
                    <WaitButton :waitButtonProps="waitButtonProps" />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Constants } from '@/plugins/constants';
import TableProtocol from '@/components/Control/Detection/TableProtocol';
import WaitButton from '@/components/app/WaitButton';

export default {
    components: {
        TableProtocol,
        WaitButton,
    },

    props: {
        EditDeviceProps: {
            type: Object,
            required: true,
        },
    },

    data: () => ({
        // button save
        waitButtonProps: {
            styleBtn: '',
            disabledBtn: false,
            showBtn: true,
            colorBtn: Constants.STYLE.SUCCESS,
            textBtn: 'Cохранить',
            loaderColor: Constants.STYLE.SUCCESS,
            loaderSize: '20',
            loaderBtn: false,
            loaderStyle: 'absolute',
        },

        showTableEdit: false,
        rackItem: [],
        protocols: [],
    }),

    methods: {
        ...mapActions([
            'inventoryRequest',
            'inventoryDeviceType',
            'inventoryRacks',
            'inventoryProtocols',
            'inventoryRequestPatch',
            'inventoryDelete',
        ]),

        /**
         *
         * Сохранение отредактированного оборудования
         *
         * @returns {Promise<void>}
         */
        async saveDevice() {
            this.waitButtonProps = {
                styleBtn: '',
                disabledBtn: true,
                showBtn: true,
                colorBtn: Constants.STYLE.SUCCESS,
                textBtn: 'Cохранить',
                loaderColor: Constants.STYLE.SUCCESS,
                loaderSize: '20',
                loaderBtn: true,
                setTimeout: 1000,
            };

            let activProtocol = [];
            // let protocolVersion = []
            let testProtocolOk = this.protocols.filter(i => i.test === Constants.STATUS_TEXT.OK);
            // this.protocolsModel.map(i => protocolVersion.push(i.slice(7)))
            for (let item of this.getInventoryProtocols) {
                for (let test of testProtocolOk) {
                    if (item.uuid === test.uuid) {
                        activProtocol.push({
                            protocolUUID: test.uuid,
                        });
                    }
                }
            }

            // при попытке отправить пустой протокол - присвоить неизвестно
            if (activProtocol.length === 0) {
                activProtocol.push({
                    protocolUUID: Constants.CODE_STATUSES.CODE_STATUSES_DEFAULT,
                });
            }

            const currentRackMount = this.getInventoryRacks.find(f => f.name === this.EditDeviceProps.rackMount.name);
            const currentDeviceType = this.getDeviceType.find(
                item => item.name === this.EditDeviceProps.deviceType.name,
            );

            await this.inventoryRequestPatch({
                // uuid оборудования
                uuid: this.EditDeviceProps.uuid,
                // Сохранить объект на сервер
                devices: {
                    biosRevision: this.EditDeviceProps.biosRevision,
                    identifier: this.EditDeviceProps.identifier,
                    ipAddress: this.EditDeviceProps.ipAddressString,
                    macAddress: this.EditDeviceProps.macAddress,
                    productName: this.EditDeviceProps.productName,
                    boardMfg: this.EditDeviceProps.boardMfg,
                    name: this.EditDeviceProps.name,
                    nameofserial: this.EditDeviceProps.productSerial,
                    uuid: this.EditDeviceProps.uuid,
                    // Стойка
                    rackUUID: currentRackMount ? currentRackMount.uuid : null,
                    // Тип оборудования
                    deviceTypeUUID: currentDeviceType ? currentDeviceType.uuid : null,
                    // Протоколы
                    protocols:
                        activProtocol.length !== 0
                            ? activProtocol
                            : {
                                  protocolUUID: Constants.CODE_STATUSES.CODE_STATUSES_DEFAULT,
                              },

                    deviceType: {
                        uuid: this.EditDeviceProps.deviceType.uuid,
                    },
                },
            });
            this.$store.dispatch('snackSuccess', 'Оборудование отредактировано!');
            this.showTableEdit = false;
            this.itemsTable = [];
        },

        showTableInventary() {
            this.$emit('showTableInventary');
        },
    },

    computed: {
        ...mapGetters(['getDeviceType', 'getInventoryRacks', 'getInventoryProtocols']),
    },

    async mounted() {
        await this.inventoryRacks();
        this.inventoryProtocols();

        this.$load(async () => {
            const resProt = await this.$api.protocols.getAll();
            this.protocols = resProt
                .filter(v => !v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_6))
                .map(v => ({
                    uuid: v.uuid,
                    name: `${v.name} ${v.version ? 'v.' + v.version : ''}`.trim(),
                    login: v.community || v.login,
                    password: v.password || '',
                }))
                .map(v => ({
                    uuid: v.uuid,
                    name: v.name,
                    login: v.login,
                    password: v.password,
                    showPassword: false,
                    disableLogin: v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1),
                    disablePassword:
                        v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1) ||
                        v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_3),
                    testing: false,
                    // Здесь поставить ОК протоколам, которые уже выбраны на устройстве
                    test: v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1)
                        ? Constants.STATUS_TEXT.OK
                        : Constants.STATUS_TEXT.NONE,
                }));
        });
    },
};
</script>
