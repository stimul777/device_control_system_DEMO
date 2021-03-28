export default {
    actions: {
        async editKickstartFile(ctx, itemNameEdit) {
            try {
                this.$api.kickstart.updateKickstartFile(itemNameEdit);
                ctx.dispatch('snackSuccess', `Kickstart файл ${itemNameEdit.name} обновлен!`);
            } catch (e) {
                ctx.dispatch('snackError', `Kickstart файл  ${items.name} не удалось обновить!`);
            }
        },

        async removeKickstart(ctx, item) {
            try {
                ctx.commit('deleteKickstart', item);

                await this.$api.kickstart.deleteKickstartFile(item.uuid);
                ctx.dispatch('snackSuccess', `Kickstart файл ${item.name} удален!`);
            } catch (e) {
                ctx.dispatch('snackError', `Kickstart файл  ${items.name} не удалось удалить!`);
            }
        },
        async addNewItemKickstart(ctx, items) {
            try {
                await this.$api.kickstart.postCreateKickstart(items);
                ctx.dispatch('snackSuccess', `Kickstart файл  ${items.name} добавлен!`);
            } catch (err) {
                ctx.dispatch('snackError', `Kickstart файл  ${items.name} не добавлен!`);
            }
            ctx.dispatch('requestAllKickstart');
        },
        showFormKikstart(ctx, show) {
            ctx.commit('showFormNewKickstart', show);
        },
        selectedRowKickstart(ctx, item) {
            ctx.commit('selectedKickstart', item);
        },

        async requestAllKickstart(ctx) {
            const response = await this.$api.kickstart.getAllKickstart();
            ctx.commit('updateKickstart', response.data);
        },
    },
    getters: {
        getAllKickstart(state) {
            return state.tableItems;
        },
        getItemsMenuKickstart(state) {
            return state.itemsMenu;
        },
        getStateKickstart(state) {
            return state;
        },
    },
    mutations: {
        deleteKickstart(state, itemRemove) {
            state.tableItems.splice(state.tableItems.indexOf(itemRemove), 1);
        },

        showFormNewKickstart(state, show) {
            state.showFormKickstart = show.show;
            state.typeForm = show.typeForm;
            state.textHeader = show.textHeader;
        },
        selectedKickstart(state, item) {
            state.selectedRowKickstart = item;
        },
        updateKickstart(state, response) {
            state.tableItems = response;
        },
    },
    state: {
        itemsMenu: {
            id: 1,
            name: 'Каталог kickstart',
            children: [],
            action: 'add',
        },
        showFormKickstart: false,
        typeForm: '',
        selectedRowKickstart: [],
        textHeader: '',
        tableItems: [],
        openDialogApprove: false,
    },
};
