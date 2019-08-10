const Dev  = require('../models/Dev');

module.exports = {

    async store(req, res) {
        const { user } = req.headers;
        const { devId } = req.params;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if(!targetDev) {
            return res.status(404).json({error: "Dev not exists."});
        }

        const alreadyDislikes = loggedDev.dislikes.includes(targetDev._id);
        if(!alreadyDislikes) {
            loggedDev.dislikes.push(targetDev._id);
            await loggedDev.save();
        }

        return res.json(loggedDev);
    }

}