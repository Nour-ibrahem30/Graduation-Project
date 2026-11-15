(() => {
  const style = document.createElement('style');
  style.textContent = `
    .ghorza-chat-launcher{position:fixed;z-index:60;right:24px;bottom:22px;border:0;border-radius:999px;background:#98440b;color:#fff;padding:12px 17px;display:flex;align-items:center;gap:9px;font:inherit;font-size:13px;font-weight:600;box-shadow:0 8px 26px #26180d30;cursor:pointer}
    .ghorza-chat-launcher:hover{background:#7b3507}
    .ghorza-chat-panel{position:fixed;z-index:61;right:24px;bottom:82px;width:min(360px,calc(100vw - 28px));height:min(490px,calc(100dvh - 110px));background:#fbf9f5;border:1px solid #e5e0d7;border-radius:16px;box-shadow:0 18px 50px #21190e30;display:none;overflow:hidden;font-family:inherit}
    .ghorza-chat-panel.is-open{display:flex;flex-direction:column}
    .ghorza-chat-head{display:flex;align-items:center;justify-content:space-between;padding:15px 17px;background:#fff;border-bottom:1px solid #e8e4dc}
    .ghorza-chat-title{font-size:14px;font-weight:700;color:#272923}.ghorza-chat-status{display:block;color:#77786e;font-size:10px;margin-top:2px}
    .ghorza-chat-close{border:0;background:transparent;font-size:23px;cursor:pointer;color:#555}
    .ghorza-chat-messages{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
    .ghorza-chat-message{max-width:88%;padding:10px 12px;border-radius:12px;font-size:12px;line-height:1.75;white-space:pre-wrap;overflow-wrap:anywhere}
    .ghorza-chat-message.bot{background:#fff;border:1px solid #ece8df;align-self:flex-start;color:#34352f}
    .ghorza-chat-message.user{background:#98440b;color:white;align-self:flex-end}
    .ghorza-chat-form{display:flex;gap:8px;padding:12px;border-top:1px solid #e8e4dc;background:#fff}
    .ghorza-chat-input{flex:1;min-width:0;border:1px solid #ddd8ce;border-radius:9px;padding:9px 11px;font:inherit;font-size:12px;outline-color:#98440b}
    .ghorza-chat-send{width:40px;border:0;border-radius:9px;background:#20211e;color:white;font-size:17px;cursor:pointer}
    .ghorza-chat-send:disabled{opacity:.55;cursor:wait}
    @media(max-width:520px){.ghorza-chat-launcher{right:14px;bottom:14px}.ghorza-chat-panel{right:14px;bottom:72px}}
  `;
  document.head.appendChild(style);

  const launcher = document.createElement('button');
  launcher.className = 'ghorza-chat-launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'ghorzaChatPanel');
  launcher.textContent = 'اسأل غُرزة  ✳';

  const panel = document.createElement('section');
  panel.className = 'ghorza-chat-panel';
  panel.id = 'ghorzaChatPanel';
  panel.setAttribute('aria-label', 'مساعد التسوق');
  panel.innerHTML = `
    <div class="ghorza-chat-head"><div><span class="ghorza-chat-title">مساعد غُرزة</span><span class="ghorza-chat-status">اسأل عن المنتجات أو الطلب</span></div><button type="button" class="ghorza-chat-close" aria-label="إغلاق المحادثة">×</button></div>
    <div class="ghorza-chat-messages" aria-live="polite"><div class="ghorza-chat-message bot">أهلًا بيك! أقدر أساعدك تعرف تفاصيل المنتجات وأسعارها.</div></div>
    <form class="ghorza-chat-form"><input class="ghorza-chat-input" type="text" maxlength="1200" autocomplete="off" placeholder="اكتب سؤالك..." aria-label="اكتب سؤالك" required /><button class="ghorza-chat-send" type="submit" aria-label="إرسال">←</button></form>
  `;
  document.body.append(launcher, panel);

  const messagesElement = panel.querySelector('.ghorza-chat-messages');
  const form = panel.querySelector('.ghorza-chat-form');
  const input = panel.querySelector('.ghorza-chat-input');
  const sendButton = panel.querySelector('.ghorza-chat-send');
  const history = [];

  function addMessage(role, text) {
    const message = document.createElement('div');
    message.className = `ghorza-chat-message ${role === 'assistant' ? 'bot' : 'user'}`;
    message.textContent = text;
    messagesElement.appendChild(message);
    messagesElement.scrollTop = messagesElement.scrollHeight;
    return message;
  }

  launcher.addEventListener('click', () => {
    const open = panel.classList.toggle('is-open');
    launcher.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  });
  panel.querySelector('.ghorza-chat-close').addEventListener('click', () => {
    panel.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) {
      panel.classList.remove('is-open');
      launcher.setAttribute('aria-expanded', 'false');
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text || sendButton.disabled) return;
    history.push({ role: 'user', content: text });
    addMessage('user', text);
    input.value = '';
    sendButton.disabled = true;
    const pending = addMessage('assistant', 'ثواني وبرد عليك...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-20) })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'حصلت مشكلة. جرّب تاني.');
      pending.textContent = result.reply;
      history.push({ role: 'assistant', content: result.reply });
      if (history.length > 20) history.splice(0, history.length - 20);
    } catch (error) {
      pending.textContent = error.message || 'مش قادر أرد دلوقتي. جرّب كمان شوية.';
      history.pop();
    } finally {
      sendButton.disabled = false;
      input.focus();
      messagesElement.scrollTop = messagesElement.scrollHeight;
    }
  });
})();
