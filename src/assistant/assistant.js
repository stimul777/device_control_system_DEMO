/** Возвращает пользователю уведомление о состоянии оборудования
 * Компонент: Control/DeviceGroup
 *
 * @param ComboBoxModel
 * @param itemsComboBox
 * @param store
 */
function messageUserDeviceGroup(ComboBoxModel, itemsComboBox, store) {
    const messageText = [
        { id: itemsComboBox.start, text: 'Оборудование поставлено на включение' },
        { id: itemsComboBox.stop, text: 'Оборудование поставлено на выключение' },
        { id: itemsComboBox.reboot, text: 'Оборудование поставлено на перезагрузку' },
        {
            id: itemsComboBox.serviceon,
            text: 'Оборудование поставлено на обслуживание',
        },
        {
            id: itemsComboBox.serviceoff,
            text: 'Оборудование снято с обслуживания',
        },
    ];
    messageText.forEach(f => (f.id === ComboBoxModel ? store.dispatch('snackSuccess', f.text) : null));
}

/** Валидирует новые и старые карточки на повторение имени
 * Компонент: Administration/Directory
 *
 * @param item
 * @param itemsDirectoryData
 * @param store
 * @param message
 * @returns {boolean|*}
 */
function newFrameValidation(item, itemsDirectoryData, store, message) {
    const valid = !itemsDirectoryData.find(i => i.name === item.name);

    if (!valid) {
        store.dispatch('snackError', message);
    }
    return valid;
}

function dateTransformationUTC() {
    let now = new Date(); // Fri Feb 20 2015 19:29:31 GMT+0530 (India Standard Time)
    let isoDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    //раскоментить, если нужно isoDate = new Date(now).toISOString();
    return isoDate;
}

export { messageUserDeviceGroup, newFrameValidation, dateTransformationUTC };
