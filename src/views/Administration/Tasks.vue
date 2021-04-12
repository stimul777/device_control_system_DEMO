<template>
    <v-container fluid>
        <v-row>
            <v-tabs align-with-title>
                <v-tab @click="(showUserTasks = true), (showBackgroundTasks = BackgroundTableShow = false)">
                    Пользовательские задачи
                </v-tab>
                <v-tab @click="(showUserTasks = false), (showBackgroundTasks = true)"> Фоновые задачи </v-tab>
                <v-tabs-slider :color="'tabs-slider-success'"></v-tabs-slider>
            </v-tabs>
            <!-- UserTasks: -->
            <v-container fluid v-if="showUserTasks">
                <v-row>
                    <UserTreeView />
                    <UserTableTasks />
                </v-row>
            </v-container>
            <!-- BackgroundTasks: -->
            <v-container fluid v-if="showBackgroundTasks">
                <v-row>
                    <BgrdTreeView @selectTabEmit="selectTabEmit" />
                    <BackgroundTable v-show="BackgroundTableShow" :activTabProps="activTabProps" />
                </v-row>
            </v-container>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'tasks',

    components: {
        // UserTasks:
        UserTreeView: () => import('@/components/Administration/Tasks/UsersTasks/UserTreeView'),
        UserTableTasks: () => import('@/components/Administration/Tasks/UsersTasks/UserTableTasks'),

        // BackgroundTasks:
        BackgroundTable: () => import('@/components/Administration/Tasks/BackgroundTasks/BackgroundTable'),
        BgrdTreeView: () => import('@/components/Administration/Tasks/BackgroundTasks/BgrdTreeView'),
    },

    data: () => ({
        BackgroundTableShow: false,
        activTabProps: String,
        showUserTasks: true,
        showBackgroundTasks: false,
    }),

    methods: {
        selectTabEmit(activeTab) {
            if (activeTab.length !== 0) {
                this.BackgroundTableShow = true;
                this.activeTabProps = activeTab.map(m => m.id).join();
            } else {
                this.BackgroundTableShow = false;
            }
        },
    },
};
</script>
