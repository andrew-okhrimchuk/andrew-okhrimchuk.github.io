;(function ($) {
  "use strict";

  function normalizePath(pathname) {
    if (!pathname || pathname === "/") {
      return "index.html";
    }
    return (pathname.split("/").pop() || "index.html").toLowerCase();
  }

  function setActiveMenuItem() {
    var current = normalizePath(window.location.pathname);
    $(".navbar-nav .nav-link").each(function () {
      var href = ($(this).attr("href") || "").toLowerCase();
      if (!href || href === "#") return;
      $(this).closest(".nav-item").toggleClass("active", href === current);
    });
  }

  function improveExternalLinks() {
    $('a[target="_blank"]').attr("rel", "noopener noreferrer");
  }

  function initReveal() {
    var items = document.querySelectorAll(".gh-reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("gh-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.getAttribute("data-gh-delay") || "0", 10);
          setTimeout(function () {
            el.classList.add("gh-visible");
          }, delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target") || "0", 10);
    var suffix = target === 100 ? "%" : "+";
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var value = Math.floor(target * progress);
      el.textContent = value + (progress >= 1 ? suffix : "");
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll(".gh-counter");
    if (!counters.length || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initCertificateLightbox() {
    var $grid = $(".gh-cert-grid");
    if (!$grid.length || !$.fn.magnificPopup) return;

    $grid.magnificPopup({
      delegate: "a.gh-cert-lightbox",
      type: "image",
      mainClass: "mfp-fade",
      removalDelay: 160,
      closeOnContentClick: true,
      closeBtnInside: true,
      fixedContentPos: true,
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1],
      },
      image: {
        verticalFit: true,
        titleSrc: function (item) {
          return item.el.attr("title") || item.el.find("img").attr("alt") || "";
        },
      },
    });
  }

  function initParallaxOrbs() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var orbs = document.querySelector(".gh-bg-orbs");
    if (!orbs) return;

    window.addEventListener(
      "scroll",
      function () {
        var y = window.pageYOffset * 0.08;
        orbs.style.transform = "translateY(" + y + "px)";
      },
      { passive: true }
    );
  }

  $(function () {
    $("body").addClass("gh-live-site");
    setActiveMenuItem();
    improveExternalLinks();
    initReveal();
    initCounters();
    initParallaxOrbs();
    initCertificateLightbox();
  });
})(jQuery);
