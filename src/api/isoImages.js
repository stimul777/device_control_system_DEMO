import axios from 'axios';

export default function(instance) {
    return {
        get() {
            return instance.get('DEMO_VERSION');
        },

        delete(uuid) {
            return instance.delete(`DEMO_VERSION/${uuid}`);
        },
        post(payload) {
            return instance.post('DEMO_VERSION', payload);
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

        // обновить информацию об образе
        updateFile(payload) {
            return instance.put('DEMO_VERSION', payload);
        },

        // после успешной загрузки файла в репозиторий говорим беку, что мы его загрузили полностью
        putConfirm(uuid) {
            return instance.put(`DEMO_VERSION ${uuid}`);
        },

        // связать ОС и OSList
        putEdit(payload) {
            console.log('!!!', payload);
            return instance.put(`DEMO_VERSION ${payload.uuidFile}/${payload.uuidOS}`);
        },
    };
}
