export default {
    state: {
        statuses: {
            // undefined
            '00000000-0000-0000-0000-000000000001': {
                icon: 'mdi-help-circle',
                color: '#CCCCCC',
                uuid: '00000000-0000-0000-0000-000000000001',
            },
            // norm
            '00000000-0000-0000-0000-000000000002': {
                icon: 'mdi-check-circle',
                color: '#00BE6E',
                uuid: '00000000-0000-0000-0000-000000000002',
            },
            // warning
            '00000000-0000-0000-0000-000000000003': {
                icon: 'mdi-alert',
                color: '#FFB800',
                uuid: '00000000-0000-0000-0000-000000000003',
            },
            // error
            '00000000-0000-0000-0000-000000000004': {
                icon: 'mdi-alert-circle',
                color: '#E21A1A',
                uuid: '00000000-0000-0000-0000-000000000004',
            },
            // unavailable
            '00000000-0000-0000-0000-000000000005': {
                icon: 'mdi-close-circle',
                color: 'orange',
                uuid: '00000000-0000-0000-0000-000000000005',
            },
            // maintenance
            '00000000-0000-0000-0000-000000000006': {
                icon: 'mdi-wrench',
                color: '#0066A1',
                uuid: '00000000-0000-0000-0000-000000000006',
            },

            //poweroff - тоже самое что и 0001, конфликтует на управлении, исправить, убить
            '00000000-0000-0000-0000-000000000007': {
                icon: 'mdi-help-circle',
                color: '#CCCCCC',
                uuid: '00000000-0000-0000-0000-000000000007',
            },
            //reboot
            '00000000-0000-0000-0000-000000000008': {
                icon: 'mdi-help-circle',
                color: '#CCCCCC',
                uuid: '00000000-0000-0000-0000-000000000008',
            },
        },

        power: {
            on: {
                icon: 'mdi-power-plug-outline',
                color: 'green',
            },
            off: {
                icon: 'mdi-power-plug-off-outline',
                color: 'red',
            },
        },

        labels: {
            norm: 'Доступно',
            warning: 'Предупреждение',
            error: 'Ошибка',
            unavailable: 'Недоступно',
            maintenance: 'На обслуживании',
        },

        uuidFromName: {
            Доступно: '00000000-0000-0000-0000-000000000002',
            Предупреждение: '00000000-0000-0000-0000-000000000003',
            Ошибка: '00000000-0000-0000-0000-000000000004',
            Недоступно: '00000000-0000-0000-0000-000000000005',
            'На обслуживании': '00000000-0000-0000-0000-000000000006',
        },
    },

    getters: {
        getStatuses(state) {
            return state.statuses;
        },
        getLabels(state) {
            return state.labels;
        },
        getUuidFromName(state) {
            return state.uuidFromName;
        },

        getPower(state) {
            return state.power;
        },
    },
};
