const Co2Monitor = require('co2-monitor');

let co2Monitor = new Co2Monitor();

co2Monitor.on('connected', (device) => {
    co2Monitor.startTransfer();
});

co2Monitor.on('error', (error) => {
    console.error(error);
})

co2Monitor.on('data', (data) => {
    console.log('data: ' + data);
})

co2Monitor.connect();
