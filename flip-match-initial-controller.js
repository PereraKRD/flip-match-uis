$(function () {
  var $codeBoxes = $(".flip-match-code-box");

  $codeBoxes.on("input", function () {
    var $this = $(this);
    var val = $this.val().replace(/[^0-9]/g, "");
    $this.val(val);
    $this.toggleClass("filled", val.length === 1);

    if (val.length === 1) {
      var next = $this.data("index") + 1;
      $codeBoxes.filter('[data-index="' + next + '"]').trigger("focus");
    }
    checkCodeComplete();
  });

  $codeBoxes.on("keydown", function (e) {
    var $this = $(this);
    if (e.key === "Backspace" && $this.val() === "") {
      var prev = $this.data("index") - 1;
      $codeBoxes.filter('[data-index="' + prev + '"]').trigger("focus").trigger("select");
    }
  });

  $codeBoxes.on("paste", function (e) {
    var pasted = (e.originalEvent.clipboardData || window.clipboardData).getData("text");
    var digits = pasted.replace(/[^0-9]/g, "").split("").slice(0, 4);
    if (digits.length) {
      e.preventDefault();
      digits.forEach(function (d, i) {
        $codeBoxes.filter('[data-index="' + i + '"]').val(d).addClass("filled");
      });
      checkCodeComplete();
    }
  });

  function checkCodeComplete() {
    var complete = true;
    $codeBoxes.each(function () {
      if ($(this).val().length !== 1) complete = false;
    });
    $("#startBtn").prop("disabled", !complete);
    $("#codeError").removeClass("show");
  }

  $("#startBtn").on("click", function () {
    var complete = true;
    $codeBoxes.each(function () {
      if ($(this).val().length !== 1) complete = false;
    });
    if (!complete) {
      $("#codeError").addClass("show");
      return;
    }
    window.location.href = "flip-match-game.html";
  });

  function setResponsiveBackground() {
    var $el = $(".flip-match-screen");
    if (!$el.length) return;

    var bg;
    if (window.matchMedia("(max-width: 768px)").matches) {
      bg = $el.data("bg-phone");
    } else if (window.matchMedia("(max-width: 1024px)").matches) {
      bg = $el.data("bg-tablet");
    } else {
      bg = $el.data("bg-desktop");
    }

    $el.css("background-image", "url('" + bg + "')");
  }

  $(setResponsiveBackground);
  $(window).on("resize", setResponsiveBackground);
});