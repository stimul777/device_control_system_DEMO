import axios from 'axios';

export default {
    actions: {
        async requestDownloadFile(ctx, payload) {
            await this.$load(async () => {
                // Первый запрос служит для получения второго запроса, который
                // пришлет ссылку для загрузки файла
                await this.$api[payload.connections]
                    .post({
                        name: payload.name,
                    })
                    .then(resolve =>
                        // Передача файла по ссылке, которую прислал в ответе 1 запрос
                        this.$load(async () => {
                            //объект данных для отмены загрузки
                            let res = {
                                url: resolve.fileId,
                                uuid: resolve.uuid,
                                request: this.request,
                            };
                            ctx.commit('updateUuidFile', res);

                            await this.$api[payload.connections].put(
                                {
                                    url: resolve.fileId,
                                    file: payload.selectFile,
                                },
                                payload.store,
                            );

                            if (!ctx.state.reqIsCancel) {
                                // сообщить беку об успешной загрузке передать uuid put запросом
                                await this.$api[payload.connections].putConfirm(resolve.uuid);

                                payload.store.dispatch(
                                    'snackSuccess',
                                    `Файл ${payload.selectFile.name} успешно загружен в репозиторий!`,
                                );
                            }
                        }),
                    );
            });
        },
        async changeUuidFile(ctx, payload) {
            ctx.commit('updateUuidFile', payload);
        },
        updateRequestCancel(ctx, payload) {
            ctx.commit('saveRequestCancel', payload);
        },
        requestCancel(ctx, payload) {
            ctx.commit('isCancelRequest', payload);
        },
    },

    mutations: {
        updateUuidFile(state, value) {
            state.uuidFileDownload = value.uuid;
            state.urlDownload = value.url;
            state.request = value.request;
        },
        saveRequestCancel(state, value) {
            state.request = value;
        },
        isCancelRequest(state, value) {
            state.reqIsCancel = value;
        },
    },
    getters: {
        getUuidFile(state) {
            return state;
        },
    },
    state: {
        uuidFileDownload: null,
        urlDownload: '',
        request: '',
        reqIsCancel: false,
    },
};
