/**
 * هسته نرم‌افزاری CodePitch AI v2.1
 * پیاده‌سازی ۱۰۰٪ کلاینت‌محور (Zero-Backend)
 */

document.addEventListener('DOMContentLoaded', () => {
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

    const I18N = {
        fa: {
            subtitle: 'موتور معماری سیستم و پروپوزال',
            donateBtn: 'حمایت / Pro',
            settingsBtn: 'تنظیمات',
            printBtn: 'PDF',
            panelTitle: 'تنظیمات محتوا و صدور سند',
            docType: 'نوع ساختار سند',
            projectTitle: 'عنوان موضوع یا پروژه',
            repoUrl: 'لینک مرجع یا ریپازیتوری (اختیاری)',
            rfpText: 'شرح جزئیات، نیازمندی‌ها یا محتوای ارائه',
            provider: 'ارائه‌دهنده',
            modelName: 'شناسه دقیق مدل (آزاد)',
            generateBtn: 'پردازش و ایجاد سند',
            docThemeLabel: 'استایل سند در صفحه نمایش:',
            btnLight: 'روشن',
            btnDark: 'تیره',
            emptyState: 'مشخصات را وارد کرده و دکمه پردازش را بزنید.',
            diagramTitle: 'دیاگرام ساختاری و جریان داده',
            docFooter: 'تاییدیه محتوایی مهندسی سیستم',
            docBadge: 'سند رسمی',
            technicalOption: 'پروپوزال مهندسی و معماری سیستم',
            businessOption: 'طرح کسب‌وکار، ارائه و استارتاپ (Pitch Deck)',
            educationalOption: 'ارائه آموزشی، سرفصل دانشگاهی و اسلاید',
            customOption: 'تحلیل آزاد و مهندسی فرآیند',
            toastSaved: 'تنظیمات ذخیره شد.',
            toastNoKey: 'کلید API تنظیم نشده است.',
            toastEmptyRfp: 'لطفاً شرح مشخصات یا نیازمندی را وارد کنید.',
            toastSuccess: 'سند با موفقیت ایجاد شد.'
        },
        en: {
            subtitle: 'Architecture Engine & Proposal Synthesizer',
            donateBtn: 'Sponsor / Pro',
            settingsBtn: 'Settings',
            printBtn: 'PDF',
            panelTitle: 'Content & Output Configuration',
            docType: 'Document Structure Type',
            projectTitle: 'Project / Topic Title',
            repoUrl: 'Reference Repo URL (Optional)',
            rfpText: 'Detailed Scope & Requirements',
            provider: 'Provider',
            modelName: 'Exact Model Identifier',
            generateBtn: 'Synthesize Document',
            docThemeLabel: 'Screen Document Style:',
            btnLight: 'Light',
            btnDark: 'Dark',
            emptyState: 'Enter scope details and trigger document generation.',
            diagramTitle: 'System & Architecture Flowchart',
            docFooter: 'Formal Engineering Sign-off',
            docBadge: 'Official Document',
            technicalOption: 'Technical Proposal & Architecture',
            businessOption: 'Business Plan & Pitch Deck',
            educationalOption: 'Courseware & Slide Presentation',
            customOption: 'General Process Analysis',
            toastSaved: 'Settings saved successfully.',
            toastNoKey: 'API key is missing.',
            toastEmptyRfp: 'Please enter scope or requirements.',
            toastSuccess: 'Document synthesized successfully.'
        }
    };

    let currentLang = localStorage.getItem('cp_lang') || 'fa';

    mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Vazirmatn, Inter, sans-serif'
    });

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
        document.getElementById('lbl-panel-title').innerHTML = `<svg class="w-4 h-4 sm:w-5 sm:h-5 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> ${t.panelTitle}`;
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
        document.getElementById('lbl-diagram-title').innerHTML = `<span class="w-2 h-2 bg-brand-500 rounded-full inline-block"></span> ${t.diagramTitle}`;
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

    btnToggleUiTheme.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        iconSun.classList.toggle('hidden', !isDark);
        iconMoon.classList.toggle('hidden', isDark);
        localStorage.setItem('cp_ui_theme', isDark ? 'dark' : 'light');
    });

    btnDocThemeLight.addEventListener('click', () => {
        printableArea.className = 'proposal-paper doc-theme-light rounded-2xl p-4 sm:p-8 shadow-2xl relative min-h-[750px] border transition-colors duration-200 w-full overflow-hidden';
    });
    btnDocThemeDark.addEventListener('click', () => {
        printableArea.className = 'proposal-paper doc-theme-dark rounded-2xl p-4 sm:p-8 shadow-2xl relative min-h-[750px] border transition-colors duration-200 w-full overflow-hidden';
    });

    walletSelect.addEventListener('change', () => {
        walletAddressDisplay.textContent = WALLETS[walletSelect.value].address;
    });

    btnCopyAddress.addEventListener('click', () => {
        navigator.clipboard.writeText(walletAddressDisplay.textContent.trim());
        showToast(currentLang === 'fa' ? 'آدرس در کلیپ‌بورد کپی شد.' : 'Address copied to clipboard.');
    });

    btnOpenWallet.addEventListener('click', () => walletModal.classList.remove('hidden'));
    btnCloseWallet.addEventListener('click', () => walletModal.classList.add('hidden'));

    function checkLicenseKey(key) {
        if (!key) return false;
        const clean = key.trim();
        const isTx = /^(0x)?[a-fA-F0-9]{64}$/.test(clean) || /^[1-9A-HJ-NP-za-km-z]{64,88}$/.test(clean);
        const isCode = /^CP-PRO-[A-Z0-9]{8,24}$/i.test(clean);
        return isTx || isCode;
    }

    btnVerifyLicense.addEventListener('click', () => {
        const key = inputLicense.value.trim();
        if (checkLicenseKey(key)) {
            localStorage.setItem('cp_license_key', key);
            document.body.classList.add('is-pro');
            licenseResultMsg.textContent = currentLang === 'fa' ? 'لایسنس تایید شد (واترمارک غیرفعال شد).' : 'Pro License Active (Watermark Disabled).';
            licenseResultMsg.className = 'text-[10px] text-emerald-400 font-bold';
            showToast(currentLang === 'fa' ? 'لایسنس اعمال گردید.' : 'License validated.');
        } else {
            showToast(currentLang === 'fa' ? 'فرمت شناسه نامعتبر است.' : 'Invalid hash/key format.');
        }
    });

    btnOpenSettings.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));
    btnSaveSettings.addEventListener('click', () => {
        localStorage.setItem('cp_gemini_key', inputGeminiKey.value.trim());
        localStorage.setItem('cp_groq_key', inputGroqKey.value.trim());
        settingsModal.classList.add('hidden');
        showToast(I18N[currentLang].toastSaved);
    });

    document.getElementById('btn-print').addEventListener('click', () => window.print());

    function getFallbackDiagram() {
        return `flowchart LR
    A["ورودی سیستم"] --> B["هسته پردازش"]
    B --> C["پایگاه داده"]
    B --> D["خروجی نهایی"]`;
    }

    async function renderMermaidSafely(code) {
        mermaidContainer.innerHTML = '';
        let target = code ? code.replace(/```mermaid/gi, '').replace(/```/gi, '').trim() : '';
        if (!target) target = getFallbackDiagram();

        const renderId = 'mermaid-' + Date.now();
        try {
            const { svg } = await mermaid.render(renderId, target);
            mermaidContainer.innerHTML = svg;
            const svgEl = mermaidContainer.querySelector('svg');
            if (svgEl) {
                svgEl.style.maxHeight = '270px';
                svgEl.style.width = '100%';
            }
        } catch (err) {
            console.error('Mermaid render error. Fallback loaded.', err);
            const errEl = document.getElementById('d' + renderId);
            if (errEl) errEl.remove();
            try {
                const { svg: fallbackSvg } = await mermaid.render('fallback-' + Date.now(), getFallbackDiagram());
                mermaidContainer.innerHTML = fallbackSvg;
            } catch (e) {
                mermaidContainer.innerHTML = '<div class="text-xs text-rose-500 py-3">خطا در رندر دیاگرام.</div>';
            }
        }
    }

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
            throw new Error(err.error?.message || `Google API status ${res.status}`);
        }
        const data = await res.json();
        return JSON.parse(data.candidates[0].content.parts[0].text);
    }

    async function callGroq(apiKey, model, prompt) {
        const url = 'https://api.groq.com/openai/v1/chat/completions';
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: 'You are an elite software architect and strategist. Return ONLY a single raw valid JSON object.' },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.2
            })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error?.message || `Groq API status ${res.status}`);
        }
        const data = await res.json();
        return JSON.parse(data.choices[0].message.content);
    }

    btnGenerate.addEventListener('click', async () => {
        const title = inputProjectTitle.value.trim() || 'Untitled Scope';
        const repo = inputRepoUrl.value.trim();
        const rfp = inputRfpText.value.trim();
        const docType = selectDocType.value;
        const provider = selectProvider.value;
        const model = inputModelName.value.trim() || 'gemini-3.1-flash-lite';

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
        generateBtnText.textContent = currentLang === 'fa' ? `پردازش با ${model}...` : `Synthesizing with ${model}...`;

        const promptText = `
You are an expert system architect and documentation lead.
Language Directive: Write the entire response strictly in the language of the input (Persian for Persian, English for English).

Parameters:
- Target Structure: ${docType}
- Title: ${title}
- Reference: ${repo || 'None'}
- Scope:
${rfp}

Return ONLY a pure JSON object containing exactly two keys:
{
  "proposal_markdown": "Complete formal document text in markdown",
  "mermaid_code": "Valid Mermaid diagram syntax"
}

Diagram Guidelines (CRITICAL FOR A4 PRINTING):
- Use 'flowchart LR' (Horizontal Left-to-Right) or a compact 2-level branched 'flowchart TD'.
- NEVER create a long single-column vertical chain of more than 3 steps without branching.
- Keep maximum 4 to 6 total nodes so the diagram fits in a single view without exceeding 280px in height.
- Use English alphanumeric node IDs (A, B, C) and quote-wrapped descriptive node labels like A["عنوان"].
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

    inputGeminiKey.value = localStorage.getItem('cp_gemini_key') || '';
    inputGroqKey.value = localStorage.getItem('cp_groq_key') || '';
    const savedLicense = localStorage.getItem('cp_license_key') || '';
    inputLicense.value = savedLicense;
    if (checkLicenseKey(savedLicense)) {
        document.body.classList.add('is-pro');
        licenseResultMsg.textContent = 'Pro License Active';
        licenseResultMsg.className = 'text-[10px] text-emerald-400 font-bold';
    }

    applyLanguage(currentLang);
});
