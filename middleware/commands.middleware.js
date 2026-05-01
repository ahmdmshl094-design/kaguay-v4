import fs from "fs-extra";
import { log } from "../logger/index.js";

export const commandMiddleware = async () => {
  try {
    const dir = await fs.readdir("./commands");
    for (const directory of dir) {
      if (fs.statSync(`./commands/${directory}`).isDirectory()) {
        const cmd = await fs.readdir(`./commands/${directory}`);
        for (const command of cmd) {
          try {
            const commands = (await import(`../commands/${directory}/${command}`)).default;
            if (commands?.onLoad && typeof commands?.onLoad == "function") {
              await commands.onLoad();
            }
            if (!commands?.name) {
              log([
                { message: "[ النظام ]: ", color: "green" },
                { message: `تعذر تحميل الأمر: ${command} لأنه لا يحتوي على اسم`, color: "red" },
              ]);
              continue;
            }
            if (typeof commands?.execute !== "function") {
              log([
                { message: "[ النظام ]: ", color: "green" },
                { message: `تعذر تحميل الأمر: ${command} لأنه لا يحتوي على دالة التنفيذ`, color: "red" },
              ]);
              continue;
            }
            await global.client.commands.set(commands.name, commands);
            await log([
              { message: "[ النظام ]: ", color: "green" },
              { message: ` تم تحميل الأمر بنجاح: ./${directory.toLowerCase()}/${commands.name}`, color: "white" },
            ]);
            if (commands.aliases && Array.isArray(commands.aliases)) {
              for (const alias of commands.aliases) {
                if (global.client.aliases.has(alias)) {
                  log([
                    { message: "[ الاختصار ]: ", color: "ocean" },
                    {
                      message: `الاختصار "${alias}" مستخدم بالفعل للأمر <${global.client.aliases.get(alias)}> ولا يمكن استخدامه للأمر: ${commands.name}`,
                      color: "red",
                    },
                  ]);
                  continue;
                }
                if (alias == "" || !alias) {
                  continue;
                }
                global.client.aliases.set(alias, commands.name);
              }
            }
          } catch (error) {
            log([
              { message: "[ النظام ]: ", color: "green" },
              { message: `تعذر تحميل الأمر: ${command} بسبب خطأ: ${error}`, color: "red" },
            ]);
            continue;
          }
        }
      }
    }
  } catch (error) {
    log([
      { message: "[ النظام ]: ", color: "green" },
      { message: `تعذر تحميل الأوامر بسبب خطأ: ${error}`, color: "red" },
    ]);
  }
};
