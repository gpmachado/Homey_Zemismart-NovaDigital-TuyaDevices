# Zemismart & NovaDigital Tuya Zigbee Devices for Homey Pro

Homey Pro app for NovaDigital and Zemismart Tuya Zigbee devices. Supports multi-gang switches (1-6 gangs), combo devices, temperature sensors, gas detectors, sirens, and fan controllers. Developed with physical device testing, Zigbee sniffing, and validated against Hubitat and Zigbee2MQTT implementations.

## Supported Devices

### Multi-Gang Wall Switches

#### 1-Gang Switch
- **NovaDigital /Zemismart 1-Gang Switch **
  - Manufacturer: `_TZ3000_ovyaisip`, `_TZ3000_pk8tgtdb`
  - Product ID: `TS0001`

#### 2-Gang Switches
- **NovaDigital /Zemismart 2-Gang Switch**
  - Manufacturer: `_TZ3000_kgxej1dv", `_TZ3000_ywubfuvt"`
  - Product ID: `TS0002`


#### 3-Gang Switches
- **NovaDigital /Zemismart  3-Gang Switch /2-Gang Switch + Socket (No metering) **
  - Manufacturer: `"_TZ3000_yervjnlj", _TZ3000_vjhcenzo", "_TZ3000_qxcnwv26", "_TZ3000_eqsair32", "_TZ3000_f09j9qjb", "_TZ3000_fawk5xjv", "_TZ3000_ok0ggpk7"
  - Product ID: `TS0003`


#### 4-Gang Switch
- **NovaDigital /Zemismart  4-Gang Switch**
  - Manufacturer: "_TZE200_shkxsgis",  "_TZE204_aagrxlbd"
  - Product ID: `TS0601`

#### 6-Gang Switch
- **Zemismart  6-Gang Switch**
  - Manufacturer: `"_TZE200_r731zlxk`
  - Product ID: `TS0601`


### Fan Controllers

#### 3-Gang Moes Dimmer
- **MOES 3-Gang Fan Controller**
  - Manufacturer: `_TZE204_1v1dxkck`
  - Product ID: `TS0601`
  - Note: Dimmer-based device adapted for fan speed control

### Sensors

#### Temperature Sensors
- **Tuya Temperature & Humidity Sensor**
  - Manufacturer: `_TZ3000_ywagc4rj'
  - Product ID: `TS0201`

#### Gas Detectors
- **Tuya Gas Sensor**
  - Manufacturer: `_TYZB01_0w3d5uw3`
  - Product ID: `TS0204`

### Alarms

#### Sirens
- **Tuya Siren**
  - Manufacturer: `_TZE204_q76rtoa9`
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
