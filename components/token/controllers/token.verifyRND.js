
async function VerifyRND(req, res) {
    try {
        let session = JSON.parse(req.signedCookies.tokenSession);
        return res.status(200).json({ message: session });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }

}

module.exports = VerifyRND;