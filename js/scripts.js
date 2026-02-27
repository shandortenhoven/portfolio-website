(function () {
  "use strict";

  // jQuery DOM-ready
  $(function () {
    // ----------------------------
    // Mobile nav
    // ----------------------------
    $(document).on("click", ".nav-toggle", function () {
      var $btn = $(this);

      // Prefer aria-controls target if available, fallback to sibling nav
      var controlsId = $btn.attr("aria-controls");
      var $nav = controlsId ? $("#" + controlsId) : $btn.siblings("nav").first();

      $nav.toggleClass("is-open");

      var isOpen = $nav.hasClass("is-open");
      $btn.attr("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu after clicking a nav link (mobile only)
    $(document).on("click", "nav.site-nav a, nav.nav a", function () {
      if (window.matchMedia("(max-width: 640px)").matches) {
        var $nav = $(this).closest("nav");
        $nav.removeClass("is-open");

        // Update the correct toggle button aria state
        $nav.siblings(".nav-toggle").attr("aria-expanded", "false");
      }
    });

    // Close menu when resizing to desktop
    $(window).on("resize", function () {
      if (window.matchMedia("(min-width: 641px)").matches) {
        $("nav.site-nav, nav.nav").removeClass("is-open");
        $(".nav-toggle").attr("aria-expanded", "false");
      }
    });

    // Optional: smooth scroll for in-page anchors (e.g. #work on index)
    $(document).on("click", 'a[href^="#"]', function (e) {
      var href = this.getAttribute("href");

      // Ignore empty hash links like "#"
      if (!href || href === "#") return;

      var $target = $(href);
      if ($target.length) {
        e.preventDefault();
        $("html, body").animate({ scrollTop: $target.offset().top - 70 }, 500);
      }
    });

    // ----------------------------
    // LIGHTBOX (click to enlarge)
    // Targets: .project-hero img, .gallery img
    // Optional: use data-full for higher-res image
    // Optional: use data-caption or alt text for caption
    // ----------------------------

    // Create lightbox once
    var $lightbox = $(
      '<div class="lightbox" role="dialog" aria-modal="true" aria-label="Image preview">' +
        '<div class="lightbox__panel">' +
          '<button class="lightbox__close" type="button" aria-label="Close">✕</button>' +
          '<img class="lightbox__img" alt="Expanded view" />' +
          '<div class="lightbox__caption" style="display:none;"></div>' +
        "</div>" +
      "</div>"
    );
    $("body").append($lightbox);

    function openLightbox(src, caption) {
      $lightbox.find(".lightbox__img").attr("src", src);

      var $cap = $lightbox.find(".lightbox__caption");
      if (caption) {
        $cap.text(caption).show();
      } else {
        $cap.hide().text("");
      }

      $("body").addClass("lb-open");
      $lightbox.addClass("is-open");
    }

    function closeLightbox() {
      $lightbox.removeClass("is-open");
      $("body").removeClass("lb-open");
      $lightbox.find(".lightbox__img").attr("src", "");
      $lightbox.find(".lightbox__caption").hide().text("");
    }

    // Open on click (hero + gallery)
    $(document).on("click", ".project-hero img, .gallery img", function () {
      var $img = $(this);
      var full = $img.attr("data-full") || $img.attr("src");
      var caption = $img.attr("data-caption") || $img.attr("alt") || "";
      openLightbox(full, caption);
    });

    // Close: button
    $(document).on("click", ".lightbox__close", function () {
      closeLightbox();
    });

    // Close: click backdrop (but not the panel)
    $(document).on("click", ".lightbox", function (e) {
      if ($(e.target).is(".lightbox")) closeLightbox();
    });

    // Close: press ESC
    $(document).on("keydown", function (e) {
      if (e.key === "Escape" && $lightbox.hasClass("is-open")) {
        closeLightbox();
      }
    });
  });
})();