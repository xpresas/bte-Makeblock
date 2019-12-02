'use strict'

/**
 * General configuration (UUID)
*/
class Config {

    constructor() {
    }

    name() { return "Makeblock_LE"; }
    service() { return "0000ffe1-0000-1000-8000-00805f9b34fb" }
    charateristic() { return "0000ffe3-0000-1000-8000-00805f9b34fb" }
}

// Const for instructions types
const TYPE_MOTOR = 0x0a,
    TYPE_RGB = 0x08,
    TYPE_SOUND = 0x07;


// Const for the ports
const PORT_1 = 0x01,
    PORT_2 = 0x02,
    PORT_3 = 0x03,
    PORT_4 = 0x04,
    PORT_5 = 0x05,
    PORT_6 = 0x06,
    PORT_7 = 0x07,
    PORT_8 = 0x08,
    M_1 = 0x09,
    M_2 = 0x0a;


/**
 * Class for the robot
 * */
class MBot {
    constructor() {
        this.device = null;
        this.config = new Config();
        this.onDisconnected = this.onDisconnected.bind(this);
        this.buzzerIndex = 0;
    }

    /*
    Request the device with bluetooth
    */
    request() {
        let options = {
            "filters": [{
                "name": this.config.name()
            }],
            "optionalServices": [this.config.service()]
        };
        return navigator.bluetooth.requestDevice(options)
            .then(device => {
                this.device = device;
                this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
                return device;
            });
    }

    /**
     * Connect to the device
     * */
    connect() {
        if (!this.device) {
            return Promise.reject('Device is not connected.');
        } else {
            return this.device.gatt.connect();
        }
    }

    /**
     * Control the motors of robot
    */
    processMotor(valueM1, valueM2) {
        return this._writeCharacteristic(this._genericControl(TYPE_MOTOR, M_1, 0, 0, valueM1))
            .then(() => {
                return this._writeCharacteristic(this._genericControl(TYPE_MOTOR, M_2, 0, 0, valueM2));
            }).catch(error => {
                console.error(error);
            });

    }

    processBuzzer(note) {
        console.log("Port2");
        this.buzzerIndex = (this.buzzerIndex + 1) % 8;
        return this._writeCharacteristic(this._genericControl(TYPE_SOUND, PORT_2, 22, 0, note))
            .catch(error => {
                console.error(error);
            });
    }

    processColor(led, red, green, blue) {
        let rHex = red << 8;
        let gHex = green << 16;
        let bHex = blue << 24;
        let value = rHex | gHex | bHex;
        //let colors = { "r": red, "g": green, "b": blue }
        this._writeCharacteristic(this._genericControl(TYPE_RGB, PORT_6, 0, led, value));

    }

    disconnect() {
        if (!this.device) {
            return Promise.reject('Device is not connected.');
        } else {
            return this.device.gatt.disconnect();
        }
    }

    onDisconnected() {
        console.log('Device is disconnected.');
    }


