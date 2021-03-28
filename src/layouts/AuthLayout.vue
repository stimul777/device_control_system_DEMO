<template>
    <v-app class="empty">
        <v-main>
            <LoginCard />
            <SnackBar />
        </v-main>
    </v-app>
</template>

<script>
export default {
    components: {
        LoginCard: () => import('@/components/Login/LoginCard'),
        SnackBar: () => import('@/components/app/SnackBar'),
    },
};
</script>

<style scoped>
.empty {
    background: url('../assets/images/auth_back.png') 0 0 / cover;
}
</style>
