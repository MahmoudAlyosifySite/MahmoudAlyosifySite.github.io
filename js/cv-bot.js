/* CV page — mounts the Mahmoud AI assistant. The page sits one folder
   below the site root (see the <base> in cv/index.html), so the assistant
   is told where the site's images and profile data are. Loaded after
   js/chatbot.js; both addresses are read only when the panel is built. */
window.MAHMOUD_AI_ASSET_BASE = '../';
window.MAHMOUD_AI_DATA_URL = '../data/mahmoud-profile.json';

window.MahmoudAI.mount({ lang: 'en', t: (key) => window.I18N.en[key] || key });
document.getElementById('bot-fab').addEventListener('click', () => window.MahmoudAI.toggle());
