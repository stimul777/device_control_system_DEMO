import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import { Constants } from '@/plugins/constants';

Vue.use(VueRouter);

const routes = [
    // App
    {
        path: '/',
        name: 'Home',
        meta: { layout: 'main', title: 'Главная', protection: [Constants.CLAIMS.R_HOME] },
        component: () => import('@/views/Home.vue'),
    },
    {
        path: '/not-role',
        name: 'EmptyRoles',
        meta: { layout: 'main', title: '', protection: [] },
        component: () => import('@/views/Home.vue'),
    },
    {
        path: '/login',
        name: 'LoginAuth',
        meta: { layout: 'auth', protection: '' },
        component: () => import('@/components/Login/LoginAuth.vue'),
    },
    {
        path: '/login/forgotPass',
        name: 'LoginForgot',
        meta: { layout: 'auth', protection: '' },
        component: () => import('@/components/Login/LoginForgot.vue'),
    },
    {
        path: '/login/2auth',
        name: 'Login2F',
        meta: { layout: 'auth', protection: '' },
        component: () => import('@/components/Login/Login2F.vue'),
    },

    // Monitoring
    {
        path: '/monitoring',
        name: 'Monitoring',
        meta: { layout: 'main', title: 'Мониторинг', protection: [Constants.CLAIMS.R_MONITORING] },
        component: () => import('@/views/Monitoring/Monitoring.vue'),
    },
    // Журналы
    {
        path: '/monitoring/event_log',
        name: 'EventLog',
        meta: { layout: 'main', title: 'Журнал событий', protection: [Constants.CLAIMS.R_MONITORING] },
        component: () => import('@/views/Monitoring/EventLog.vue'),
    },
    {
        path: '/monitoring/audit_log',
        name: 'AuditLog',
        meta: { layout: 'main', title: 'Журнал аудита', protection: [Constants.CLAIMS.R_MONITORING] },
        component: () => import('@/views/Monitoring/AuditLog.vue'),
    },
    {
        path: '/monitoring/quest_log',
        name: 'QuestLog',
        meta: { layout: 'main', title: 'Журнал заданий', protection: [Constants.CLAIMS.R_MONITORING] },
        component: () => import('@/views/Monitoring/QuestLog.vue'),
    },
    {
        path: '/monitoring/networking_log',
        name: 'NetworkingLog',
        meta: { layout: 'main', title: 'Журнал взаимосвязей', protection: [Constants.CLAIMS.R_MONITORING] },
        component: () => import('@/views/Monitoring/NetworkingLog.vue'),
    },
    {
        path: '/monitoring/notification_log',
        name: 'NotificationLog',
        meta: { layout: 'main', title: 'Журнал оповещений', protection: [Constants.CLAIMS.R_MONITORING] },
        component: () => import('@/views/Monitoring/NotificationLog.vue'),
    },

    // Мониторинг оборудования
    {
        path: '/monitoring/equipment',
        name: 'Equipment',
        meta: { layout: 'main', title: 'Мониторинг оборудования', protection: [Constants.CLAIMS.R_MONITORING] },
        component: () => import('@/views/Monitoring/Equipment/Equipment.vue'),
    },
    {
        path: '/monitoring/equipment/device_charts',
        name: 'DeviceCharts',
        meta: { layout: 'main', title: 'Графики', protection: [Constants.CLAIMS.R_MONITORING] },
        component: () => import('@/views/Monitoring/Equipment/DeviceCharts.vue'),
    },
    {
        path: '/monitoring/equipment/servers',
        name: 'ServersTable',
        meta: { layout: 'main', title: 'Серверы', protection: [Constants.CLAIMS.R_MONITORING] },
        component: () => import('@/views/Monitoring/Equipment/Servers.vue'),
    },
    {
        path: '/monitoring/equipment/storages',
        name: 'StoragesTable',
        meta: { layout: 'main', title: 'Хранилища', protection: [Constants.CLAIMS.R_MONITORING] },
        component: () => import('@/views/Monitoring/Equipment/Storages.vue'),
    },
    {
        path: '/monitoring/equipment/switches',
        name: 'SwitchesTable',
        meta: { layout: 'main', title: 'Коммутаторы', protection: [Constants.CLAIMS.R_MONITORING] },
        component: () => import('@/views/Monitoring/Equipment/Switches.vue'),
    },
    {
        path: '/monitoring/equipment/racks',
        name: 'RacksTable',
        meta: { layout: 'main', title: 'Стойки', protection: [Constants.CLAIMS.R_MONITORING] },
        component: () => import('@/views/Monitoring/Equipment/Racks.vue'),
    },
    {
        path: '/monitoring/equipment/user_group',
        name: 'UserGroup',
        meta: { layout: 'main', title: 'Тестовые группы', protection: [Constants.CLAIMS.R_MONITORING] },
        component: () => import('@/views/Monitoring/Equipment/UserGroup.vue'),
    },
    {
        path: '/monitoring/equipment/angle_group',
        name: 'AngleGroup',
        meta: { layout: 'main', title: 'Пользовательские ракурсы', protection: [Constants.CLAIMS.R_MONITORING] },
        component: () => import('@/views/Monitoring/Equipment/AngleGroup.vue'),
    },

    // Control
    {
        path: '/control',
        name: 'Control',
        meta: { layout: 'main', title: 'Управление', protection: [Constants.CLAIMS.R_CONTROL] },
        component: () => import('@/views/Control/Control.vue'),
    },
    {
        path: '/control/detection',
        name: 'Detection',
        meta: { layout: 'main', title: 'Обнаружение', protection: [Constants.CLAIMS.R_CONTROL] },
        component: () => import('@/views/Control/Detection.vue'),
    },
    {
        path: '/control/detection/device',
        name: 'DetectionDevice',
        meta: {
            layout: 'main',
            title: 'Детали обнаружения',
            protection: [Constants.CLAIMS.R_CONTROL, Constants.CLAIMS.C_CONTROL],
        },
        component: () => import('@/views/Control/DetectionDevice.vue'),
    },
    {
        path: '/control/tasks',
        name: 'ControlTasks',
        meta: { layout: 'main', title: 'Задания', protection: [Constants.CLAIMS.R_CONTROL] },
        component: () => import('@/views/Control/Tasks.vue'),
    },
    {
        path: '/control/servers',
        name: 'Servers',
        meta: { layout: 'main', title: 'Серверы', protection: [Constants.CLAIMS.R_CONTROL] },
        component: () => import('@/views/Control/Servers.vue'),
    },
    {
        path: '/control/storage',
        name: 'Storage',
        meta: { layout: 'main', title: 'Хранилища', protection: [Constants.CLAIMS.R_CONTROL] },
        component: () => import('@/views/Control/Storage.vue'),
    },
    {
        path: '/control/switches',
        name: 'Switches',
        meta: { layout: 'main', title: 'Коммутаторы', protection: [Constants.CLAIMS.R_CONTROL] },
        component: () => import('@/views/Control/Switches.vue'),
    },
    {
        path: '/control/racks',
        name: 'Racks',
        meta: { layout: 'main', title: 'Стойки', protection: [Constants.CLAIMS.R_CONTROL] },
        component: () => import('@/views/Control/Racks.vue'),
    },
    {
        path: '/control/groups',
        name: 'Groups',
        meta: { layout: 'main', title: 'Группы', protection: [Constants.CLAIMS.R_CONTROL] },
        component: () => import('@/views/Control/Groups.vue'),
    },
    {
        path: '/control/angles',
        name: 'Angles',
        meta: { layout: 'main', title: 'Ракурсы', protection: [Constants.CLAIMS.R_CONTROL] },
        component: () => import('@/views/Control/Angles.vue'),
    },
    {
        path: '/control/servers/systemBoot',
        name: 'systemBoot',
        meta: { layout: 'main', title: 'Установка системы', protection: [Constants.CLAIMS.R_CONTROL] },
    },

    // Administration
    {
        path: '/administration',
        name: 'Administration',
        meta: { layout: 'main', title: 'Администрирование', protection: [Constants.CLAIMS.R_ADMINISTRATION] },
        component: () => import('@/views/Administration/Administration.vue'),
    },
    {
        path: '/administration/access',
        name: 'Access',
        meta: { layout: 'main', title: 'Права доступа', protection: ['r/Administration/Access'] },
        component: () => import('@/views/Administration/Access.vue'),
    },
    {
        path: '/administration/notifications',
        name: 'Notifications',
        meta: { layout: 'main', title: 'Оповещения', protection: [Constants.CLAIMS.R_ADMINISTRATION] },
        component: () => import('@/views/Administration/Notifications.vue'),
    },
    {
        path: '/administration/network',
        name: 'Network',
        meta: { layout: 'main', title: 'Сеть', protection: [Constants.CLAIMS.R_ADMINISTRATION] },
        component: () => import('@/views/Administration/Network.vue'),
    },
    {
        path: '/administration/compDevices',
        name: 'CompDevices',
        meta: { layout: 'main', title: 'Компоненты оборудования', protection: [Constants.CLAIMS.R_ADMINISTRATION] },
        component: () => import('@/views/Administration/CompDevices.vue'),
    },
    {
        path: '/administration/tasks',
        name: 'Tasks',
        meta: { layout: 'main', title: 'Задачи', protection: [Constants.CLAIMS.R_ADMINISTRATION] },
        component: () => import('@/views/Administration/Tasks.vue'),
    },
    {
        path: '/administration/inventoryParameters',
        name: 'inventoryParameters',
        meta: { layout: 'main', title: 'Параметры инвентаря', protection: [Constants.CLAIMS.R_ADMINISTRATION] },
        component: () => import('@/views/Administration/InventoryParameters.vue'),
    },
    {
        path: '/administration/directory',
        name: 'directory',
        meta: {
            layout: 'main',
            title: 'Справочники организации оборудования',
            protection: [Constants.CLAIMS.R_ADMINISTRATION],
        },
        component: () => import('@/views/Administration/Directory.vue'),
    },
    {
        path: '/administration/backupAndRestore',
        name: 'backupAndRestore',
        meta: {
            layout: 'main',
            title: 'Резервное копирование / восстановление',
            protection: [Constants.CLAIMS.R_ADMINISTRATION],
        },
        component: () => import('@/views/Administration/BackupAndRestore.vue'),
    },
    {
        path: '/administration/authentication',
        name: 'authentication',
        meta: {
            layout: 'main',
            title: 'Аутентификация и авторизация',
            protection: [Constants.CLAIMS.R_ADMINISTRATION],
        },
        component: () => import('@/views/Administration/Authentication.vue'),
    },
    {
        path: '/administration/repository',
        name: 'repository',
        meta: { layout: 'main', title: 'Репозиторий', protection: [Constants.CLAIMS.R_ADMINISTRATION] },
        component: () => import('@/views/Administration/Repository.vue'),
    },
];

