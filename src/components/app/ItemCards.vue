<template>
    <v-row :class="{ 'mt-5': !noneMarginTop }">
        <v-col class="flex-grow-0" v-for="item of cards" :key="item.id">
            <router-link :to="item.path">
                <v-card class="card" outlined>
                    <div class="card-title-wrapper">
                        <div class="card-icon">
                            <v-icon>{{ item.icon }}</v-icon>
                        </div>
                        <h2 class="card-title">{{ item.name }}</h2>

                        <div class="card-desc">
                            <p>{{ item.comment }}</p>
                        </div>
                    </div>
                </v-card>
            </router-link>
        </v-col>
    </v-row>
</template>

<script>
export default {
    props: {
        cards: {
            type: Array,
            required: true,
        },

        noneMarginTop: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
};
</script>

<style scoped>
a {
    text-decoration: none;
}

.card {
    width: 330px;
    height: 175px;
    background-color: #f1f3f5 !important;
    border: unset !important;
}

.card:hover {
    background-color: #fff;
    transition: 0.2s;
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.08), 4px 4px 24px rgba(0, 0, 0, 0.08);
}

.card-title-wrapper {
    padding: 30px 0 0 24px;
}

.card-title {
    font-family: 'RussianRail_G_Pro-400', sans-serif !important;
    font-size: 16px;
    display: inline;
}

.card-icon {
    margin: 0 8px 0 0;
    display: inline-block;
}

.card-desc {
    margin: 20px 0 0 0;
    font-size: 12px;
}
</style>
