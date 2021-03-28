import jwt_decode from 'jwt-decode';
import router from '@/router';

export default {
    namespaced: true,

    state: {
        jwtToken: localStorage.getItem('jwtToken') || null,

        /**
         * @var {Array} FrontRole - элементы, которые блочатся (для фронта)
         * * r (read) - чтение (методы get)
         * * с (control) - управление (методы post/patch/put)
         * * 'r/Home' - не показывается в хэдере кнопка "Главная" -> (следовательно) блокируются все запросы, относящиеся к этой вкладке (Передаются в QueryRole)
         * * 'r/Monitoring' - блочится в хэдере кнопка "Мониторинг" -> блокируются все запросы, относящиеся к этой вкладке (Передаются в QueryRole)
         * * 'r/Control' - блочится в хэдере кнопка "Управление" -> блокируются все запросы, относящиеся к этой вкладке (Передаются в QueryRole)
         * * 'с/Control' - блочатся все элементы управления на странице "Управление" -> блокируются только запросы, отвечающие за управление (patch/post/put) (Передаются в QueryRole)
         * * 'r/Administration' - блочится в хэдере кнопка "Администрирования" -> блокируются все запросы, относящиеся к этой вкладке (Передаются в QueryRole)
         * * 'r/Administration/Access' - блочится карточка "Права доступа" -> блокируются только запросы, находящиеся в этой вкладке (Передаются в QueryRole)
         *
         * ? Клеймы
         * * Operator - ['r/Control', 'c/Control', 'r/Administration', 'r/Administration/Access']
         * * Admin - ['r/Administration/Access']
         * * SuperAdmin - []
         * @var {Array} QueryRole - запросы, которые блочатся (для мидла)
         */
        jwtDecodeData: localStorage.getItem('jwtToken') ? jwt_decode(localStorage.getItem('jwtToken')) : null,

        authorized: !!localStorage.getItem('jwtToken'),
        inputError: false,
    },

    mutations: {
        setJwtToken(state, token) {
            localStorage.setItem('jwtToken', token);
            state.jwtDecodeData = jwt_decode(token);
            state.jwtToken = token;
            state.authorized = true;
        },

        destroyJwtToken(state) {
            localStorage.removeItem('jwtToken');
            state.jwtToken = null;
            state.jwtDecodeData = null;
            state.authorized = false;
        },
    },

    actions: {
        /**Авторизаци
         *
         * @param ctx
         * @param username
         * @param password
         */
        login(ctx, { username, password }) {
            this.$load(
                async () => {
                    const response = await this.$api.account.login({ username, password });
                    ctx.state.inputError = false;
                    ctx.commit('setJwtToken', response.jwtToken);
                    router.push('/');
                },
                () => {
                    ctx.state.inputError = true;
                },
                () => {
                    ctx.state.inputError = false;
                },
            );
        },

        /** Выход из учетной записи
         *
         * @param ctx
         * @returns {Promise<void>}
         */
        async logout(ctx) {
            await this.$load(async () => {
                await this.$api.account.logout();
            });

            router.push('/login');
            ctx.commit('destroyJwtToken');
        },
    },

    getters: {
        getJwtToken: s => s.jwtToken,
        getAuthorized: s => s.authorized,
        getInputError: s => s.inputError,
        getJwtDecodeData: s => s.jwtDecodeData,
        getUserRole: s => s.jwtDecodeData.actort,
        getRoleClaims: s =>
            typeof s.jwtDecodeData?.FrontRole == 'string'
                ? s.jwtDecodeData?.FrontRole.split()
                : typeof s.jwtDecodeData?.FrontRole == 'undefined'
                ? []
                : s.jwtDecodeData?.FrontRole,
    },
};