const router = new VueRouter({
    mode: process.env.NODE_ENV === 'production' ? '' : 'history',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    const auth = store.getters['auth/getAuthorized'];
    const roles = store.getters['auth/getRoleClaims'];
    const requireAuth = to.matched.some(record => !record.path.startsWith('/login'));
    const guardRoute = to.matched.some(record => roles.some(role => record.meta.protection.includes(role)));

    if (requireAuth && !auth) {
        next('/login');
    } else if (guardRoute) {
        if (!roles.includes(Constants.CLAIMS.R_HOME)) {
            next('/');
        } else if (!roles.includes(Constants.CLAIMS.R_MONITORING)) {
            next('/monitoring');
        } else if (!roles.includes(Constants.CLAIMS.R_ADMINISTRATION)) {
            next('/administration');
        } else if (!roles.includes(Constants.CLAIMS.R_CONTROL)) {
            next('/control');
        } else {
            next('/not-role');
        }
    } else {
        next();
    }

    // * функционал для очистки результатов обнаружения
    if (
        to.path !== '/control/detection' &&
        to.path !== '/control/detection/device' &&
        to.path !== '/control/detection/deviceAll'
    ) {
        if (store.getters['getIcmpResult'].length) {
            store.commit('clearIcmp');
        }
    }
});

export default router;
