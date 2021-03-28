import { Constants } from '@/plugins/constants';

export default {
    state: {
        notificationVisible: false,
        notificationItems: [],
        selectedCompAndParam: null,
    },

    actions: {
        changeNotificationVisible(ctx) {
            ctx.state.notificationVisible = !ctx.state.notificationVisible;
        },
        /** Запись сообщений системы
         *
         * @param ctx
         * @param notifications
         */
        setNotifications(ctx, notifications) {
            if (!localStorage.notifications) {
                ctx.state.notificationItems = notifications
                    .map(not => {
                        return {
                            show: true,
                            icon: 'mdi-thermometer-alert',
                            deviceUuid: not.device.uuid,
                            ip: not.device.ipAddress,
                            compName: not.componentType.name,
                            parameter: not.monitoringProfile.name,
                            thresholdValue: not.monitoringProfile.thresholdValue,
                            unit: not.monitoringProfile.parameterType.unit,
                            currentValue: not.measurement.value,
                            unixDate: not.measurement.date,
                            date: new Intl.DateTimeFormat(Constants.LOCALIZATION_DATA.LANGUAGE, {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            }).format(not.measurement.date),
                        };
                    })
                    .reverse();

                localStorage.notifications = JSON.stringify(ctx.state.notificationItems);
            } else {
                ctx.state.notificationItems = JSON.parse(localStorage.notifications);
            }
        },
        /** Обновление массива сообщений
         *
         * @param ctx
         * @param notifications
         */
        updateNotifications(ctx, notifications) {
            if (notifications.length) {
                ctx.state.notificationItems.unshift(
                    ...notifications
                        .map(not => {
                            return {
                                show: true,
                                icon: 'mdi-thermometer-alert',
                                deviceUuid: not.device.uuid,
                                ip: not.device.ipAddress,
                                compName: not.componentType.name,
                                parameter: not.monitoringProfile.name,
                                thresholdValue: not.monitoringProfile.thresholdValue,
                                unit: not.monitoringProfile.parameterType.unit,
                                currentValue: not.measurement.value,
                                unixDate: not.measurement.date,
                                date: new Intl.DateTimeFormat(Constants.LOCALIZATION_DATA.LANGUAGE, {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                }).format(not.measurement.date),
                            };
                        })
                        .reverse(),
                );

                localStorage.notifications = JSON.stringify(ctx.state.notificationItems);
            }
        },
    },

    mutations: {
        removeDot(state, idx) {
            state.notificationItems[idx].show = false;
            localStorage.notifications = JSON.stringify(state.notificationItems);
        },

        removeDotAll(state) {
            state.notificationItems.forEach(v => {
                v.show = false;
            });

            localStorage.notifications = JSON.stringify(state.notificationItems);
        },

        setSelectedCompAndParam(state, param) {
            state.selectedCompAndParam = param;
        },

        clearSelectedCompAndParam(state) {
            state.selectedCompAndParam = null;
        },
    },

    getters: {
        getNotificationVisible: s => s.notificationVisible,
        getNotificationItems: s => s.notificationItems,
        getNotificationItemsDotLength: s => s.notificationItems.filter(v => v.show).length,
        getSelectedCompAndParam: s => s.selectedCompAndParam,
    },
};
