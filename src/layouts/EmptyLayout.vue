<template>
    <Loader v-if="loading" style="align-items: center" />
    <v-app class="empty" v-else :style="userStyle">
        <div class="content">
            <h1>Страница не найдена!</h1>
            <router-link class="link" to="/">Вернуться на главную</router-link>
        </div>
    </v-app>
</template>

<script>
import Loader from '../components/app/Loader.vue';
import { Constants } from '@/plugins/constants';

export default {
    components: { Loader },
    data: () => ({
        loading: true,
        Constants,
    }),

    mounted() {
        setTimeout(() => {
            this.loading = false;
        }, 300);
    },
    computed: {
        userStyle() {
            return {
                '--default-color': this.Constants.STYLE.DEFAULT,
                '--primary-color': this.Constants.STYLE.PRIMARY,
                '--success-color': this.Constants.STYLE.SUCCESS,
            };
        },
    },
};
</script>

<style>
.empty {
    background: url('../assets/images/auth_back.png') 0 0 / cover;
}

.content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.link {
    margin-top: 10px;
    color: var(--success-color);
}
</style>
