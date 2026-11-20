/**
 * موتور منطقی CodePitch AI
 * معماری: کلاینت‌محور (Zero-Backend)
 * سازگار با مدل‌های ۲۰۲۶ گوگل استودیو
 */

document.addEventListener('DOMContentLoaded', () => {
    // مقداردهی اولیه کتابخانه Mermaid
    mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Vazirmatn'
    });

    // المان‌های رابط کاربری
    const btnOpenSettings = document.getElementById('btn-open-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnSaveSettings = document.getElementById('btn-save-settings');
    const settingsModal = document.getElementById('settings-modal');
    
    const inputGeminiKey = document.getElementById('gemini-key');
    const inputGroqKey = document.getElementById('groq-key');
    const inputLicenseKey = document.getElementById('license-key');
    const licenseStatus = document.getElementById('license-status');

    const inputProjectTitle = document.getElementById('project-title');
    const inputRepoUrl = document.getElementById('repo-url');
    const inputRfpText = document.getElementById('rfp-text');
    const selectProvider = document.getElementById('provider-select');
    const selectModel = document.getElementById('model-select');
    const boxCustomModel = document.getElementById('custom-model-box');
    const inputCustomModel = document.getElementById('custom-model-input');

    const btnGenerate = document.getElementById('btn-generate');
    const generateSpinner = document.getElementById('generate-spinner');
    const generateBtnText = document.getElementById('generate-btn-text');
    const btnPrint = document.getElementById('btn-print');

    const viewDocTitle = document.getElementById('view-doc-title');
    const viewDocDate = document.getElementById('view-doc-date');
    const proposalContent = document.getElementById('proposal-content');
    const mermaidContainer = document.getElementById('mermaid-container');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // نمایش یا پنهان‌سازی فیلد مدل سفارشی
    selectModel.addEventListener('change', () => {
        if (selectModel.value === 'custom') {
            boxCustomModel.classList.remove('hidden');
            inputCustomModel.focus();
        } else {
            boxCustomModel.classList.add('hidden');
        }
    });

    // همگام‌سازی لیست مدل‌ها بر اساس موتور انتخابی
    selectProvider.addEventListener('change', () => {
        selectModel.innerHTML = '';
        boxCustomModel.classList.add('hidden');

        if (selectProvider.value === 'gemini') {
            const models = [
                { id: 'gemini-3.8-flash', title: 'Gemini 3.8 Flash (پیشنهادی)' },
                { id: 'gemini-4-hydrogen', title: 'Gemini 4 Hydrogen (کدنویسی)' },
                { id: 'gemini-3.1-flash-lite', title: 'Gemini 3.1 Flash Lite (سریع)' },
                { id: 'gemini-4-neon', title: 'Gemini 4 Neon (پرچمدار)' },
                { id: 'gemini-4-argon', title: 'Gemini 4 Argon' },
                { id: 'gemini-2.5-flash', title: 'Gemini 2.5 Flash' },
                { id: 'custom', title: 'ورود مدل سفارشی...' }
            ];
            models.forEach(m => selectModel.add(new Option(m.title, m.id)));
        } else {
            const groqModels = [
                { id: 'llama-3.3-70b-versatile', title: 'Llama 3.3 70B Versatile' },
                { id: 'mixtral-8x7b-32768', title: 'Mixtral 8x7B' },
                { id: 'custom', title: 'ورود مدل سفارشی...' }
            ];
            groqModels.forEach(m => selectModel.add(new Option(m.title, m.id)));
        }
    });

    // بارگذاری تنظیمات از حافظه مرورگر
    function loadSettings() {
        const geminiKey = localStorage.getItem('cp_gemini_key') || '';
        const groqKey = localStorage.getItem('cp_groq_key') || '';
        const licenseKey = localStorage.getItem('cp_license_key') || '';

        inputGeminiKey.value = geminiKey;
        inputGroqKey.value = groqKey;
        inputLicenseKey.value = licenseKey;

        verifyAndApplyLicense(licenseKey);
    }

    // ذخیره تنظیمات در حافظه مرورگر
    function saveSettings() {
        localStorage.setItem('cp_gemini_key', inputGeminiKey.value.trim());
        localStorage.setItem('cp_groq_key', inputGroqKey.value.trim());
        localStorage.setItem('cp_license_key', inputLicenseKey.value.trim());

        verifyAndApplyLicense(inputLicenseKey.value.trim());
        settingsModal.classList.add('hidden');
        showToast('تنظیمات با موفقیت ذخیره شد.');
    }

    // اعتبارسنجی لایسنس کاربری
    function verifyAndApplyLicense(key) {
        if (!key) {
            document.body.classList.remove('is-pro');
            licenseStatus.textContent = 'نسخه: رایگان (دارای واترمارک)';
            licenseStatus.className = 'text-[11px] text-slate-400 mt-1';
            return;
        }

        const isTxHash = /^(0x)?[a-fA-F0-9]{64}$/.test(key);
        const isProLicense = /^CP-PRO-[A-Z0-9]{8,16}$/.test(key);

        if (isTxHash || isProLicense) {
            document.body.classList.add('is-pro');
            licenseStatus.textContent = 'وضعیت: لایسنس معتبر Pro (واترمارک غیرفعال شد)';
            licenseStatus.className = 'text-[11px] text-emerald-400 font-semibold mt-1';
        } else {
            document.body.classList.remove('is-pro');
            licenseStatus.textContent = 'هش/کلید نامعتبر است (واترمارک فعال است)';
            licenseStatus.className = 'text-[11px] text-rose-400 mt-1';
        }
    }

    // نمایش اعلان موقت (Toast)
    function showToast(msg) {
        toastMessage.textContent = msg;
        toast.classList.remove('translate-y-24', 'opacity-0');
        setTimeout(() => {
            toast.classList.add('translate-y-24', 'opacity-0');
        }, 3500);
    }

    // باز و بسته کردن پنجره تنظیمات
    btnOpenSettings.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));
    btnSaveSettings.addEventListener('click', saveSettings);

    // پرینت سند
    btnPrint.addEventListener('click', () => {
        window.print();
    });

    // دیاگرام جایگزین استاندارد در صورت بروز خطا در خروجی هوش مصنوعی
    function getFallbackMermaidDiagram() {
        return `flowchart TD
    Client["کلاینت / کاربر"] --> API["درگاه API و اعتبارسنجی"]
    API --> Logic["هسته منطق تجاری"]
    Logic --> DB[("پایگاه داده اصلی")]
    Logic --> Cache[("حافظه نهان Cache")]`;
    }

    // مهار خطای سینتکس دیاگرام Mermaid
    async function renderMermaidSafely(rawCode) {
        mermaidContainer.innerHTML = '';
        
        let targetCode = rawCode ? rawCode.trim() : '';
        targetCode = targetCode.replace(/```mermaid/gi, '').replace(/```/gi, '').trim();

        if (!targetCode) {
            targetCode = getFallbackMermaidDiagram();
        }

        const renderId = 'mermaid-svg-' + Date.now();

        try {
            const { svg } = await mermaid.render(renderId, targetCode);
            mermaidContainer.innerHTML = svg;
        } catch (error) {
            console.error('Mermaid syntax error. Falling back to default diagram.', error);
            
            const errorElement = document.getElementById('d' + renderId);
            if (errorElement) {
                errorElement.remove();
            }

            try {
                const fallbackCode = getFallbackMermaidDiagram();
                const fallbackId = 'mermaid-fallback-' + Date.now();
                const { svg: fallbackSvg } = await mermaid.render(fallbackId, fallbackCode);
                mermaidContainer.innerHTML = fallbackSvg;
            } catch (fallbackError) {
                mermaidContainer.innerHTML = '<div class="text-xs text-rose-500 py-4">خطا در پردازش ساختار دیاگرام رخ داد.</div>';
            }
        }
    }

    // فراخوانی Gemini API با شناسه مدل متغیر
    async function callGeminiApi(apiKey, model, prompt) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.2
            }
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || `خطای سرور گوگل (${response.status})`);
        }

        const data = await response.json();
        const rawJsonText = data.candidates[0].content.parts[0].text;
        return JSON.parse(rawJsonText);
    }

    // فراخوانی Groq API
    async function callGroqApi(apiKey, model, prompt) {
        const endpoint = 'https://api.groq.com/openai/v1/chat/completions';

        const payload = {
            model: model,
            messages: [
                {
                    role: 'system',
                    content: 'You are an elite software architect and proposal writer. You MUST output ONLY a valid JSON object containing keys "proposal_markdown" and "mermaid_code". Do not use markdown wraps.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.2
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || `خطای سرور Groq (${response.status})`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        return JSON.parse(content);
    }

    // اجرای تحلیل و صدور پروپوزال
    btnGenerate.addEventListener('click', async () => {
        const title = inputProjectTitle.value.trim() || 'پروژه نرم‌افزاری اختصاصی';
        const repo = inputRepoUrl.value.trim();
        const rfp = inputRfpText.value.trim();
        const provider = selectProvider.value;

        // مشخص کردن نام دقیق مدل
        let activeModel = selectModel.value;
        if (activeModel === 'custom') {
            activeModel = inputCustomModel.value.trim();
            if (!activeModel) {
                showToast('لطفاً شناسه مدل سفارشی را وارد کنید.');
                inputCustomModel.focus();
                return;
            }
        }

        if (!rfp) {
            showToast('لطفاً شرح نیازمندی‌های پروژه (RFP) را وارد کنید.');
            inputRfpText.focus();
            return;
        }

        const geminiKey = localStorage.getItem('cp_gemini_key') || '';
        const groqKey = localStorage.getItem('cp_groq_key') || '';

        if (provider === 'gemini' && !geminiKey) {
            showToast('کلید Gemini API را در تنظیمات وارد کنید.');
            settingsModal.classList.remove('hidden');
            return;
        }

        if (provider === 'groq' && !groqKey) {
            showToast('کلید Groq API را در تنظیمات وارد کنید.');
            settingsModal.classList.remove('hidden');
            return;
        }

        btnGenerate.disabled = true;
        generateSpinner.classList.remove('hidden');
        generateBtnText.textContent = `در حال تحلیل با مدل ${activeModel}...`;

        const promptText = `
شما یک معمار ارشد سیستم و مهندس نرم‌افزار هستید. شرح نیاز زیر را تحلیل کنید:

عنوان پروژه: ${title}
ریپازیتوری مرجع: ${repo ? repo : 'ندارد'}
شرح نیازمندی‌ها (RFP):
${rfp}

یک شیء خالص JSON بدون هیچ متن اضافی بازگردانید:
{
  "proposal_markdown": "متن رسمی پروپوزال با ساختار کامل",
  "mermaid_code": "کد دیاگرام جریان داده یا ساختار سیستم با سینتکس Mermaid"
}

الزامات بخش proposal_markdown:
۱. تحلیل مسئله و اهداف کلیدی پروژه.
۲. پشته فناوری و ساختار معماری پیشنهادی.
۳. فازبندی تحویل در حداقل ۳ فاز اجرایی.
۴. تحلیل ریسک‌ها و برآورد سطح دشواری.
۵. جدول مارک‌داون شامل ستون‌های: ردیف، شرح اقدام، زمان تخمینی، و یک ستون خالی با عنوان «هزینه پیشنهادی (ریال/تومان)».

الزامات بخش mermaid_code:
۱. ساختار flowchart TD باشد.
۲. شناسه‌ها فقط کاراکترهای لاتین باشند (A, B, C).
۳. متن فارسی فقط داخل دابل کوتیشن قرار گیرد مانند: A["پایگاه داده"].
۴. از پرانتز و کاراکترهای خاص داخل نام گره‌ها استفاده نکنید.
`;

        try {
            let resultData;
            if (provider === 'gemini') {
                resultData = await callGeminiApi(geminiKey, activeModel, promptText);
            } else {
                resultData = await callGroqApi(groqKey, activeModel, promptText);
            }

            viewDocTitle.textContent = title;
            const now = new Date();
            viewDocDate.textContent = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(now);

            proposalContent.innerHTML = marked.parse(resultData.proposal_markdown || 'متنی تولید نشد.');
            await renderMermaidSafely(resultData.mermaid_code || '');

            showToast('پروپوزال و معماری با موفقیت آماده شد.');

        } catch (err) {
            console.error(err);
            showToast('خطا: ' + err.message);
        } finally {
            btnGenerate.disabled = false;
            generateSpinner.classList.add('hidden');
            generateBtnText.textContent = 'پردازش و تولید پروپوزال';
        }
    });

    loadSettings();
});
