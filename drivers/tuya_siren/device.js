/**
 * device.js v1.0.5 - Neo Smart Siren Device IMPROVED
 * 
 */

'use strict';

const { Cluster } = require('zigbee-clusters');
const TuyaSpecificCluster = require('../../lib/TuyaSpecificCluster');
const TuyaSpecificClusterDevice = require('../../lib/TuyaSpecificClusterDevice');

Cluster.addCluster(TuyaSpecificCluster);

// Datapoints - confirmed working from logs
const dataPoints = {
  TUYA_DP_VOLUME: 5,      // DP 5 - CONFIRMED WORKING
  TUYA_DP_DURATION: 7,    // DP 7 - CONFIRMED WORKING  
  TUYA_DP_ALARM: 13,      // DP 13 - CONFIRMED WORKING
  TUYA_DP_BATTERY: 15,    // DP 15 - CONFIRMED WORKING
  TUYA_DP_MELODY: 21,     // DP 21 - CONFIRMED WORKING
};

// Volume mapping - CORRECT version that was working
const volumeMapping = new Map();
volumeMapping.set(0, 'Low');
volumeMapping.set(1, 'Medium'); 
volumeMapping.set(2, 'High');

// Melody mapping
const melodiesMapping = new Map();
melodiesMapping.set(0, 'Doorbell Chime');
melodiesMapping.set(1, 'Fur Elise');
melodiesMapping.set(2, 'Westminster Chimes');
melodiesMapping.set(3, 'Fast double door bell');
melodiesMapping.set(4, 'William Tell Overture');
melodiesMapping.set(5, 'Turkish March');
melodiesMapping.set(6, 'Safe/Security Alarm');
melodiesMapping.set(7, 'Chemical Spill Alert');
melodiesMapping.set(8, 'Piercing Alarm Clock');
melodiesMapping.set(9, 'Smoke Alarm');
melodiesMapping.set(10, 'Dog Barking');
melodiesMapping.set(11, 'Police Siren');
melodiesMapping.set(12, 'Doorbell Chime (reverb)');
melodiesMapping.set(13, 'Mechanical Telephone');
melodiesMapping.set(14, 'Fire/Ambulance');
melodiesMapping.set(15, '3/1 Elevator');
melodiesMapping.set(16, 'Buzzing Alarm Clock');
melodiesMapping.set(17, 'School Bell');

const dataTypes = {
  raw: 0, // [ bytes ]
  bool: 1, // [0/1]
  value: 2, // [ 4 byte value ]
  string: 3, // [ N byte string ]
  enum: 4, // [ 0-255 ]
  bitmap: 5, // [ 1,2,4 bytes ] as bits
};

const convertMultiByteNumberPayloadToSingleDecimalNumber = (chunks) => {
  let value = 0;
  for (let i = 0; i < chunks.length; i++) {
    value <<= 8;
    value += chunks[i];
  }
  return value;
};

const getDataValue = (dpValue) => {
  switch (dpValue.datatype) {
    case dataTypes.raw:
      return dpValue.data;
    case dataTypes.bool:
      return dpValue.data[0] === 1;
    case dataTypes.value:
      return convertMultiByteNumberPayloadToSingleDecimalNumber(dpValue.data);
    case dataTypes.string:
      let dataString = '';
      for (let i = 0; i < dpValue.data.length; ++i) {
        dataString += String.fromCharCode(dpValue.data[i]);
      }
      return dataString;
    case dataTypes.enum:
      return dpValue.data[0];
    case dataTypes.bitmap:
      return convertMultiByteNumberPayloadToSingleDecimalNumber(dpValue.data);
  }
};

class sirene_NEO extends TuyaSpecificClusterDevice {

  async onNodeInit({ zclNode }) {
    console.log('[Tuya Siren] v1.0.5 - Device initializing');
    this.printNode();

    // Simple state tracking - let device manage auto-off
    this.sirenState = {
      isPlaying: false,
      lastActivation: null
    };

    this.addCapability('measure_battery');

    this.registerCapabilityListener('onoff', async (value) => {
      if (value) {
        await this.startSiren();
      } else {
        await this.stopSiren();
      }
    });

    zclNode.endpoints[1].clusters.tuya.on('response', (value) => this.processResponse(value));
    zclNode.endpoints[1].clusters.tuya.on('reporting', (value) => this.processReporting(value));
    zclNode.endpoints[1].clusters.tuya.on('datapoint', (value) => this.processDatapoint(value));

    // Flow card registration
    this.registerFlowCards();
  }

