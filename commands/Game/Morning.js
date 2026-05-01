export default {
  name: "صباح",
  description: "رسالة الصباح من البوت",
  aliases: ["صبح"],
  cooldowns: 10,
  execute: async ({ api, event }) => {
    await api.sendMessage(
      "☀️ صبحكم نور يا سنافري! 🌼\nالنهار كله بخير والسعادة معاكم!\nمن: حمودي سان 🇸🇩",
      event.threadID,
      event.messageID
    );
  },
};
