const userMemory = new Map();

export default {
  name: "ذكي",
  description: "ردود ذكية بأسلوب بشري",
  aliases: ["smartreply"],
  cooldowns: 3,
  execute: async ({ api, event, args }) => {
    const { threadID, messageID, senderID } = event;
    const body = args.join(" ").toLowerCase().trim();

    if (!body) {
      return api.sendMessage("📝 اكتب رسالتك بعد الأمر.", threadID, messageID);
    }

    const getMood = (txt) => {
      if (["تعبت", "حزين", "ممل", "ضعيف"].some(w => txt.includes(w))) return "sad";
      if (["ههه", "حلو", "ممتاز", "ضحكة"].some(w => txt.includes(w))) return "happy";
      if (txt.includes("?") || ["كيف", "ليش", "وش", "هل", "متى"].some(w => txt.includes(w))) return "question";
      return "neutral";
    };

    const replies = {
      sad: ["يا قلبي ❤️", "أنا معاك يا سنافري", "ما تستسلمش، أنت أقوى من كذا"],
      happy: ["هههه 😂", "أنت تسعدني!", "الحمد لله، إنت كذا دايمًا!"],
      question: ["سؤال حلو!", "والله ما أعرف بالضبط 😅", "جرب تسأل حمودي سان 🇸🇩"],
      neutral: ["أوكي أوكي 😎", "اشرح أكثر؟", "فاهم عليك!", "تابع، أنا سامعك..."],
    };

    const mood = getMood(body);
    const pool = replies[mood];
    const reply = pool[Math.floor(Math.random() * pool.length)];

    await api.sendMessage(reply, threadID, messageID);
  },
};
