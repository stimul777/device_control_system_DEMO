<template>
    <v-container>
        <div class="main-container">
            <div>
                <h2 class="device-title">Редактирование устройства</h2>
                <div class="device-subtitle">IP-адрес: {{ rowData.ipAddress }}</div>
            </div>
            <div class="items-container">
                <div class="items-item">
                    <span>SKU / part number</span>
                    <v-text-field
                        dense
                        outlined
                        hide-details
                        style="max-width: 200px"
                        v-model="rowData.productPartNumber"
                    ></v-text-field>
                </div>
                <div class="items-item">
                    <span>Серийный номер</span>
                    <v-text-field
                        dense
                        outlined
                        hide-details
                        style="max-width: 200px"
                        v-model="rowData.nameofserial"
                    ></v-text-field>
                </div>
                <div class="items-item">
                    <span>Идентификатор</span>
                    <v-text-field
                        dense
                        outlined
                        hide-details
                        style="max-width: 200px"
                        v-model="rowData.identifier"
                    ></v-text-field>
                </div>
                <div class="items-item">
                    <span>Название</span>
                    <v-text-field
                        dense
                        outlined
                        hide-details
                        style="max-width: 200px"
                        v-model="rowData.name"
                    ></v-text-field>
                </div>
                <div class="items-item">
                    <span>Тип оборудования</span>
                    <v-select
                        clearable
                        :items="typesData"
                        item-text="name"
                        item-value="uuid"
                        v-model="rowData.deviceTypeUuid"
                        persistent-hint
                        single-line
                        dense
                        outlined
                        hide-details
                        style="max-width: 200px"
                    ></v-select>
                </div>
                <div class="items-item">
                    <span>Стойка</span>
                    <v-select
                        clearable
                        :items="racksData"
                        item-text="name"
                        item-value="uuid"
                        v-model="rowData.rackUUID"
                        persistent-hint
                        single-line
                        dense
                        outlined
                        hide-details
                        style="max-width: 200px"
                    ></v-select>
                </div>
                <div class="items-item">
                    <span>Производитель</span>
                    <v-text-field
                        dense
                        outlined
                        hide-details
                        style="max-width: 200px"
                        v-model="rowData.boardMfg"
                    ></v-text-field>
                </div>

                <div class="items-item">
                    <span>Модель/Серия</span>
                    <v-text-field
                        dense
                        outlined
                        hide-details
                        style="max-width: 200px"
                        v-model="rowData.productName"
                    ></v-text-field>
                </div>

                <!--  -->
                <div>
                    <div style="margin: 12px 0">Протоколы</div>

                    <TableProtocol
                        v-for="(prot, j) of protocols"
                        :key="j"
                        :prot="prot"
                        :ip="rowData.ipAddress"
                        style="max-width: 400px"
                    />
                </div>
                <!--  -->
                <div style="width: 400px;">
                    <div style="margin: 12px 0">Атрибуты</div>
                    <div class="attributes" v-for="(attr, i) of attributes" :key="i">
                        <v-text-field
                            style="max-width: 150px"
                            dense
                            outlined
                            hide-details
                            placeholder="Название"
                            v-model="attr.name"
                        ></v-text-field>
                        <v-text-field
                            style="max-width: 150px"
                            dense
                            outlined
                            hide-details
                            placeholder="Описание"
                            v-model="attr.value"
                        ></v-text-field>
                        <button class="btn-attr" @click="attributes.push({ name: '', value: '' })">+</button>
                        <button class="btn-attr" @click="delAttr(i)">-</button>
                    </div>
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-cancel" @click="$emit('cancelChange', cashProtocols, cashRowData)">
                    Отмена
                </button>
                <button class="btn btn-success" @click="$emit('saveChange', attributes)">Сохранить</button>
            </div>
        </div>
    </v-container>
</template>

<script>
export default {
    props: ['rowData', 'protocols', 'typesData', 'racksData'],
    components: {
        TableProtocol: () => import('@/components/Control/Detection/TableProtocol'),
    },
    data: () => ({
        attributes: [],
        cashProtocols: [],
        cashRowData: {},
    }),

    methods: {
        /** Удаление атрибута
         * @param i
         */
        delAttr(i) {
            if (this.attributes.length > 1) {
                this.attributes.splice(i, 1);
            } else {
                this.attributes = [
                    {
                        name: '',
                        value: '',
                    },
                ];
            }
        },
    },

    mounted() {
        if (this.rowData.attributes.length) {
            this.attributes = JSON.parse(JSON.stringify(this.rowData.attributes));
        } else {
            this.attributes = [
                {
                    name: '',
                    value: '',
                },
            ];
        }

        this.cashProtocols = JSON.parse(JSON.stringify(this.protocols));
        this.cashRowData = JSON.parse(JSON.stringify(this.rowData));
    },
};
</script>

<style scoped>
.device-title {
    font-size: 16px;
    margin: 38px 0 15px 0;
}

.items-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 0 1 400px;
    margin: 12px 0;
}

.device-subtitle {
    margin-bottom: 16px;
}

.main-container {
    max-width: 1000px;
}
.items-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    max-width: 1000px;
    margin: 0 auto;
}

.item-wrapper {
    display: flex;
    flex: 0 1 400px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.btn-group {
    margin-top: 17px;
    text-align: end;
}

.attributes {
    display: flex;
    justify-content: space-between;
    margin-bottom: 3px;
}

.btn-attr {
    width: 36px;
    height: 36px;
    background-color: #e7e7e7;
    border-radius: 4px;
    font-weight: 500;
}
</style>
