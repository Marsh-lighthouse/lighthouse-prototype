// ════════════════════════════════════════════════
//  Language Switcher — English & Arabic
//  Manages language state and provides translated content
// ════════════════════════════════════════════════

const TRANSLATIONS = {
  en: {
    dashboard: "Dashboard",
    development: "Development",
    scheduling: "Scheduling",
    insights: "Insights",
    myProfile: "My profile",
    welcomeBack: "Welcome back",
    goodAfternoon: "Good afternoon,",
    activePrograms: "Active programs",
    reportsReady: "Reports ready",
    yourPrograms: "Your programs",
    programsSubhead: "You may have been assigned multiple activities to complete. Make sure all assigned activities are completed across every program.",
    daysLeft: "days left",
    profileCompletion: "Profile completion",
    sectionsCompleted: "sections completed",
    completeProfile: "Complete Profile",
    continueProgram: "Continue program",
    beginProgram: "Begin program",
    statusNotStarted: "Not started",
    statusInProgress: "In progress",
    statusCompleted: "Completed",
    systemCheck: "System Check",
    appearance: "Appearance",
    light: "Light",
    dark: "Dark",
    logout: "Logout",
    backToPrograms: "Back to programs",
    programInstructions: "Program Instructions",
    leadershipAssessment2026: "Leadership Assessment 2026",
    perspective360Feedback: "360° Perspective Feedback",
    hoganAssessment: "Hogan Assessment",
    cognitiveAbilityTest: "Cognitive Ability Test",
    videoInterview: "Video Interview",
    selfAssessment: "Self Assessment",
    nominateRaters: "Nominate Raters",
    trackResponses: "Track Responses",
    watchIntroductionVideo: "Watch introduction video",
    introductionWatched: "Introduction watched",
    beforeYouBegin: "Before you begin",
    iHaveReadInstructions: "I have read the instructions",
    continue: "Continue",
    instructionsAcknowledged: "Instructions acknowledged.",
    watchTheShortIntroduction: "Watch the short introduction and read the instructions below before you begin your task.",
    programTasks: "Program Tasks",
    complete: "Complete",
    inProgress: "In progress",
    notStarted: "Not started",
    locked: "Locked",
    preCheck: "Pre-check",
    systemCheckInstructions: "System Check",
    openAssessment: "Open Task",
    startAssessment: "Start Task",
    reviewProgress: "Review Progress",
    of: "of",
    tasksCompleted: "tasks completed",
    allRightsReserved: "All rights reserved",
    privacyTerms: "Privacy & Terms",
    privacyStatement: "Privacy Statement",
    privacyNotice: "Privacy Notice",
    cookieNotice: "Cookie Notice",
    manageCookies: "Manage Cookies",
    reportTechnicalProblem: "Report a technical problem",
  },
  ar: {
    dashboard: "لوحة التحكم",
    development: "التطوير",
    scheduling: "الجدولة",
    insights: "الرؤى",
    myProfile: "ملفي الشخصي",
    welcomeBack: "أهلا بعودتك",
    goodAfternoon: "مساء الخير",
    activePrograms: "البرامج النشطة",
    reportsReady: "التقارير الجاهزة",
    yourPrograms: "برامجك",
    programsSubhead: "ربما تم تعيين عدة أنشطة لإكمالها. تأكد من إكمال جميع الأنشطة المعينة عبر كل البرامج.",
    daysLeft: "أيام متبقية",
    profileCompletion: "إكمال الملف الشخصي",
    sectionsCompleted: "أقسام مكتملة",
    completeProfile: "إكمال الملف الشخصي",
    continueProgram: "متابعة البرنامج",
    beginProgram: "بدء البرنامج",
    statusNotStarted: "لم يبدأ",
    statusInProgress: "قيد التنفيذ",
    statusCompleted: "مكتمل",
    systemCheck: "فحص النظام",
    appearance: "المظهر",
    light: "فاتح",
    dark: "داكن",
    logout: "تسجيل خروج",
    backToPrograms: "العودة إلى البرامج",
    programInstructions: "تعليمات البرنامج",
    leadershipAssessment2026: "تقييم القيادة 2026",
    perspective360Feedback: "تقييم المنظور 360°",
    hoganAssessment: "تقييم هوجان",
    cognitiveAbilityTest: "اختبار القدرة المعرفية",
    videoInterview: "المقابلة بالفيديو",
    selfAssessment: "التقييم الذاتي",
    nominateRaters: "تعيين المقيمين",
    trackResponses: "تتبع الردود",
    allRightsReserved: "جميع الحقوق محفوظة",
    privacyTerms: "الخصوصية والشروط",
    privacyStatement: "بيان الخصوصية",
    privacyNotice: "إشعار الخصوصية",
    cookieNotice: "إشعار ملفات تعريف الارتباط",
    manageCookies: "إدارة ملفات تعريف الارتباط",
    reportTechnicalProblem: "الإبلاغ عن مشكلة تقنية",
    watchIntroductionVideo: "شاهد فيديو المقدمة",
    introductionWatched: "تمت مشاهدة المقدمة",
    beforeYouBegin: "قبل أن تبدأ",
    iHaveReadInstructions: "لقد قرأت التعليمات",
    continue: "متابعة",
    instructionsAcknowledged: "تم الاعتراف بالتعليمات.",
    watchTheShortIntroduction: "شاهد المقدمة القصيرة واقرأ التعليمات أدناه قبل أن تبدأ مهمتك.",
    programTasks: "مهام البرنامج",
    complete: "مكتمل",
    inProgress: "قيد التقدم",
    notStarted: "لم يبدأ",
    locked: "مقفول",
    preCheck: "الفحص المسبق",
    systemCheckInstructions: "فحص النظام",
    openAssessment: "المهمة المفتوحة",
    startAssessment: "بدء المهمة",
    reviewProgress: "مراجعة التقدم",
    of: "من",
    tasksCompleted: "المهام المكتملة",
  },
};

