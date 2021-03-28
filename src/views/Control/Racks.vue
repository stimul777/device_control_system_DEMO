<template>
    <DeviceGroup :propsDeviceType="typeDevice" />
</template>

<script>
export default {
    components: {
        DeviceGroup: () => import('@/components/Control/DeviceGroup/DeviceGroup'),
    },

    data: () => ({
        typeDevice: {
            name: 'Стойки',
            id: 'racks',
            patch: '/racksDevices',
        },
    }),
};
</script>
