// index.js — نسخة نهائية، مكتملة، وآمنة لمشروع snfor

import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import axios from "axios";
import semver from "semver";
import gradient from "gradient-string";
import { log, notifer } from "./logger/index.js";
import { commandMiddleware, eventMiddleware } from "./middleware/index.js";
import config from "./KaguyaSetUp/config.js";
import login from "@xaviabot/fca-unofficial";

// تحديد مسار الجذر
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class snfor {
  constructor() {
    this.currentConfig = config;
    this.credentialsPath = path.join(__dirname, "KaguyaSetUp", "KaguyaState.json");
    this.package = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8"));
    this.checkCredentials();
  }

  checkCredentials() {
    try {
      if (!fs.existsSync(this.credentialsPath)) {
        throw new Error("ملف KaguyaState.json غير موجود.");
      }

      const data = fs.readFileSync(this.credentialsPath, "utf8");
      const appState = JSON.parse(data);

      if (!Array.isArray(appState) || appState.length === 0) {
        throw new Error("ملف appState فارغ أو غير صالح.");
      }

      this.appState = appState;
    } catch (error) {
      log([
        { message: "[ خطأ ]: ", color: "red" },
        { message: `فشل في قراءة appState: ${error.message}`, color: "white" }
      ]);
      process.exit(1);
    }
  }

  async checkVersion() {
    const pinkGradient = gradient("#ff66cc", "#ff00ff", "#cc00ff");
    
    console.log("");
    console.log(pinkGradient("       "));
    console.log(pinkGradient("█▀█ █▀█ █▄░█ █▀▀ █▀█ █▀"));
    console.log(pinkGradient("█▀▄ █▄█ █░▀█ █▄▄ █▄█ ▄█"));
    console.log(pinkGradient("=".repeat(55)));
    console.log(`${pinkGradient("[ المطور ]: ")} ${gradient("cyan", "pink")("حمودي سان 🇸🇩")}`);
    console.log(`${pinkGradient("[ فيسبوك ]: ")} ${gradient("cyan", "pink")("https://www.facebook.com/babasnfor80")}`);
    console.log(`${pinkGradient("[ رسالة ]: ")} ${gradient("white", "pink")("أحبكم يا سنافري ❤️")}`);
    console.log(pinkGradient("=".repeat(55)));
    console.log("");

    // ✅ التحقق من التحديثات من مستودعك
    try {
      // 🔧 إصلاح: إزالة المسافة الزائدة في الرابط
      const response = await axios.get("https://raw.githubusercontent.com/hamoudisan/snfor-bot/main/package.json", { timeout: 10000 });
      const remotePackage = response.data;
      if (semver.lt(this.package.version, remotePackage.version)) {
        log([
          { message: "[ نظام ]: ", color: "yellow" },
          { message: `يوجد تحديث جديد (v${remotePackage.version})! قم بالترقية.`, color: "white" }
        ]);
      }
    } catch (err) {
      log([
        { message: "[ تنبيه ]: ", color: "yellow" },
        { message: "تعذر التحقق من التحديثات.", color: "white" }
      ]);
    }

    this.startBot();
  }

  async loadComponents() {
    global.client = {
      commands: new Map(),
      events: new Map(),
      cooldowns: new Map(),
      aliases: new Map(),
      handler: {
        reply: new Map(),
        reactions: new Map(),
      },
      config: this.currentConfig,
    };

    try {
      await commandMiddleware();
      console.log(`✔ تم تحميل ${global.client.commands.size} أمر.`);
    } catch (err) {
      console.error(`❌ فشل تحميل الأوامر: ${err.message}`);
    }

    try {
      await eventMiddleware();
      console.log(`✔ تم تحميل ${global.client.events.size} حدث.`);
    } catch (err) {
      console.error(`❌ فشل تحميل الأحداث: ${err.message}`);
    }

    console.log("=".repeat(50));
    console.log(`✔ إجمالي الأوامر: ${global.client.commands.size}`);
    console.log(`✔ إجمالي الأحداث: ${global.client.events.size}`);
    console.log("=".repeat(50));
  }

  startBot() {
    this.loadComponents();

    login({ appState: this.appState }, async (err, api) => {
      if (err) {
        log([
          { message: "[ اتصال ]: ", color: "red" },
          { message: `فشل في تسجيل الدخول: ${err.message}`, color: "white" }
        ]);
        console.error(err); // سجل الخطأ الكامل
        return process.exit(1);
      }

      api.setOptions(this.currentConfig.options);

      // ✅ استماع آمن مع try/catch
      api.listen(async (err, event) => {
        if (err) {
          const errMsg = err?.message || JSON.stringify(err) || "خطأ غير معروف";
          log([{ message: "[ استماع ]: ", color: "red" }, { message: errMsg, color: "white" }]);
          return;
        }

        try {
          const listenPath = path.join(__dirname, "listen", "listen.js");
          if (!fs.existsSync(listenPath)) {
            log([{ message: "[ خطأ ]: ", color: "red" }, { message: "ملف listen.js غير موجود.", color: "white" }]);
            return;
          }

          const { listen } = await import("./listen/listen.js");
          if (typeof listen === "function") {
            await listen({ api, event, client: global.client });
          } else {
            log([{ message: "[ خطأ ]: ", color: "red" }, { message: "الدالة listen ليست دالة صالحة.", color: "white" }]);
          }
        } catch (error) {
          log([
            { message: "[ استيراد ]: ", color: "red" },
            { message: `فشل في تحميل listen.js: ${error.message}`, color: "white" }
          ]);
        }
      });

      // تحديث عنوان النافذة
      setInterval(() => {
        const uptime = process.uptime();
        const [h, m, s] = [Math.floor(uptime / 3600), Math.floor((uptime % 3600) / 60), Math.floor(uptime % 60)]
          .map(v => v.toString().padStart(2, '0'));
        const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        process.title = `snfor - حمودي سان - ${h}:${m}:${s} - ${memory} MB`;
      }, 1000);

      notifer("[ النظام ]", "البوت يعمل بنجاح!");
      log([{ message: "[ النظام ]: ", color: "green" }, { message: "البوت يعمل الآن!", color: "white" }]);
    });
  }
}

// تشغيل البوت
new snfor().checkVersion();
