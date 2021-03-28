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
            name: 'Группы',
            id: 'groups',
            patch: '/groupsDevices',
        },
    }),
};
</script>
