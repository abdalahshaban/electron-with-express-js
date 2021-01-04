const graphene = require('graphene-pk11')
const pkcs11 = require('pkcs11js')
const usbDetect = require('usb-detection')
const path = require('path')
const fs = require('fs')
usbDetect.startMonitoring()
let mod

async function openSession(req, res) {
  try {
    let { pin } = req.body
    // productId: 2055
    // vendorId: 2414
    let device = await usbDetect.find(2414, 2055)

    if (device.length === 0) return res.status(400).json({ success: false })

    let dllPath = path.join(__dirname, `../../../lib/eps2003csp11.dll`)

    mod = graphene.Module.load(dllPath)

    mod.initialize()
    const slots = mod.getSlots()

    if (!slots.length) {
      mod.finalize()
      return res.status(400).send('List of Slots is Empty')
    }

    const slot = mod.getSlots(0)
    const session = slot.open(
      graphene.SessionFlag.RW_SESSION | graphene.SessionFlag.SERIAL_SESSION,
    )

    session.login(pin, graphene.UserType.USER)
    // session.setPin(pin, '11112222')

    const cookieConfig = {
      httpOnly: true, // to disable accessing cookie via client side js
      // secure: true, // to force https (if you use it)
      maxAge: 1000000, // ttl in seconds (remove this option and cookie will die when browser is closed)
      signed: true, // if you use the secret with cookieParser
    }

    res.cookie('tokenSession', JSON.stringify(session), cookieConfig)
    // session.clear();
    // session.destroy();
    return res.json({ message: session })

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
    //     extractable: true,
    // }
    // Generate RSA key and write it to token
    // const rsaKeys = session.generateKeyPair(graphene.KeyGenMechanism.RSA, publicKeyTemplate, privateKeyTemplate);

    // let pk = fs.writeFileSync('pk.json', JSON.stringify(rsaKeys.publicKey));
    // let sig = fs.writeFileSync('sign.json', JSON.stringify(signature));

    // let pk = fs.readFileSync(path.join(__dirname, '../../../pk.json'), 'utf8');
    // let sig = fs.readFileSync(path.join(__dirname, '../../../sign.json'), 'utf8');

    // const pkObj = session.create({
    //     class: graphene.ObjectClass.DATA,
    //     label: "data.pk",
    //     application: "isec",
    //     objectId: Buffer.from([1]),
    //     token: true,
    //     modifiable: true,
    //     value: pk,
    // });

    // const sigObj = session.create({
    //     class: graphene.ObjectClass.DATA,
    //     label: "data.sig",
    //     application: "isec",
    //     objectId: Buffer.from([1]),
    //     token: true,
    //     modifiable: true,
    //     value: sig,
    // });

    // let objPk = pkSession.toType();
    // let objSig = sigSession.toType();

    // session.clear();

    // let isecSession = session.find({ application: "isec" });
    // length = isecSession.length
    // if (length >= 0) {
    //     for (let i = 0; i < isecSession.length; i++) {
    //         console.log(isecSession.items(i).toType().value, i);
    //         console.log(isecSession.items(i).toType().label.toString(), i);
    //         console.log(isecSession.items(i).toType().objectId.toString(), i);
    //         console.log(isecSession.items(i).toType().token.toString(), i);
    //         console.log(isecSession.items(i).toType().modifiable.toString(), i);
    //         console.log(isecSession.items(i).toType().class.toString(), i);

    //     }
    // }
    // const data = "hello world2";

    // let pk = session.find({ class: graphene.ObjectClass.PUBLIC_KEY }).items(0).toType();
    // // console.log(pk, 'pk');

    // let pv = session.find({ class: graphene.ObjectClass.PRIVATE_KEY }).items(0).toType();

    // CERTIFICATE template
    // const template = {
    //     class: graphene.ObjectClass.CERTIFICATE,
    //     certType: graphene.CertificateType.X_509,
    //     private: false,
    //     token: true,
    //     // id: Buffer.from([1, 2, 3, 4, 5]), // Should be the same as Private/Public key has
    //     id: new Buffer([1, 2, 3, 4, 5]), // Should be the same as Private/Public key has
    //     label: "My certificate",
    //     subject: Buffer.from("3034310B300906035504...", "hex"),
    //     value: Buffer.from("308203A830820290A003...", "hex"),
    // };

    // const objCert = session.create(template).toType();

    // const count = session.find().length

    // return res.json({ pk, pv, objCert, count });
    // const alg = { name: "RSA_PKCS_OAEP", params: new graphene.RsaOaepParams() };
    // const data = "hello world2";
    // const encrypted = Buffer.alloc(4096);
    // const decrypted = Buffer.alloc(4096);

    // const cipher = session.createCipher(alg, pk);
    // const enc = cipher.once(data, encrypted);

    // console.log(enc, 'enc');

    // const decipher = session.createDecipher(alg, pv);
    // const dec = decipher.once(enc, decrypted);
    // console.log(decrypt.toString(), 'dec');

    // return res.json({ message: 'j' });

    // const pkSession = session.find({ label: "data.pk" });
    // const sigSession = session.find({ label: "data.sig" });

    // const pkSession = session.find({ application: "isec", label: "data.pk" });
    // const sigSession = session.find({ application: "isec", label: "data.sig" });

    // dataPk = pkSession.items(0).toType();
    // dataSig = sigSession.items(0).toType();

    // console.log(dataPk.value, 'dataPk.value');
    // console.log(dataSig.value, 'dataSig.value');

    // let valuePk = dataPk.value.toString();
    // let valueSig = dataSig.value.toString();

    // return res.status(200).json({ pk: JSON.parse(valuePk), sig: JSON.parse(valueSig), count });

    //FIXME:unlocked
    //TODO:
    //Change User's PIN
    //Adding x509 certificate
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
}

module.exports = openSession
