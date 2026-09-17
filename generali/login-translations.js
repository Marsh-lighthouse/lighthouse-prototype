// ════════════════════════════════════════════════
//  Login Pages Language Translations
//  Handles English/Arabic for Login, Sign Up, Forgot Password
// ════════════════════════════════════════════════

const LOGIN_TRANSLATIONS = {
  en: {
    // Participant Login page
    "loginEyebrow": "SIGN IN",
    "loginTitle": "Welcome back",
    "loginSub": "Sign in to your leadership assessment account",
    "emailLabel": "Email",
    "passwordLabel": "Password",
    "forgotPassword": "Forgot password?",
    "signIn": "Sign in",
    "noAccount": "Not a member?",
    "signup": "Sign up",

    // SSO Login page
    "ssoEyebrow": "SINGLE SIGN-ON",
    "ssoTitle": "Enterprise Access",
    "ssoSub": "Sign in with your company credentials",
    "continueSSO": "Continue to SSO",
    "ssoNote": "You'll be redirected to your company's identity provider.",

    // Magic Link Login page
    "magicEyebrow": "MAGIC LINK",
    "magicTitle": "Sign in seamlessly",
    "magicSub": "We'll send you a secure link to sign in instantly",
    "sendLink": "Send sign-in link",
    "magicNote": "✓ Check your inbox for a secure link\n✓ Link expires in 24 hours\n✓ No password needed",

    // Footer & misc
    "© 2026 Marsh Lighthouse. All rights reserved.": "© 2026 Marsh Lighthouse. All rights reserved.",
    "Privacy & Terms": "Privacy & Terms",
    "Privacy Statement": "Privacy Statement",
    "Connecting to": "Connecting to",
    "Sign in with your account to access Marsh Lighthouse": "Sign in with your account to access Marsh Lighthouse",
    "Verify it's you with a security method": "Verify it's you with a security method",
    "Select from the following options": "Select from the following options",
    "Choose how you'd like to confirm your identity": "Choose how you'd like to confirm your identity",
    "Enter a code": "Enter a code",
    "Get a push notification": "Get a push notification",
    "Use a security key": "Use a security key",
    "Authenticator app": "Authenticator app",
    "Passkey / WebAuthn": "Passkey / WebAuthn",
    "Select": "Select",
    "Back to sign in": "Back to sign in",
    "Secured by Lighthouse SSO": "Secured by Lighthouse SSO",
    "Privacy notice": "Privacy Notice",
    "Cookie notice": "Cookie Notice",
    "Privacy Notice": "Privacy Notice",
    "Cookie Notice": "Cookie Notice",
    "Manage Cookies": "Manage Cookies",
    "Split": "Split",
    "Spotlight": "Spotlight",
    "Cinematic": "Cinematic",
    "Midnight": "Midnight",
    "Showcase": "Showcase",
    "Celestial": "Celestial",
    "Aura": "Aura",
    "Participant": "Participant",
    "SSO": "SSO",
    "Magic Link": "Magic Link",

    // Sign Up page
    "Create account": "Create account",
    "Join Marsh Lighthouse": "Join Marsh Lighthouse",
    "First name": "First name",
    "Last name": "Last name",
    "Registration code": "Registration code",
    "I agree to the Terms of Service": "I agree to the Terms of Service",
    "Already a member?": "Already a member?",
    "Log in": "Log in",

    // Forgot Password page
    "Forgot password?": "Forgot password?",
    "Enter your email to reset your password": "Enter your email to reset your password",
    "Send reset link": "Send reset link",
    "Back to login": "Back to login",
    "Link sent successfully": "Link sent successfully",
  },
  ar: {
    // Participant Login page
    "loginEyebrow": "تسجيل الدخول",
    "loginTitle": "أهلا بعودتك",
    "loginSub": "سجل دخولك إلى حساب تقييم القيادة الخاص بك",
    "emailLabel": "البريد الإلكتروني",
    "passwordLabel": "كلمة المرور",
    "forgotPassword": "هل نسيت كلمة المرور؟",
    "signIn": "تسجيل الدخول",
    "noAccount": "لست عضوا؟",
    "signup": "إنشاء حساب",

    // SSO Login page
    "ssoEyebrow": "تسجيل دخول موحد",
    "ssoTitle": "الوصول المؤسسي",
    "ssoSub": "قم بتسجيل الدخول باستخدام بيانات اعتماد شركتك",
    "continueSSO": "المتابعة إلى SSO",
    "ssoNote": "ستتم إعادة توجيهك إلى موفر الهوية في شركتك.",

    // Magic Link Login page
    "magicEyebrow": "رابط سحري",
    "magicTitle": "تسجيل دخول سلس",
    "magicSub": "سنرسل لك رابطا آمنا لتسجيل الدخول على الفور",
    "sendLink": "إرسال رابط تسجيل الدخول",
    "magicNote": "✓ تحقق من صندوق الوارد الخاص بك للحصول على رابط آمن\n✓ ينتهي الرابط بعد 24 ساعة\n✓ لا تحتاج إلى كلمة مرور",

    // Footer & misc
    "© 2026 Marsh Lighthouse. All rights reserved.": "© 2026 Marsh Lighthouse. جميع الحقوق محفوظة.",
    "Privacy & Terms": "الخصوصية والشروط",
    "Privacy Statement": "بيان الخصوصية",
    "Connecting to": "جارٍ الاتصال بـ",
    "Sign in with your account to access Marsh Lighthouse": "سجل الدخول بحسابك للوصول إلى Marsh Lighthouse",
    "Verify it's you with a security method": "تحقق من هويتك باستخدام طريقة أمان",
    "Select from the following options": "اختر من الخيارات التالية",
    "Choose how you'd like to confirm your identity": "اختر الطريقة التي ترغب بها في تأكيد هويتك",
    "Enter a code": "أدخل رمزًا",
    "Get a push notification": "استلم إشعارًا فوريًا",
    "Use a security key": "استخدم مفتاح أمان",
    "Authenticator app": "تطبيق المصادقة",
    "Passkey / WebAuthn": "مفتاح المرور / WebAuthn",
    "Select": "اختيار",
    "Back to sign in": "العودة إلى تسجيل الدخول",
    "Secured by Lighthouse SSO": "مؤمّن بواسطة Lighthouse SSO",
    "Privacy Notice": "إشعار الخصوصية",
    "Cookie Notice": "إشعار ملفات تعريف الارتباط",
    "Manage Cookies": "إدارة ملفات تعريف الارتباط",
    "Split": "مقسم",
    "Spotlight": "أضواء كاشفة",
    "Cinematic": "سينمائي",
    "Midnight": "منتصف الليل",
    "Showcase": "عرض",
    "Celestial": "سماوي",
    "Aura": "هالة",
    "Participant": "مشارك",
    "SSO": "SSO",
    "Magic Link": "رابط سحري",

    // Sign Up page
    "Create account": "إنشاء حساب",
    "Join Marsh Lighthouse": "انضم إلى Marsh Lighthouse",
    "First name": "الاسم الأول",
    "Last name": "اسم العائلة",
    "Registration code": "رمز التسجيل",
    "I agree to the Terms of Service": "أوافق على شروط الخدمة",
    "Already a member?": "هل أنت عضو بالفعل؟",
    "Log in": "تسجيل الدخول",

    // Forgot Password page
    "Forgot password?": "هل نسيت كلمة المرور؟",
    "Enter your email to reset your password": "أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور",
    "Send reset link": "إرسال رابط إعادة التعيين",
    "Back to login": "العودة إلى تسجيل الدخول",
    "Link sent successfully": "تم إرسال الرابط بنجاح",
  }
};

