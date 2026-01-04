(function () {
  "use strict";

  // jQuery DOM-ready
  $(function () {
    // Toggle button click
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
  });
})();
