<template>
    <tr class="tr-item">
        <a class="mr-2">
            <div class="loading" v-if="prot.testing">
                <v-progress-circular indeterminate color="#fff" :size="20" :width="3"></v-progress-circular>
            </div>
            <v-icon
                size="32px"
                :color="Constants.STYLE.DEFAULT"
                v-if="prot.test === 'none' && !prot.testing"
                @click="startTesting(prot)"
            >
                mdi-play-circle
            </v-icon>
            <v-icon
                size="32px"
                :color="Constants.STYLE.PRIMARY"
                v-else-if="prot.test === 'ok'"
                @click="clearTest(prot)"
            >
                mdi-check-circle
            </v-icon>
            <v-icon
                size="32px"
                :color="Constants.STYLE.SUCCESS"
                v-else-if="prot.test === 'bad'"
                @click="clearTest(prot)"
            >
                mdi-close-circle
            </v-icon>
        </a>
        <v-text-field class="input-el" hide-details outlined dense v-model="prot.name" disabled></v-text-field>
        <v-text-field
            class="input-el"
            dense
            outlined
            hide-details
            v-model="prot.login"
            :disabled="prot.disableLogin || prot.test === 'ok'"
        ></v-text-field>
        <v-text-field
            class="input-el"
            :append-icon="prot.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="prot.showPassword ? 'text' : 'password'"
            @click:append="prot.showPassword = !prot.showPassword"
            dense
            outlined
            hide-details
            v-model="prot.password"
            :disabled="prot.disablePassword || prot.test === 'ok'"
        ></v-text-field>
    </tr>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    props: ['prot', 'ip', 'testSuccess'],
    data: () => ({ Constants }),
    methods: {
        /** Начало тестирования протокола в таблице протоколов
         *
         * @param prot
         */
        startTesting(prot) {
            const data = {
                prot,
                ip: this.ip,
            };
            this.$store.dispatch('startTestProtocols', data);

            prot.testing = true;
        },
        /** Очищение результатов тестировани у протоколов
         *
         * @param prot
         */
        clearTest(prot) {
            if (!prot.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_01)) {
                prot.testing = false;
                prot.test = Constants.STATUS_TEXT.NONE;
            }
        },
        getSuccessTest(testSuccess, prot) {
            if (testSuccess && testSuccess.some(i => i.uuid === prot.uuid)) {
                prot.test = Constants.STATUS_TEXT.OK;
            }
        },
    },
    async mounted() {
        this.getSuccessTest(this.testSuccess, this.prot);
    },
};
</script>

<style scoped>
.tr-item {
    width: 100%;
    display: flex;
    align-items: center;
    margin: 3px 0;
}

.input-el {
    margin-right: 10px !important;
    max-width: 200px;
}

.loading {
    background-color: #a9a9a9;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 3px;
}
</style>
