<template>
    <v-container fluid>
        <v-expansion-panels flat tile accordion>
            <v-expansion-panel v-for="(item, idx) of tasks" :key="item.name">
                <v-expansion-panel-header @click="showUnderTable(item, idx)">
                    <template v-slot:actions>
                        <v-icon></v-icon>
                    </template>
                    <v-simple-table>
                        <thead class="my-table-head" v-if="idx === 0">
                            <tr>
                                <th></th>
                                <th>Тип</th>
                                <th>Задание</th>
                                <th style="min-width: 140px">Формирование</th>
                                <th>Запуск</th>
                                <th style="min-width: 110px">Окончание</th>
                                <th style="min-width: 80px">Статус</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>
                                    <button>
                                        <v-icon>{{ item.menu }}</v-icon>
                                    </button>
                                </td>
                                <td>{{ item.type }}</td>
                                <td>{{ item.task }}</td>
                                <td style="min-width: 140px">{{ item.formation }}</td>
                                <td>{{ item.start }}</td>
                                <td style="min-width: 110px">{{ item.end }}</td>
                                <td style="min-width: 80px" class="text-center">
                                    <v-icon :color="item.status === 'done' ? '#00BE6E' : '#000'">
                                        {{ iconStatus(item.status) }}
                                    </v-icon>
                                </td>
                                <td class="table-action">
                                    <v-btn class="v-btn-action" @click.native.stop="stop(idx)">
                                        <v-icon style="color: #bbb" ref="stopIcon">mdi-stop</v-icon>
                                    </v-btn>
                                    <v-btn class="v-btn-action" @click.native.stop="start(idx)">
                                        <v-icon style="color: #bbb" ref="startIcon">mdi-play</v-icon>
                                    </v-btn>
                                    <v-btn class="v-btn-action" style="padding-bottom: 2px" @click.native.stop>
                                        <v-icon size="16" style="color: #000">mdi-file-document-multiple</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-simple-table>
                        <thead>
                            <tr>
                                <th>Группа</th>
                                <th>Стойка</th>
                                <th>Сервер</th>
                                <th>Произ-ль</th>
                                <th>Модель</th>
                                <th>Серийный №</th>
                                <th>IP-адрес</th>
                                <th>Тек. верс.</th>
                                <th>Новая верс.</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item of underTable" :key="item.ip">
                                <td>{{ item.group }}</td>
                                <td>{{ item.rack }}</td>
                                <td>{{ item.server }}</td>
                                <td>{{ item.boardMfg }}</td>
                                <td>{{ item.model }}</td>
                                <td>{{ item.serial }}</td>
                                <td>{{ item.ip }}</td>
                                <td>{{ item.curVersion }}</td>
                                <td>{{ item.newVersion }}</td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        tasks: [
            {
                type: 'Пользовательское',
                task: 'Обновление BIOS',
                formation: '20.12.2020 18:00',
                start: '21.12.2020 18:00',
                end: '22.12.2020 18:00',
                status: 'done', // update, process
                menu: 'mdi-menu-right',
            },
            {
                type: 'Пользовательское',
                task: 'Обновление BIOS',
                formation: '20.12.2020 18:00',
                start: '21.12.2020 18:00',
                end: '22.12.2020 18:00',
                status: 'update', // update, process
                menu: 'mdi-menu-right',
            },
            {
                type: 'Пользовательское',
                task: 'Обновление BIOS',
                formation: '20.12.2020 18:00',
                start: '21.12.2020 18:00',
                end: '22.12.2020 18:00',
                status: 'process', // update, process
                menu: 'mdi-menu-right',
            },
        ],

        underTable: [
            {
                group: 'Группа 1',
                rack: 'Стойка 1',
                server: 'Резервынй сервер 1',
                boardMfg: 'Электрон',
                serial: '1QWERTY234',
                model: 'Дельта 1',
                ip: '10.7.10.18',
                curVersion: '14',
                newVersion: '15',
            },

            {
                group: 'Группа 2',
                rack: 'Стойка 2',
                server: 'Резервынй сервер 2',
                boardMfg: 'Электрон',
                serial: '1QWERTY234',
                model: 'Дельта 1',
                ip: '10.7.10.19',
                curVersion: '11',
                newVersion: '15',
            },
        ],
    }),

    methods: {
        iconStatus(status) {
            const icons = {
                done: 'mdi-check',
                update: 'mdi-update',
                process: 'mdi-clock-time-four-outline',
            };
            return icons[status];
        },
        start(idx) {
            this.$refs.startIcon[idx].$el.style.color = '#00BE6E';
            this.$refs.stopIcon[idx].$el.style.color = '#BBBBBB';
        },

        stop(idx) {
            this.$refs.stopIcon[idx].$el.style.color = '#FF0000';
            this.$refs.startIcon[idx].$el.style.color = '#BBBBBB';
        },

        showUnderTable(item) {
            if (item.menu === 'mdi-menu-right') {
                item.menu = 'mdi-menu-down';
            } else {
                item.menu = 'mdi-menu-right';
            }
        },
    },
};
</script>

<style scoped>
.my-table {
    font-size: 14px !important;
    border-radius: unset !important;
    border-top: thin solid rgba(0, 0, 0, 0.12) !important;
    border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}

.my-table-head > tr > th {
    font-size: 14px !important;
    color: #000 !important;
    height: 40px !important;
}

tr {
    height: 50px !important;
}

.table-action {
    width: 260px;
}

.v-btn-action {
    width: 36px !important;
    height: 36px !important;
    background: #f6f6f6 !important;
    border-radius: 4px !important;
    margin-right: 4px !important;
    padding: unset !important;
    min-width: unset !important;
    box-shadow: unset !important;
}

.v-expansion-panel-header {
    padding: unset !important;
    cursor: unset !important;
}
</style>
