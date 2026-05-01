export default {
  name: "تنظيف",
  description: "تنظيف المحادثة (غير نشط)",
  aliases: ["clean"],
  cooldowns: 5,
  role: "admin",
  execute: async ({ api, event }) => {
    await api.sendMessage("🧹 أمر التنظيف غير مفعّل حالياً.", event.threadID, event.messageID);
  },
};
