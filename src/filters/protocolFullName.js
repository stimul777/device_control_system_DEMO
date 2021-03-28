/**
 * * Возвращает строку протколов с версиями. Пример: IPMI v.1
 * @param {Array} protocols
 * @returns {String}
 */
import { Constants } from '@/plugins/constants';

export default function(protocols) {
    return protocols
        .filter(p => !p.uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_0))
        .map(({ name, version, uuid }) => {
            if (uuid.endsWith(Constants.SHORT_CODE_STATUSES.STATUSES_1)) {
                return name;
            } else {
                return `${name} v.${version}`;
            }
        })
        .join(', ');
}
