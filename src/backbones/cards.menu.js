import Vue from 'vue';
const _vm = new Vue();
import { Constants } from '@/plugins/constants';

/**
 * * 1) Формирование карточек для страницы "Мониторинг"
 */

/** Процедура, которая формирует карточки для типов девайсов
 *
 * @returns {Promise<void>}
 */

const DEVICE_TYPE_UUID = {
    UUID_1: '1',
    UUID_2: '2',
    UUID_3: '3',
    UUID_4: '4',
    UUID_5: '5',
    UUID_6: '6',
};

async function loadDevicesTypesCards() {
    let types;
    await _vm.$load(async () => {
        types = await _vm.$api.devicesTypes.getAll();
    });

    monitoringCards.equipment.types = types
        .filter(deviceType => !deviceType.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1))
        .map(deviceType => {
            let cardInfo;

            switch (deviceType.uuid[deviceType.uuid.length - 1]) {
                case DEVICE_TYPE_UUID.UUID_3:
                    cardInfo = {
                        icon: 'mdi-server',
                        path: '/monitoring/equipment/servers',
                    };
                    break;
                case DEVICE_TYPE_UUID.UUID_4:
                    cardInfo = {
                        icon: 'mdi-switch',
                        path: '/monitoring/equipment/switches',
                    };
                    break;
                case DEVICE_TYPE_UUID.UUID_5:
                    cardInfo = {
                        icon: 'mdi-database',
                        path: '/monitoring/equipment/storages',
                    };
                    break;
            }

            return {
                ...deviceType,
                ...cardInfo,
            };
        });
}

/** Формирует карточки для стоек
 *
 * @returns {Promise<void>}
 */
async function loadDevicesRacksCards() {
    let racks;
    await _vm.$load(async () => {
        racks = await _vm.$api.racks.getAll();
    });

    monitoringCards.equipment.racks = racks
        .filter(rack => !rack.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1))
        .map(rack => ({
            ...rack,
            icon: 'mdi-tournament',
            path: `/monitoring/equipment/racks?uuid=${rack.uuid}`,
        }));
}

/** Формирует карточки для групп
 *
 * @returns {Promise<void>}
 */
async function loadDevicesGroupsCards() {
    let groups;
    await _vm.$load(async () => {
        groups = await _vm.$api.devicesGroups.getAll();
    });

    monitoringCards.equipment.groups = groups
        .filter(group => !group.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1))
        .map(group => ({
            ...group,
            icon: 'mdi-switch',
            path: `/monitoring/equipment/user_group?uuid=${group.uuid}`,
        }));
}

/** Формирует карточки для пользовательских ракурсов
 *
 * @returns {Promise<void>}
 */
async function loadDevicesAnglesCards() {
    let angles;
    await _vm.$load(async () => {
        angles = await _vm.$api.angles.getAll();
    });

    monitoringCards.equipment.angles = angles
        .filter(angle => !angle.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1))
        .map(angle => ({
            ...angle,
            icon: 'mdi-switch',
            path: `/monitoring/equipment/angle_group?uuid=${angle.uuid}`,
        }));
}

function loadEquipmentItems() {
    loadDevicesTypesCards();
    loadDevicesRacksCards();
    loadDevicesGroupsCards();
    loadDevicesAnglesCards();
}

/** Все карточки на страницах меню, кроме дэшборда
 *
 * @type {{equipment: {types: [], angles: [], racks: [], groups: []}, main: []}}
 */
const monitoringCards = {
    main: [],
    equipment: {
        types: [],
        racks: [],
        groups: [],
        angles: [],
    },
};

loadEquipmentItems();

monitoringCards.main = [
    {
        name: 'Мониторинг оборудования',
        comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
        icon: 'mdi-laptop',
        path: '/monitoring/equipment',
    },
    {
        name: 'Журнал событий',
        comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
        icon: 'mdi-calendar-range',
        path: '/monitoring/event_log',
    },
    {
        name: 'Журнал аудита',
        comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
        icon: 'mdi-calendar-text',
        path: '/monitoring/audit_log',
    },
    {
        name: 'Журнал заданий',
        comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
        icon: 'mdi-calendar-check',
        path: '/monitoring/quest_log',
    },
    {
        name: 'Журнал взаимосвязей',
        comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
        icon: 'mdi-calendar-weekend',
        path: '/monitoring/networking_log',
    },
    {
        name: 'Журнал оповещений',
        comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
        icon: 'mdi-calendar-clock',
        path: '/monitoring/notification_log',
    },
];

