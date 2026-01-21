# Zemismart & NovaDigital Tuya Zigbee Devices for Homey Pro

Homey Pro app for NovaDigital and Zemismart Tuya Zigbee devices. Supports multi-gang switches (1-6 gangs), combo devices, temperature sensors, gas detectors, sirens, and fan controllers. Developed with physical device testing, Zigbee sniffing, and validated against Hubitat and Zigbee2MQTT implementations.

## Supported Devices

### Multi-Gang Wall Switches

#### 1-Gang Switch
- **NovaDigital 1-Gang Switch**
  - Manufacturer: `_TZE200_amp6tsvy`, `_TZE200_oisqyl4o`, `_TZE200_wunufsil`, `_TZE204_sooucan5`
  - Product ID: `TS0601`

#### 2-Gang Switches
- **NovaDigital 2-Gang Switch**
  - Manufacturer: `_TZE200_g1ib5ldv`, `_TZE200_wunufsil`, `_TZE204_sooucan5`
  - Product ID: `TS0601`

- **Zemismart 2-Gang Switch**
  - Manufacturer: `_TZE200_dhdstcqc`
  - Product ID: `TS0601`

#### 3-Gang Switches
- **NovaDigital 3-Gang Switch**
  - Manufacturer: `_TZE200_tz32mtza`, `_TZE200_1ozguk6x`, `_TZE200_wunufsil`, `_TZE204_sooucan5`
  - Product ID: `TS0601`

- **Zemismart 3-Gang Switch**
  - Manufacturer: `_TZE200_9mahtqtg`
  - Product ID: `TS0601`

#### 4-Gang Switch
- **NovaDigital 4-Gang Switch**
  - Manufacturer: `_TZE200_k6jhsr0q`, `_TZE200_wunufsil`, `_TZE204_sooucan5`
  - Product ID: `TS0601`

#### 6-Gang Switch
- **NovaDigital 6-Gang Switch**
  - Manufacturer: `_TZE200_9mahtqtg`
  - Product ID: `TS0601`

### Combination Devices

#### 2-Gang Switch + Socket
- **NovaDigital 2-Gang + Socket**
  - Manufacturer: `_TZE200_vhy3iakz`
  - Product ID: `TS0601`
  - Note: Socket without power monitoring

### Fan Controllers

#### 3-Gang Fan Controller
- **MOES 3-Gang Fan Controller**
  - Manufacturer: `_TZE204_1v1dxkck`
  - Product ID: `TS0601`
  - Note: Dimmer-based device adapted for fan speed control

### Sensors

#### Temperature Sensors
- **Tuya Temperature & Humidity Sensor**
  - Manufacturer: `_TZE200_a8sdabtg`, `_TZE204_auin4exy`
  - Product ID: `TS0601`

#### Gas Detectors
- **Tuya Gas Sensor**
  - Manufacturer: `_TZE200_yojqa8xn`
  - Product ID: `TS0601`

### Alarms

#### Sirens
- **Tuya Siren**
  - Manufacturer: `_TZE200_t1blo2bj`
  - Product ID: `TS0601`

## Development Methodology

This app has been developed using a rigorous testing and validation approach:

- **Physical Device Testing**: All supported devices tested with actual hardware
- **Zigbee Protocol Analysis**: Using Zigbee sniffing tools to capture and analyze device communications
- **Cross-Platform Validation**: Implementation validated against Hubitat and Zigbee2MQTT drivers
- **Based on Proven Foundation**: Built upon Johan Bendz's Tuya Zigbee framework

## Installation

### From Homey App Store
*Coming soon*

### Manual Installation (GitHub)
1. Download this repository
2. Install using Homey CLI:
```bash
   homey app install
```

## Adding Devices

1. Go to Devices in your Homey app
2. Click the '+' button to add a new device
3. Select "Zemismart & NovaDigital Tuya Zigbee"
4. Follow the pairing instructions for your specific device
5. Put your device in pairing mode (usually by pressing and holding the button)

## Technical Details

- **Zigbee Clusters**: Properly handles Tuya-specific clusters and attributes
- **Manufacturer Commands**: Validated manufacturer-specific command implementation
- **Device Capabilities**: Full capability mapping for switches, sensors, and alarms
- **Optimized**: Specifically optimized for Homey Pro's Zigbee stack

## Troubleshooting

### Device not pairing
- Ensure the device is in pairing mode
- Reset the device according to manufacturer instructions
- Move the device closer to Homey during pairing

### Device not responding
- Check Zigbee network health in Homey settings
- Try removing and re-adding the device
- Ensure device firmware is up to date

## Credits

- Based on the [Tuya Zigbee app](https://github.com/JohanBendz/com.tuya.zigbee) by Johan Bendz
- Device testing and implementation by Gabriel Machado
- Community feedback and testing

## Support

For issues, feature requests, or questions:
- Open an issue on [GitHub](https://github.com/gpmachado/Homey_Zemismart-NovaDigital-TuyaDevices/issues)
- Check existing issues before creating a new one

## License

This project is licensed under the GPL-3.0 License - see the LICENSE file for details.

## Changelog

### Version 1.0.0
- Initial release
- Support for NovaDigital 1-6 gang switches
- Support for Zemismart 2-3 gang switches
- Support for 2-gang + socket combo device
- Support for MOES 3-gang fan controller
- Support for temperature, gas sensors, and sirens
