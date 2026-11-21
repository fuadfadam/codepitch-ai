# CodePitch AI
> **Universal Architecture Engine & Technical Proposal Synthesizer**  
> *Deterministic, Zero-Backend, Client-Side Synthesis on GitHub Pages.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Hosting: GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-black?logo=github)](https://fuadfadam.github.io/codepitch-ai/)
[![Architecture: Zero--Backend](https://img.shields.io/badge/Architecture-Zero--Backend-indigo.svg)](#architecture)
[![Interface: Responsive](https://img.shields.io/badge/UI-Mobile--First-emerald.svg)](#interface)

---

## English Overview

**CodePitch AI** is a static, client-orchestrated system engineered to translate project requirements, RFPs, and architectural blueprints into formal documents, interactive diagrams, and print-ready deliverables in seconds.

Built without server-side dependencies or runtime build chains, CodePitch AI operates directly within standard modern browsers via static edge delivery.

### Core Architectural Pillars
- **Zero-Backend Security (BYOK):** API tokens (Google AI Studio, Groq Cloud) persist exclusively inside client-side `localStorage`. No keys or user data touch third-party intermediaries.
- **Client-Side AST & Vector Synthesis:** Integrates `marked.js` and `Mermaid.js` for on-the-fly syntax parsing and data-flow diagram rendering with deterministic fault-fallback safeguards.
- **Native Print CSS Media:** Eliminates canvas rasterization distortion and RTL font encoding failures by relying on standard browser layout engines and custom `@media print` stylesheets.
- **Universal Scope Definition:** Supports technical proposals, startup investor pitches, curriculum courseware, and process workflows.

---

## مشخصات فنی و معماری به زبان فارسی

سامانه **CodePitch AI** یک زیرساخت پردازشی کلاینت‌محور است که اسناد نیازمندی، سرفصل‌ها و توضیحات پراکنده پروژه‌ها را به ساختارهای فنی منظم، جداول زمان‌بندی، دیاگرام‌های تعاملی و فایل‌های چاپی بدون نقص تبدیل می‌کند.

### اصول معماری سیستم
*   **امنیت داده و مدل BYOK:** کلیدهای اعتبارسنجی مستقیماً در حافظه ایزوله مرورگر ذخیره شده و درخواست‌ها بدون هیچ سرور واسط به نقاط پایانی ارسال می‌شوند.
*   **رفع ریشه‌ای اختلال تایپوگرافی RTL:** پردازش خروجی از طریق استانداردهای DOM و موتور پرینت مرورگر صورت گرفته و نیاز به کتابخانه‌های ناپایدار کانواس مانند jsPDF حذف شده است.
*   **مهار خطاهای ساختاری دیاگرام:** رندر کدهای ساختاری با مکانیزم Fallback انجام می‌شود تا هرگونه خطای احتمالی سینتکس با نمودارهای پایه جایگزین گردد.
*   **انعطاف‌پذیری تم و رسانه:** قابلیت انتخاب مستقل تم اپلیکیشن و فرمت بصری خروجی (روشن یا تیره) برای کاربردهای اداری و دیجیتال.

---

## Multi-Chain Sponsorship & Pro Licensing / حمایت و فعال‌سازی

Verification is performed client-side through deterministic transaction hash matching.

| Network / Chain | Supported Currencies | Public Deposit Address |
| :--- | :--- | :--- |
| **EVM (ETH, BSC, Polygon, Arbitrum, Base, OP)** | ETH, BNB, POL, USDT, USDC, DAI | `0x5574432Aa702a60eCF73F20123C775d5bC980C31` |
| **Solana** | SOL, USDT, USDC | `84ftXW1r7HbHcr2nUQKNfNCcSFjEqDFqVAK1DiS8rTA1` |
| **TRON** | TRX, USDT (TRC20) | `TKtUabiYPR7D4C2bAi9wruHtHQNFtq7cEC` |
| **Cardano** | ADA | `addr1qxruqaqgda2gudm4tua07sjn3zeua6fe3ydx7xgg5dw90ertyq76mnxgtgvjdkuuza6ckw2x0y93rygaf42l9vg6sx9s5a2q2l` |
| **Dogecoin** | DOGE | `D9vqtbVuoqpgKWM1hEqKgVjaQVFXEKJuZu` |
| **Litecoin** | LTC | `ltc1q6fm3h7c78p9guz796wyrazhffuehuakk06ntvc` |
| **Ripple** | XRP | `rEbXmM3WJeSP59ZssEgu5tzASLYqBgBRx2` |
| **Algorand** | ALGO | `VLAGNF3OMOSYG2Y2Y52NSEIWZPA6BBTKI3WQMOMSU3WG2QDHP4GMV2R5QE` |
| **Cosmos** | ATOM | `cosmos10caa6aufk3t9y9g2jfwjcaxl3j4p9x7jgndzll` |

---

## Author & Maintainer
Designed and engineered by **Fuad Fadam**.  
Production Deployment: [https://fuadfadam.github.io/codepitch-ai/](https://fuadfadam.github.io/codepitch-ai/)
