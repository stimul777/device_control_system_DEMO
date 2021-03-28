<template>
    <div class="title-wrapper" :style="userStyle">
        <div class="title-block">
            <h1 class="title-text">{{ title || 'Главная' }}</h1>
        </div>

        <ul class="breadcrumbs_wrapper">
            <li v-for="(b, i) of nameArrPath" :key="i" class="breadcrumbs_items">
                <router-link
                    :to="arrPath[i]"
                    class="breadcrumbs_link"
                    :class="i === nameArrPath.length - 1 ? 'disabled_link' : ''"
                    >{{ breadName(i) }}</router-link
                >
            </li>
        </ul>

        <div class="find">
            <v-text-field dense placeholder="Поиск" append-icon="mdi-magnify"></v-text-field>
        </div>
    </div>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    props: ['title', 'route'],
    data: () => ({ Constants }),

    computed: {
        fullPath() {
            return this.route.path === '/' ? '/home' : this.route.path || '/';
        },
        nameArrPath() {
            return this.fullPath.split('/').filter(v => v !== '');
        },
        arrPath() {
            let resArr = [];

            for (let i = 0; i < this.nameArrPath.length; i++) {
                let mediArr = [];
                for (let j = 0; j <= i; j++) {
                    mediArr.push(this.nameArrPath[j]);
                }
                resArr.push('/' + mediArr.join('/'));
            }

            if (resArr[0] === '/home') {
                return '/';
            } else {
                return resArr;
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

    methods: {
        breadName(i) {
            return this.$router.options.routes.find(v => v.path === this.arrPath[i]).meta.title;
        },
    },
};
</script>

<style scoped>
.title-wrapper {
    margin: 0px 0 0 0;
    width: 100%;
    height: 62px;
    position: relative;
}

.title-wrapper::after {
    content: '';
    display: block;
    height: 4px;
    width: 100%;
    left: 100px;
    position: absolute;
    background-color: var(--success-color);
}

.title-block {
    width: 330px;
    height: 100%;
    background-color: var(--success-color);
    -webkit-mask-image: url('../../assets/images/header-el.svg');
    mask-image: url('../../assets/images/header-el.svg');
    left: 0px;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
}

.title-text {
    color: #fff;
    font-weight: 700;
    font-size: 18px;
}

.find {
    width: 300px;
    position: absolute;
    right: 25px;
    bottom: 0px;
}

.breadcrumbs_wrapper {
    position: absolute;
    left: 315px;
    top: 40%;
    display: flex;
    list-style: none;
}

.breadcrumbs_items {
    margin: 0 5px 0 0;
}

.breadcrumbs_link {
    text-decoration: none;
}

.breadcrumbs_items:last-child > a::after {
    content: '';
}

.breadcrumbs_link::after {
    display: inline;
    content: ' >';
    color: #000;
    pointer-events: none;
    cursor: default;
}

.disabled_link {
    pointer-events: none;
    cursor: default;
    color: gray;
}
</style>
