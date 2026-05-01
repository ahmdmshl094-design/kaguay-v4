import axios from "axios";
import fs from "fs";
import path from "path";
import process from "process";

export default {
  name: "قائمة",
  author: "حمودي سان",
  cooldowns: 50,
  description: "قائمة الأوامر",
  role: "member",
  aliases: ["menu", "قائمه"],
  execute: async ({ api, event }) => {
    api.setMessageReaction("📜", event.messageID, () => {}, true);

    const messageText =
      "\t\t\t\t\t\t\t༒☾قـــائــــمــــة الــاوامـــر☽༒\n\n" +
      "༺✿فــــئــــة الألــعــاب✿༻\n\n" +
      "❁تفكيك  ❁رأس_أو_وجه  ❁شارات  ❁حجر_ورقة_مقص  ❁شخصيات ❁ايموجي ❁الاسرع ❁اكس_او ❁حقيقة&جرأة ❁فزورة ❁تخمين\n\n" +
      "༺فـــئـــة الاقــــتــــصــاد༻\n\n" +
      "❂عمل ❂هدية ❂نقاط ❂رصيدي ❂صرف ❂توب ❂كهف\n\n" +
      "༺فــــئــــة الـــــــخــــدمـــات༻\n\n" +
      " ✺إزالة_الخلفية  ✺بيانات ✺ايدي ✺تعالو\n" +
      " ✺مزج ✺ارت ✺تلوين ✺ترجمي ✺تطقيم ✺تطقيم2 ✺ذكريني ✺تحميل ✺غني ✺يوتيوب ✺رابط ✺رابط2 ✺رابط3  ✺رابط4 ✺أخبار_الأنمي ✺أوبستايت ✺فيسبوك ✺تحميل\n" +
      " ✺الطقس ✺اقتصاص ✺ضيفيني ✺ملصق ✺غني ✺صور ✺جوجل ✺قرآن ✺كنية ✺تيد ✺اوامر ✺عمري ✺ويكيبيديا ✺إيموجي ✺المعرف ✺دمج ✺زخرفة  ✺جودة  ✺تحويل ✺آيدي ✺معلوماتي ✺نصيحة ✺اطرديني ✺انضمام ✺مشغول ✺لوغو\n\n" +
      "༺✿فــــئــــة الــــــذكـــاء✿༻\n\n" +
      "♔تخيلي ♔تخيلي2 ♔ارسمي ♔ارسمي2 ♔كاغويا ♔ذكاء\n" +
      "♔نيجي ♔تشابه ♔برومبت\n\n" +
      "༺✿فــــئــــة الــــمـــتـــعـــة✿༻\n\n" +
      "❀رقص ❀افلام ❀كراش ❀شاذ ❀سيجما ❀أنمي2 ❀اقتباس ❀شخصيتي ❀مقطع_أنمي ❀إعجاب ❀زوجيني ❀نيزكو ❀اصفعي ❀آيفون ❀علمني ❀حضن ❀اعجاب ❀أزياء ❀قولي ❀ونبيس ❀قبر ❀فتيات ❀مرحاض ❀زواج ❀غموض ❀طلب ❀ماذا_لو ❀خلفيات ❀سبيدرمان ❀شنق ❀مطلوب ❀انميات ❀تحدي ❀شخصيتي_السينمائية ❀زوجة\n" +
      "❀ زوجيني2 ❀زوجيني3 ❀زوجيني4 ❀سيلفي ❀عناق2 ❀حيواني ❀قبلة ❀حيواني ❀ضرب\n\n" +
      "༺✿فــــئــــة الـــــمــــطـــور✿༻\n\n" +
      "♛قبول ♛طلبات ♛غادري ♛المطور ♛موافقة ♛المتجر ♛آدمن ♛رد_الآدمن ♛تجربة ♛ضبط_البادئة ♛كمند ♛بايو ♛المجموعة ♛تصفية ♛إشعار ♛اوبتايم ♛ڤيو ♛شرح ♛المستخدم ♛مشاركة ♛لاست\n\n" +
      "༺فــــئــــة الـــمــجــمــوعــة༻\n\n" +
      "❆حماية_الإسم ❆حماية_الصورة ❆ضبط_إيموجي ❆ضبط_الصورة ❆ضبط_الإسم\n\n" +
      "༺✿أوٌآمــر إضــآفــيــةّ✿༻\n\n" +
      " ☠مثير ☠تطبيقات ☠شوتي\n\n" +
      "\t\t<┈┈┈ ⋞ 〈 ⏣ 〉 ⋟ ┈┈┈┈>";

    const imagePath = path.join(process.cwd(), "cache", "neko_image.png");

    try {
      const apiResponse = await axios.get(
        "https://jerome-web.gleeze.com/service/api/neko?type=png&amount=1"
      );

      if (apiResponse.data.success && apiResponse.data.data.length > 0) {
        const nekoImageUrl = apiResponse.data.data[0].url;

        const response = await axios({
          url: nekoImageUrl,
          responseType: "stream",
        });

        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);

        writer.on("finish", () => {
          api.sendMessage(
            {
              body: messageText,
              attachment: fs.createReadStream(imagePath),
            },
            event.threadID,
            () => {
              try { fs.unlinkSync(imagePath); } catch (_) {}
            },
            event.messageID
          );
        });

        writer.on("error", (err) => {
          console.error("[ خطأ ]: فشل في حفظ الصورة:", err);
          api.sendMessage(messageText, event.threadID, event.messageID);
        });
      } else {
        api.sendMessage(messageText, event.threadID, event.messageID);
      }
    } catch (error) {
      console.error("[ خطأ ]: فشل في جلب صورة القائمة:", error);
      api.sendMessage(messageText, event.threadID, event.messageID);
    }
  },
};
