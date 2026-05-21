$(document).ready(function () {
  (function ($) {
    "use strict";

    var FORM_ENDPOINT = "https://formsubmit.co/ajax/a0972103356@gmail.com";

    function contactPack() {
      var lang = localStorage.getItem("gh_lang") || "uk";
      var pack =
        window.GH_TRANSLATIONS &&
        window.GH_TRANSLATIONS[lang] &&
        window.GH_TRANSLATIONS[lang].contact;
      return pack || {};
    }

    function validationMessages() {
      var t = contactPack();
      return {
        name: {
          required: t.valNameRequired || "Вкажіть ім'я",
          minlength: t.valNameMin || "Ім'я — щонайменше 2 символи"
        },
        subject: {
          required: t.valSubjectRequired || "Вкажіть тему",
          minlength: t.valSubjectMin || "Тема — щонайменше 4 символи"
        },
        email: {
          required: t.valEmailRequired || "Вкажіть email",
          email: t.valEmailFormat || "Некоректний email"
        },
        message: {
          required: t.valMessageRequired || "Напишіть повідомлення",
          minlength: t.valMessageMin || "Повідомлення — щонайменше 20 символів"
        }
      };
    }

    function showModal(id) {
      $(id).modal("show");
    }

    var $form = $("#contactForm");
    if (!$form.length) return;

    $form.validate({
      rules: {
        name: { required: true, minlength: 2 },
        subject: { required: true, minlength: 4 },
        email: { required: true, email: true },
        message: { required: true, minlength: 20 }
      },
      messages: validationMessages(),
      submitHandler: function (form) {
        var $btn = $(form).find('[type="submit"]');
        $btn.prop("disabled", true);

        var body = new FormData(form);
        body.append("_subject", "Повідомлення з сайту Okhrimchuk");
        body.append("_template", "table");
        body.append("_captcha", "false");

        fetch(FORM_ENDPOINT, {
          method: "POST",
          body: body,
          headers: { Accept: "application/json" }
        })
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            if (data && data.success) {
              form.reset();
              showModal("#success");
            } else {
              showModal("#error");
            }
          })
          .catch(function () {
            showModal("#error");
          })
          .finally(function () {
            $btn.prop("disabled", false);
          });
      }
    });

    document.addEventListener("gh:languagechange", function () {
      if ($form.data("validator")) {
        $form.validate().settings.messages = validationMessages();
      }
    });
  })(jQuery);
});
