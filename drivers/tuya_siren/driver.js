/**
 * driver.js v1.0.0 - Tuya Siren Driver
 * Simple driver implementation for Tuya Siren devices
 * For NEO Smart Siren (_TZE204_q76rtoa9 / TS0601)
 */

'use strict';

const { ZigBeeDriver } = require('homey-zigbeedriver');

class TuyaSirenDriver extends ZigBeeDriver {

    async onInit() {
        this.driverVersion = '1.0.0';
        this.log(`[Tuya Siren Driver] v${this.driverVersion} - Initializing`);
    }

    async onPairListDevices() {
        this.log('Device pairing initiated for Tuya Siren');
        return [];
    }

    async onUninit() {
        this.log(`Tuya Siren Driver v${this.driverVersion} uninitializing`);
    }

}

module.exports = TuyaSirenDriver;