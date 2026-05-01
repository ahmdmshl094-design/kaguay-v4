export default {
  name: "اخترق",
  description: "نظام اختراق وهمي للمتعة",
  aliases: ["hack"],
  cooldowns: 10,
  execute: async ({ api, event, args }) => {
    const { threadID, messageID, senderID, mentions } = event;

    const mention = mentions ? Object.keys(mentions)[0] : null;
    const targetName = mention
      ? mentions[mention]
      : args.join(" ") || "مجهول";

    const steps = [
      "🔍 جاري البحث عن الهدف...",
      "🌐 الاتصال بالشبكة المشفرة...",
      "🔓 كسر طبقة الحماية الأولى...",
      "💾 استخراج البيانات...",
      "✅ تم الاختراق بنجاح!",
    ];

    const hackMessage =
      `🧩 نظام الاختراق الوهمي - snfor v1.0 🧩\n` +
      `──────────────────────\n` +
      `🎯 الهدف: ${targetName}\n` +
      `──────────────────────\n` +
      steps.map((s, i) => `${i + 1}. ${s}`).join("\n") +
      `\n──────────────────────\n` +
      `⚠️ هذا للمتعة فقط ولا يمثل اختراقًا حقيقيًا!`;

    await api.sendMessage(hackMessage, threadID, messageID);
  },
};