/** 2) Формирование карточек для страницы "Управление"
 *
 * @type {{extra: [{path: string, name: string, icon: string, comment: string}, {path: string, name: string, icon: string, comment: string}, {path: string, name: string, icon: string, comment: string}, {path: string, name: string, icon: string, comment: string}, {path: string, name: string, icon: string, comment: string}], userProfiles: [{path: string, name: string, icon: string, comment: string}], base: [{path: string, name: string, icon: string, comment: string}, {path: string, name: string, icon: string, comment: string}]}}
 */

const controlCards = {
    base: [
        {
            name: 'Обнаружение',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-text-box-search',
            path: '/control/detection',
        },
        {
            name: 'Задания',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-text-box-multiple',
            path: '/control/tasks',
        },
    ],

    extra: [
        {
            name: 'Серверы',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-server',
            path: '/control/servers',
        },
        {
            name: 'Хранилища',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-dip-switch',
            path: '/control/storage',
        },
        {
            name: 'Коммутаторы',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-electric-switch',
            path: '/control/switches/',
        },
        {
            name: 'Стойки',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-coat-rack',
            path: '/control/racks/',
        },
        {
            name: 'Группы',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-ungroup',
            path: '/control/groups',
        },
    ],

    userProfiles: [
        {
            name: 'Пользовательские ракурсы',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-format-list-bulleted-triangle',
            path: '/control/angles',
        },
    ],
};

/** 3) Формирование карточек для страницы "Администрирование"
 *
 * @type {{extra: ({path: string, name: string, icon: string, comment: string}|{path: string, name: string, icon: string, comment: string}|{path: string, name: string, icon: string, comment: string}|{path: string, name: string, icon: string, comment: string}|{path: string, name: string, icon: string, comment: string})[], base: ({path: string, name: string, icon: string, comment: string}|{path: string, name: string, icon: string, comment: string}|{path: string, name: string, icon: string, comment: string}|{path: string, name: string, icon: string, comment: string}|{path: string, name: string, icon: string, comment: string})[]}}
 */

const adminCards = {
    base: [
        {
            name: 'Аутентификация и авторизация',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-microsoft-outlook',
            path: '/administration/authentication',
        },
        {
            name: 'Сеть',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-wan',
            path: '/administration/network',
        },
        {
            name: 'Дата и время',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-square',
            path: '/',
        },
        {
            name: 'Резервное копирование / восстановление',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-file-restore-outline',
            path: '/administration/backupAndRestore',
        },
        {
            name: 'Учётные записи',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-square',
            path: '/',
        },
        {
            name: 'Права доступа',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-account-lock',
            path: '/administration/access',
        },
    ],

    extra: [
        {
            name: 'Репозиторий',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-source-repository',
            path: '/administration/repository',
        },
        {
            name: 'Задачи',
            comment: 'Описание',
            icon: 'mdi-gesture-tap-button',
            path: '/administration/tasks',
        },
        {
            name: 'Параметры инвентаря',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-bag-checked',
            path: '/administration/inventoryParameters',
        },
        {
            name: 'Компоненты оборудования',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-temperature-celsius',
            path: '/administration/compDevices',
        },
        {
            name: 'Справочники организации оборудования',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-scan-helper',
            path: '/administration/directory',
        },
        {
            name: 'События',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-square',
            path: '/',
        },
        {
            name: 'Оповещения',
            comment: 'Небольшой сопутствующий текст про мониторинг оборудования. Буквально два небольших предложения',
            icon: 'mdi-bell',
            path: '/administration/notifications',
        },
    ],
};

export { monitoringCards, controlCards, adminCards, loadEquipmentItems };
