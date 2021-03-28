export default {
    components: {
        LogTable: () => import('@/components/Monitoring/LogTable.vue'),
    },
    data() {
        return {
            headers: [],
            items: [],
            plugItems: [],
        };
    },

    mounted() {
        setTimeout(() => {
            this.headers = [
                { text: 'Дата и время', value: 'date' },
                { text: 'Событие', value: 'event' },
                { text: 'Уровень серьезности', value: 'lvl' },
                { text: 'Тип оборудования', value: 'type' },
                { text: 'Идентификатор', value: 'id' },
                { text: 'IP-адрес', value: 'ip', sortable: false },
            ];

            this.items = [
                {
                    date: new Intl.DateTimeFormat('ru-RU', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                    }).format(new Date()),

                    event: 'Не удалось',
                    lvl: '80',
                    type: 'Сервер',
                    id: 'ACMA',
                    ip: '10.7.10.18',
                },
            ];

            for (let i = 0; i < 15; i++) {
                this.plugItems.push(...this.items);
            }
        }, 1000);
    },
};
