const usbDetect = require("usb-detection");
const graphene = require("graphene-pk11");
const path = require("path");

usbDetect.startMonitoring();
async function checkIfTokenInserted(req, res) {
    try {
        // productId: 2055
        // vendorId: 2414
        let device = await usbDetect.find(2414, 2055)
        if (device.length === 0) return res.status(400).json({ success: false });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal server error');
    }

}

module.exports = checkIfTokenInserted;