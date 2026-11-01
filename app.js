/**
 * موتور منطقی CodePitch AI
 * معماری: کلاینت‌محور (Zero-Backend)
 */

document.addEventListener('DOMContentLoaded', () => {
    // مقداردهی اولیه سیستم دیاگرام Mermaid
    mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Vazirmatn'
    });

    // ارجاع به المان‌های رابط کاربری
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

    // همگام‌سازی مدل‌های موتورها
    selectProvider.addEventListener('change', () => {
        selectModel.innerHTML = '';
        if (selectProvider.value === 'gemini') {
            const m1 = new Option('gemini-1.5-flash', 'gemini-1.5-flash');
            const m2 = new Option('gemini-2.0-flash', 'gemini-2.0-flash');
            selectModel.add(m1);
            selectModel.add(m2);
        } else {
            const m1 = new Option('llama-3.3-70b-versatile', 'llama-3.3-70b-versatile');
            const m2 = new Option('mixtral-8x7b-32768', 'mixtral-8x7b-32768');
            selectModel.add(m1);
            selectModel.add(m2);
        }
    });

    // بارگذاری تنظیمات از حافظه محلی مرورگر
    function loadSettings() {
        const geminiKey = localStorage.getItem('cp_gemini_key') || '';
        const groqKey = localStorage.getItem('cp_groq_key') || '';
        const licenseKey = localStorage.getItem('cp_license_key') || '';

        inputGeminiKey.value = geminiKey;
        inputGroqKey.value = groqKey;
        inputLicenseKey.value = licenseKey;

        verifyAndApplyLicense(licenseKey);
    }

    // ذخیره تنظیمات در حافظه محلی
    function saveSettings() {
        localStorage.setItem('cp_gemini_key', inputGeminiKey.value.trim());
        localStorage.setItem('cp_groq_key', inputGroqKey.value.trim());
        localStorage.setItem('cp_license_key', inputLicenseKey.value.trim());

        verifyAndApplyLicense(inputLicenseKey.value.trim());
        settingsModal.classList.add('hidden');
        showToast('تنظیمات با موفقیت ذخیره شد.');
    }

    // اعتبارسنجی لایسنس یا هش تراکنش کریپتو
    function verifyAndApplyLicense(key) {
        if (!key) {
            document.body.classList.remove('is-pro');
            licenseStatus.textContent = 'نسخه: رایگان (دارای واترمارک)';
            licenseStatus.className = 'text-[11px] text-slate-400 mt-1';
            return;
        }

        // بررسی فرمت هش تراکنش (EVM یا Tron یا کلید لایسنس استاندارد CodePitch)
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

    // نمایش اعلان سیستم
    function showToast(msg) {
        toastMessage.textContent = msg;
        toast.classList.remove('translate-y-24', 'opacity-0');
        setTimeout(() => {
            toast.classList.add('translate-y-24', 'opacity-0');
        }, 3500);
    }

    // باز و بسته کردن مودال
    btnOpenSettings.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));
    btnSaveSettings.addEventListener('click', saveSettings);

    // ارسال درخواست چاپ به مرورگر
    btnPrint.addEventListener('click', () => {
        window.print();
    });

    // استخراج دیاگرام پیش‌فرض هنگام بروز خطای هوش مصنوعی
    function getFallbackMermaidDiagram() {
        return `flowchart TD
    Client["کلاینت / کاربر"] --> API["درگاه API و اعتبارسنجی"]
    API --> Logic["هسته منطق تجاری"]
    Logic --> DB[("پایگاه داده اصلی")]
    Logic --> Cache[("حافظه نهان Cache")]`;
    }

    // رندر ایمن Mermaid به همراه مهار استثنا
    async function renderMermaidSafely(rawCode) {
        mermaidContainer.innerHTML = '';
        
        let targetCode = rawCode ? rawCode.trim() : '';

        // پاکسازی تگ‌های احتمالی مارک‌داون
        targetCode = targetCode.replace(/```mermaid/gi, '').replace(/```/gi, '').trim();

        if (!targetCode) {
            targetCode = getFallbackMermaidDiagram();
        }

        const renderId = 'mermaid-svg-' + Date.now();

        try {
            const { svg } = await mermaid.render(renderId, targetCode);
            mermaidContainer.innerHTML = svg;
        } catch (error) {
            console.error('Mermaid render error. Using fallback diagram.', error);
            
            // حذف المان‌های خطای احتمالی ایجادشده توسط کتابخانه Mermaid در صفحه
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
                mermaidContainer.innerHTML = '<div class="text-xs text-rose-500 py-4">خطا در رندر دیاگرام معماری رخ داد.</div>';
            }
        }
    }

    // فراخوانی سرویس Google Gemini
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
            throw new Error(errData.error?.message || 'خطا در ارتباط با سرور Gemini');
        }

        const data = await response.json();
        const rawJsonText = data.candidates[0].content.parts[0].text;
        return JSON.parse(rawJsonText);
    }

    // فراخوانی سرویس Groq Cloud
    async function callGroqApi(apiKey, model, prompt) {
        const endpoint = 'https://api.groq.com/openai/v1/chat/completions';

        const payload = {
            model: model,
            messages: [
                {
                    role: 'system',
                    content: 'You are an elite software architect and proposal writer. You MUST output ONLY a valid, single JSON object containing exact keys "proposal_markdown" and "mermaid_code". Do not use wrapping Markdown syntax like ```json.'
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
            throw new Error(errData.error?.message || 'خطا در ارتباط با سرور Groq');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        return JSON.parse(content);
    }

    // فرایند اصلی دریافت ورودی و اجرای هوش مصنوعی
    btnGenerate.addEventListener('click', async () => {
        const title = inputProjectTitle.value.trim() || 'پروژه نرم‌افزاری اختصاصی';
        const repo = inputRepoUrl.value.trim();
        const rfp = inputRfpText.value.trim();
        const provider = selectProvider.value;
        const model = selectModel.value;

        if (!rfp) {
            showToast('لطفاً شرح نیازمندی‌های پروژه (RFP) را وارد کنید.');
            inputRfpText.focus();
            return;
        }

        const geminiKey = localStorage.getItem('cp_gemini_key') || '';
        const groqKey = localStorage.getItem('cp_groq_key') || '';

        if (provider === 'gemini' && !geminiKey) {
            showToast('کلید Gemini API یافت نشد. به منوی تنظیمات بروید.');
            settingsModal.classList.remove('hidden');
            return;
        }

        if (provider === 'groq' && !groqKey) {
            showToast('کلید Groq API یافت نشد. به منوی تنظیمات بروید.');
            settingsModal.classList.remove('hidden');
            return;
        }

        // تغییر وضعیت دکمه به در حال بارگذاری
        btnGenerate.disabled = true;
        generateSpinner.classList.remove('hidden');
        generateBtnText.textContent = 'در حال تحلیل معماری و نگارش...';

        const promptText = `
شما یک مهندس ارشد نرم‌افزار و معمار سیستم هستید. شرح نیاز پروژه یا ریپازیتوری زیر را تحلیل کنید:

عنوان پروژه: ${title}
ریپازیتوری مرجع: ${repo ? repo : 'ندارد'}
شرح نیازمندی‌ها (RFP):
${rfp}

وظیفه شما بازگرداندن یک آبجکت خالص JSON با ساختار زیر است (بدون هیچ توضیح اضافه، فقط JSON معتبر):
{
  "proposal_markdown": "متن کامل پروپوزال به زبان فارسی رسمی با ساختار استاندارد",
  "mermaid_code": "کد خام دیاگرام معماری سیستم یا جریان داده به فرمت Mermaid"
}

دستورالعمل برای "proposal_markdown":
۱. متن کاملاً ساختاریافته و با عناوین واضح باشد:
   - تحلیل مسئله و اهداف کلیدی پروژه
   - نیازمندی‌های فنی، زبان‌ها و فریم‌ورک‌های پیشنهادی
   - فازبندی تحویل و مایلستون‌ها (حداقل ۳ فاز)
   - برآورد ریسک‌ها و سطح پیچیدگی فنی (ساده، متوسط، پیچیده)
   - جدول خام مارک‌داون شامل ستون‌های: ردیف، شرح اقدام/فاز، زمان تخمینی، و یک ستون خالی به نام «هزینه پیشنهادی (ریال/تومان)» جهت تکمیل دستی توسط پیمانکار.

دستورالعمل برای "mermaid_code":
۱. نوع دیاگرام flowchart TD یا sequenceDiagram باشد.
۲. کدهای شناسه گره‌ها انگلیسی ساده (مانند A, B, C) باشند.
۳. برچسب گره‌ها به زبان فارسی داخل دابل کوتیشن قرار گیرند: A["متن فارسی"].
۴. از پرانتز یا کاراکترهای خراب‌کننده سینتکس داخل متن گره‌ها اکیداً خودداری کنید.
`;

        try {
            let resultData;
            if (provider === 'gemini') {
                resultData = await callGeminiApi(geminiKey, model, promptText);
            } else {
                resultData = await callGroqApi(groqKey, model, promptText);
            }

            // بروزرسانی سربرگ سند
            viewDocTitle.textContent = title;
            const now = new Date();
            const dateStr = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(now);
            viewDocDate.textContent = dateStr;

            // رندر مارک‌داون
            const rawMarkdown = resultData.proposal_markdown || 'پروپوزال تولید نشد.';
            proposalContent.innerHTML = marked.parse(rawMarkdown);

            // رندر دیاگرام معماری
            const rawMermaid = resultData.mermaid_code || '';
            await renderMermaidSafely(rawMermaid);

            showToast('سند و دیاگرام با موفقیت ایجاد شد.');

        } catch (err) {
            console.error(err);
            showToast('خطا در پردازش: ' + err.message);
        } finally {
            btnGenerate.disabled = false;
            generateSpinner.classList.add('hidden');
            generateBtnText.textContent = 'پردازش و تولید پروپوزال';
        }
    });

    // بارگذاری داده‌ها در هنگام آغاز به کار نرم‌افزار
    loadSettings();
});
