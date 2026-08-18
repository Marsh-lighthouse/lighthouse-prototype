// ════════════════════════════════════════════════
//  Cookie consent banner + Manage Cookies side panel
//  Self-contained: injects markup, handles EN/AR, and
//  persists the user's choice in localStorage so the
//  banner only shows on first visit.
// ════════════════════════════════════════════════
(function () {
  var STORE = "lh-cookie-consent";

  var T = {
    en: {
      body: 'We and our partners may process our data through the use of cookies (and other tracking technologies). Some cookies are necessary to make our website work, so they can’t be turned off. Others are not strictly necessary but are useful to optimize the performance of this site, help us assess site usage, and give you the best user experience. You can consent to the use of such cookies by clicking “Accept”, you can reject our use of such cookies by clicking “Reject”, or you can make individualized decisions by clicking “Manage Cookies”. To learn more about cookies and why we use them, please refer to our {privacy} and/or {cookie}.',
      privacy: "Privacy Notice",
      cookie: "Cookie Notice",
      manage: "Manage Cookies",
      accept: "Accept",
      reject: "Reject Non-Essential",
      close: "Close",
      panelTitle: "Storage Preferences",
      panelIntro: "When you visit websites, they may store or retrieve data about you using cookies and similar technologies (“cookies”). Cookies may be necessary for the basic functionality of the website as well as other purposes. You have the option of disabling certain types of cookies, though doing so may impact your experience on the website.",
      cat1: "Strictly Necessary Cookies",
      cat1Desc: "Required to enable basic website functionality. You may not disable essential cookies.",
      cat2: "Advertising Cookies",
      cat2Desc: "Used to deliver advertising that is more relevant to you and your interests. May also be used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns. Advertising networks usually place them with the website operator’s permission.",
      cat3: "Functional Cookies",
      cat3Desc: "Allow the website to remember choices you make (such as your username, language, or the region you are in) and provide enhanced, more personal features. For example, a website may provide you with local weather reports or traffic news by storing data about your general location.",
      cat4: "Analytics Cookies",
      cat4Desc: "Help the website operator understand how its website performs, how visitors interact with the site, and whether there may be technical issues.",
      disclosures: "View Disclosures",
      save: "Save"
    },
    ar: {
      body: 'قد نقوم نحن وشركاؤنا بمعالجة بياناتنا من خلال استخدام ملفات تعريف الارتباط (وتقنيات تتبع أخرى). بعض ملفات تعريف الارتباط ضرورية لتشغيل موقعنا ولا يمكن إيقافها. يمكنك الموافقة بالنقر على “قبول”، أو رفضها، أو اتخاذ قرارات فردية بالنقر على “إدارة ملفات تعريف الارتباط”. لمعرفة المزيد، يرجى الاطلاع على {privacy} و/أو {cookie}.',
      privacy: "إشعار الخصوصية",
      cookie: "إشعار ملفات تعريف الارتباط",
      manage: "إدارة ملفات تعريف الارتباط",
      accept: "قبول",
      reject: "رفض غير الضروري",
      close: "إغلاق",
      panelTitle: "تفضيلات التخزين",
      panelIntro: "عند زيارتك للمواقع، قد تقوم بتخزين أو استرجاع بيانات عنك باستخدام ملفات تعريف الارتباط والتقنيات المماثلة. قد تكون ضرورية للوظائف الأساسية للموقع ولأغراض أخرى. لديك خيار تعطيل أنواع معينة، ولكن قد يؤثر ذلك على تجربتك.",
      cat1: "ملفات ضرورية تمامًا",
      cat1Desc: "لازمة لتفعيل الوظائف الأساسية للموقع. لا يمكنك تعطيل الملفات الأساسية.",
      cat2: "ملفات الإعلانات",
      cat2Desc: "تُستخدم لتقديم إعلانات أكثر صلة بك وباهتماماتك، وقد تُستخدم أيضًا لقياس فعالية الحملات الإعلانية.",
      cat3: "ملفات وظيفية",
      cat3Desc: "تسمح للموقع بتذكّر الخيارات التي تتخذها (مثل اسم المستخدم أو اللغة أو المنطقة) وتوفر ميزات أكثر تخصيصًا.",
      cat4: "ملفات التحليلات",
      cat4Desc: "تساعد مشغّل الموقع على فهم أداء الموقع وكيفية تفاعل الزوار معه وما إذا كانت هناك مشكلات تقنية.",
      disclosures: "عرض الإفصاحات",
      save: "حفظ"
    }
  };

  function lang() {
    try { return localStorage.getItem("lh-login-language") === "ar" ? "ar" : "en"; } catch (e) { return "en"; }
  }

  var els = {};

  function build() {
    // Banner
    var banner = document.createElement("div");
    banner.className = "lh-cookie";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.innerHTML =
      '<button class="lh-cookie-close" type="button" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>' +
      '</button>' +
      '<div class="lh-cookie-main">' +
        '<span class="lh-cookie-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2.8a9.2 9.2 0 109.2 9.2 3.8 3.8 0 01-3.8-3.8 2.9 2.9 0 01-2.9-2.9 .9 .9 0 00-1.3-.8 9.2 9.2 0 00-1.2-1.7z"/><circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="13.5" cy="13.5" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r="1" fill="currentColor" stroke="none"/></svg></span>' +
        '<p class="lh-cookie-text"></p>' +
      '</div>' +
      '<div class="lh-cookie-actions">' +
        '<button class="lh-cookie-btn" data-act="manage" type="button"></button>' +
        '<button class="lh-cookie-btn" data-act="accept" type="button"></button>' +
        '<button class="lh-cookie-btn" data-act="reject" type="button"></button>' +
      '</div>';
    document.body.appendChild(banner);

    // Scrim + side panel
    var scrim = document.createElement("div");
    scrim.className = "lh-cookie-scrim";
    document.body.appendChild(scrim);

    var panel = document.createElement("aside");
    panel.className = "lh-cookie-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Manage cookies");
    panel.innerHTML =
      '<div class="lh-cp-head">' +
        '<div class="lh-cp-title"><span class="lh-cp-hico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2.8a9.2 9.2 0 109.2 9.2 3.8 3.8 0 01-3.8-3.8 2.9 2.9 0 01-2.9-2.9 .9 .9 0 00-1.3-.8 9.2 9.2 0 00-1.2-1.7z"/><circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="13.5" cy="13.5" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r="1" fill="currentColor" stroke="none"/></svg></span><h2></h2></div>' +
        '<button class="lh-cp-close" type="button" aria-label="Close">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="lh-cp-body">' +
        '<p class="lh-cp-intro"></p>' +
        '<div class="lh-cp-cat">' +
          '<div class="lh-cp-cathead"><div class="lh-cp-catname"><span class="lh-cp-cico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg></span><h3 data-k="cat1"></h3></div>' +
            '<span class="lh-cp-toggle"><input type="checkbox" checked disabled /><span class="lh-cp-track"></span></span></div>' +
          '<p class="lh-cp-desc" data-k="cat1Desc"></p>' +
          '<a class="lh-cp-disc" href="#" data-k="disclosures"></a>' +
        '</div>' +
        '<div class="lh-cp-cat">' +
          '<div class="lh-cp-cathead"><div class="lh-cp-catname"><span class="lh-cp-cico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h3l6 4V6L7 10H4z"/><path d="M17 9a4 4 0 010 6"/></svg></span><h3 data-k="cat2"></h3></div>' +
            '<span class="lh-cp-toggle"><input type="checkbox" id="lh-ck-ads" /><span class="lh-cp-track"></span></span></div>' +
          '<p class="lh-cp-desc" data-k="cat2Desc"></p>' +
          '<a class="lh-cp-disc" href="#" data-k="disclosures"></a>' +
        '</div>' +
        '<div class="lh-cp-cat">' +
          '<div class="lh-cp-cathead"><div class="lh-cp-catname"><span class="lh-cp-cico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h8"/><circle cx="15" cy="8" r="2"/><path d="M18 8h2"/><path d="M4 16h2"/><circle cx="9" cy="16" r="2"/><path d="M12 16h8"/></svg></span><h3 data-k="cat3"></h3></div>' +
            '<span class="lh-cp-toggle"><input type="checkbox" id="lh-ck-func" /><span class="lh-cp-track"></span></span></div>' +
          '<p class="lh-cp-desc" data-k="cat3Desc"></p>' +
          '<a class="lh-cp-disc" href="#" data-k="disclosures"></a>' +
        '</div>' +
        '<div class="lh-cp-cat">' +
          '<div class="lh-cp-cathead"><div class="lh-cp-catname"><span class="lh-cp-cico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"/><path d="M7 20v-6"/><path d="M12 20V8"/><path d="M17 20v-9"/></svg></span><h3 data-k="cat4"></h3></div>' +
            '<span class="lh-cp-toggle"><input type="checkbox" id="lh-ck-analytics" /><span class="lh-cp-track"></span></span></div>' +
          '<p class="lh-cp-desc" data-k="cat4Desc"></p>' +
          '<a class="lh-cp-disc" href="#" data-k="disclosures"></a>' +
        '</div>' +
      '</div>' +
      '<div class="lh-cp-foot">' +
        '<button class="lh-cp-btn lh-cp-btn--primary" data-act="save" type="button"></button>' +
      '</div>';
    document.body.appendChild(panel);

    els = { banner: banner, scrim: scrim, panel: panel };

    // Wire actions
    banner.querySelector(".lh-cookie-close").addEventListener("click", dismiss);
    banner.querySelector('[data-act="accept"]').addEventListener("click", function () { save("accepted"); });
    banner.querySelector('[data-act="reject"]').addEventListener("click", function () { save("rejected"); });
    banner.querySelector('[data-act="manage"]').addEventListener("click", openPanel);
    panel.querySelector(".lh-cp-close").addEventListener("click", closePanel);
    scrim.addEventListener("click", closePanel);
    panel.querySelector('[data-act="save"]').addEventListener("click", function () { save("custom"); closePanel(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePanel(); });

    render();
    window.addEventListener("lh-language-change", render);
  }

  function render() {
    if (!els.banner) return;
    var t = T[lang()];
    // Banner text with two links
    var parts = t.body.split("{privacy}");
    var afterPrivacy = (parts[1] || "").split("{cookie}");
    els.banner.querySelector(".lh-cookie-text").innerHTML =
      esc(parts[0]) + '<a href="#">' + esc(t.privacy) + "</a>" +
      esc(afterPrivacy[0] || "") + '<a href="#">' + esc(t.cookie) + "</a>" +
      esc(afterPrivacy[1] || "");
    els.banner.querySelector('[data-act="manage"]').textContent = t.manage;
    els.banner.querySelector('[data-act="accept"]').textContent = t.accept;
    els.banner.querySelector('[data-act="reject"]').textContent = t.reject;
    els.banner.querySelector(".lh-cookie-close").setAttribute("aria-label", t.close);
    // Panel
    els.panel.querySelector("h2").textContent = t.panelTitle;
    els.panel.querySelector(".lh-cp-intro").textContent = t.panelIntro;
    els.panel.querySelectorAll("[data-k]").forEach(function (n) { n.textContent = t[n.dataset.k]; });
    els.panel.querySelector('[data-act="save"]').textContent = t.save;
  }

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function openPanel() { els.scrim.classList.add("open"); els.panel.classList.add("open"); }
  function closePanel() { els.scrim.classList.remove("open"); els.panel.classList.remove("open"); }

  function dismiss() { els.banner.hidden = true; closePanel(); }

  function save(choice) {
    try { localStorage.setItem(STORE, choice); } catch (e) {}
    dismiss();
  }

  function shouldShow() {
    try { return !localStorage.getItem(STORE); } catch (e) { return true; }
  }

  function init() {
    // Footer "Manage Cookies" link opens the panel on any visit
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest(".lg-footer a");
      if (!a) return;
      var txt = (a.textContent || "").trim();
      if (txt === T.en.manage || txt === T.ar.manage) {
        e.preventDefault();
        if (!els.banner) { build(); els.banner.hidden = true; }
        openPanel();
      }
    });
    // Demo behaviour: always present the consent banner on a fresh landing,
    // so it reliably appears each time you open a login page. Accept / Reject /
    // close still dismisses it for the current view, and the choice is recorded.
    build();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Allow re-opening from the footer "Manage Cookies" link or for testing
  window.LHCookies = {
    reset: function () { try { localStorage.removeItem(STORE); } catch (e) {} if (!els.banner) build(); els.banner.hidden = false; },
    open: function () { if (!els.banner) { build(); els.banner.hidden = true; } openPanel(); }
  };
})();
