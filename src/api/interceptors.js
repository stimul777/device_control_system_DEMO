import store from '../store';
import instance from './instance';

/**
 * Перехватчик всех ответов от сервера для обновления jwt-токена в случае поступления нового в хэдере
 */
instance.interceptors.response.use(response => {
    if (response.headers.authorization) {
        // если хэдер ответа содержит authorization
        const jwtToken = response.headers.authorization.replace(/Bearer /g, '');
        // повторный запуск токена при обновлении JwtToken
        store.dispatch('startSocket');
        store.commit('auth/setJwtToken', jwtToken);
    }

    // * Возвращается развёрнутый JSON ответа
    return response.data;
});

/**
 * Перехватчик всех запросов для вставки jwt-токена
 */
instance.interceptors.request.use(config => {
    if (store.getters['auth/getJwtToken']) {
        config.headers['Authorization'] = `Bearer ${store.getters['auth/getJwtToken']}`;
    }
    // * Возвращается развёрнутый JSON ответа
    return config;
});
