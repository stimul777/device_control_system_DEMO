<template>
    <div class="navbar" :style="userStyle">
        <v-app-bar color="#fff" dense flat height="66">
            <router-link to="/" style="background-color: unset">
                <v-img :aspect-ratio="16 / 9" :src="logoPath" width="120px" class="mr-5"></v-img>
            </router-link>
            <div v-if="$store.getters['auth/getJwtDecodeData']">
                <span>{{ $store.getters['auth/getJwtDecodeData'].nameid }}</span>
                <v-chip class="ma-2" color="primary">{{ userRole }}</v-chip>
            </div>

            <v-spacer></v-spacer>
            <ul class="link-wrapper">
                <li class="link-item" v-if="!roleClaims.find(cl => cl === 'r/Home')">
                    <router-link to="/" exact>Главная</router-link>
                </li>
                <li class="link-item" v-if="!roleClaims.find(cl => cl === 'r/Monitoring')">
                    <router-link to="/monitoring">Мониторинг</router-link>
                </li>
                <li class="link-item" v-if="!roleClaims.find(cl => cl === 'r/Control')">
                    <router-link to="/control">Управление</router-link>
                </li>
                <li class="link-item" v-if="!roleClaims.find(cl => cl === 'r/Administration')">
                    <router-link to="/administration">Администрирование</router-link>
                </li>
                <li class="link-item">
                    <router-link to="/faq">FAQ</router-link>
                </li>
            </ul>

            <v-spacer></v-spacer>

            <v-btn icon>
                <v-icon>mdi-cog</v-icon>
            </v-btn>

            <v-btn
                icon
                @click="$store.dispatch('changeNotificationVisible')"
                :style="{ opacity: !$store.getters.getNotificationVisible ? '1' : '0' }"
            >
                <v-badge
                    overlap
                    :color="Constants.STYLE.SUCCESS"
                    :content="$store.getters.getNotificationItemsDotLength"
                    :value="$store.getters.getNotificationItemsDotLength"
                >
                    <v-icon>mdi-bell</v-icon>
                </v-badge>
            </v-btn>

            <v-btn icon @click="$store.dispatch('auth/logout')">
                <v-icon>mdi-exit-to-app</v-icon>
            </v-btn>
        </v-app-bar>
    </div>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    name: 'navbar',

    data: () => ({ Constants, logoPath: require('@/assets/images/logo_header.png') }),
    computed: {
        userRole() {
            return this.$store.getters['auth/getUserRole'];
        },
        roleClaims() {
            return this.$store.getters['auth/getRoleClaims'];
        },
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

<style scoped>
.navbar {
    padding: 0 30px;
}

.link-wrapper {
    list-style-type: none;
    display: flex;
    align-items: center;
    padding: unset;
}

.link-item > a {
    position: relative;
    padding: 8px 16px;
}

.link-item > a {
    text-decoration: none;
    color: #828282;
    border-radius: 5px;
}

a.router-link-active {
    color: #fff;
    background-color: var(--success-color);
}

@media (max-width: 950px) {
    .navbar {
        padding: 0;
    }

    .link-item > a {
        margin: 0 20px 0 0;
    }
}
</style>