    _genericControl(type, port, slot, led, value) {
        /*
        ff 55 len idx action device port  slot  data a
        0  1  2   3   4      5      6     7     8
        */
        // Static values
        var buf = new ArrayBuffer(16);
        var bufView = new Uint16Array(buf);

        var byte0 = 0xff, // Static header
            byte1 = 0x55, // Static header
            byte2 = 0x09, // len
            byte3 = 0x00, // idx
            byte4 = 0x02, // action
            byte5 = type, // device
            byte6 = port, // port
            byte7 = slot; // slot
        //dynamics values
        var byte8 = 0x00, // data
            byte9 = 0x00, // data
            byte10 = 0x00, // data
            byte11 = 0x00; // data
        //End of message
        var byte12 = 0x0a,
            byte13 = 0x00,
            byte14 = 0x00,
            byte15 = 0x00;

        switch (type) {
            case TYPE_MOTOR:
                // Motor M1
                // ff:55  09:00  02:0a  09:64  00:00  00:00  0a"
                // 0x55ff;0x0009;0x0a02;0x0964;0x0000;0x0000;0x000a;0x0000;
                // Motor M2
                // ff:55:09:00:02:0a:0a:64:00:00:00:00:0a                
                var tempValue = value < 0 ? (parseInt("ffff", 16) + Math.max(-255, value)) : Math.min(255, value);
                byte7 = tempValue & 0x00ff;
                byte8 = 0x00;
                byte8 = tempValue >> 8;


                break;
            case TYPE_RGB:

                // 0  1  2  3  4  5  6  7 LED R  G  B     
                //ff 55 09 00 02 08 07 02 00 00 00 00
                //ff 55 09 00 02 08 07 02 00 ff ff ff
                byte0 = 0xff;
                byte1 = 0x55;
                byte2 = 0x09;
                byte3 = 0x00;
                byte4 = 0x02;
                byte5 = 0x08;
                byte6 = 0x07;
                byte7 = 0x02;
                if (led == 0) {
                    byte8 = 0x00;
                } else if (led == 1) {
                    byte8 = 0x01;
                } else if (led == 2) {
                    byte8 = 0x02;
                } else {
                    byte8 = 0x00;
                }
                byte9 = 0xff
                byte10 = 0xff;
                byte11 = 0x00;
                break;
            case TYPE_SOUND:
                //ff:55:05:00:02:22:00:00:0a
                //ff:55:05:00:02:22:06:01:0a
                //ff:55:05:00:02:22:ee:01:0a
                //ff:55:05:00:02:22:88:01:0a
                //ff:55:05:00:02:22:b8:01:0a
                //ff:55:05:00:02:22:5d:01:0a
                //ff:55:05:00:02:22:4a:01:0a
                //ff:55:05:00:02:22:26:01:0a
                // 0  1  2  3  4  5  6  7  8  9
                //ff:55:07:00:02:22:7b:00:fa:00
                byte0 = 0xff;
                byte1 = 0x55;
                byte2 = 0x07;
                byte3 = 0x00;
                byte4 = 0x02;
                byte5 = 0x22;
                if (value === "E3half") {
                    byte6 = 0xa5;
                    byte7 = 0x00;
                    byte8 = 0xf4;
                    byte9 = 0x01;
                } else if (value === "C3whole") {
                    byte6 = 0x83;
                    byte7 = 0x00;
                    byte8 = 0xe8;
                    byte9 = 0x03;
                }
                else if (value === "B2whole") {
                    byte6 = 0x7b;
                    byte7 = 0x00;
                    byte8 = 0xe8;
                    byte9 = 0x03;

                } else if (value === "E3quarter") {
                    byte6 = 0xa5;
                    byte7 = 0x00;
                    byte8 = 0xfa;
                    byte9 = 0x00;
                } else if (value === "G3quarter") {
                    byte6 = 0xc4;
                    byte7 = 0x00;
                    byte8 = 0xfa;
                    byte9 = 0x00;
                } else if (value === "D3quarter") {
                    byte6 = 0x93;
                    byte7 = 0x00;
                    byte8 = 0xfa;
                    byte9 = 0x00;
                } else if (value === "C3quarter") {
                    byte6 = 0x83;
                    byte7 = 0x00;
                    byte8 = 0xfa;
                    byte9 = 0x00;
                } else {
                    byte6 = 0x26;
                    byte7 = 0x00;
                    byte8 = 0xfa;
                    byte9 = 0x00;
                }
                byte10 = 0x00;
                byte12 = 0x00;

                break;
        }



        bufView[0] = byte1 << 8 | byte0;
        bufView[1] = byte3 << 8 | byte2;
        bufView[2] = byte5 << 8 | byte4;
        bufView[3] = byte7 << 8 | byte6;
        bufView[4] = byte9 << 8 | byte8;
        bufView[5] = byte11 << 8 | byte10;
        bufView[6] = byte13 << 8 | byte12;
        bufView[7] = byte15 << 8 | byte14;
        console.log(
            byte0.toString(16) + ":" +
            byte1.toString(16) + ":" +
            byte2.toString(16) + ":" +
            byte3.toString(16) + ":" +
            byte4.toString(16) + ":" +
            byte5.toString(16) + ":" +
            byte6.toString(16) + ":" +
            byte7.toString(16) + ":" +
            byte8.toString(16) + ":" +
            byte9.toString(16) + ":" +
            byte10.toString(16)// + ":" +
            // byte11.toString(16) + ":" +
            // byte12.toString(16) + ":" +
            // byte13.toString(16) + ":" +
            // byte14.toString(16) + ":" +
            // byte15.toString(16)
        );
        console.log(
            bufView[0].toString(16) + ":" +
            bufView[1].toString(16) + ":" +
            bufView[2].toString(16) + ":" +
            bufView[3].toString(16) + ":" +
            bufView[4].toString(16) + ":" +
            bufView[5].toString(16) + ":" +
            bufView[6].toString(16) + ":" +
            bufView[7].toString(16)
        );
        return buf;
    }

    _writeCharacteristic(value) {
        console.log("This is what is written:" + value)
        return this.device.gatt.getPrimaryService(this.config.service())
            .then(service => service.getCharacteristic(this.config.charateristic()))
            .then(characteristic => characteristic.writeValue(value));
    }


}

const DEVICE_NAME = "Makeblock_LE",
    SERVICE_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb",
    CHARACTERISTIC_UUID = "0000ffe3-0000-1000-8000-00805f9b34fb";





let mBot = new MBot();

//module.exports = mBot;