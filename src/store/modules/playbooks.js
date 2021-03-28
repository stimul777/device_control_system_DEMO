export default {
    actions: {
        async editScriptFile(ctx, itemNameEdit) {
            try {
                this.$api.playbookScripts.updateScriptFile(itemNameEdit);
                ctx.dispatch('snackSuccess', `Установочный скрипт ${itemNameEdit.name} обновлен!`);
            } catch (e) {
                ctx.dispatch('snackError', `Установочный скрипт  ${itemNameEdit.name} не удалось обновить!`);
            }
        },

        removeScript(ctx, item) {
            try {
                ctx.commit('deleteScript', item);

                this.$api.playbookScripts.deleteScriptFile(item.uuid);
                ctx.dispatch('snackSuccess', `Установочный скрипт ${item.name} удален!`);
            } catch (e) {
                ctx.dispatch('snackError', `Установочный скрипт  ${item.name} не удалось удалить!`);
            }
        },
        addNewItemScript(ctx, items) {
            try {
                this.$api.playbookScripts.postCreateScript(items);
                ctx.dispatch('snackSuccess', `Установочный скрипт ${items.name} добавлен!`);
            } catch (e) {
                ctx.dispatch('snackError', `Установочный скрипт  ${items.name} не удалось добавить!`);
            }
            ctx.dispatch('requestAllScript');
        },
        showFormScript(ctx, show) {
            ctx.commit('showFormNewScript', show);
        },
        selectedRowScript(ctx, item) {
            ctx.commit('selectedScript', item);
        },

        async requestAllScript(ctx) {
            const response = await this.$api.playbookScripts.getAllScript();
            ctx.commit('updateScripts', response.data);
        },
    },
    getters: {
        getScript(state) {
            return state.scriptSettings;
        },
        getItemsMenuPlaybooks(state) {
            return state.itemsMenu;
        },
        getAllScripts(state) {
            return state.tableItems;
        },

        getStateScripts(state) {
            return state;
        },
    },
    mutations: {
        inputName(state, editItem) {
            editItem.editNameFile = true;
        },
        deleteScript(state, itemRemove) {
            state.tableItems.splice(state.tableItems.indexOf(itemRemove), 1);
        },

        showFormNewScript(state, show) {
            state.showFormScript = show.show;
            state.typeForm = show.typeForm;
            state.textHeader = show.textHeader;
        },
        selectedScript(state, item) {
            state.selectedRowScript = item;
        },
        updateScripts(state, response) {
            state.tableItems = response;
        },
    },
    state: {
        itemsMenu: {
            id: 1,
            name: 'Каталог установочных скриптов',
        },
        showFormScript: false,
        typeForm: '',
        selectedRowScript: [],
        textHeader: '',
        tableItems: [],
        openDialogApprove: false,
    },
};
