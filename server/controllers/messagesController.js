const messageModel = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    console.log("addmsg");
    const { from, to, message } = req.body;

    console.log(`Received message from ${from} to ${to}: ${message}`);

    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    console.log("Data from MongoDB:", data);
    if (data) {
      return res.json({ msg: "message added successfully" });
    } else {
      return res.json({ msg: "fail to add to db" });
    }
  } catch (ex) {
    console.error("Error in addMessage:", ex);
    // next(ex);
    return res
      .status(500)
      .json({ msg: "failed to add to db", error: ex.message });
  }
};
module.exports.getMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel.find({
      users: {
        $all: [from, to],
      },
    })
    .sort({updatedAt:1});
    const projectMessages = messages.map((msg) => {
        return{
            fromSelf: msg.sender.toString() === from ,
            message:msg.message.text,
        }
    })
    res.json(projectMessages)
  } catch (ex) {
    next(ex);
  }
};
