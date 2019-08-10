const Dev = require('../models/Dev')

module.exports = {

  async store(req, res) {
    const { user } = req.headers;
    const { devId } = req.params;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    //not found
    if (!targetDev) {
      return res.status(404).json({ error: "Dev not exists." });
    }

    //prevent duplication
    const alreadyLikes = loggedDev.likes.includes(targetDev._id);
    if (!alreadyLikes) {
      loggedDev.likes.push(targetDev._id);
      await loggedDev.save();
    }
    //match
    const match = targetDev.likes.includes(loggedDev._id);
    if (match) {
      const targetSocket = req.connectedUsers[targetDev._id];
      const loggedSocket = req.connectedUsers[loggedDev._id];

      if (targetSocket) {
        req.io.to(targetSocket).emit('match', loggedDev);
      }

      if (loggedSocket) {
        req.io.to(loggedSocket).emit('match', targetDev);
      }

    }

    return res.json(loggedDev);
  }

}