class LoginLanguageSwitcher {
  constructor() {
    this.currentLang = this.loadLanguage();
    this.applyInitialLanguage();
    this.setupListeners();
  }

  loadLanguage() {
    try {
      return localStorage.getItem("lh-login-language") || "en";
    } catch (e) {
      return "en";
    }
  }

  applyInitialLanguage() {
    document.documentElement.dir = this.currentLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = this.currentLang;
    this.translatePage();
    this.updateLangLabel();
    window.dispatchEvent(new CustomEvent("lh-language-change", { detail: this.currentLang }));
  }

  setLanguage(lang) {
    if (!LOGIN_TRANSLATIONS[lang]) return;
    this.currentLang = lang;
    try {
      localStorage.setItem("lh-login-language", lang);
    } catch (e) {}

    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;

    this.translatePage();
    this.updateLangLabel();
    window.dispatchEvent(new CustomEvent("lh-language-change", { detail: lang }));
  }

  setupListeners() {
    const langToggle = document.getElementById("lg-lang-toggle");
    const langDropdown = document.getElementById("lg-lang-dropdown");
    const langOptions = document.querySelectorAll(".lg-lang-option");

    if (langToggle) {
      langToggle.addEventListener("click", () => {
        langDropdown?.classList.toggle("active");
      });
    }

    langOptions.forEach(option => {
      option.addEventListener("click", (e) => {
        const lang = e.target.dataset.lang;
        this.setLanguage(lang);
        langOptions.forEach(opt => opt.classList.remove("active"));
        e.target.classList.add("active");
        langDropdown?.classList.remove("active");
      });
    });

    document.addEventListener("click", (e) => {
      if (
        langDropdown &&
        !langDropdown.contains(e.target) &&
        !langToggle?.contains(e.target)
      ) {
        langDropdown.classList.remove("active");
      }
    });
  }

