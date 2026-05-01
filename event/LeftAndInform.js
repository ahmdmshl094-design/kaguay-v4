import axios from 'axios';
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import { Jimp } from 'jimp';

async function execute({ api, event, Users, Threads }) {
  const ownerFbIds = ["100076269693499"];  // قائمة بمعرفات الفيسبوك لأصحاب البوت المصرح لهم

  switch (event.logMessageType) {
    case "log:unsubscribe": {
      const { leftParticipantFbId, reason } = event.logMessageData;
      if (leftParticipantFbId == api.getCurrentUserID()) {
        return;
      }
      const userInfo = await api.getUserInfo(leftParticipantFbId);
      const profileName = userInfo[leftParticipantFbId]?.name || "Unknown";
      const type = event.author == leftParticipantFbId ? "غادر لوحده" : "طرده الآدمن";
      const farewellReason = getFarewellReason(reason);
      const membersCount = await api.getThreadInfo(event.threadID).then(info => info.participantIDs.length).catch(error => {
        console.error('Error getting members count:', error);
        return "Unknown";
      });
      const farewellMessage = `❏ الإســم 👤 : 『${profileName}』 \n❏ الـسـبـب 📝 : \n『${type}』 \n 『${farewellReason}』\n❏ المـتـبـقـيـيـن : ${membersCount} عـضـو`;
      const profilePicturePath = await getProfilePicture(leftParticipantFbId);
      await sendWelcomeOrFarewellMessage(api, event.threadID, farewellMessage, profilePicturePath);
      break;
    }
    case "log:subscribe": {
      const { addedParticipants } = event.logMessageData;
      const botUserID = api.getCurrentUserID();
      const botAdded = addedParticipants.some(participant => participant.userFbId === botUserID);

      if (botAdded) {
        // التعامل مع إضافة البوت
        await handleBotAddition(api, event, ownerFbIds);
      }

      break;  // لا ترسل رسالة ترحيب
    }
  }
}

async function handleBotAddition(api, event, ownerFbIds) {
  const threadInfo = await api.getThreadInfo(event.threadID);
  const threadName = threadInfo.threadName || "Unknown";
  const membersCount = threadInfo.participantIDs.length;
  const addedBy = event.author;
  const addedByInfo = await api.getUserInfo(addedBy);
  const addedByName = addedByInfo[addedBy]?.name || "Unknown";

  if (!ownerFbIds.includes(addedBy)) {
    const notifyOwnerMessage = `⚠️ إشعار: تم إضافة البوت إلى مجموعة جديدة! \n📍 اسم المجموعة: ${threadName} \n🔢 عدد الأعضاء: ${membersCount} \n🧑‍💼 بواسطة: ${addedByName}`;
    await api.sendMessage(notifyOwnerMessage, ownerFbIds[0]);

    const exitMessage = `⚠️ | إضافة البوت بدون إذن غير مسموح يرجى التواصل مع المطور من أجل الحصول على الموافقة \n 📞 | رابـط الـمـطـور : https://www.facebook.com/profile.php?id=100076269693499`;
    await api.sendMessage(exitMessage, event.threadID);

    await api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
  } else {
    const notifyOwnerMessage = `⚠️ إشعار: تم إضافة البوت إلى مجموعة جديدة! \n📍 اسم المجموعة: ${threadName} \n🔢 عدد الأعضاء: ${membersCount}`;
    await api.sendMessage(notifyOwnerMessage, ownerFbIds[0]);
  }
}

async function sendWelcomeOrFarewellMessage(api, threadID, message, attachmentPath) {
  try {
    await api.sendMessage({
      body: message,
      attachment: fs.createReadStream(attachmentPath),
    }, threadID);
  } catch (error) {
    console.error('Error sending welcome or farewell message:', error);
  }
}

async function getProfilePicture(userID) {
  const url = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const img = await Jimp.read(url);
  const profilePath = path.join(process.cwd(), 'cache', `profile_${userID}.png`);
  await img.write(profilePath);
  return profilePath;
}

function getFarewellReason(reason) {
  return reason === "leave" ? "ناقص واحد ناقص مشكلة 😉" : "لاتنسى تسكر الباب وراك 🙂";
}

export default {
  name: "ترحيب_ومغادرة",
  description: "يتم استدعاء هذا الأمر عندما ينضم شخص جديد إلى المجموعة أو يغادرها.",
  execute,
};