class LanguageSwitcher {
  constructor() {
    this.currentLang = this.loadLanguage();
    this.listeners = [];
    this.applyInitialLanguage();
  }

  loadLanguage() {
    try {
      return localStorage.getItem("lh-language") || "en";
    } catch (e) {
      return "en";
    }
  }

  applyInitialLanguage() {
    document.documentElement.dir = this.currentLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = this.currentLang;
  }

  setLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    this.currentLang = lang;
    try {
      localStorage.setItem("lh-language", lang);
    } catch (e) {}

    // Update HTML direction for Arabic
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;

    // Notify all listeners of language change
    this.listeners.forEach(cb => cb(lang));
    window.dispatchEvent(new CustomEvent("lh-language-change", { detail: lang }));

    // Force React re-render by triggering a global event
    setTimeout(() => {
      window.dispatchEvent(new Event("lh-language-updated"));
    }, 0);
  }

  get(key) {
    return TRANSLATIONS[this.currentLang]?.[key] || TRANSLATIONS.en[key] || key;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  getLanguages() {
    return ["en", "ar"];
  }

  getLanguageLabel(lang) {
    return lang === "en" ? "English" : "العربية";
  }
}

window.LangSwitcher = new LanguageSwitcher();

// Global translation function
window.t = (key) => window.LangSwitcher.get(key);

// Instruction text translations
const INSTRUCTION_TRANSLATIONS = {
  en: {
    "This program includes individual exercises and Assessment Centers (live, multi-phase simulations with assessors).": "This program includes individual exercises and Assessment Centers (live, multi-phase simulations with assessors).",
    "Some exercises must be completed in order (sequential). Others can be taken at any time.": "Some exercises must be completed in order (sequential). Others can be taken at any time.",
    "You will first complete a self-assessment rating yourself on leadership competencies.": "You will first complete a self-assessment rating yourself on leadership competencies.",
    "Then nominate raters — your manager, 3–5 peers, and 2–3 direct reports.": "Then nominate raters — your manager, 3–5 peers, and 2–3 direct reports.",
    "They will rate you on the same competencies, providing 360° feedback.": "They will rate you on the same competencies, providing 360° feedback.",
    "A facilitated debrief session helps you understand and apply your results.": "A facilitated debrief session helps you understand and apply your results.",
  },
  ar: {
    "This program includes individual exercises and Assessment Centers (live, multi-phase simulations with assessors).": "يتضمن هذا البرنامج تمارين فردية ومراكز تقييم (محاكاة حية متعددة المراحل مع المقيمين).",
    "Some exercises must be completed in order (sequential). Others can be taken at any time.": "يجب إكمال بعض التمارين بالترتيب (بالتسلسل). يمكن إجراء تمارين أخرى في أي وقت.",
    "You will first complete a self-assessment rating yourself on leadership competencies.": "ستكمل أولاً تقييماً ذاتياً حيث تقيّم نفسك على الكفاءات القيادية.",
    "Then nominate raters — your manager, 3–5 peers, and 2–3 direct reports.": "ثم عيّن المقيمين — مديرك و 3-5 زملاء و 2-3 مرؤوسين مباشرين.",
    "They will rate you on the same competencies, providing 360° feedback.": "سيقيمونك على نفس الكفاءات، مما يوفر تقييماً 360 درجة.",
    "A facilitated debrief session helps you understand and apply your results.": "تساعدك جلسة إعادة فحص ميسرة على فهم وتطبيق نتائجك.",
  }
};

window.tInstruction = (text) => {
  const lang = window.LangSwitcher?.currentLang || "en";
  return INSTRUCTION_TRANSLATIONS[lang]?.[text] || text;
};

// ════════════════════════════════════════════════
//  Login Page Language Dropdown Handler
// ════════════════════════════════════════════════
function initializeLoginDropdown() {
  const langToggle = document.getElementById('lg-lang-toggle');
  const langDropdown = document.getElementById('lg-lang-dropdown');
  const langOptions = document.querySelectorAll('.lg-lang-option');
  const langSwitcher = document.querySelector('.lg-lang-switcher');

  if (!langToggle || !langDropdown) return false;

  // Toggle dropdown on button click
  langToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    langDropdown.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (langSwitcher && !langSwitcher.contains(e.target)) {
      langDropdown.classList.remove('active');
    }
  });

  // Handle language selection
  langOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const lang = option.dataset.lang;
      if (lang) {
        window.LangSwitcher.setLanguage(lang);
        langDropdown.classList.remove('active');
      }
    });
  });

  return true;
}

// Try to initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLoginDropdown);
} else {
  // DOM is already loaded, initialize immediately
  setTimeout(initializeLoginDropdown, 0);
}
