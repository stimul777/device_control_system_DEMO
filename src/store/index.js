import Vue from 'vue';
import Vuex from 'vuex';

// libs
import { v4 as uuidv4 } from 'uuid';

// modules
import detection from './modules/detection';
import equipment from './modules/equipment';
import directory from './modules/directory';
import inventoryParametrs from './modules/inventoryParametrs';
import compDevices from './modules/compDevices';
import deviceGroup from './modules/deviceGroup';
import tasks from './modules/tasks';
import repository from './modules/repository';
import notifications from './modules/notification';
import websocket from './modules/websocket';
import playbooks from './modules/playbooks';
import kickstart from './modules/kickstart';
import osItems from './modules/osItems';
import auth from './modules/auth';
import downloadFile from './modules/downloadFile';

// root
import protocols from './root/protocols';
import states from './root/states';
import snackBar from './root/snackBar';
import calendar from './root/calendar';
import systemBoot from './root/systemBoot';
import saveConfigs from "./modules/saveConfigs";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    actions: {
        uuidv4() {
            const uuid = uuidv4();
            return uuid;
        },
    },
    mutations: {},
    getters: {},

    modules: {
        detection,
        equipment,
        directory,
        inventoryParametrs,
        compDevices,
        deviceGroup,
        tasks,
        notifications,
        protocols,
        auth,
        snackBar,
        states,
        calendar,
        systemBoot,
        repository,
        websocket,
        playbooks,
        kickstart,
        osItems,
        downloadFile,
        saveConfigs
    },
});
