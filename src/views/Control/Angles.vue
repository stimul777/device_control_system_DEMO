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
            name: 'Ракурсы',
            id: 'angles',
            patch: '/anglesDevices',
        },
    }),
};
</script>
