import { Jimp } from 'jimp';
import fs from 'fs';

async function bal(one, two) {
    let avatarOne = await circle(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    let avatarTwo = await circle(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);

    let avone = await Jimp.read(await circle(avatarOne));
    let avtwo = await Jimp.read(await circle(avatarTwo));

    // استخدام رابط الصورة الجديد
    let img = await Jimp.read("https://i.ibb.co/5TwSHpP/Guardian-Place-full-1484178.jpg");

    // تحديث الإحداثيات والمقاسات
    img.composite(avone.resize(90, 90), 250, 1)
       .composite(avtwo.resize(90, 90), 350, 70);

    const pth = "زواج.png";
    await img.write(pth);
    return pth;
}

async function circle(url) {
    const img = await Jimp.read(url);
    img.circle();
    return await img.getBufferAsync(JimpMime.PNG);
}

export default {
    name: "زوجيني3",
    author: "Anonymous",
    role: "member",
    description: "إرسال صورة زفاف بين عروسين محددين.",
    execute: async function ({ api, event, args }) {
        const mention = Object.keys(event.mentions);
        if (mention.length == 0) return api.sendMessage(" ⚠️ | المرجو عمل منشن للشخص الذي تريد الزواج به", event.threadID);
        else if (mention.length == 1) {
            const one = event.senderID, two = mention[0];
            try {
                const ptth = await bal(one, two);
                return api.sendMessage({ body: "تهانينا للعروسين 🥳", attachment: fs.createReadStream(ptth) }, event.threadID);
            } catch (error) {
                console.error(error);
                return api.sendMessage("حدث خطأ أثناء إرسال الصورة.", event.threadID);
            }
        } else {
            const one = mention[1], two = mention[0];
            try {
                const ptth = await bal(one, two);
                return api.sendMessage({ body: "تهانينا للعروسين 🥳", attachment: fs.createReadStream(ptth) }, event.threadID);
            } catch (error) {
                console.error(error);
                return api.sendMessage("حدث خطأ أثناء إرسال الصورة.", event.threadID);
            }
        }
    }
};
