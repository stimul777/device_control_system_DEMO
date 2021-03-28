<template>
    <v-app id="inspire" :style="userStyle">
        <Navbar />
        <TitleBar :title="currentTitile" :route="route" />
        <SnackBar />
        <transition name="fade">
            <Notifications v-if="$store.getters.getNotificationVisible" />
        </transition>
        <div class="version">{{ $constants.VERSION }}</div>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
import Navbar from '@/components/app/Navbar';
import TitleBar from '@/components/app/TitleBar';
import SnackBar from '@/components/app/SnackBar';
import Notifications from '@/components/app/Notifications';
import { Constants } from '@/plugins/constants';

export default {
    name: 'mainlayout',
    components: {
        Navbar,
        TitleBar,
        SnackBar,
        Notifications,
    },
    data: () => ({
        Constants,
        titles: {
            home: 'Главная',
            monitoring: 'Мониторинг',
            control: 'Управление',
            administration: 'Администрирование',
        },

        currentTitile: '',
        path: '',
        route: '',

        intervalNotify: null,
    }),

    updated() {
        let path = this.$route.path.split('/')[1] || 'home';
        this.currentTitile = this.titles[path];
        this.path = this.$route.path === '/' ? '/home' : this.$route.path;

        this.route = this.$route;
    },

    mounted() {
        this.$load(async () => {
            const res = await this.$api.notifications.getParameterTracking({ intervar: 15 });
            this.$store.dispatch('setNotifications', res);
            localStorage.setItem('notifyInterval', true);
        });

        if (!JSON.parse(localStorage.getItem('notifyInterval'))) {
            this.intervalNotify = setInterval(() => {
                this.$load(async () => {
                    const res = await this.$api.notifications.getParameterTracking({ intervar: 1 });
                    this.$store.dispatch('updateNotifications', res);
                });
            }, 1000 * 60);

            localStorage.setItem('notifyInterval', true);
        }

        let path = this.$route.path.split('/')[1] || 'home';
        this.currentTitile = this.titles[path];
        this.path = this.$route.path === '/' ? '/home' : this.$route.path;

        this.route = this.$route;
        this.$store.dispatch('startSocket');
    },

    destroyed() {
        clearInterval(this.intervalNotify);
        localStorage.removeItem('notifyInterval');
        this.$store.dispatch('stopSocket');
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

<style scoped>
.version {
    font-size: 14px;
    font-weight: 700;
    position: absolute;
    bottom: 5px;
    right: 5px;
    background-color: var(--success-color);
    display: block;
    color: #ffffff;
    padding: 0 20px;
    border-radius: 5px;
    z-index: 1000;
}
</style>
