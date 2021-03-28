<template>
    <v-text-field
        style="max-width: 90px"
        label="чч:мм"
        prepend-icon="mdi-clock-time-eight-outline"
        :disabled="disabled"
        v-mask="'##:##'"
        :rules="inputRules"
        v-model="time"
    ></v-text-field>
</template>

<script>
export default {
    props: {
        propsTimeValidator: {
            type: Object,
            // required: true,
        },
    },

    data: () => ({
        disabled: false,
        time: undefined,
        inputRules: [v => !!v],
        regTime: /^(?:0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
    }),

    methods: {
        /** Вылидация времени
         *
         * @param val
         */
        timeValidation(val) {
            if (Array.isArray(val)) {
                return null;
            }
            let regEx = val.match(this.regTime);

            if (regEx == null) {
                this.inputRules[0] = false;
                this.showBtnStart = true;
            } else {
                this.inputRules[0] = true;
                this.showBtnStart = false;
            }
        },
    },

    watch: {
        time(val) {
            this.timeValidation(val);
        },
    },

    mounted() {
        this.start();
    },
};
</script>

<style></style>
