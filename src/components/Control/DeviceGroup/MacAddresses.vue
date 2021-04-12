<template>
    <v-container xs="12" sm="12" mg="12" lg="12" xl="12">
        <v-alert dense type="info">
            <p>
                Сервер не выбран. Для создания новых девайсов введите МAC адреса вручную в формате -
                ["xx:xx:xx:xx:xx:xx", "xx:xx:xx:xx:xx:xx", ....]:
            </p>
        </v-alert>
        <v-row>
            <v-col>
                <v-textarea
                    autofocus
                    name="input-7-1"
                    label="Введите MAC адреса в формате: [MAC адрес]"
                    value="Введите МАС адреса:"
                    v-model="textareaValue"
                ></v-textarea>
            </v-col>
            <v-col>
                <v-select :items="itemsRacks" label="Выбрать стойку из существующих" v-model="selectRack"></v-select>
            </v-col>
            <v-col>
                <v-btn class="btn btn-success" style="min-width: 160px" to="/administration/directory"
                    >Создать новую стойку</v-btn
                ></v-col
            >
        </v-row>
        <v-container style="margin-left: 60%">
            <v-btn class="btn btn-success" style="min-width: 140px" @click="cancel()"> Отмена </v-btn>
            <v-btn
                class="btn btn-success"
                style="min-width: 140px"
                :disabled="disabledInstallBtn"
                @click="goInstallOS()"
            >
                {{ 'Развернуть ОС' }}
            </v-btn>
        </v-container>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        disabledInstallBtn: true,
        textareaValue: '',
        itemsRacks: [],
        racks: [],
        selectRack: undefined,
    }),
    methods: {
        goInstallOS() {
            const arrayMAC = JSON.parse(this.textareaValue);

            arrayMAC.map(
                async m =>
                    // создаем новый девайс
                    await this.$api.devicesRacks.postDevicespack([
                        {
                            rackUUID: this.racks.find(f => f.name == this.selectRack).uuid,
                            identifier: 'VPS',
                            name: 'manualAddition',
                            deviceTypeUuid: '00000000-0000-0000-0000-000000000003',
                            macAddress: m,
                        },
                    ]),
            );

            this.$store.dispatch('snackSuccess', 'Оборудование успешно создано!');
        },

        cancel() {
            this.$emit('cancelInstallTable');
        },
    },
    watch: {
        textareaValue() {
            this.textareaValue == '' || this.selectRack == undefined
                ? (this.disabledInstallBtn = true)
                : (this.disabledInstallBtn = false);
        },

        selectRack() {
            this.textareaValue == '' || this.selectRack == undefined
                ? (this.disabledInstallBtn = true)
                : (this.disabledInstallBtn = false);
        },
    },

    async mounted() {
        this.racks = await this.$api.racks.getAll();
        this.racks.map(m => this.itemsRacks.push(m.name));
    },
};
</script>
