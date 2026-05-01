export default {
  name: "احذف",
  description: "يحذف رسالة البوت الأخيرة",
  cooldowns: 3,
  execute: async ({ api, event }) => {
    const { threadID, messageID } = event;
    const lastMessageID = global.client?.lastBotMessageID;
    if (lastMessageID) {
      api.unsendMessage(lastMessageID);
    } else {
      await api.sendMessage("❌ لا توجد رسالة للحذف.", threadID, messageID);
    }
  },
};
