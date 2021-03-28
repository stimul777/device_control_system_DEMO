<template>
    <v-btn
        class="btn btn-success"
        :style="waitButtonProps.styleBtn"
        :disabled="waitButtonProps.disabledBtn"
        v-show="waitButtonProps.showBtn"
        :color="waitButtonProps.colorBtn"
    >
        <span>{{ waitButtonProps.textBtn }}</span>
        <v-progress-circular
            indeterminate
            style="position: absolute"
            :color="waitButtonProps.loaderColor"
            :size="waitButtonProps.loaderSize"
            v-show="waitButtonProps.loaderBtn"
        ></v-progress-circular>
    </v-btn>
</template>

<script>
export default {
    props: {
        waitButtonProps: {
            type: Object,
            require: true,
        },
    },

    watch: {
        waitButtonProps() {
            setTimeout(() => {
                this.waitButtonProps.disabledBtn = false;
                this.waitButtonProps.loaderBtn = false;
            }, this.waitButtonProps.setTimeout);
        },
    },
};
</script>

<style></style>
