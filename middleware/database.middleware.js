import mongoose from "mongoose";
import config from "../KaguyaSetUp/config.js";
import { log } from "../logger/index.js";
import fs from "fs";

(async () => {
  switch (config.database.type) {
    case "mongodb":
      {
        try {
          await mongoose.connect(config.database.mongodb.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          log([
            { message: "[ قاعدة البيانات ]: ", color: "green" },
            { message: "تم الاتصال بقاعدة البيانات بنجاح", color: "white" },
          ]);
        } catch (error) {
          console.log(error);
          log([
            { message: "[ قاعدة البيانات ]: ", color: "red" },
            { message: "تعذر الاتصال بقاعدة البيانات", color: "white" },
          ]);
          process.exit(0);
        }
      }
      break;
    case "json":
      {
        const createIfNotExists = (path) => {
          if (!fs.existsSync(path)) fs.writeFileSync(path, "[]");
        };

        createIfNotExists("./database/users.json");
        createIfNotExists("./database/threads.json");

        log([
          { message: "[ قاعدة البيانات ]: ", color: "green" },
          { message: "تم الاتصال بقاعدة البيانات JSON بنجاح", color: "white" },
        ]);
      }
      break;
  }
})();
