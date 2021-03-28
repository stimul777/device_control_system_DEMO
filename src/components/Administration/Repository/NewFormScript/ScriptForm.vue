<template>
    <v-container>
        <div>
            <h3>{{ textHeader }}</h3>
            <div>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-file-input
                        truncate-length="15"
                        prepend-icon="mdi-paperclip"
                        label="Загрузите файл с текстом скрипта"
                        ref="scriptFile"
                        @change="selectedFile"
                    ></v-file-input>
                    <v-text-field
                        v-model="valueName"
                        :counter="20"
                        :rules="inputRules"
                        label="Наименование"
                        required
                    ></v-text-field>

                    <v-textarea v-model="valueText" :rules="inputRules" label="Текст скрипта" required></v-textarea>
                    <v-text-field v-model="valueComment" :counter="20" label="Комментарий"></v-text-field>
                    <v-autocomplete
                        v-model="valueOsItem"
                        :items="items"
                        label="Выбор ОС"
                        item-value="uuid"
                        item-text="name"
                        :required="!valueOsItem"
                        :disabled="typeForm !== 'addNew' && typeForm !== 'copy'"
                        :multiple="typeTable === 'script'"
                        :rules="inputRules"
                    >
                        <template slot="item" slot-scope="data">
                            {{ data.item.name }} - version: {{data.item.version}} - {{ data.item.type }} - {{ data.item.architecture }}
                        </template>
                        <template slot="selection" slot-scope="data">
                            {{ data.item.name }} -  version: {{data.item.version}} - {{ data.item.type }} - {{ data.item.architecture }}
                        </template>
                    </v-autocomplete>
                    <v-autocomplete
                        v-if="typeTable === 'script'"
                        v-model="valueSoftItem"
                        :items="itemsSoft"
                        label="Выбор ПО"
                        item-value="uuid"
                        item-text="name"
                        :required="!valueSoftItem"
                        :disabled="typeForm !== 'addNew' && typeForm !== 'copy'"
                        :multiple="typeTable === 'script'"
                        :rules="inputRules"
                    >
                    </v-autocomplete>
                    <v-btn :disabled="!valid" color="success" class="mr-4" @click="createKickstart">
                        {{ typeForm === 'addNew' || typeForm === 'copy' ? 'Добавить' : 'Сохранить' }}
                    </v-btn>

                    <v-btn color="error" class="mr-4" @click="closeShowForm">
                        Отмена
                    </v-btn>
                </v-form>
            </div>
        </div>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: ['textHeader', 'rowIndex', 'typeForm', 'typeTable'],
    data: () => ({
        valid: true,
        name: '',
        architecture: '',
        textScript: '',
        comment: '',
        selectOs: null,
        selectSoft: null,
        items: [],
        itemsSoft: [],
        inputRules: [v => !!v || 'Заполните поле!'],
    }),
    methods: {
        createKickstart() {
            if (this.$refs.form.validate()) {
                let objShowTable = {
                    show: false,
                    typeForm: '',
                };

                if (this.typeForm === 'addNew' || this.typeForm === 'copy') {
                    if (this.typeTable === 'kickstart') {
                        let obj = {
                            name: this.name,
                            comment: this.comment,
                            text: this.textScript ? this.textScript : this.rowIndex.text,
                            osUuid: this.selectOs,
                        };
                        this.$store.dispatch('addNewItemKickstart', obj);
                        // this.$store.dispatch('snackSuccess', `Kickstart файл добавлен!`);
                    } else {
                        let obj = {
                            name: this.name,
                            comment: this.comment,
                            text: this.textScript ? this.textScript : this.rowIndex.text,
                            osUuidArr: this.selectOs,
                            softUuidArr: this.selectSoft,
                        };
                        this.$store.dispatch('addNewItemScript', obj);
                        // this.$store.dispatch('snackSuccess', `Установочный скрипт добавлен!`);
                    }
                } else {
                    let obj = {
                        name: this.name ? this.name : this.rowIndex.name,
                        comment: this.comment ? this.comment : this.rowIndex.comment,
                        text: this.textScript ? this.textScript : this.rowIndex.text,
                        // osUuid:  this.selectOs ?  this.selectOs :  this.rowIndex.os.uuid,
                        uuid: this.rowIndex.uuid,
                        // os: this.rowIndex.os
                    };
                    if (this.typeTable === 'kickstart') {
                        this.$store.dispatch('editKickstartFile', obj);
                    } else {
                        this.$store.dispatch('editScriptFile', obj);
                    }
                }
                this.typeTable === 'kickstart'
                    ? this.$store.dispatch('showFormKikstart', objShowTable)
                    : this.$store.dispatch('showFormScript', objShowTable);

                this.$emit('updateTable');
            }
        },
        closeShowForm() {
            let obj = {
                show: false,
                typeForm: '',
            };
            this.typeTable === 'kickstart'
                ? this.$store.dispatch('showFormKikstart', obj)
                : this.$store.dispatch('showFormScript', obj);
            this.typeTable === 'kickstart'
                ? this.$store.dispatch('selectedRowKickstart', '')
                : this.$store.dispatch('selectedRowScript', '');
            this.$emit('updateTable');
        },

        /**
         * Вставка скрипта из файла
         * @param ev
         */
        selectedFile(ev) {
            let file = ev;
            if (!file || file.type !== 'text/plain') return;
            let reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = evt => {
                this.textScript = evt.target.result;
            };
            reader.onerror = evt => {
                console.error(evt);
            };
        },
    },
    computed: {
        ...mapGetters(['getOsItems', 'softGetter']),
        valueName: {
            get() {
                if (this.typeForm === 'addNew' || this.typeForm === 'copy') {
                    return this.name;
                } else return this.rowIndex.name;
            },
            set(value) {
                this.name = value;
            },
        },
        valueText: {
            get() {
                if (this.typeForm === 'addNew') {
                    return this.textScript;
                } else return this.rowIndex.text;
            },
            set(value) {
                this.textScript = value;
            },
        },
        valueComment: {
            get() {
                if (this.typeForm === 'addNew' || this.typeForm === 'copy') {
                    return this.comment;
                } else return this.rowIndex.comment;
            },
            set(value) {
                this.comment = value;
            },
        },
        valueOsItem: {
            get() {
                if (this.typeForm === 'addNew' || this.typeForm === 'copy') {
                    return this.selectOs;
                } else {
                    if (this.typeTable === 'kickstart') {
                        return this.rowIndex.osUuid;
                    } else return this.rowIndex.osList;
                }
            },
            set(value) {
                this.selectOs = value;
            },
        },
        valueSoftItem: {
            get() {
                if (this.typeForm === 'addNew' || this.typeForm === 'copy') {
                    return this.selectSoft;
                } else return this.rowIndex.softwareFiles;
            },
            set(value) {
                this.selectSoft = value;
            },
        },
    },
    mounted() {
        this.items = this.getOsItems;
        this.itemsSoft = this.softGetter;
    },
};
</script>

<style scoped></style>
