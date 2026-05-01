export default {
  name: "مساعدة",
  version: "1.5",
  hasPermission: "users",
  credits: "حمودي سان 🇸🇩",
  description: "عرض قائمة كاملة بالأوامر مرتبة حسب الفئة",
  commandCategory: "نظام",
  usages: "مساعدة",
  cooldowns: 5,
  aliases: ["اوامر", "help"],
  execute: async ({ api, event }) => {
    const botName = "snfor";
    const developer = "حمودي سان 🇸🇩";
    const facebook = "fb.com/babasnfor80";
    const prefix = "";
    const totalCommands = global.client?.commands?.size || 0;

    const categories = {
      "🎮 تسلية": ["اخترق", "حب", "حظ", "تحدي", "دراما", "ميمز"],
      "📈 تفاعل": ["مستواي", "الترتيب", "هدية", "رد", "إيموجي"],
      "🛠️ نظام": ["مطور", "مساعدة", "اوبتايم", "قائمة"],
    };

    let helpMessage =
      "🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓\n" +
      `     🌟 قائمة أوامر بوت ${botName} 🌟\n` +
      "🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓\n\n";

    Object.keys(categories).forEach(category => {
      helpMessage += `\n${category}\n`;
      categories[category].forEach(cmd => {
        helpMessage += `  🔹 ${prefix}${cmd}\n`;
      });
    });

    helpMessage +=
      "\n🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓\n" +
      `👑 المطور: ${developer}\n` +
      "💬 أحبكم يا سنافري ❤️\n" +
      `📱 فيسبوك: ${facebook}\n` +
      "📌 البوت شغال 24 ساعة\n" +
      `🔔 إجمالي الأوامر المحملة: ${totalCommands}\n` +
      "🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓";

    api.sendMessage(helpMessage, event.threadID, event.messageID)
      .catch(err => {
        console.error("[ خطأ ]: تعذر إرسال رسالة الأوامر:", err);
        api.sendMessage("❌ تعذر عرض الأوامر. حاول لاحقًا.", event.threadID);
      });
  },
};
