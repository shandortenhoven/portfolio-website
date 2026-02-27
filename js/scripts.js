(function () {
  "use strict";

  $(function () {
    /* -----------------------------
       Mobile nav toggle
    ----------------------------- */
    $(document).on("click", ".nav-toggle", function () {
      var $btn = $(this);
      var controlsId = $btn.attr("aria-controls");
      var $nav = controlsId ? $("#" + controlsId) : $btn.siblings("nav").first();

      $nav.toggleClass("is-open");

      var isOpen = $nav.hasClass("is-open");
      $btn.attr("aria-expanded", isOpen ? "true" : "false");
    });

    $(document).on("click", "nav.site-nav a, nav.nav a", function () {
      if (window.matchMedia("(max-width: 640px)").matches) {
        var $nav = $(this).closest("nav");
        $nav.removeClass("is-open");
        $nav.siblings(".nav-toggle").attr("aria-expanded", "false");
      }
    });

    $(window).on("resize", function () {
      if (window.matchMedia("(min-width: 641px)").matches) {
        $("nav.site-nav, nav.nav").removeClass("is-open");
        $(".nav-toggle").attr("aria-expanded", "false");
      }
    });

    $(document).on("click", 'a[href^="#"]', function (e) {
      var href = this.getAttribute("href");
      if (!href || href === "#") return;

      var $target = $(href);
      if ($target.length) {
        e.preventDefault();
        $("html, body").animate({ scrollTop: $target.offset().top - 70 }, 500);
      }
    });

    /* -----------------------------
       Lightbox (click to enlarge)
       Works with: .lb-trigger[data-full]
    ----------------------------- */

    // Create once
    if (!$(".lightbox").length) {
      $("body").append(`
        <div class="lightbox" aria-hidden="true">
          <div class="lightbox__backdrop" data-lb-close="1"></div>
          <div class="lightbox__dialog" role="dialog" aria-modal="true" aria-label="Image preview">
            <div class="lightbox__bar">
              <p class="lightbox__title" id="lbTitle">Preview</p>
              <button class="lightbox__close" type="button" aria-label="Close preview" data-lb-close="1">✕</button>
            </div>
            <div class="lightbox__imgwrap">
              <img class="lightbox__img" src="" alt="" />
            </div>
          </div>
        </div>
      `);
    }

    function openLightbox(fullSrc, altText, titleText) {
      // Guard against empty paths (this is what causes your “empty src” errors)
      if (!fullSrc || !String(fullSrc).trim()) return;

      var $lb = $(".lightbox");
      $lb.addClass("is-open").attr("aria-hidden", "false");

      $lb.find(".lightbox__img").attr("src", fullSrc).attr("alt", altText || "Expanded image");
      $lb.find("#lbTitle").text(titleText || "Preview");

      // prevent background scroll
      $("body").css("overflow", "hidden");
    }

    function closeLightbox() {
      var $lb = $(".lightbox");
      $lb.removeClass("is-open").attr("aria-hidden", "true");

      // clear src to stop memory usage
      $lb.find(".lightbox__img").attr("src", "").attr("alt", "");

      $("body").css("overflow", "");
    }

    // Open
    $(document).on("click", ".lb-trigger", function () {
      var fullSrc = $(this).attr("data-full");
      var altText = $(this).find("img").attr("alt") || "Expanded image";
      var titleText = $(this).attr("data-title") || altText;

      openLightbox(fullSrc, altText, titleText);
    });

    // Close (button or backdrop)
    $(document).on("click", "[data-lb-close]", function () {
      closeLightbox();
    });

    // Close on ESC
    $(document).on("keydown", function (e) {
      if (e.key === "Escape" && $(".lightbox").hasClass("is-open")) {
        closeLightbox();
      }
    });
  });
})();