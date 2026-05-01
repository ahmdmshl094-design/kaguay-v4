export default {
  name: "تذكير",
  description: "رسالة تذكير إيجابية",
  cooldowns: 5,
  execute: async ({ api, event }) => {
    const reminders = [
      "يا سنافري، ما تنساش إنك مميز!",
      "الحمد لله على كل شيء، أنت أقوى مما تظن!",
      "اليوم يومك، استمتع بكل لحظة!",
      "أنت أقرب إلى أحلامك مما تتخيل!",
      "لا تستسلم، النجاح قادم لا محالة!",
    ];
    const random = reminders[Math.floor(Math.random() * reminders.length)];
    await api.sendMessage(`📌 تذكير: ${random}`, event.threadID, event.messageID);
  },
};
