// ════════════════════════════════════════════════
//  Login error-state demo (Login / Sign Up / Forgot)
//  Triggered by the "Error Screens" item in the
//  Participant dropdown. Shows red field errors + a
//  top alert and disables the submit button.
// ════════════════════════════════════════════════
(function () {
  var T = {
    en: {
      emailMissing: "Email is missing",
      emailInvalid: "Please enter a valid email address",
      passwordWrong: "Password is not correct",
      firstMissing: "First name is missing",
      lastMissing: "Last name is missing",
      codeMissing: "Registration code is missing",
      alertSignin: "We are not able to sign you in.",
      alertSignup: "We can’t create your account yet.",
      alertForgot: "We can’t send a reset link. Please correct the email address below."
    },
    ar: {
      emailMissing: "البريد الإلكتروني مفقود",
      emailInvalid: "يرجى إدخال بريد إلكتروني صالح",
      passwordWrong: "كلمة المرور غير صحيحة",
      firstMissing: "الاسم الأول مفقود",
      lastMissing: "اسم العائلة مفقود",
      codeMissing: "رمز التسجيل مفقود",
      alertSignin: "لا يمكنك تسجيل الدخول. يرجى تصحيح الحقول المميزة أدناه.",
      alertSignup: "لا يمكننا إنشاء حسابك بعد. يرجى إكمال الحقول المميزة أدناه.",
      alertForgot: "لا يمكننا إرسال رابط إعادة التعيين. يرجى تصحيح البريد الإلكتروني أدناه."
    }
  };

  function lang() {
    try { return localStorage.getItem("lh-login-language") === "ar" ? "ar" : "en"; } catch (e) { return "en"; }
  }

  function activeForm() {
    return document.querySelector(".lg-login-type.active") || document.getElementById("lg-form");
  }

  // Decide each field's error message + whether to seed an invalid sample value
  function fieldError(input, ctx, t) {
    var id = (input.id || "") + " " + (input.name || "");
    if (input.type === "password") return { msg: t.passwordWrong };
    if (/first|given/i.test(id)) return { msg: t.firstMissing };
    if (/last|family/i.test(id)) return { msg: t.lastMissing };
    if (/code/i.test(id)) return { msg: t.codeMissing };
    if (input.type === "email") {
      if (ctx.isForgot) return { msg: t.emailInvalid, seed: "name@@company" };
      return { msg: t.emailMissing };
    }
    return null;
  }

  function clear() {
    var form = activeForm();
    if (!form) return;
    form.querySelectorAll(".lg-error-msg").forEach(function (n) { n.remove(); });
    var alert = form.querySelector(".lg-alert");
    if (alert) alert.remove();
    form.querySelectorAll(".lg-input.is-error").forEach(function (n) {
      n.classList.remove("is-error");
      if (n.dataset.lhSeeded) { n.value = ""; delete n.dataset.lhSeeded; }
    });
    var btn = form.querySelector(".lg-btn");
    if (btn) btn.disabled = false;
  }

  function show() {
    var form = activeForm();
    if (!form) return;
    clear();
    var t = T[lang()];
    var inputs = form.querySelectorAll("input.lg-input");
    var hasPwd = !!form.querySelector("input[type=password]");
    var hasName = !!form.querySelector("#lg-first, [name=given-name]");
    var ctx = { isForgot: !hasPwd && !hasName && form.querySelectorAll("input.lg-input").length <= 1 };

    inputs.forEach(function (input) {
      var err = fieldError(input, ctx, t);
      if (!err) return;
      input.classList.add("is-error");
      if (err.seed) { input.value = err.seed; input.dataset.lhSeeded = "1"; }
      var field = input.closest(".lg-field") || input.parentElement;
      var msg = document.createElement("p");
      msg.className = "lg-error-msg";
      msg.textContent = err.msg;
      field.appendChild(msg);
    });

    // Top alert
    var alert = document.createElement("div");
    alert.className = "lg-alert";
    alert.setAttribute("role", "alert");
    alert.textContent = ctx.isForgot ? t.alertForgot : (hasName ? t.alertSignup : t.alertSignin);
    var firstBlock = form.querySelector(".lg-row2, .lg-field");
    if (firstBlock) form.insertBefore(alert, firstBlock); else form.appendChild(alert);

    // Disable submit
    var btn = form.querySelector(".lg-btn");
    if (btn) btn.disabled = true;
  }

  // Re-render messages on language change while errors are shown
  window.addEventListener("lh-language-change", function () {
    var form = activeForm();
    if (form && form.querySelector(".lg-alert")) show();
  });

  window.LHErrors = { show: show, clear: clear };
})();
