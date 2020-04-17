# usage: MACKEREL_API_KEY=XXX MACKEREL_SERVICE_NAME=home MACKEREL_METRIC_NAME_SUFFIX=bedroom sudo -E node index.js

const Co2Monitor = require('co2-monitor');
const axios = require('axios');

axios.defaults.baseURL = 'https://api.mackerelio.com';
axios.defaults.headers.common['X-Api-Key'] = process.env.MACKEREL_API_KEY;
axios.defaults.headers.post['Content-Type'] = 'application/json';

let co2Monitor = new Co2Monitor();

co2Monitor.on('connected', (device) => {
    co2Monitor.startTransfer();
});

co2Monitor.on('error', (error) => {
    console.error(error);
})

co2Monitor.on('data', (json) => {
    console.log('data: ' + json);
    const data = JSON.parse(json);

    const now = Math.floor(new Date().getTime() / 1000);
    const metricValues = Object.keys(data).map(key => {
        return {
            name: `co2-mini.${key}.${process.env.MACKEREL_METRIC_NAME_SUFFIX}`,
            time: now,
            value: ( typeof(data[key]) === 'number' ? data[key] : parseFloat(data[key]) ),
        };
    });
    axios.post(`/api/v0/services/${process.env.MACKEREL_SERVICE_NAME}/tsdb`, metricValues)
    .then(response => {
        // NOP
    }).catch(error => {
        // https://github.com/axios/axios#handling-errors
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
    });
})

co2Monitor.connect();
