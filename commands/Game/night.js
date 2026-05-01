export default {
  name: "مساء",
  description: "رسالة مساء الخير",
  aliases: ["ليل", "تصبح"],
  cooldowns: 10,
  execute: async ({ api, event }) => {
    await api.sendMessage(
      "🌙 تصبحون على خير يا سنافري! 💤\nالنوم حلو، والحلوين بيحبوكم 🌟\nمن: حمودي سان 🇸🇩",
      event.threadID,
      event.messageID
    );
  },
};
