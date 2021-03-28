<template>
    <v-col sm="4" md="3">
        <v-text-field label="Введите названиe..." v-model="inputName"></v-text-field>
        <v-textarea
            auto-grow
            rows="3"
            dense
            :counter="counterText"
            label="Комментарий"
            value="dfdfdfdf"
            v-model="inputComment"
            class="textArea-Table"
            :error="errorText"
        ></v-textarea>

        <v-btn style="left: 60%" class="btn btn-success" :disabled="disabledBtn" @click="newDirectory()"
            >Сохранить</v-btn
        >
    </v-col>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    props: {
        activatedTabProps: {
            type: String,
            required: true,
        },
    },
    data: () => ({
        inputName: '',
        inputComment: '',
        errorText: false,
        counterText: 120,
        disabledBtn: false,
    }),

    methods: {
        ...mapActions(['addNewDirectory']),
        /** Получение новой директории
         * @returns {Promise<void>}
         */
        async newDirectory() {
            let newCard = {
                name: this.inputName,
                comment: this.inputComment,
            };

            await this.addNewDirectory({ activatedTabProps: this.activatedTabProps, newCard: newCard });
            this.$emit('tabActiv', this.activatedTabProps);
        },
    },

    watch: {
        inputComment() {
            this.inputComment.length < this.counterText
                ? ((this.errorText = false), (this.disabledBtn = false))
                : ((this.errorText = true), (this.disabledBtn = true));
        },
    },
};
</script>

<style scoped></style>
