<template>
    <v-container fluid class="ml-4" :style="userStyle">
        <v-radio-group row v-model="radio">
            <v-radio label="Адрес" value="oneIp" :color="Constants.STYLE.SUCCESS" class="first-radio"></v-radio>
            <v-radio label="Диапазон адресов" value="twoIp" :color="Constants.STYLE.SUCCESS"></v-radio>
        </v-radio-group>
        <div class="input-group">
            <vue-ip-input class="input-ip" :ip="ip1" :on-change="onIpChange1"></vue-ip-input>
            <template v-if="radio === 'twoIp'">
                <div class="input-line">—</div>
                <vue-ip-input class="input-ip" :ip="ip2" :on-change="onIpChange2"></vue-ip-input>
            </template>
            <button class="btn-find" @click="startPing()" :disabled="disableSearch || connection">
                <v-icon size="16" dark class="mr-1">mdi-magnify</v-icon>
                <span>Поиск</span>
            </button>
        </div>
        <Loader v-if="connection" />
        <DetectionTable v-if="icmpResult.length" />
    </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import { required, ipAddress } from 'vuelidate/lib/validators';

import { Constants } from '@/plugins/constants';

export default {
    components: {
        DetectionTable: () => import('@/components/Control/Detection/DetectionTable'),
    },

    validations: {
        ip1: {
            required,
            ipAddress,
        },
        ip2: {
            required,
            ipAddress,
        },
    },

    data: () => ({
        radio: 'oneIp',
        ip1: '',
        ip2: '',
        failRange: false,
        Constants,
    }),

    computed: {
        icmpResult() {
            return this.$store.getters.getIcmpResult;
        },

        connection() {
            return this.$store.getters.getConnection;
        },

        disableSearch() {
            if (this.radio === 'oneIp') {
                const address = this.ip1.split('.');
                let octet = 0;
                address.forEach(v => {
                    v ? octet++ : null;
                });
                return octet !== 4;
            } else {
                const address1 = this.ip1.split('.');
                const address2 = this.ip2.split('.');
                let octet = 0;
                address1.forEach(v => {
                    v ? octet++ : null;
                });
                address2.forEach(v => {
                    v ? octet++ : null;
                });
                return octet !== 8;
            }
        },

        userStyle() {
            return {
                '--default-color': this.Constants.STYLE.DEFAULT,
                '--primary-color': this.Constants.STYLE.PRIMARY,
                '--success-color': this.Constants.STYLE.SUCCESS,
            };
        },
    },

    watch: {
        radio(state) {
            if (state === 'oneIp') {
                this.ip2 = '';
            }
        },
    },

    methods: {
        ...mapActions(['startICMP', 'snackError']),

        onIpChange1(ip) {
            this.ip1 = ip;
        },

        onIpChange2(ip) {
            this.ip2 = ip;
        },

        /**
         * Проверка диапазона введенных ip-адресов
         */
        checkRange() {
            this.failRange = false;
            let arrIp1 = this.ip1.split('.');
            let arrIp2 = this.ip2.split('.');

            for (let i = 0; i < 3; i++) {
                if (arrIp1[i] !== arrIp2[i]) {
                    this.failRange = true;
                    this.snackError('Неверный диапазон!');
                }
            }

            if (+arrIp2[3] <= +arrIp1[3]) {
                this.failRange = true;
                this.snackError('Неверный диапазон!');
            }

            if (this.ip1 === '' || this.ip2 === '') {
                this.failRange = true;
                this.snackError('Неверный диапазон!');
            }

            return this.failRange;
        },

        /** Добавление ip-адреса в массив
         */
        setIpArr() {
            let arrIp1 = this.ip1.split('.');
            let arrIp2 = this.ip2.split('.');
            let arrIpAll = [];

            for (let i = +arrIp1[3]; i <= +arrIp2[3]; i++) {
                let mediArr = arrIp1.filter((v, i) => i !== 3);
                mediArr.push('' + i);
                arrIpAll.push(mediArr.join('.'));
            }

            return arrIpAll;
        },

        /** Поиск сервера
         *
         * @returns {Promise<void>}
         */
        async startPing() {
            if (this.$v.ip1.$invalid && this.radio === 'oneIp') {
                this.$v.$touch();
                return;
            }

            if (this.radio === 'oneIp') {
                let ipArr = [this.ip1];
                await this.startICMP(ipArr);
                this.$v.$reset();
            }

            if (this.radio === 'twoIp' && !this.checkRange()) {
                let ipArr = this.setIpArr();
                await this.startICMP(ipArr);
            }
        },
    },

    mounted() {
        this.ip1 = Constants.RANGE_API.API_1;
        this.ip2 = Constants.RANGE_API.API_2;
    },
    destroyed() {
        const connection = this.$store.getters.getConnectSocket;
        connection.off('ReceiveMessage');
    },
};
</script>

<style scoped>
.first-radio {
    margin-right: 135px !important;
}

.input-group {
    display: flex;
    align-items: center;
}

.input-line {
    display: inline-block;
    margin: 0 15px;
}

.input-ip {
    width: 170px;
    height: 41px;
    border-radius: 5px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
}

.btn-find {
    width: 78px;
    height: 36px;
    background-color: var(--success-color);
    border-radius: 5px;
    font-size: 12px;
    color: #ffffff;
    margin-left: 32px;
}

.btn-find:disabled {
    opacity: 0.3;
}

.input-message {
    margin-left: 20px;
    color: var(--success-color);
}
</style>
