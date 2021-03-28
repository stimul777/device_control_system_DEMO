<template>
    <v-progress-circular
        :size="progressCircularProps.size"
        :color="progressCircularProps.color"
        indeterminate
    ></v-progress-circular>
</template>

<script>
export default {
    props: {
        progressCircularProps: {
            type: Object,
        },
    },
};
</script>

<style scoped></style>
