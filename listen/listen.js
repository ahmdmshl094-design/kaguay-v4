import { CommandHandler } from "../handler/handlers.js";
import { threadsController, usersController, economyControllers, expControllers } from "../database/controllers/index.js";
import { utils } from "../helper/index.js";

const createHandler = (api, event, User, Thread, Economy, Exp) => {
  const args = { api, event, Users: User, Threads: Thread, Economy, Exp };
  return new CommandHandler(args);
};

const listen = async ({ api, event }) => {
  try {
    const { threadID, senderID, type, userID, from, isGroup } = event;
    const Thread = threadsController({ api });
    const User = usersController({ api });
    const Economy = economyControllers({ api, event });
    const Exp = expControllers({ api, event });

    if (["message", "message_reply", "message_reaction", "typ"].includes(type)) {
      if (isGroup) {
        await Thread.create(threadID);
      }
      const resolvedID = senderID || userID || from;
      if (resolvedID) {
        await User.create(resolvedID);
      }
    }

    global.kaguya = utils({ api, event });

    const handler = createHandler(api, event, User, Thread, Economy, Exp);
    await handler.handleEvent();

    switch (type) {
      case "message":
        await handler.handleCommand();
        break;
      case "message_reaction":
        await handler.handleReaction();
        break;
      case "message_reply":
        await handler.handleReply();
        await handler.handleCommand();
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("[ خطأ ]: حدث خطأ أثناء معالجة الحدث:", error);
  }
};

export { listen };
