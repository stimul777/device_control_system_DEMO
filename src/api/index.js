import './interceptors';
import instance from './instance';
// * Модули запросов
import accountModule from './account';
import devicesModule from './devices';
import statisticsModule from './statistics';
import protocolsModule from './protocols';
import jobTasksModule from './jobTasks';
import monitoringProfilesModule from './monitoringProfiles';
import parametersModule from './parameters';
import devicesTypesModule from './devicesTypes';
import racksModule from './racks';
import groupsModule from './groups';
import anglesModule from './angles';
import devicesGroupsModule from './devicesGroups';
import devicesManagementModule from './devicesManagement';
import devicesRacksModule from './devicesRacks';
import notificationsModule from './notifications';
import devicesStatesModule from './devicesStates';
import socketsUrlModule from './socketsUrl';
import rolesManagementModule from './rolesManagement';
import usersManagementModule from './usersManagement';
import backendCommunications from './backendCommunications';
import kickstart from './kickstart';
import osItems from './osItems';
import isoImagesModule from './isoImages';
import enumsModule from './enums';
import playbookScripts from './playbookScripts';
import softFileModule from './softFile';
import scheduleJobModule from './scheduleJob';
import saveConfigs from "./saveConfigs";

export default {
    account: accountModule(instance),
    devices: devicesModule(instance),
    statistics: statisticsModule(instance),
    protocols: protocolsModule(instance),
    jobTasks: jobTasksModule(instance),
    monitoringProfiles: monitoringProfilesModule(instance),
    parameters: parametersModule(instance),
    devicesTypes: devicesTypesModule(instance),
    racks: racksModule(instance),
    angles: anglesModule(instance),
    groups: groupsModule(instance),
    devicesManagement: devicesManagementModule(instance),
    devicesRacks: devicesRacksModule(instance),
    notifications: notificationsModule(instance),
    devicesStates: devicesStatesModule(instance),
    devicesGroups: devicesGroupsModule(instance),
    rolesManagement: rolesManagementModule(instance),
    usersManagement: usersManagementModule(instance),
    isoImages: isoImagesModule(instance),
    socketsUrl: socketsUrlModule,
    backendCommunications: backendCommunications(instance),
    kickstart: kickstart(instance),
    osItems: osItems(instance),
    enums: enumsModule(instance),
    softFile: softFileModule(instance),
    scheduleJob: scheduleJobModule(instance),
    playbookScripts: playbookScripts(instance),
    saveConfigs: saveConfigs(instance)
};
