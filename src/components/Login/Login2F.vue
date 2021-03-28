<template>
    <form>
        <div class="card-text">
            <p>Введите шестизначный код из SMS, отправленного на Ваш номер телефона:</p>
        </div>

        <div class="card-form">
            <input
                class="card-tel-input"
                :class="{ 'input-none': transparent }"
                v-model.trim="code"
                type="text"
                maxlength="6"
                @keypress="isNumber($event)"
                autofocus
            />

            <div class="card-system-message">
                <div class="card-error" v-if="codeFailed">
                    <small>Введённый код не совпадает с кодом из SMS</small>
                </div>
            </div>
        </div>

        <div class="card-timer" v-if="countTimer >= 0">
            <p>
                Повторную отправку кода можнo запросить через
                <span :style="{ color: Constants.STYLE.SUCCESS, 'font-weight': 700 }"
                    >00:{{ countTimer.toString().padStart(2, '0') }}</span
                >
                секунд
            </p>
        </div>
        <div class="card-link" v-else>
            <a @click.prevent="sendCode()">Запросить код повторно</a>
        </div>
    </form>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    data: () => ({
        Constants,
        code: '',
        codeFailed: false,
        countTimer: null,
        timeInterval: null,
        transparent: false,
    }),

    watch: {
        code(v) {
            if (v.length === 6) {
                this.auth2Handler(v);
                this.transparent = true;
            } else {
                this.codeFailed = false;
                this.transparent = false;
            }
        },

        countTimer(v) {
            if (v < 0) {
                clearInterval(this.timeInterval);
            }
        },
    },

    methods: {
        /** Проверка авторизации
         * @param v
         * */
        auth2Handler(v) {
            if (v === '777777') {
                this.$router.push('/');
            } else {
                this.codeFailed = true;
            }
        },
        /** Таймер обратного отсчета повторной отправки кода
         * */
        sendCode() {
            this.countTimer = 60;
            this.timeInterval = setInterval(() => {
                this.countTimer--;
            }, 1000);
        },
        /** Проверка на ввод, что введены числа
         * @param e
         * */
        isNumber(e) {
            let charCode = e.keyCode;
            if (charCode >= 48 && charCode <= 57) {
                return true;
            } else {
                e.preventDefault();
            }
        },
    },
    /** Отправка кода подтверждения
     *
     */
    created() {
        this.sendCode();
    },
};
</script>

<style scoped>
.card-text {
    margin: 54px 0 36px 0;
    font-size: 14px;
    text-align: center;
    line-height: 1.2;
}

.card-system-message {
    height: 24px;
    margin: 10px 0;
}

.card-tel-input {
    width: 100%;
    border-bottom: 1px solid black;
    font-size: 36px;
    letter-spacing: 22px;
    padding: 0 13px;
    display: flex;
    justify-content: space-around;
}

.input-none {
    caret-color: transparent;
}

.card-tel-input:focus {
    outline: none;
}

.card-error {
    margin: 10px 0;
    text-align: center;
    color: #e21a1a;
}

.card-link {
    margin: 24px 0 0 0;
    text-align: center;
    text-decoration: underline;
}

.card-timer {
    font-size: 12px;
    text-align: center;
    width: 240px;
    margin: 0 auto;
    line-height: 1.2;
}

.card-link > a {
    text-decoration: none;
    color: #000;
    font-size: 12px;
}
</style>