  translatePage() {
    const translations = LOGIN_TRANSLATIONS[this.currentLang];

    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });

    // Translate all text nodes and element content
    const walk = (node) => {
      if (!node) return;
      if (node.nodeType === 3) { // Text node
        const text = node.textContent.trim();
        if (text && translations[text]) {
          node.textContent = translations[text];
        }
      } else if (node.nodeType === 1) { // Element node
        // Skip script and style tags
        if (node.tagName !== "SCRIPT" && node.tagName !== "STYLE") {
          // Translate aria-label and title attributes
          if (node.getAttribute("aria-label")) {
            const ariaText = node.getAttribute("aria-label");
            if (translations[ariaText]) {
              node.setAttribute("aria-label", translations[ariaText]);
            }
          }
          if (node.getAttribute("title")) {
            const titleText = node.getAttribute("title");
            if (translations[titleText]) {
              node.setAttribute("title", translations[titleText]);
            }
          }
          if (node.getAttribute("placeholder")) {
            const placeholderText = node.getAttribute("placeholder");
            if (translations[placeholderText]) {
              node.setAttribute("placeholder", translations[placeholderText]);
            }
          }

          // Recursively translate child nodes
          Array.from(node.childNodes).forEach(child => walk(child));
        }
      }
    };

    walk(document.body);
  }

  updateLangLabel() {
    const langLabel = document.getElementById("lg-lang-label");
    if (langLabel) {
      langLabel.textContent = this.currentLang === "en" ? "English" : "العربية";
    }
  }

  get(key) {
    return LOGIN_TRANSLATIONS[this.currentLang]?.[key] || LOGIN_TRANSLATIONS.en[key] || key;
  }
}

window.LoginLanguageSwitcher = new LoginLanguageSwitcher();
window.tLogin = (key) => window.LoginLanguageSwitcher.get(key);
window.LOGIN_TRANSLATIONS = LOGIN_TRANSLATIONS;

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.LoginLanguageSwitcher = new LoginLanguageSwitcher();
  });
} else {
  window.LoginLanguageSwitcher = new LoginLanguageSwitcher();
}
