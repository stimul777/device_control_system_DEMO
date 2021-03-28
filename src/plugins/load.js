import Vuex from 'vuex';
import store from '../store';

export default {
    install(Vue) {
        /**
         * @param {async Function} action - действие при запросе
         * @param {Function} errHandler - функция с логикой при ошибках ответа от сервера
         * @param {Function} networkHandler - функция с логикой при ошибках сети
         * @returns {undefined} - функция является процедурой
         */
        Vue.prototype.$load = Vuex.Store.prototype.$load = async (action, errHandler, networkHandler) => {
            try {
                await action();
            } catch (e) {
                // * Если запрос завершился не со статусами 2xx
                if (e.response) {
                    // * Если ответ от сервера пришёл
                    if (errHandler) errHandler(); // * Выполнение функции-обработчика (если передана)
                    if (e.response.data.error) {
                        // * Если в ответе есть кастомное сообщение (приходит с мидла)
                        const error = e.response.data.error?.message.join('\n');
                        store.dispatch('snackError', `API ERROR (CUSTOM): ${error}`);
                        // console.error(' API ERROR (CUSTOM):', error);
                    } else {
                        // * Если кастомного сообщение об ошибке нет
                        store.dispatch('snackError', `API ERROR (SERVER): ${e.message}`);
                        console.error(' API ERROR (SERVER):', e.message);
                    }
                } else {
                    // * Если ответ от сервера не пришёл
                    if (networkHandler) networkHandler(); // * Выполнение функции-обработчика (если передана)
                    store.dispatch('snackError', `API ERROR (CRITICAL): ${e.message}`);
                    // console.error(' API ERROR (CRITICAL):', e.message);
                }
            }
        };
    },
};
