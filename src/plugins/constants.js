export const Constants = {
    VERSION: process.env.VUE_APP_VERSION,
    ROLE: {
        OPERATOR: {
            ruName: 'Оператор',
            value: 'Operator',
        },
        SUPER_ADMIN: {
            ruName: 'Суперадминистратор',
            value: 'SuperAdmin',
        },
        ADMIN: {
            ruName: 'Администратор',
            value: 'Admin',
        },
    },
    CLAIMS: {
        R_ADMINISTRATION_ACCESS: 'r/Administration/Access',
        R_ADMINISTRATION: 'r/Administration',
        R_CONTROL: 'r/Control',
        C_CONTROL: 'c/Control',
        R_HOME: 'r/Home',
        R_MONITORING: 'r/Monitoring',
    },
    CODE_STATUSES: {
        CODE_STATUSES_DEFAULT: '00000000-0000-0000-0000-000000000000',
        CODE_STATUSES_1: '00000000-0000-0000-0000-000000000001',
        CODE_STATUSES_2: '00000000-0000-0000-0000-000000000002',
        CODE_STATUSES_3: '00000000-0000-0000-0000-000000000003',
        CODE_STATUSES_4: '00000000-0000-0000-0000-000000000004',
        CODE_STATUSES_5: '00000000-0000-0000-0000-000000000005',
        CODE_STATUSES_6: '00000000-0000-0000-0000-000000000006',
        CODE_STATUSES_7: '00000000-0000-0000-0000-000000000007',
        CODE_STATUSES_8: '00000000-0000-0000-0000-000000000008',
    },
    SHORT_CODE_STATUSES: {
        STATUSES_0: '0',
        STATUSES_00: '000000',
        STATUSES_1: '1',
        STATUSES_01: '000000000001',
        STATUSES_2: '2',
        STATUSES_02: '000000000002',
        STATUSES_3: '3',
        STATUSES_4: '4',
        STATUSES_5: '5',
        STATUSES_6: '6',
    },
    FILTER_TYPE: {
        TYPE_1: 1, //Неизвестный
        TYPE_2: 2,
        TYPE_3: 3, //Сервера
        TYPE_4: 4, //Коммутаторы
        TYPE_5: 5, //Хранилища
    },
    FILTER_STATUS: {
        STATUS_1: 1,
        STATUS_2: 2,
        STATUS_3: 3,
        STATUS_4: 4,
        STATUS_5: 5,
        STATUS_6: 6,
        STATUS_7: 7,
    },
    EVENT_MESSAGES: {
        WARNING: {
            TEXT: 'Предупреждение',
            CODE: '13XXrg023',
        },
        ERROR: {
            TEXT: 'Ошибка',
            CODE: '',
        },
        CRITICAL: {
            TEXT: 'Критический',
            CODE: '13XXrg023',
        },
        INFORMATIONAL: {
            TEXT: 'Информационный',
            CODE: 'ffXXrg023',
        },
    },
    LOCALIZATION_DATA: {
        MONDAY: { name: 'Пн', value: 'monday' },
        TUESDAY: { name: 'Вт', value: 'tuesday' },
        WEDNESDAY: { name: 'Ср', value: 'wednesday' },
        THURSDAY: { name: 'Чт', value: 'thursday' },
        FRIDAY: { name: 'Пт', value: 'friday' },
        SATURDAY: { name: 'Сб', value: 'saturday' },
        SUNDAY: { name: 'Вс', value: 'sunday' },
        LANGUAGE: 'ru-RU',
    },
    EQUIPMENT: {
        SERVERS: 'Серверы',
        SWITCHES: 'Коммутаторы',
        NETWORK_STORAGES: 'Сетевые хранилища',
    },
    RANGE_API: {
        API_1: process.env.VUE_APP_RANGE_API_1,
        API_2: process.env.VUE_APP_RANGE_API_2,
    },
    STATUS_TEXT: {
        BAD: 'bad',
        OK: 'ok',
        NONE: 'none',
    },
    STYLE: {
        PRIMARY: process.env.VUE_APP_PRIMARY || 'grey',
        SUCCESS: process.env.VUE_APP_SUCCESS || 'grey',
        DEFAULT: process.env.VUE_APP_DEFAULT || 'grey',
    },
};

export default {
    install(Vue) {
        Vue.prototype.$constants = Constants;
    },
};
