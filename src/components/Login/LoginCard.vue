<template>
    <v-container style="height: 100vh" class="d-flex justify-center align-center">
        <div class="card">
            <div class="card-wrapper">
                <div class="card-title">
                    <div class="card-logo">
                        <div class="card-logo__img">
                            <v-img src="@/assets/images/logo_auth.png" width="100%" />
                        </div>
                        <div class="card-logo__text">Element Management System</div>
                    </div>
                </div>
                <router-view />
            </div>
        </div>
    </v-container>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    name: 'navbar',

    data: () => ({ Constants }),
};
</script>

<style scoped>
.card {
    background: #ffffff !important;
    box-shadow: 0px 4px 80px rgba(0, 0, 0, 0.15) !important;
    border-radius: 16px !important;
    width: 560px;
    height: 460px;
    display: flex;
    justify-content: center;
    font-weight: 500;
}

.card-wrapper {
    width: 300px;
    height: 100%;
    padding: 56px 0 39px 0;
}

.card-logo {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.card-logo__img {
    width: 131px;
}
.card-logo__text {
    width: 78px;
    font-size: 12px;
    color: #858585;
    line-height: 1.2;
}
</style>
