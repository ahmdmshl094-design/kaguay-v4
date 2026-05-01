import express from "express";
import config from "./KaguyaSetUp/config.js";
import { log } from "./logger/index.js";
import { spawn } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

const PORT = process.env.PORT || config.port || 3000;

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "./utils/index.html"));
});

app.listen(PORT, () => {
  log([
    { message: "[ الخادم ]: ", color: "green" },
    { message: `يعمل على المنفذ: ${PORT}`, color: "white" },
  ]);
});

function startBotProcess(script) {
  const child = spawn(
    "node",
    ["--trace-warnings", "--async-stack-traces", script],
    {
      cwd: __dirname,
      stdio: "inherit",
      shell: true,
    }
  );

  child.on("close", (codeExit) => {
    log([
      { message: "[ البوت ]: ", color: "yellow" },
      { message: `توقف البوت برمز الخروج: ${codeExit} — جاري إعادة التشغيل خلال 3 ثوانٍ...`, color: "white" },
    ]);
    if (codeExit !== 0) {
      setTimeout(() => startBotProcess(script), 3000);
    }
  });

  child.on("error", (error) => {
    log([
      { message: "[ خطأ ]: ", color: "red" },
      { message: `حدث خطأ عند تشغيل ${script}: ${error}`, color: "white" },
    ]);
  });
}

startBotProcess("index.js");
