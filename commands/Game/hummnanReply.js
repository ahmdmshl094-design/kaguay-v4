const humanReplies = {
  greetings: [
    "اهلاً وسهلاً يا سنافري ❤️",
    "ليش ما تكتب من زمان؟ اشتقتلك!",
    "مرحباً! كيفك؟",
    "هاي! جيت تكلمني؟ أهلاً بك!",
    "أهلاً يا نجم! شتريد؟"
  ],
  questions: [
    "سؤالك مهم، بس ما عنديش جواب دقيق!",
    "أنا أفكر... طب، شنو رأيك أنت؟",
    "ما أعرف 100%، بس نقدر نجرب!",
    "سؤال حلو! حمودي سان شايف إن...",
    "هذا سؤال يخليك تفكر... أحبه!"
  ],
  name_mentions: [
    "أنا snfor، نعم أنا 🍓",
    "تعرف، أنا مش مشغول، أنا هنا عشانك",
    "لما تكتب اسمي، أحس بالفرحة ❤️",
    "نعم؟ أنا هنا يا سنافري",
    "شنو؟ ما تخليني أرد عليك؟"
  ],
  vague: [
    "أنا فاهم، بس اشرح أكثر شوي؟",
    "ما فهمت تمام، بس أحبك يا سنافري!",
    "انت تكلمني؟ أنا مشغول شوي 😎",
    "طب، أنا سامعك، تابع...",
    "هذا صحيح... أو لا؟"
  ],
  affection: [
    "يا سنافري، أنت الأحلى ❤️",
    "كلامك يسعدني، بصراحة!",
    "انا ما بحب، انا بعشقكم يا سنافري!",
    "حتى لو ما تكتبوا، أنا أحبكم",
    "قلبي معاكم دايمًا 🇸🇩"
  ]
};

const detectIntent = (body, mentionsBot) => {
  const text = body.toLowerCase();
  if (mentionsBot) return "name_mentions";
  if (["هلا", "سلام", "اهلا", "هيي", "هاي"].some(w => text.includes(w))) return "greetings";
  if (["؟", "سؤال", "شلون", "وش", "هل", "كيف", "متى", "ليش"].some(w => text.includes(w))) return "questions";
  if (["بحبك", "احبك", "حلو", "جميل", "تحبني"].some(w => text.includes(w))) return "affection";
  return "vague";
};

export const getHumanReply = (senderName, body, mentionsBot) => {
  const intent = detectIntent(body, mentionsBot);
  const replies = humanReplies[intent];
  const randomReply = replies[Math.floor(Math.random() * replies.length)];
  let finalReply = randomReply;
  if (finalReply.includes("يا سنافري") && senderName) {
    finalReply = finalReply.replace("يا سنافري", `يا ${senderName}`);
  }
  return finalReply;
};

export default {
  name: "رد_بشري",
  description: "ردود ذكية بأسلوب بشري تلقائياً",
  cooldowns: 3,
  aliases: ["humanreply"],
  execute: async ({ api, event, args }) => {
    const body = args.join(" ") || "سلام";
    const mentionsBot = body.includes("snfor") || body.includes("بوت");
    const reply = getHumanReply(null, body, mentionsBot);
    await api.sendMessage(reply, event.threadID, event.messageID);
  },
};
