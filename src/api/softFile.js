import axios from 'axios';

export default function(instance) {
    return {
        get() {
            return instance.get('DEMO_VERSION');
        },
        delete(uuid) {
            return instance.delete(`DEMO_VERSION${uuid}`);
        },
        // создать новый файл в репозитории
        patch(payload) {
            return instance.patch(`DEMO_VERSION`, payload);
        },
        post(payload) {
            return instance.post('DEMO_VERSION', payload);
        },

        // связать ПО и OSList
        putEdit(payload) {
            return instance.put(`DEMO_VERSION${payload.uuidFile}/${payload.uuidOS}`);
        },

        // обновить информацию о ПО
        updateFile(payload) {
            return instance.patch('DEMO_VERSION', payload);
        },

        // передача файла
        async put(payload, $store, timeout) {
            //axiosSource - необходимо для корректной остановки запроса загрузки образа в репозиторий
            const axiosSource = axios.CancelToken.source();
            let request = { cancel: axiosSource.cancel, msg: 'Loading...' };
            $store.dispatch('updateRequestCancel', request);
            $store.dispatch('requestCancel', false);

            try {
                await axios.put(payload.url, payload.file, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    cancelToken: axiosSource.token,

                    onUploadProgress(progressEvent) {
                        $store.dispatch('uploadProgressSystem', progressEvent);
                    },
                    timeout: timeout,
                });
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log(err.message);
                    $store.dispatch('requestCancel', true);
                }
                console.log(err.message);
            }
        },

        // после успешной загрузки файла в репозиторий говорим мидлу, что мы его загрузили полностью
        putConfirm(uuid) {
            console.log('payload', uuid);
            return instance.put(`DEMO_VERSION/${uuid}`);
        },
    };
}