  registerFlowCards() {
    const actionAlarmState = this.homey.flow.getActionCard('siren_alarm_state');
    if (actionAlarmState) {
      actionAlarmState.registerRunListener(async (args, state) => {
        try {
          const alarmStateRequested = args.siren_alarm_state === 'on';
          if (alarmStateRequested) {
            await this.startSiren();
          } else {
            await this.stopSiren();
          }
          return true;
        } catch (error) {
          console.error('[Tuya Siren] Flow siren_alarm_state error:', error);
          return false;
        }
      });
    }

    const actionSirenVolume = this.homey.flow.getActionCard('siren_volume');
    if (actionSirenVolume) {
      actionSirenVolume.registerRunListener(async (args, state) => {
        await this.sendAlarmVolume(args.siren_volume);
        return true;
      });
    }

    const actionSirenDuration = this.homey.flow.getActionCard('siren_duration');
    if (actionSirenDuration) {
      actionSirenDuration.registerRunListener(async (args, state) => {
        await this.sendAlarmDuration(args.duration);
        return true;
      });
    }

    const actionSirenMelody = this.homey.flow.getActionCard('siren_melody');
    if (actionSirenMelody) {
      actionSirenMelody.registerRunListener(async (args, state) => {
        await this.sendAlarmTune(args.siren_melody);
        return true;
      });
    }

    const actionSirenBeep = this.homey.flow.getActionCard('siren_beep');
    if (actionSirenBeep) {
      actionSirenBeep.registerRunListener(async (args, state) => {
        await this.playTestBeep();
        return true;
      });
    }
  }



  // Start siren with proper configuration  
  async startSiren() {
    try {
      // Configure siren before starting
      const currentTune = this.getSettings().alarmtune || '5'; // Default Turkish March
      const currentVolume = this.getSettings().alarmvolume || '2'; // Default High  
      const currentDuration = this.getSettings().alarmsoundtime || 10; // Default 10s
      
      // Set all parameters before turning on
      await this.writeEnum(dataPoints.TUYA_DP_MELODY, Number(currentTune));
      await this.writeEnum(dataPoints.TUYA_DP_VOLUME, Number(currentVolume));
      await this.writeData32(dataPoints.TUYA_DP_DURATION, Number(currentDuration));
      
      // Small delay to ensure settings are applied
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Start the alarm - device will auto-stop after duration
      await this.writeBool(dataPoints.TUYA_DP_ALARM, true);
      
      // Note: siren_activated flow will be triggered in processReporting when device confirms
      
    } catch (error) {
      console.error('[Tuya Siren] Failed to start siren:', error);
      throw error;
    }
  }

  // Stop siren method - marks as manual stop
  async stopSiren() {
    try {
      // Mark as manual stop before sending command
      this.sirenState.isPlaying = false;
      
      await this.writeBool(dataPoints.TUYA_DP_ALARM, false);
      
      // Trigger manual deactivated flow
      this.triggerFlow('siren_deactivated', { reason: 'manual' });
      
    } catch (error) {
      console.error('[Tuya Siren] Failed to stop siren:', error);
      throw error;
    }
  }

