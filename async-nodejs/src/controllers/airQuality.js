const airQuality = require('express').Router();
const URLSearchParams = require('url-search-params');
const {airQualityCallback, airQualityPromise} = require('../helpers/airQualityHelper');


let url = 'https://api.openaq.org/v2/latest';

airQuality.get('/callback', (req, res) => {
    airQualityCallback(url, function(err, resp) {
        if (err) {
            return res.status(500).json({err: err});
        } else {
            return res.status(200).json(resp);
        }
    })
});

airQuality.get('/promise', (req, res) => {
    airQualityPromise(url).then(data => {
        return res.status(200).json(data);
    }).catch(err => {
        return res.status(500).json({err: err});
    });
});

airQuality.get('/callbackHell', (req, res) => {
    let payload = {page: 1};
    let total = [];
    const searchParams = new URLSearchParams(payload);
    airQualityCallback(`${url}?${searchParams}`, function(err, data) {
        if (err) {
            return res.status(500).json({err: err});
        } else {
            payload.page = payload.page + 1;
            const searchParams2 = new URLSearchParams(payload);
            airQualityCallback(`${url}?${searchParams2}`, function(err2, data2) {
                if (err2) {
                    return res.status(500).json({err: err2});
                } else {
                    payload.page = payload.page + 1;
                    const searchParams3 = new URLSearchParams(payload);
                    airQualityCallback(`${url}?${searchParams3}`, function(err3, data3) {
                        if (err3) {
                            return res.status(500).json({err: err3});
                        } else {
                            total.push(data);
                            total.push(data2);
                            total.push(data3);
                            return res.status(200).json(total);
                        }
                    });
                }
            })
        }
    });
});

airQuality.get('/promiseCallbackNonHell', (req, res) => {
    let payload = {page: 1};
    let total = [];
    const searchParams = new URLSearchParams(payload);
    airQualityPromise(`${url}?${searchParams}`).then(data => {
        payload.page = payload.page + 1;
        const searchParams2 = new URLSearchParams(payload);
        airQualityPromise(`${url}?${searchParams2}`).then(data2 => {
            payload.page = payload.page + 1;
            const searchParams3 = new URLSearchParams(payload);
            airQualityPromise(`${url}?${searchParams3}`).then(data3 => {
                total.push(data);
                total.push(data2);
                total.push(data3);
                return res.status(200).json(total);
            }).catch(err3 => {
                return res.status(500).json({err: err3});
            });
        }).catch(err2 => {
            return res.status(500).json({err: err2});
        });
    }).catch(err => {
        return res.status(500).json({err: err});
    });
});


airQuality.get('/asyncAwaitNonHell', async (req, res) => {
    try {
        let payload = {page: 1};
        let total = [];
        const searchParams = new URLSearchParams(payload);
        let data1 = await airQualityPromise(`${url}?${searchParams}`);
        payload.page = payload.page + 1;
        const searchParams2 = new URLSearchParams(payload);
        let data2 = await airQualityPromise(`${url}?${searchParams2}`);
        payload.page = payload.page + 1;
        const searchParams3 = new URLSearchParams(payload);
        let data3 = await airQualityPromise(`${url}?${searchParams3}`);
        total.push(data1);
        total.push(data2);
        total.push(data3);
        return res.status(200).json(total);
    } catch(err ) {
        return res.status(500).json({err: err});
    }
});

airQuality.get('/asyncAwait', async (req, res) => {
    try {
        let data = await airQualityPromise(url);
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({err: err});
    }
});


airQuality.get('/multiplePromises', (req, res) => {
    let payload = {page: 1};
    let total = [];
    const searchParams = new URLSearchParams(payload);
    let promise1 = airQualityPromise(`${url}?${searchParams}`);
    payload.page = payload.page + 1;
    const searchParams2 = new URLSearchParams(payload);
    let promise2 = airQualityPromise(`${url}?${searchParams2}`)
    payload.page = payload.page + 1;
    const searchParams3 = new URLSearchParams(payload);
    let promise3 = airQualityPromise(`${url}?${searchParams3}`);
    Promise.all([promise1, promise2, promise3]).then(values => {
        return res.status(200).json(values);
    }).catch(err => {
        return res.status(500).json({err: err});
    });
});

module.exports = airQuality;