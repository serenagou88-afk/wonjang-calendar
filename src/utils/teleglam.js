const BOT_TOKEN = '8912324839:AAEV3h1mhg0J9WB9zxgGTDGwSdwCnw1geWw';
const CHAT_ID = '8933511006';

export const sendTelegramAlert = async (message) => {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `🚨 선생님의 비서 오류\n\n${message}\n\n⏰ ${new Date().toLocaleString('ko-KR')}`,
      })
    });
  } catch (e) {
    console.error('텔레그램 알림 실패:', e);
  }
};
