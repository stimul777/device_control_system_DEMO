/** Модуль для системной информации в таблицах
 *
 */
export default {
    install(Vue) {
        Vue.prototype.$tableMessage = {
            'no-data-text': 'Данных нет',
            'loading-text': 'Данные загружаются с сервера',
        };
    },
};
