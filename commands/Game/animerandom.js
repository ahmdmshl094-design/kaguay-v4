import axios from "axios";
import fs from "fs";
import path from "path";

export default {
  name: "أنمي",
  description: "صورة أنمي عشوائية",
  aliases: ["انمي", "anime"],
  cooldowns: 5,
  execute: async ({ api, event }) => {
    try {
      const response = await axios.get("https://api.waifu.pics/sfw/waifu");
      const imageUrl = response.data.url;

      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const imagePath = path.join(process.cwd(), "cache", `anime_${Date.now()}.jpg`);
      fs.writeFileSync(imagePath, imageResponse.data);

      await api.sendMessage(
        { body: "🎨 صورة أنمي عشوائية من snfor ✨", attachment: fs.createReadStream(imagePath) },
        event.threadID,
        event.messageID
      );

      try { fs.unlinkSync(imagePath); } catch (_) {}
    } catch (error) {
      console.error(error);
      await api.sendMessage("⚠️ حدث خطأ أثناء جلب صورة الأنمي.", event.threadID, event.messageID);
    }
  },
};
