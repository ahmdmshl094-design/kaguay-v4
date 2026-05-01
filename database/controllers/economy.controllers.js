import usersController from "./users.controllers.js";

export default function ({ api, event }) {
  const formatCurrency = (number) =>
    new Intl.NumberFormat("ar-SA", { style: "decimal", maximumFractionDigits: 2 }).format(number) + " عملة";

  const performTransaction = async ({ action, uid, coins }) => {
    try {
      const data = usersController({ api });
      const user = await data.find(uid);
      const sender = await data.find(event.senderID);
      const actionMessage =
        action === "increase" ? "أضيفت" : action === "decrease" ? "خُصمت" : "حُوِّلت";

      if (!user.status || !sender.status)
        return { status: false, data: "المعلومات غير موجودة في قاعدة البيانات" };

      const isInvalidCoins = !coins || isNaN(coins) || coins <= 0;
      const notEnoughCoins = action === "pay" && sender.data.data.money < coins;
      const negativeTotal =
        (action === "increase" || action === "pay") && user.data.data.money + coins < 0;

      if (isInvalidCoins || notEnoughCoins || negativeTotal)
        return { status: false, data: "العملات غير صالحة أو غير كافية للعملية" };

      const total =
        action === "increase" || action === "pay"
          ? user.data.data.money + coins
          : user.data.data.money - coins;
      const senderMoney = sender.data.data.money;

      await data.update(event.senderID, { money: action === "pay" ? senderMoney - coins : senderMoney });
      await data.update(uid, { money: total });

      return {
        status: true,
        data: `تم بنجاح: ${formatCurrency(coins)} ${actionMessage} للمستخدم: ${user.data.data.name}`,
      };
    } catch (err) {
      console.log(err);
      return { status: false, data: "حدث خطأ في نظام الاقتصاد" };
    }
  };

  const increase = async (coins, uid) => performTransaction({ action: "increase", uid, coins });
  const decrease = async (coins, uid) => performTransaction({ action: "decrease", uid, coins });
  const pay = async (coins, uid) => performTransaction({ action: "pay", uid, coins });

  const getBalance = async (uid) => {
    try {
      const data = usersController({ api });
      const user = await data.find(uid);

      return user.status
        ? { status: true, data: user.data.data.money }
        : { status: false, data: "المستخدم غير موجود في قاعدة البيانات" };
    } catch (err) {
      console.log(err);
      return { status: false, data: "حدث خطأ في نظام الاقتصاد" };
    }
  };

  return { performTransaction, increase, decrease, pay, getBalance };
}
