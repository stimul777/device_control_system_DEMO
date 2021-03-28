<template>
    <v-dialog v-model="dialog" min-width="450" max-width="550">
        <v-card>
            <v-card-title>
                {{ textDialog }}
            </v-card-title>
            <v-card-subtitle>
                {{ textDialogBody }}
            </v-card-subtitle>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="closeDialog((agree = true))">
                    Да
                </v-btn>
                <v-btn color="green darken-1" text @click="closeDialog((agree = false))">
                    Нет
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['textDialog', 'rowIndex', 'openDialog', 'textDialogBody'],
    data() {
        return {
            dialog: this.openDialog,
            agree: false,
        };
    },
    methods: {
        closeDialog(agree) {
            let response = {
                agree: agree,
                closeDialog: false,
                item: this.rowIndex,
            };
            this.$emit('showDialogRemove', response);
        },
    },
};
</script>

<style scoped></style>
