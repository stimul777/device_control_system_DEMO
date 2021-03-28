const urlOrigin = `${window.location.protocol}//${window.location.hostname}`;

const aUrl = () => {
    let res;
    if (!process.env.VUE_APP_SERVER_URL) {
        res = urlOrigin;
        if (process.env.VUE_APP_SOCKET_PORT) {
            res += `:${process.env.VUE_APP_SOCKET_PORT}`;
        }
    }
    //localhost
    else {
        res = process.env.VUE_APP_SERVER_URL;
    }
    res += '/notify';

    return res;
};

const pUrl = () => {
    let res;

    if (!process.env.VUE_APP_SOCKET_P_URL) {
        res = urlOrigin;
        if (process.env.VUE_APP_SOCKET_PORT) {
            return (res += `:${process.env.VUE_APP_SOCKET_P_PORT}`);
        }
    }
};

export default {
    aUrl: aUrl(),
    pUrl: pUrl(),
};
