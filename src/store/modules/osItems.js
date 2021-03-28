export default {
    getters:{
        getOsItems(state){
            return state.osItems;
        }
    },
    actions: {
        async requestOsItems(ctx){
            return this.$load(async () => {
                const response = await this.$api.osItems.getAllOsItems();
                ctx.commit('updateOsItems', response.data);

            });
        }
    },
    mutations:{
        updateOsItems(state, response){
            state.osItems = response;
            state.kickStartFiles = state.osItems.kickStartFiles;
        },
    },
    state:{
        osItems: [],
        kickStartFiles: []

    }
}
