import fs from "fs-extra";
import { log } from "../logger/index.js";

export const eventMiddleware = async () => {
  try {
    const dir = await fs.readdir("./event");
    for (const event of dir) {
      if (!event.endsWith(".js")) {
        continue;
      }
      try {
        const events = (await import(`../event/${event}`)).default;
        if (events?.onLoad && typeof events?.onLoad === "function") {
          await events.onLoad();
        }
        if (!events?.name) {
          log([
            { message: "[ الأحداث ]: ", color: "yellow" },
            { message: `تعذر تحميل الحدث: ${event} لأنه لا يحتوي على اسم`, color: "red" },
          ]);
          continue;
        }
        if (typeof events?.execute !== "function") {
          log([
            { message: "[ الأحداث ]: ", color: "yellow" },
            { message: `تعذر تحميل الحدث: ${event} لأنه لا يحتوي على دالة التنفيذ`, color: "red" },
          ]);
          continue;
        }
        await global.client.events.set(events.name, events);
        await log([
          { message: "[ الأحداث ]: ", color: "yellow" },
          { message: `تم تحميل الحدث بنجاح: ./event/${events.name}`, color: "white" },
        ]);
      } catch (error) {
        log([
          { message: "[ الأحداث ]: ", color: "yellow" },
          { message: `تعذر تحميل الحدث: ${event} بسبب خطأ: ${error.message}`, color: "red" },
        ]);
        continue;
      }
    }
  } catch (error) {
    log([
      { message: "[ الأحداث ]: ", color: "yellow" },
      { message: `تعذر قراءة مجلد الأحداث: ${error.message}`, color: "red" },
    ]);
  }
};
