<template>
    <v-snackbar
        v-model="snack.show"
        :timeout="snack.timeout"
        :color="snack.color"
        dark
        bottom
        left
        style="z-index: 2000"
    >
        <span class="snack-text">({{ time }}) {{ snack.message }}</span>

        <template v-slot:action="{ attrs }">
            <div v-show="snack.alertShow">
                <v-btn
                    class="alert-btn"
                    color="#fff"
                    dense
                    text
                    v-bind="attrs"
                    @click="$store.dispatch('alertUserResponse', true)"
                >
                    <span>Да</span>
                </v-btn>
                <v-btn class="alert-btn" color="#fff" dense text v-bind="attrs" @click="snack.show = false">
                    <span>Нет</span>
                </v-btn>
                <v-btn color="#fff" dense text v-bind="attrs" @click="snack.show = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>
        </template>
    </v-snackbar>
</template>

<script>
export default {
    data: () => ({
        interval: null,
        time: 0,
    }),

    computed: {
        snack() {
            return this.$store.getters.snackSettings;
        },

        show() {
            return this.$store.getters.snackSettings.show;
        },

        alertShow() {
            return this.$store.getters.snackSettings.alertShow;
        },
    },

    watch: {
        show(v) {
            if (v) {
                this.time = Math.floor(this.$store.getters.snackSettings.timeout / 1000);
                this.interval = setInterval(() => {
                    this.time / 1000;
                    this.time > 0 ? this.time-- : this.time;
                }, 1000);
            } else {
                clearInterval(this.interval);
            }
        },
    },
};
</script>

<style scoped>
.snack-text {
    font-size: 14px;
    font-weight: 500;
}

.alert-btn {
    font-weight: 500;
    font-weight: 500;
    border: 0.5px solid white;
    margin: 5px;
}
</style>
