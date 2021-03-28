<template>
    <v-app id="app" :style="userStyle">
        <component :is="layout">
            <router-view />
        </component>
    </v-app>
</template>

<script>
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import EmptyLayout from '@/layouts/EmptyLayout';
import { Constants } from '@/plugins/constants';

export default {
    name: 'app',
    created() {
        document.title = process.env.VUE_APP_TITLE;
    },
    data: () => ({
        Constants,
    }),
    computed: {
        layout() {
            return (this.$route.meta.layout || 'empty') + '-layout';
        },
        userStyle() {
            return {
                '--default-color': this.Constants.STYLE.DEFAULT,
                '--primary-color': this.Constants.STYLE.PRIMARY,
                '--success-color': this.Constants.STYLE.SUCCESS,
            };
        },
    },
    components: {
        MainLayout,
        AuthLayout,
        EmptyLayout,
    },
};
</script>

<style>
@import './assets/css/materialdesignicons.min.css';
/* Ипорт шрифтов IBM Plex Sans*/
@import './assets/css/fonts-css.css';

/* Основной шрифт в системе */
.v-application {
    font-family: 'IBM Plex Sans', sans-serif !important;
}

/* Заголовок h1 */
h1 {
    font-family: 'RussianRail_G_Pro-700', sans-serif !important;
}

/* Установленные шритфы для заголовков в src/fonts */
@font-face {
    font-family: 'RussianRail_G_Pro-400';
    src: url('./assets/fonts/RussianRail-G-Pro-400.ttf') format('truetype');
    font-style: normal;
    font-weight: 400;
}

@font-face {
    font-family: 'RussianRail_G_Pro-700';
    src: url('./assets/fonts/RussianRail-G-Pro-700.ttf') format('truetype');
    font-style: normal;
    font-weight: 700;
}

/* Buttons */
.btn {
    width: 100px;
    height: 36px;
    color: #fff !important;
    font-size: 14px !important;
    text-transform: unset !important;
    border-radius: 5px !important;
    box-shadow: unset !important;
    letter-spacing: unset !important;
    font-weight: 400 !important;
    margin: 2px 8px !important;
}

.btn-cancel {
    background-color: var(--default-color) !important;
}

.btn-primary {
    background-color: var(--primary-color) !important;
}

.btn-success {
    background-color: var(--success-color) !important;
}

.v-application .success--text {
    color: var(--success-color) !important;
}
.v-application .primary--text {
    color: var(--primary-color) !important;
}
.v-application .default--text {
    color: var(--default--text-color) !important;
}

.v-application .success {
    background-color: var(--success-color) !important;
}
.v-application .primary {
    background-color: var(--primary-background-color) !important;
}
.v-application .default {
    background-color: var(--default-background-color) !important;
}

.v-tab--active {
    color: var(--success-color) !important;
}
.tabs-slider-success {
    color: var(--success-color) !important;
}

.btn-icon {
    border: none !important;
}

button:focus {
    outline: unset;
}

/* Группа иконок - действия (справочники) */
.btn-icon-group {
    margin: 1px !important;
    padding: 0 !important;
    min-width: 0 !important;
    outline: none !important;
    border: none !important;
}

.btn-icon-group:hover {
    background-color: #a9a9a9 !important;
}

.btn-add {
    padding: 0 !important;
    border: none !important;
    font: inherit !important;
    background-color: transparent !important;
    box-shadow: none !important;
    color: #a9a9a9 !important;
}

.v-tab {
    letter-spacing: unset !important;
    text-transform: unset !important;
    font-weight: 700 !important;
}
/* Группа иконок: обновление, фильтр */
.btn-control-group {
    padding: 0 !important;
    border: none !important;
    font: inherit !important;
    background-color: transparent !important;
    box-shadow: none !important;
    color: #000000 !important;
}

/* width */
::-webkit-scrollbar {
    width: 5px !important;
    height: 5px !important;
}

/* Track */
::-webkit-scrollbar-track {
    background: #ddd !important;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #a9a9a9 !important;
}
</style>
