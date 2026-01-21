/**
 * File: device.js
 * Device: Zemismart Wall Switch 3 Gang
 * Version: 1.3.0 + RETRY - Progressive enhancement of working v1.3.0
 * Date: 2025-07-12
 * Author: Adding ONLY retry to proven v1.3.0 base
 *
 * Description:
 * - EXACT copy of working v1.3.0 ORIGINAL
 * - ONLY addition: simple retry on onCapabilityOnoff
 * - NO other changes to maintain zero crosslink
 */
'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { CLUSTER, Cluster } = require('zigbee-clusters');
const TuyaOnOffCluster = require('../../lib/TuyaOnOffCluster');
const OnOffBoundCluster = require('../../lib/OnOffBoundCluster');


Cluster.addCluster(TuyaOnOffCluster);

class ZemismartWallSwitch3Gang extends ZigBeeDevice {

  constructor(...args) {
    super(...args);
    
    this.retryConfig = {
      maxRetries: 5,
      baseDelay: 300
    };
  }

  async onNodeInit({zclNode}) {
    this.printNode();
    
    const { subDeviceId } = this.getData();
    this._endpoint = subDeviceId === 'secondSwitch' ? 2 : 
                    subDeviceId === 'thirdSwitch' ? 3 : 1;
    this._isMainDevice = this._endpoint === 1;
    
    this.log("Device data: ", subDeviceId);
    this.log(`Zemismart 3-Gang v1.3.0+Retry - Endpoint: ${this._endpoint}, Type: ${this._isMainDevice ? 'Main' : 'Sub'}`);

    
    this.registerCapability('onoff', CLUSTER.ON_OFF, {
      endpoint: this._endpoint,
    });

    
    this._setupBoundCluster();

   
    if (!this.isSubDevice()) {
      await zclNode.endpoints[1].clusters.basic.readAttributes([
        'manufacturerName',
        'zclVersion',
        'appVersion',
        'modelId',
        'powerSource',
        'attributeReportingStatus'
      ]).catch(err => {
        this.error('Error when reading device attributes:', err);
      });
    }
  }

  
  async onCapabilityOnoff(value, opts) {
    this.log(`Command EP${this._endpoint}: ${value ? 'ON' : 'OFF'} (with retry)`);
    
    for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        if (value) {
          await this.zclNode.endpoints[this._endpoint].clusters.onOff.setOn();
        } else {
          await this.zclNode.endpoints[this._endpoint].clusters.onOff.setOff();
        }
        
        
        if (attempt > 1) {
          this.log(`Command succeeded on attempt ${attempt} EP${this._endpoint}`);
        }
        return true;
        
      } catch (error) {
        if (attempt < this.retryConfig.maxRetries) {
          this.log(`Attempt ${attempt} failed EP${this._endpoint}, retrying in ${this.retryConfig.baseDelay}ms`);
          await new Promise(resolve => setTimeout(resolve, this.retryConfig.baseDelay));
        } else {
          this.error(`Command failed after ${this.retryConfig.maxRetries} attempts EP${this._endpoint}:`, error);
          throw error;
        }
      }
    }
  }

  
  _setupBoundCluster() {
    try {
      const boundCluster = new OnOffBoundCluster({
        onSetOn: () => this._handlePhysicalCommand('on'),
        onSetOff: () => this._handlePhysicalCommand('off'),
        onToggle: () => this._handlePhysicalCommand('toggle')
      });

      
      this.zclNode.endpoints[this._endpoint].bind(CLUSTER.ON_OFF.NAME, boundCluster);
      this.log(`BoundCluster registered for endpoint ${this._endpoint}`);
      
    } catch (error) {
      this.error(`Failed to register BoundCluster for endpoint ${this._endpoint}:`, error.message);
    }
  }

  
  _handlePhysicalCommand(command) {
    this.log(`Physical command received on EP${this._endpoint}: ${command}`);
    
    try {
      if (command === 'toggle') {
        const currentState = this.getCapabilityValue('onoff');
        this.setCapabilityValue('onoff', !currentState);
      } else if (command === 'on') {
        this.setCapabilityValue('onoff', true);
      } else if (command === 'off') {
        this.setCapabilityValue('onoff', false);
      }
    } catch (error) {
      this.error(`Failed to handle physical command ${command}:`, error);
    }
  }

  
  isSubDevice() {
    return this.getData().subDeviceId === 'secondSwitch' || this.getData().subDeviceId === 'thirdSwitch';
  }

  
  onDeleted() {
    const { subDeviceId } = this.getData();
    this.log("Zemismart Wall Switch, channel ", subDeviceId, " removed");
  }
}

module.exports = ZemismartWallSwitch3Gang;