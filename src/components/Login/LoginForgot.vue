<template>
    <form @submit.prevent="forgotPassword()" :style="userStyle">
        <div class="card-text">
            <p>
                На Вашу почту в течении нескольких минут будет отправлено письмо с инструкцией по восстановлению или
                смене пароля. Внимание! Для восстановления или смены пароля, строго следуйте указанной в письме
                инструкции.
            </p>
        </div>

        <div class="card-form">
            <v-text-field label="Почта" outlined hide-details v-model.trim="email" :disabled="emailSend"></v-text-field>

            <div class="card-system-message">
                <div
                    class="card-error"
                    v-if="($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)"
                >
                    <small>Неверно указана почта</small>
                </div>

                <div class="card-success" v-if="emailSend">
                    <small>Письмо отправлено</small>
                </div>
            </div>
        </div>
        <div class="card-actions" v-if="!emailSend">
            <v-btn class="card-btn card-btn-back" @click="$router.push('/login')">Назад</v-btn>
            <v-btn class="card-btn card-btn-send" type="submit">Отправить</v-btn>
        </div>
        <div class="card-link" v-else>
            <router-link to="/login">Войти в систему</router-link>
        </div>
    </form>
</template>

<script>
import { email, required } from 'vuelidate/src/validators';
import { Constants } from '@/plugins/constants';

export default {
    data: () => ({
        Constants,
        email: '',
        show: false,
        emailSend: false,
    }),
    computed: {
        userStyle() {
            return {
                '--default-color': this.Constants.STYLE.DEFAULT,
                '--primary-color': this.Constants.STYLE.PRIMARY,
                '--success-color': this.Constants.STYLE.SUCCESS,
            };
        },
    },
    validations: {
        email: {
            required,
            email,
        },
    },

    methods: {
        /** Отправка сброса пароля на почту
         *
         */
        forgotPassword() {
            if (this.$v.$invalid) {
                this.$v.$touch();
                return;
            }

            this.emailSend = true;
        },
    },
};
</script>

<style scoped>
.card-form {
}

.card-text {
    margin: 22px 0 0 0;
    font-size: 12px;
}

.card-system-message {
    height: 24px;
    margin: 10px 0;
}

.card-error {
    margin: 10px 0;
    text-align: center;
    color: #e21a1a;
}

.card-success {
    margin: 10px 0;
    text-align: center;
    color: var(--success-color);
}

.card-actions {
    display: flex;
    justify-content: space-between;
}

.card-btn {
    width: 143px;
    height: 41px !important;
    color: #fff !important;
    font-size: 14px;
    text-transform: unset;
    border-radius: 5px;
    box-shadow: unset;
    letter-spacing: unset;
}

.card-btn-back {
    background-color: #a9a9a9 !important;
}

.card-btn-send {
    background-color: var(--success-color) !important;
}

.card-link {
    margin: 24px 0 0 0;
    text-align: center;
    text-decoration: underline;
}

.card-link > a {
    text-decoration: none;
    color: #000;
    font-size: 12px;
}
</style>
