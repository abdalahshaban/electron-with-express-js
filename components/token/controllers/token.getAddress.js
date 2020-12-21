const usbDetect = require("usb-detection");
const graphene = require("graphene-pk11");
const path = require("path");

usbDetect.startMonitoring();
// usbDetect.on('change', function (device) { console.log('change', device); });
async function getAddress(req, res) {
    try {
        //get useb list
        // productId: 2055
        // vendorId: 2414
        // usbDetect.find(function (err, devices) {
        //     if (devices.length > 0) return res.status(200).json({ devices });
        //     return res.status(200).json('no device');
        // });
        // let devices = await usbDetect.find();
        // return res.status(200).json(devices);
        // usbDetect.on('add:2414:2055', function (device) { console.log('add', device); });
        let dllPath = path.join(__dirname, `../../../lib/eps2003csp11.dll`);

        const mod = graphene.Module.load(dllPath);

        mod.initialize();

        const slot = mod.getSlots(0);
        const session = slot.open(
            graphene.SessionFlag.RW_SESSION | graphene.SessionFlag.SERIAL_SESSION
        );
        session.login("11112222", graphene.UserType.USER);

        const objs = session.find({
            id: new Buffer([1, 2, 3, 4, 5]),
            keyType: graphene.KeyType.RSA,

            class: graphene.ObjectClass.PRIVATE_KEY,
        });
        if (objs.length > 0) {
            for (let i = 0; i < objs.length; i++) {
                console.log(objs.items(i));
            }
        }
        // templates for RSA key generation
        // const publicKeyTemplate = {
        //     label: "My RSA 2048",
        //     id: new Buffer([1, 2, 3, 4, 5]), // uniquer id for keys in storage https://www.cryptsoft.com/pkcs11doc/v230/group__SEC__9__7__KEY__OBJECTS.html
        //     token: true, // flag for writing key to token
        //     publicExponent: new Buffer([1, 0, 1]),
        //     modulusBits: 1024,
        //     encrypt: true,
        //     verify: true,
        // }
        // const privateKeyTemplate = {
        //     label: "My RSA 2048",
        //     id: new Buffer([1, 2, 3, 4, 5]),
        //     private: true,
        //     token: true,
        //     decrypt: true,
        //     sign: true,
        //     extractable: false,
        // }
        // // Generate RSA key and write it to token
        // const rsaKeys = session.generateKeyPair(graphene.KeyGenMechanism.RSA, publicKeyTemplate, privateKeyTemplate);

        // const rsaAlg = {
        //     name: "RSA_PKCS_OAEP",
        //     params: new graphene.RsaOaepParams(graphene.MechanismEnum.SHA1, graphene.RsaMgf.MGF1_SHA1),
        // }
        // const data = new Buffer("SOME TEST DATA");

        // const rsaCipher = session.createCipher(rsaAlg, rsaKeys.publicKey);
        // const rsaEncData = rsaCipher.once(data, new Buffer(128));
        // console.log("RSA encrypted data:", rsaEncData.toString("hex"));

        // const rsaDCipher = session.createDecipher(rsaAlg, rsaKeys.privateKey);
        // const dec = rsaDCipher.once(rsaEncData, new Buffer(128))
        // console.log("RSA Dencrypted data:", dec.toString());

        mod.finalize();
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
}

module.exports = getAddress;