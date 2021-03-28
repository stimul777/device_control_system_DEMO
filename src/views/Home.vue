<template>
    <v-container fluid>
        <div class="container-wrapper">
            <div class="card" v-for="card of cardsData" :key="card.uuid">
                <router-link :to="card.path" class="link">
                    <div class="card-wrapper">
                        <div class="card-content">
                            <h2 class="card-title">{{ card.name }}</h2>
                            <p class="card-subtitle">{{ card.comment }}</p>
                        </div>
                        <div class="card-status-wrapper">
                            <div class="card-statuses">
                                <div class="card-status">
                                    <v-icon color="red" size="20px">mdi-alert-circle</v-icon>
                                    <span class="card-status-count">
                                        {{
                                            card.states.find(v =>
                                                v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_4),
                                            ).count
                                        }}
                                    </span>
                                </div>
                                <div class="card-status">
                                    <v-icon color="#FFB017" size="20px">mdi-alert</v-icon>
                                    <span class="card-status-count">
                                        {{
                                            card.states.find(v =>
                                                v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_3),
                                            ).count
                                        }}
                                    </span>
                                </div>
                                <div class="card-status">
                                    <v-icon color="#0066A1" size="20px">mdi-wrench</v-icon>
                                    <span class="card-status-count" size="20px">
                                        {{
                                            card.states.find(v =>
                                                v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_6),
                                            ).count
                                        }}
                                    </span>
                                </div>
                                <div class="card-status">
                                    <v-icon color="#00BE6E" size="20px">mdi-check-circle</v-icon>
                                    <span class="card-status-count">
                                        {{
                                            card.states.find(v =>
                                                v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_2),
                                            ).count
                                        }}
                                    </span>
                                </div>
                                <div class="card-status">
                                    <v-icon color="#999999" size="20px">mdi-close-circle</v-icon>
                                    <span class="card-status-count">
                                        {{
                                            card.states.find(v =>
                                                v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_5),
                                            ).count
                                        }}
                                    </span>
                                </div>
                            </div>
                            <div class="card-status-all">{{ card.statesAll }}</div>
                        </div>
                        <img :src="require(`@/assets/images/home/${card.image}`)" class="card-img" />
                    </div>
                </router-link>
            </div>

            <div class="card" v-if="nonTypeCount">
                <div class="card-wrapper">
                    <div class="card-content">
                        <h2 class="card-title">Нетипизированное оборудование</h2>
                        <p class="card-subtitle">Группы ресурсов сети. Небольшой текст про группы ресурсов сети</p>
                    </div>
                    <div class="card-status-wrapper">
                        <div class="card-statuses" style="opacity: 0">.</div>
                        <div class="card-status-all">{{ nonTypeCount }}</div>
                    </div>
                    <img :src="require(`@/assets/images/home/nontype.svg`)" class="card-img" />
                </div>
            </div>
        </div>
    </v-container>
</template>

<script>
import { Constants } from '@/plugins/constants';

export default {
    data: () => ({
        cardsData: [],
        nonTypeCount: 0,

        pathPageEquip: {
            '00000000-0000-0000-0000-000000000003': '/monitoring/equipment/servers',
            '00000000-0000-0000-0000-000000000004': '/monitoring/equipment/switches',
            '00000000-0000-0000-0000-000000000005': '/monitoring/equipment/storages',
        },

        images: {
            '00000000-0000-0000-0000-000000000003': 'servers.svg',
            '00000000-0000-0000-0000-000000000004': 'switches.svg',
            '00000000-0000-0000-0000-000000000005': 'storages.svg',
        },
        Constants,
    }),

    methods: {
        /**
         * ! Метод сложный для понимания и чтения
         * TODO: Переписать логику после создания Толей нового единого запроса для дэшборда.
         * @param {String} req - путь для запроса
         * @param {Object | String} pathPage - путь для роута
         * @param {Object | String} images - путь к картинке для карточки
         */
        async fetchData(action, pathPage, images) {
            await this.$load(async () => {
                const data = await action();
                const resData = data
                    .filter(v => !v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1))
                    .map(v => ({
                        ...v,
                        states: v.states.filter(v => !v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1)),
                        statesAll: v.states
                            .filter(v => !v.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1))
                            .map(v => v.count)
                            .reduce((a, b) => a + b, 0),
                        path: typeof pathPage === 'object' ? pathPage[v.uuid] : `${pathPage}?uuid=${v.uuid}`,
                        image: typeof images === 'object' ? images[v.uuid] : images,
                    }));

                if (pathPage === this.pathPageEquip) {
                    resData.sort((a, b) => (a.uuid > b.uuid ? 1 : -1));
                }
                this.cardsData.push(...resData);
            });
        },
    },

    async mounted() {
        await this.fetchData(this.$api.statistics.deviceTypesStatesAll, this.pathPageEquip, this.images);
        await this.fetchData(this.$api.statistics.deviceRacksStatesAll, '/monitoring/equipment/racks', 'racks.svg');
        await this.fetchData(
            this.$api.statistics.deviceGroupsStatesAll,
            '/monitoring/equipment/user_group',
            'groups.svg',
        );
        await this.fetchData(
            this.$api.statistics.deviceAnglesStatesAll,
            '/monitoring/equipment/angle_group',
            'angles.svg',
        );

        /**
         * * Запрос для подсчёта количества девайсов без типов
         */
        const devices = await this.$api.devices.getAll();
        this.nonTypeCount = devices.filter(v =>
            v.deviceType?.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1),
        ).length;
    },
};
</script>

<style scoped>
.container-wrapper {
    display: flex;
    flex-wrap: wrap;
    max-width: 950px;
    margin: 0 auto;
}

.link {
    text-decoration: unset !important;
    color: unset !important;
}

.card {
    width: 437px;
    height: 247px;
    background-color: #f6f6f6;
    border-radius: 6px;
    margin: 16px;
    position: relative;
}

.card:hover {
    background-color: #fff;
    transition: 0.2s;
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.08), 4px 4px 24px rgba(0, 0, 0, 0.08);
}

.card-wrapper {
    padding: 32px 24px 34px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-content {
    width: 210px;
    word-break: break-all;
}
.card-title {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 16px;
    margin-bottom: 24px;
}
.card-subtitle {
    font-size: 13px;
    line-height: 1.35;
}
.card-status-wrapper {
    display: flex;
    justify-content: space-between;
}
.card-statuses {
    display: flex;
    justify-content: space-between;
    margin-right: 25px;
    width: 250px;
}
.card-status {
    font-weight: 12px;
}

.card-status-count {
    margin-left: 3px;
    font-size: 12px;
    font-weight: 500;
}

.card-status-all {
    font-weight: 700;
    font-size: 52px;
    line-height: 0;
}

.card-img {
    position: absolute;
    border-radius: 0 5px 0 0;
    top: 0;
    right: 0;
}

@media (max-width: 1000px) {
    .container-wrapper {
        max-width: 500px;
    }
}

@media (min-width: 1550px) {
    .container-wrapper {
        max-width: 1450px;
    }
}
</style>