  // Test beep method
  async playTestBeep() {
    try {
      // Store current settings
      const currentTune = this.getSettings().alarmtune || '5';
      const currentVolume = this.getSettings().alarmvolume || '2';
      const currentDuration = this.getSettings().alarmsoundtime || 10;
      
      // Configure for beep (2 seconds, Fur Elise, medium volume)
      await this.writeEnum(dataPoints.TUYA_DP_MELODY, 1); // Fur Elise
      await this.writeEnum(dataPoints.TUYA_DP_VOLUME, 1); // Medium volume
      await this.writeData32(dataPoints.TUYA_DP_DURATION, 2); // 2 seconds
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Start beep - device will auto-stop after 2 seconds
      await this.writeBool(dataPoints.TUYA_DP_ALARM, true);
      
      // Restore settings after beep completes
      setTimeout(async () => {
        try {
          await this.writeEnum(dataPoints.TUYA_DP_MELODY, Number(currentTune));
          await this.writeEnum(dataPoints.TUYA_DP_VOLUME, Number(currentVolume));
          await this.writeData32(dataPoints.TUYA_DP_DURATION, Number(currentDuration));
        } catch (error) {
          console.error('[Tuya Siren] Failed to restore settings after beep:', error);
        }
      }, 3000);
      
    } catch (error) {
      console.error('[Tuya Siren] Failed to play test beep:', error);
      throw error;
    }
  }

  // Helper method to trigger flows
  triggerFlow(flowId, tokens = {}) {
    try {
      const trigger = this.homey.flow.getDeviceTriggerCard(flowId);
      if (trigger) {
        trigger.trigger(this, tokens, {});
      }
    } catch (error) {
      console.error('[Tuya Siren] Failed to trigger flow:', flowId, error);
    }
  }

  async processResponse(data) {
    const parsedValue = getDataValue(data);
  }

  async processReporting(data) {
    const parsedValue = getDataValue(data);
    
    switch (data.dp) {
      case dataPoints.TUYA_DP_ALARM:
        // Track state and trigger flows
        if (parsedValue) {
          // Siren started
          this.sirenState.isPlaying = true;
          this.sirenState.lastActivation = Date.now();
          
          const duration = this.getSettings().alarmsoundtime || 10;
          this.triggerFlow('siren_activated', { duration: duration });
          
        } else {
          // Siren stopped - check if it was our manual stop or device auto-stop
          const wasPlaying = this.sirenState.isPlaying;
          this.sirenState.isPlaying = false;
          
          if (wasPlaying) {
            // Device stopped the siren (auto-stop after duration)
            this.triggerFlow('siren_deactivated', { reason: 'auto' });
          }
          // Manual stops are handled in stopSiren() method
        }
        
        this.setCapabilityValue('onoff', parsedValue).catch(this.error);
        break;
        
      case dataPoints.TUYA_DP_VOLUME: 
        this.setSettings({
          alarmvolume: parsedValue?.toString(),
        });
        break;
        
      case dataPoints.TUYA_DP_DURATION: 
        this.setSettings({
          alarmsoundtime: parsedValue,
        });
        break;
        
      case dataPoints.TUYA_DP_MELODY: 
        this.setSettings({
          alarmtune: parsedValue?.toString(),
        });
        break;
        
      case dataPoints.TUYA_DP_BATTERY: 
        if (typeof parsedValue === 'number' && parsedValue >= 0 && parsedValue <= 100) {
          this.setCapabilityValue('measure_battery', parsedValue).catch(this.error);
        }
        break;
    }
  }

  async processDatapoint(data) {
    const parsedValue = getDataValue(data);
  }

  onDeleted() {
    // Device cleanup
  }

  async onSettings({ oldSettings, newSettings, changedKeys }) {
    try {
      changedKeys.forEach((updatedSetting) => {
        switch (updatedSetting) {
          case 'alarmvolume':
            this.sendAlarmVolume(newSettings[updatedSetting]);
            break;
          case 'alarmsoundtime':
            this.sendAlarmDuration(newSettings[updatedSetting]);
            break;
          case 'alarmtune':
            this.sendAlarmTune(newSettings[updatedSetting]);
            break;
        }
      });
    } catch (error) {
      console.error('[Tuya Siren] Settings update failed:', error);
      throw error;
    }
  }

  sendAlarmVolume(volume) { 
    return this.writeEnum(dataPoints.TUYA_DP_VOLUME, Number(volume));
  }

  sendAlarmDuration(duration) {
    return this.writeData32(dataPoints.TUYA_DP_DURATION, Number(duration));
  }

  sendAlarmTune(tune) {
    return this.writeEnum(dataPoints.TUYA_DP_MELODY, Number(tune));
  }

}

module.exports = sirene_NEO;