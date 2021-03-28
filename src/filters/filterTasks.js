/** Фильрация времени (возвращает в v-modal время)- GET
 * Компонент: Tasks
 *
 * @param filterTabArr
 * @param uuid
 * @returns {*}
 */
export function filterTimeTasks(filterTabArr, uuid) {
    return filterTabArr.find(m => m.uuid === uuid).strInterval;
}

/** функция возвращает комбоБокс в зависимости от пришедшего с сервера времени для периода хранения - GET
 *  компонент: Tasks
 *
 * @param arrPeriodDevices
 * @param filterTabArr
 * @param uuid
 * @returns {*}
 */
export function filterPeriodStorage(arrPeriodDevices, filterTabArr, uuid) {
    let months = filterTabArr.find(m => m.uuid === uuid).depth / 30;
    switch (months) {
        case 1:
            return arrPeriodDevices[0];
        case 2:
            return arrPeriodDevices[1];
        case 3:
            return arrPeriodDevices[2];
        case 6:
            return arrPeriodDevices[3];
    }
}

/** перевод времени из часов в минуты
 *
 * @param time
 * @returns {number}
 */
export function timeTranslit(time) {
    console.log('!time!:', time);

    if (time === 0) {
        return 0;
    }

    let hour = time.slice(0, 3).replace(':', '');
    let min = time.slice(3).replace(':', '');
    let result = Number(hour) * 60 + Number(min);

    return result;
}

/** функция для записи периода хранения. Переводит v-select в дни(Number) для PATCH запроса
 *  компонент: Tasks
 *
 * @param requestArr
 * @param sendDataServer
 * @param deviceUUID
 * @returns {*}
 */
export function storagePeriodDispatch(requestArr, sendDataServer, deviceUUID) {
    for (let i of deviceUUID) {
        requestArr.map(m => (m.uuid === i.id ? (m.depth = sendDataServer[i.name].slice(0, 1) * 30) : false));
    }
    return requestArr;
}

// Доделать
export function timeDispatch(requestArr, sendDataServer, deviceTimeUUID) {
    for (let i of deviceTimeUUID) {
        requestArr.map(m => (m.uuid === i.id ? (m.interval = sendDataServer[i.name]) : false));
        return requestArr;
    }
}
