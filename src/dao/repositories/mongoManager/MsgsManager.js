import { messageModel } from "../../models/messages.model.js";

class MsgsManager {
  async getMsgs() {
    try {
      const getMsgs = await messageModel.find({});
      return getMsgs;
    } catch (err) {
      console.log(err);
    }
  }

  async sendMsg(msg) {
    try {
      const send = await messageModel.create(msg);
      return send;
    } catch (err) {
      console.log(err);
    }
  }
}

export default MsgsManager;
