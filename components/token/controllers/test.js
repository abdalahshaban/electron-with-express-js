const { Crypto } = require("node-webcrypto-p11");
const usbDetect = require("usb-detection");
const path = require("path");

usbDetect.startMonitoring();
let mod

async function openSession(req, res) {
    try {
        let { pin } = req.body
        // productId: 2055
        // vendorId: 2414
        let device = await usbDetect.find(2414, 2055);

        if (device.length === 0) return res.status(400).json({ success: false });

        let dllPath = path.join(__dirname, `../../../lib/eps2003csp11.dll`);

        const crypto = new Crypto({
            library: dllPath,
            pin,
            slot: 0,
            readWrite: true
        });

        const keys = await crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: {
                name: "SHA-1"
            },
            token: true,
        },
            true,
            ["sign", "verify"]
        );

        
        console.log(keys, 'keys');
        res.cookie('tokenSession', JSON.stringify(session), cookieConfig);
        return res.status(200).json({ message: true });

    } catch (error) {
        return res.status(500).send(error);
    }

}

module.exports = openSession;