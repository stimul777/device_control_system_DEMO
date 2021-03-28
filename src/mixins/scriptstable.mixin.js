import DialogApprove from '../components/app/DialogApprove';
import Templates from '../components/Administration/CompDevices/Templates/Templates';
import ScriptForm from '../components/Administration/Repository/NewFormScript/ScriptForm';

export default {
    components: {
        DialogApprove,
        Templates,
        ScriptForm,
    },
    data: () => ({
        selectedFile: null,
        isSelecting: false,
        loaderTable: true,
        headersTable: [],
        itemsTable: [],
        singleSelect: false,
        selected: [],
        slots: [],
        enabled: null,
        showForm: false,
        openDialog: false,
        selectedRemoveItem: [],
    }),
    methods: {
        updateTable() {
            this.getRows();
        },
    },

    async mounted() {
        this.getRows();
    },
};
