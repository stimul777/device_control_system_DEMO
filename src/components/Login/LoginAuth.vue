<template>
    <form @submit.prevent="submitHandler()" :style="userStyle">
        <div class="card-form">
            <v-text-field label="Логин" outlined hide-details v-model.trim="login"></v-text-field>
            <v-text-field
                label="Пароль"
                class="mt-4"
                outlined
                hide-details
                v-model.trim="password"
                :append-icon="!show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                @click:append="show = !show"
            ></v-text-field>
            <div class="card-error">
                <small v-if="authError">Неверно указан логин/пароль</small>
                <div v-else style="height:24px"></div>
            </div>
        </div>
        <div class="card-actions">
            <v-btn class="card-btn" type="submit">Войти</v-btn>
            <div class="card-link">
                <router-link to="/login/forgotPass">Забыл пароль</router-link>
            </div>
        </div>
    </form>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    data: () => ({
        Constants,
        login: '',
        password: '',
        show: false,
    }),

    computed: {
        authError() {
            return this.$store.getters['auth/getInputError'];
        },
        userStyle() {
            return {
                '--default-color': this.Constants.STYLE.DEFAULT,
                '--primary-color': this.Constants.STYLE.PRIMARY,
                '--success-color': this.Constants.STYLE.SUCCESS,
            };
        },
    },

    methods: {
        /** Отправка авторизации
         *
         */
        submitHandler() {
            const formData = {
                username: this.login,
                password: this.password,
            };

            this.$store.dispatch('auth/login', formData);
        },
    },
};
</script>

<style scoped>
.card-form {
    margin: 56px 0 0 0;
}

.card-error {
    margin: 10px 0;
    text-align: center;
    color: #e21a1a;
}

.card-actions {
}

.card-btn {
    width: 100%;
    height: 41px !important;
    background-color: var(--success-color) !important;
    color: #fff !important;
    font-size: 14px;
    text-transform: unset;
    border-radius: 5px;
    box-shadow: unset;
    letter-spacing: unset;
}

.card-link {
    margin: 12px 0 0 0;
    text-align: center;
}

.card-link > a {
    text-decoration: none;
    color: #000;
    font-size: 12px;
}
</style>
