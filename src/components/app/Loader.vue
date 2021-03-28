<template>
    <v-row>
        <ProgressCircular :progressCircularProps="progressCircularProps" style="top: 40%; left: 50%;" />
    </v-row>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    components: {
        ProgressCircular: () => import('@/components/app/ProgressCircular'),
    },
    data: () => ({
        Constants,
        progressCircularProps: {
            size: 40,
            color: Constants.STYLE.SUCCESS,
        },
    }),
};
</script>
