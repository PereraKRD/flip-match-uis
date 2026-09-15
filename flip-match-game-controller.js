$(function () {
  var GAME_SECONDS = 150;
  var FLIP_BACK_DELAY = 900;
  var TILE_IMG_PATH = window.FLIP_MATCH_IMG_PATH || '';

  var FEATURES = [
    { key: "profile", label: "Employee Profile", img: "employee-profile.png" },
    { key: "ess", label: "Employee Self Service", img: "employee-self-service.png" },
    { key: "payroll", label: "Payroll", img: "payroll.png" },
    { key: "benefits", label: "Benefit Management", img: "benefit-management.png" },
    { key: "survey", label: "Survey Management", img: "survey-management.png" },
    { key: "performance", label: "Performance Management", img: "performance-management.png" },
    { key: "offboarding", label: "Offboarding", img: "offboarding.png" },
    { key: "onboarding", label: "Onboarding", img: "onboarding.png" },
    { key: "reports", label: "Reports", img: "reports.png" },
    { key: "resign", label: "Resign & Exit", img: "resign-exit.png" },
    { key: "ai", label: "AI Module", img: "ai-module.png" },
    { key: "workforce", label: "Workforce Planning", img: "workforce-planning.png" },
    { key: "esign", label: "E Signature", img: "e-signature.png" },
    { key: "standard", label: "Advanced Analytics", img: "advanced-analytics.png" },
    { key: "leave", label: "Leave & Attendance", img: "leave-attendance.png" },
    { key: "templates", label: "Gallery Doc Letter Templates", img: "gallery-doc.png" },
    { key: "recruitment", label: "Recruitment & Talent Acquisition", img: "seeknow.png" },
    { key: "td", label: "Training & Development", img: "t-d.png" }
  ];

  var state = {
    timer: null,
    secondsLeft: GAME_SECONDS,
    moves: 0,
    matched: 0,
    lockBoard: false,
    firstCard: null,
    secondCard: null
  };

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function buildBoard() {
    var deck = shuffle(FEATURES.concat(FEATURES));
    var $board = $("#board").empty();

    deck.forEach(function (feature) {
      var $card = $('<div class="card-tile"></div>').attr("data-key", feature.key);
      var $inner = $('<div class="card-tile-inner"></div>');

      var $back = $('<div class="card-tile-face card-tile-back"></div>')
        .append('<img src="' + TILE_IMG_PATH + 'glogo.png" alt="">');

      var $front = $('<div class="card-tile-face card-tile-front"></div>')
        .append('<img src="' + TILE_IMG_PATH + feature.img + '" alt="' + feature.label + '">');

      $inner.append($back).append($front);
      $card.append($inner);
      $board.append($card);
    });
  }

  function startGame() {
    state.secondsLeft = GAME_SECONDS;
    state.moves = 0;
    state.matched = 0;
    state.lockBoard = false;
    state.firstCard = null;
    state.secondCard = null;

    $("#movesCount").text(0);
    updateTimerDisplay();
    buildBoard();

    clearInterval(state.timer);
    state.timer = setInterval(tick, 1000);
  }

  function tick() {
    state.secondsLeft--;
    updateTimerDisplay();
    if (state.secondsLeft <= 0) {
      clearInterval(state.timer);
      endGame(false);
    }
  }

  function updateTimerDisplay() {
    var m = Math.floor(Math.max(state.secondsLeft, 0) / 60);
    var s = Math.max(state.secondsLeft, 0) % 60;
    var text = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    var $el = $("#timeLeft").text(text);
    $el.toggleClass("warning", state.secondsLeft <= 20);
  }

  $("#board").on("click", ".card-tile", function () {
    var $card = $(this);
    if (state.lockBoard) return;
    if ($card.hasClass("is-flipped") || $card.hasClass("is-matched")) return;

    $card.addClass("is-flipped");

    if (!state.firstCard) {
      state.firstCard = $card;
      return;
    }

    state.secondCard = $card;
    state.lockBoard = true;
    state.moves++;
    $("#movesCount").text(state.moves);

    checkForMatch();
  });

  function checkForMatch() {
    var isMatch = state.firstCard.data("key") === state.secondCard.data("key");

    if (isMatch) {
      state.firstCard.addClass("is-matched");
      state.secondCard.addClass("is-matched");

      var $checkmark = $('<div class="match-checkmark"><i class="fa fa-check"></i></div>');
      state.firstCard.find('.card-tile-front').append($checkmark.clone());
      state.secondCard.find('.card-tile-front').append($checkmark);

      state.matched++;
      resetTurn();

      if (state.matched === FEATURES.length) {
        clearInterval(state.timer);
        setTimeout(function () { endGame(true); }, 500);
      }
    } else {
      setTimeout(function () {
        state.firstCard.removeClass("is-flipped");
        state.secondCard.removeClass("is-flipped");
        resetTurn();
      }, FLIP_BACK_DELAY);
    }
  }

  function resetTurn() {
    state.firstCard = null;
    state.secondCard = null;
    state.lockBoard = false;
  }

  function endGame(won) {
    clearInterval(state.timer);

    var elapsed = GAME_SECONDS - Math.max(state.secondsLeft, 0);
    var m = Math.floor(elapsed / 60);
    var s = elapsed % 60;
    var timeText = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;

    if (won) {
      $("#finalMatches").text(state.matched);
      $("#finalTime").text(timeText);
      $("#winModal").fadeIn(200);
    } else {
      $("#badLuckModal").fadeIn(200);
    }
  }

  $("#winCloseBtn").on("click", function (e) {
    e.preventDefault();
    $("#winModal").fadeOut(200);
  });

  $("#winExitBtn, #exitBtn").on("click", function (e) {
    e.preventDefault();
    window.location.href = "flip-match-initial.html";
  });

  startGame();

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
