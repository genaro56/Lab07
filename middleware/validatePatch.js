const validatePatch = (req, res, next) => {
    let id = req.params.id;
    let bodyId = req.body.id;
    if (!bodyId) {
        res.statusMessage = "The id must be sent in the body"
        res.status(406).end();
    }
    if (!id) {
        res.statusMessage = "The id must be sent as a parameter"
        res.status(406).end();
    }
    if (id != bodyId) {
        res.statusMessage = "The ids must match"
        res.status(409).end();
    }
    next();
}


module.exports = validatePatch;