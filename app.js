/**
 * هسته منطقی CodePitch AI v2.0
 * پشتیبانی از چندزبانه، تم‌های مستقل و ولت‌های کریپتو
 */

document.addEventListener('DOMContentLoaded', () => {
    // آدرس‌های واقعی ولت‌ها
    const WALLETS = {
        evm: { label: 'EVM (ETH, BNB, Polygon, Arbitrum, Base, OP)', address: '0x5574432Aa702a60eCF73F20123C775d5bC980C31' },
        sol: { label: 'Solana (SOL, SPL)', address: '84ftXW1r7HbHcr2nUQKNfNCcSFjEqDFqVAK1DiS8rTA1' },
        trx: { label: 'Tron (TRX, TRC20)', address: 'TKtUabiYPR7D4C2bAi9wruHtHQNFtq7cEC' },
        ada: { label: 'Cardano (ADA)', address: 'addr1qxruqaqgda2gudm4tua07sjn3zeua6fe3ydx7xgg5dw90ertyq76mnxgtgvjdkuuza6ckw2x0y93rygaf42l9vg6sx9s5a2q2l' },
        doge: { label: 'Dogecoin (DOGE)', address: 'D9vqtbVuoqpgKWM1hEqKgVjaQVFXEKJuZu' },
        ltc: { label: 'Litecoin (LTC)', address: 'ltc1q6fm3h7c78p9guz796wyrazhffuehuakk06ntvc' },
        xrp: { label: 'Ripple (XRP)', address: 'rEbXmM3WJeSP59ZssEgu5tzASLYqBgBRx2' },
        algo: { label: 'Algorand (ALGO)', address: 'VLAGNF3OMOSYG2Y2Y52NSEIWZPA6BBTKI3WQMOMSU3WG2QDHP4GMV2R5QE' },
        atom: { label: 'Cosmos (ATOM)', address: 'cosmos10caa6aufk3t9y9g2jfwjcaxl3j4p9x7jgndzll' }
    };

    // فرهنگ لغات دو زبانه
    const I18N = {
        fa: {
            subtitle: 'سامانه جامع تولید پرزنتیشن، پروپوزال و دیاگرام',
            donateBtn: 'حمایت / نسخه Pro',
            settingsBtn: 'تنظیمات API',
            printBtn: 'خروجی PDF',
            panelTitle: 'تنظیمات محتوا و صدور سند',
            docType: 'نوع ساختار سند',
            projectTitle: 'عنوان موضوع یا پروژه',
            repoUrl: 'لینک مرجع یا ریپازیتوری (اختیاری)',
            rfpText: 'شرح جزئیات، نیازمندی‌ها یا محتوای ارائه',
            provider: 'ارائه‌دهنده',
            modelName: 'شناسه دقیق مدل (آزاد)',
            generateBtn: 'پردازش و ایجاد سند',
            docThemeLabel: 'استایل بصری سند خروجی:',
            btnLight: 'روشن (کاغذ سفید)',
            btnDark: 'تیره (دارک آفیس)',
            emptyState: 'مشخصات را در فرم سمت راست وارد کنید و دکمه پردازش را بزنید.',
            diagramTitle: 'دیاگرام ساختاری و جریان داده',
            docFooter: 'تاییدیه محتوایی و اعتبارسنجی فرآیند',
            docBadge: 'سند رسمی',
            technicalOption: 'پروپوزال مهندسی و معماری سیستم',
            businessOption: 'طرح کسب‌وکار، ارائه و استارتاپ (Pitch Deck)',
            educationalOption: 'ارائه آموزشی، سرفصل دانشگاهی و اسلاید',
            customOption: 'تحلیل آزاد و مهندسی فرآیند',
            toastSaved: 'تنظیمات با موفقیت ذخیره شد.',
            toastNoKey: 'کلید API یافت نشد. لطفاً در تنظیمات وارد کنید.',
            toastEmptyRfp: 'لطفاً شرح نیازمندی یا موضوع ارائه را وارد کنید.',
            toastSuccess: 'سند با موفقیت ایجاد شد.'
        },
        en: {
            subtitle: 'Universal Proposal, Pitch Deck & Architecture Engine',
            donateBtn: 'Sponsor / Pro',
            settingsBtn: 'API Settings',
            printBtn: 'Export PDF',
            panelTitle: 'Content & Output Configuration',
            docType: 'Document Structure Type',
            projectTitle: 'Project or Topic Title',
            repoUrl: 'Reference Link / Repo URL (Optional)',
            rfpText: 'Detailed Requirements / Presentation Scope',
            provider: 'AI Provider',
            modelName: 'Model Identifier (Freeform)',
            generateBtn: 'Generate Document',
            docThemeLabel: 'Document Output Style:',
            btnLight: 'Light (White Paper)',
            btnDark: 'Dark (Dark Office)',
            emptyState: 'Fill the input fields and click Generate Document.',
            diagramTitle: 'System & Architecture Flowchart',
            docFooter: 'Formal Verification & Content Approval',
            docBadge: 'Official Document',
            technicalOption: 'Technical Proposal & System Architecture',
            businessOption: 'Business Plan & Pitch Deck',
            educationalOption: 'Academic Courseware & Presentation',
            customOption: 'General Process Flow & Analysis',
            toastSaved: 'Settings saved successfully.',
            toastNoKey: 'API Key is missing. Please set it in settings.',
            toastEmptyRfp: 'Please enter project requirements or description.',
            toastSuccess: 'Document generated successfully.'
        }
    };

    let currentLang = localStorage.getItem('cp_lang') || 'fa';

    // مقداردهی اولیه Mermaid
    mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Vazirmatn, Inter, sans-serif'
    });

    // ارجاع به المان‌ها
    const btnToggleLang = document.getElementById('btn-toggle-lang');
    const btnToggleUiTheme = document.getElementById('btn-toggle-ui-theme');
    const iconSun = document.getElementById('icon-theme-sun');
    const iconMoon = document.getElementById('icon-theme-moon');

    const btnOpenWallet = document.getElementById('btn-open-wallet');
    const btnCloseWallet = document.getElementById('btn-close-wallet');
    const walletModal = document.getElementById('wallet-modal');
    const walletSelect = document.getElementById('wallet-select');
    const walletAddressDisplay = document.getElementById('wallet-address-display');
    const btnCopyAddress = document.getElementById('btn-copy-address');
    const inputLicense = document.getElementById('input-license');
    const btnVerifyLicense = document.getElementById('btn-verify-license');
    const licenseResultMsg = document.getElementById('license-result-msg');

    const btnOpenSettings = document.getElementById('btn-open-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnSaveSettings = document.getElementById('btn-save-settings');
    const settingsModal = document.getElementById('settings-modal');
    const inputGeminiKey = document.getElementById('gemini-key');
    const inputGroqKey = document.getElementById('groq-key');

    const selectDocType = document.getElementById('doc-type');
    const inputProjectTitle = document.getElementById('project-title');
    const inputRepoUrl = document.getElementById('repo-url');
    const inputRfpText = document.getElementById('rfp-text');
    const selectProvider = document.getElementById('provider-select');
    const inputModelName = document.getElementById('model-name-input');
    const btnGenerate = document.getElementById('btn-generate');
    const generateSpinner = document.getElementById('generate-spinner');
    const generateBtnText = document.getElementById('generate-btn-text');

    const btnDocThemeLight = document.getElementById('btn-doc-theme-light');
    const btnDocThemeDark = document.getElementById('btn-doc-theme-dark');
    const printableArea = document.getElementById('printable-area');

    const viewDocTypeBadge = document.getElementById('view-doc-type-badge');
    const viewDocTitle = document.getElementById('view-doc-title');
    const viewDocDate = document.getElementById('view-doc-date');
    const proposalContent = document.getElementById('proposal-content');
    const mermaidContainer = document.getElementById('mermaid-container');

    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    function showToast(msg) {
        toastMessage.textContent = msg;
        toast.classList.remove('translate-y-24', 'opacity-0');
        setTimeout(() => toast.classList.add('translate-y-24', 'opacity-0'), 3500);
    }

    // تغییر زبان رابط کاربری
    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('cp_lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
        btnToggleLang.textContent = lang === 'fa' ? 'EN' : 'FA';

        const t = I18N[lang];
        document.getElementById('nav-subtitle').textContent = t.subtitle;
        document.getElementById('txt-donate-btn').textContent = t.donateBtn;
        document.getElementById('txt-settings-btn').textContent = t.settingsBtn;
        document.getElementById('txt-print-btn').textContent = t.printBtn;
        document.getElementById('lbl-panel-title').innerHTML = t.panelTitle;
        document.getElementById('lbl-doc-type').textContent = t.docType;
        document.getElementById('lbl-project-title').textContent = t.projectTitle;
        document.getElementById('lbl-repo-url').textContent = t.repoUrl;
        document.getElementById('lbl-rfp-text').textContent = t.rfpText;
        document.getElementById('lbl-provider').textContent = t.provider;
        document.getElementById('lbl-model-name').textContent = t.modelName;
        document.getElementById('generate-btn-text').textContent = t.generateBtn;
        document.getElementById('lbl-doc-theme').textContent = t.docThemeLabel;
        document.getElementById('btn-doc-theme-light').textContent = t.btnLight;
        document.getElementById('btn-doc-theme-dark').textContent = t.btnDark;
        document.getElementById('lbl-empty-state').textContent = t.emptyState;
        document.getElementById('lbl-diagram-title').innerHTML = `<span class="w-2.5 h-2.5 bg-brand-500 rounded-full inline-block"></span> ${t.diagramTitle}`;
        document.getElementById('lbl-doc-footer').textContent = t.docFooter;
        viewDocTypeBadge.textContent = t.docBadge;

        selectDocType.options[0].text = t.technicalOption;
        selectDocType.options[1].text = t.businessOption;
        selectDocType.options[2].text = t.educationalOption;
        selectDocType.options[3].text = t.customOption;
    }

    btnToggleLang.addEventListener('click', () => {
        applyLanguage(currentLang === 'fa' ? 'en' : 'fa');
    });

    // تغییر تم UI
    btnToggleUiTheme.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        iconSun.classList.toggle('hidden', !isDark);
        iconMoon.classList.toggle('hidden', isDark);
        localStorage.setItem('cp_ui_theme', isDark ? 'dark' : 'light');
    });

    // تغییر تم سند خروجی (کاغذ روشن / کاغذ تیره)
    btnDocThemeLight.addEventListener('click', () => {
        printableArea.className = 'proposal-paper doc-theme-light rounded-2xl p-8 shadow-2xl relative min-h-[900px] border transition-colors duration-200';
    });
    btnDocThemeDark.addEventListener('click', () => {
        printableArea.className = 'proposal-paper doc-theme-dark rounded-2xl p-8 shadow-2xl relative min-h-[900px] border transition-colors duration-200';
    });

    // مدیریت ولت‌ها
    walletSelect.addEventListener('change', () => {
        const item = WALLETS[walletSelect.value];
        walletAddressDisplay.textContent = item.address;
    });

    btnCopyAddress.addEventListener('click', () => {
        navigator.clipboard.writeText(walletAddressDisplay.textContent.trim());
        showToast(currentLang === 'fa' ? 'آدرس کپی شد.' : 'Address copied.');
    });

    btnOpenWallet.addEventListener('click', () => walletModal.classList.remove('hidden'));
    btnCloseWallet.addEventListener('click', () => walletModal.classList.add('hidden'));

    // اعتبارسنجی لایسنس یا هش تراکنش
    function checkLicenseKey(key) {
        if (!key) return false;
        const clean = key.trim();
        // پذیرش هش معتبر ۶۴ کاراکتری هگز (EVM / Tron / Solana / Doge / etc.)
        const isTx = /^(0x)?[a-fA-F0-9]{64}$/.test(clean) || /^[1-9A-HJ-NP-za-km-z]{64,88}$/.test(clean);
        // پذیرش کد لایسنس مستقیم
        const isCode = /^CP-PRO-[A-Z0-9]{8,24}$/i.test(clean);
        return isTx || isCode;
    }

    btnVerifyLicense.addEventListener('click', () => {
        const key = inputLicense.value.trim();
        if (checkLicenseKey(key)) {
            localStorage.setItem('cp_license_key', key);
            document.body.classList.add('is-pro');
            licenseResultMsg.textContent = currentLang === 'fa' ? 'لایسنس فعال شد (واترمارک حذف شد).' : 'Pro License Active (Watermark Removed).';
            licenseResultMsg.className = 'text-[11px] text-emerald-400 font-bold';
            showToast(currentLang === 'fa' ? 'لایسنس Pro با موفقیت اعمال گردید.' : 'Pro license applied.');
        } else {
            showToast(currentLang === 'fa' ? 'هش یا کلید نامعتبر است.' : 'Invalid hash or key.');
        }
    });

    // باز و بسته کردن تنظیمات API
    btnOpenSettings.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));
    btnSaveSettings.addEventListener('click', () => {
        localStorage.setItem('cp_gemini_key', inputGeminiKey.value.trim());
        localStorage.setItem('cp_groq_key', inputGroqKey.value.trim());
        settingsModal.classList.add('hidden');
        showToast(I18N[currentLang].toastSaved);
    });

    // پرینت
    document.getElementById('btn-print').addEventListener('click', () => window.print());

    // رندر ایمن دیاگرام Mermaid
    function getFallbackDiagram() {
        return `flowchart TD
    NodeA["ورودی سیستم"] --> NodeB["پردازش و منطق"]
    NodeB --> NodeC["پایگاه داده"]
    NodeB --> NodeD["خروجی نهایی"]`;
    }

    async function renderMermaidSafely(code) {
        mermaidContainer.innerHTML = '';
        let target = code ? code.replace(/```mermaid/gi, '').replace(/```/gi, '').trim() : '';
        if (!target) target = getFallbackDiagram();

        const renderId = 'mermaid-' + Date.now();
        try {
            const { svg } = await mermaid.render(renderId, target);
            mermaidContainer.innerHTML = svg;
        } catch (err) {
            console.error('Mermaid render failure:', err);
            const errEl = document.getElementById('d' + renderId);
            if (errEl) errEl.remove();
            try {
                const { svg: fallbackSvg } = await mermaid.render('fallback-' + Date.now(), getFallbackDiagram());
                mermaidContainer.innerHTML = fallbackSvg;
            } catch (e) {
                mermaidContainer.innerHTML = '<div class="text-xs text-rose-500 py-3">Diagram render error.</div>';
            }
        }
    }

    // فراخوانی Gemini API
    async function callGemini(apiKey, model, prompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
            })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error?.message || `Google API Error (${res.status})`);
        }
        const data = await res.json();
        return JSON.parse(data.candidates[0].content.parts[0].text);
    }

    // فراخوانی Groq API
    async function callGroq(apiKey, model, prompt) {
        const url = 'https://api.groq.com/openai/v1/chat/completions';
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: 'You are an elite system architect and business consultant. Return ONLY a single raw valid JSON object.' },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.2
            })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error?.message || `Groq API Error (${res.status})`);
        }
        const data = await res.json();
        return JSON.parse(data.choices[0].message.content);
    }

    // پردازش فرم
    btnGenerate.addEventListener('click', async () => {
        const title = inputProjectTitle.value.trim() || 'Untitled Project';
        const repo = inputRepoUrl.value.trim();
        const rfp = inputRfpText.value.trim();
        const docType = selectDocType.value;
        const provider = selectProvider.value;
        const model = inputModelName.value.trim() || 'gemini-3.8-flash';

        if (!rfp) {
            showToast(I18N[currentLang].toastEmptyRfp);
            inputRfpText.focus();
            return;
        }

        const geminiKey = localStorage.getItem('cp_gemini_key') || '';
        const groqKey = localStorage.getItem('cp_groq_key') || '';

        if (provider === 'gemini' && !geminiKey) {
            showToast(I18N[currentLang].toastNoKey);
            settingsModal.classList.remove('hidden');
            return;
        }
        if (provider === 'groq' && !groqKey) {
            showToast(I18N[currentLang].toastNoKey);
            settingsModal.classList.remove('hidden');
            return;
        }

        btnGenerate.disabled = true;
        generateSpinner.classList.remove('hidden');
        generateBtnText.textContent = currentLang === 'fa' ? `در حال پردازش با ${model}...` : `Processing with ${model}...`;

        const promptText = `
You are a senior enterprise architect and business consultant.
Language requirement: Generate the text STRICTLY in the language of this prompt (if RFP is Persian write in Persian, if English write in English).

Document Type: ${docType}
Project Title: ${title}
Reference: ${repo || 'N/A'}
Details/Scope:
${rfp}

Return a single JSON object with EXACTLY two keys:
{
  "proposal_markdown": "Full structured document text in markdown",
  "mermaid_code": "Clean valid Mermaid diagram code (flowchart TD or mindmap)"
}

Requirements for proposal_markdown:
- Comprehensive breakdown tailored to document type (${docType}).
- Include Executive Summary, Architecture/Core Strategy, Implementation Phases, Risk Matrix.
- Include a Markdown Table with estimated timelines and an empty column for pricing/cost estimation.

Requirements for mermaid_code:
- Valid flowchart TD or mindmap.
- English alphanumeric node IDs (A, B, C).
- Text labels wrapped strictly in quotes: A["Label Here"].
- Do NOT use parenthesis or syntax-breaking characters inside label texts.
`;

        try {
            let result;
            if (provider === 'gemini') {
                result = await callGemini(geminiKey, model, promptText);
            } else {
                result = await callGroq(groqKey, model, promptText);
            }

            viewDocTitle.textContent = title;
            const now = new Date();
            viewDocDate.textContent = currentLang === 'fa' 
                ? new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(now)
                : now.toLocaleDateString();

            proposalContent.innerHTML = marked.parse(result.proposal_markdown || '');
            await renderMermaidSafely(result.mermaid_code || '');

            showToast(I18N[currentLang].toastSuccess);
        } catch (err) {
            console.error(err);
            showToast('Error: ' + err.message);
        } finally {
            btnGenerate.disabled = false;
            generateSpinner.classList.add('hidden');
            generateBtnText.textContent = I18N[currentLang].generateBtn;
        }
    });

    // بارگذاری تنظیمات اولیه
    inputGeminiKey.value = localStorage.getItem('cp_gemini_key') || '';
    inputGroqKey.value = localStorage.getItem('cp_groq_key') || '';
    const savedLicense = localStorage.getItem('cp_license_key') || '';
    inputLicense.value = savedLicense;
    if (checkLicenseKey(savedLicense)) {
        document.body.classList.add('is-pro');
        licenseResultMsg.textContent = 'Pro License Active';
        licenseResultMsg.className = 'text-[11px] text-emerald-400 font-bold';
    }

    applyLanguage(currentLang);
});
