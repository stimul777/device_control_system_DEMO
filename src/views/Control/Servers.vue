<template>
    <DeviceGroup :propsDeviceType="typeDevice" />
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    components: {
        DeviceGroup: () => import('@/components/Control/DeviceGroup/DeviceGroup'),
    },

    data: () => ({
        typeDevice: {
            name: 'Сервер',
            id: 'server',
            patch: `?FilterType=${Constants.FILTER_TYPE.TYPE_3}`,
        },
    }),
};
</script>
