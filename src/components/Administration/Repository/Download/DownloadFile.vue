<template>
    <v-row no-gutters>
        <v-progress-circular
            class="mr-1"
            :rotate="90"
            :size="50"
            :width="4"
            :value="uploadProgressSystemGet ? uploadProgressSystemGet : 0"
            :color="colorProgressBar"
            v-show="showProgressBar"
        >
            <p class="progressProcent">{{ uploadProgressSystemGet + '%' }}</p>
        </v-progress-circular>
        <v-file-input
            class="mt-1"
            style="width:10%;"
            show-size
            outlined
            dense
            prepend-icon
            prepend-inner-icon="mdi-download-circle-outline"
            :disabled="disabledFileInput"
            :accept="acceptFile"
            :label="label"
            v-model="selectFile"
        ></v-file-input>
        <v-btn
            class="btn btn-success btn-action "
            v-show="showBtnSend"
            color="green"
            :disabled="disabledBtnSend"
            @click="sendFile()"
            >Загрузить
        </v-btn>
        <v-btn class="btn btn-success btn-action " v-show="showBtnCancel" @click="closeUpload()" color="red"
            >Отменить
        </v-btn>
    </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    props: {
        propsDownload: {
            // type: String,
            // requare: true,
        },
    },
    data: () => ({
        fileFormat: String,
        label: '',
        acceptFile: null,
        selectFile: null,
        uploadUrl: String,
        showBtnSend: true,
        showBtnCancel: false,
        disabledFileInput: false,
        disabledBtnSend: true,
        showProgressBar: false,
        colorProgressBar: 'red',
        // от 1 до 5 символов после последней '.'
        regexp: /\.[0-9a-z]{1,5}$/,
        // подключения
        connections: '',
        uuidFile: null,
    }),

    methods: {
        ...mapActions(['requestDownloadFile', 'deleteOSrequest', 'changeUuidFile']),

        async sendFile() {
            console.log('DATA', this.propsDownload);

            this.showProgressBar = this.disabledFileInput = this.showBtnCancel = true;
            this.showBtnSend = false;

            // store
            try {
                await this.requestDownloadFile({
                    connections: this.connections,
                    name: this.selectFile.name,
                    selectFile: this.selectFile,
                    store: this.$store,
                });
            } catch (error) {
                console.error('Ошибка:', error);
                return this.$store.dispatch('snackError', `Файл ${this.selectFile.name} уже существует в репозитории!`);
            }

            this.colorProgressBar = 'green';
            this.disabledFileInput = this.disabledBtnSend = this.showBtnCancel = false;
            this.showBtnSend = true;

            // добавляем загруженный файл в таблицу
            this.$emit('fileUploadedSuccess', this.propsDownload);
        },
        /**
         * Отмена загрузки файла
         */
        closeUpload() {
            this.uuidFile = this.getUuidFile.uuidFileDownload;
            let objAlert = {
                text: `Вы уверены, что хотите отменить загрузку файл __${this.selectFile.name}__?`,
                sheet: 'downloadInput',
            };
            this.$store.dispatch('snackAlert', objAlert);
        },
    },

    watch: {
        selectFile() {
            if (!this.selectFile) {
                this.showProgressBar = false;
                return (this.disabledBtnSend = true);
            }
            // дополнительная валидация
            if (this.selectFile) {
                this.showBtnSend = true;
                const regExpRes = this.selectFile.name.match(this.regexp);
                if (regExpRes[0] !== this.fileFormat) {
                    return this.$store.dispatch('snackError', `Файл должен быть в формате ${this.fileFormat}!`);
                }
            }

            this.selectFile ? (this.disabledBtnSend = false) : (this.disabledBtnSend = true);
            this.showProgressBar = false;
            this.$store.state.repository.uploadProgressValue = '';
        },

        propsDownload() {
            // если включен прогресс бар(идет загрузка) - отмена переключения
            if (this.showProgressBar || this.disabledBtnSend === false) return;
            switch (this.propsDownload) {
                case 'ISO':
                    this.label = 'загрузить ISO образ...';
                    this.fileFormat = this.acceptFile = '.iso';
                    this.connections = 'isoImages';
                    break;
                case 'software':
                    this.label = 'загрузить ПО...';
                    this.fileFormat = this.acceptFile = '.exe';
                    this.connections = 'softFile';
                    break;
            }
        },

        async alertUserResponseGetter() {
            if (!this.alertUserResponseGetter.alertUserResponse) {
                return;
            }
            this.showProgressBar = this.disabledFileInput = this.showBtnCancel = this.disabledBtnSend = false;
            this.showBtnSend = true;
            if (this.alertUserResponseGetter.typeSheet === 'downloadInput') {
                this.$store.dispatch('alertUserResponse', false);

                //отправляем запрос на удаление обораза
                this.deleteOSrequest(this.uuidFile);
                let reqCancel = this.getUuidFile.request;
                //закрываем запрос загрузки образа
                reqCancel.cancel('Отмена загрузки!');
                //обнуляем данные по отмене загрузки
                let changeObj = {
                    uuid: null,
                    url: this.getUuidFile.urlDownload,
                    connections: this.connections,
                    request: null,
                };
                this.changeUuidFile(changeObj);
                this.$store.dispatch('snackSuccess', `Загрузка отменена!`);
            }
        },
    },

    computed: {
        ...mapGetters(['uploadProgressSystemGet', 'getUuidFile', 'alertUserResponseGetter']),
    },
};
</script>

<style scoped>
.progressProcent {
    font-size: 0.9em;
    margin: 0 auto;
}

.btn-action {
    margin-top: 6px !important;
}
</style>
