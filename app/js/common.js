$.fn.isOnScreen = function(shift) {
  if (!shift) {
    shift = 0;
  }
  var viewport = {};
  viewport.top = $(window).scrollTop();
  viewport.bottom = viewport.top + $(window).height();
  var bounds = {};
  bounds.top = this.offset().top + shift;
  bounds.bottom = bounds.top + this.outerHeight() - shift;
  return bounds.top <= viewport.bottom && bounds.bottom >= viewport.top;
};

var menuTriggerStart = $(".scroll").offset().top;
var menuTriggerStop = $("#bottom").offset().top;
var sectionsNav = $(".sections");
var shift = 150;

var scrollDetection = function() {
  $("section").each(function() {
    var that = this;

    if ($(that).isOnScreen(shift)) {
      hightlight($(that).attr("id"));
    }
  });

  var scrollTop = $(document).scrollTop(),
    viewportHeight = $(window).innerHeight();

  if (
    scrollTop + viewportHeight - shift >= menuTriggerStart &&
    scrollTop <= menuTriggerStop - viewportHeight
  ) {
    sectionsNav.addClass("show");
  } else {
    sectionsNav.removeClass("show expanded");
  }
};

var hightlight = function(id) {
  $(".sections__item")
    .siblings()
    .removeClass("active");
  $('.sections__item[data-href="' + id + '"]').addClass("active");
};

var faqItems = $(".faq__item");
var faq = function(e) {
  e.preventDefault();
  var item = $(e.target).closest(".faq__item");
  item.find(".faq__item-text").slideToggle();
  item.toggleClass("active");
  faqItems.not(item).find(".faq__item-text").slideUp();
  faqItems.not(item).removeClass('active');
};

var videoPlayer = function() {
  $("video").each(function() {
    if ($(this).data("url")) {
      var posterUrl = $(this).attr("poster");
      $(this).removeAttr("poster");
      $(this)
        .attr("controlsList", "nodownload")
        .attr("controls", "controls")
        .html(
          '<source src="http://cdn.ahacdu.com' +
            $(this).data("url") +
            '.mp4"><source src="http://cdn.ahacdu.com' +
            $(this).data("url") +
            '.webm">'
        );
      $(this).after(
        $(
          '<div class="media__poster" style="background-image: url(' +
            posterUrl +
            ')"></div>'
        )
      );
    }
  });

  var slider = $(".media__list").slick({
    infinite: false,
    fade: true,
    speed: 500,
    prevArrow: $(".media__prev"),
    nextArrow: $(".media__next")
  });

  var playBtn = $(".media__play"),
    videoWrap = $(".media__videos"),
    video = document.querySelector(".slick-active video");

  slider.on("beforeChange", function() {
    video.pause();
    videoWrap.removeClass("playing");
  });

  slider.on("afterChange", function() {
    video = document.querySelector(".slick-active video");
  });

  playBtn.on("click", function() {
    video.play();
    $(video)
      .closest(".media__item")
      .addClass("was-played");
    videoWrap.addClass("playing");
  });
};

function setActive(collection, i) {
  collection.siblings().removeClass("active");
  collection.eq(i).addClass("active");
}

var carsSection = function() {
  var slider = $(".cars__slider-wrap").slick({
    infinite: false,
    fade: true,
    speed: 300,
    prevArrow: $(".cars__prev"),
    nextArrow: $(".cars__next"),
    autoplay: true,
    autoplaySpeed: 3500
  });

  var modelsImg = $(".cars__models img"),
    bg = $(".cars__bg"),
    info = $(".cars__info");

  slider.on("beforeChange", function(event, slick, currentSlide, nextSlide) {
    setActive(modelsImg, nextSlide);
    setActive(bg, nextSlide);
    setActive(info, nextSlide);
  });

  modelsImg.on("click", function(e) {
    var index = $(e.target).index();
    slider.slick("slickGoTo", index);
  });
};

var prizes = function() {
  var slider = $(".prizes__slider-wrap").slick({
    fade: true,
    speed: 300,
    prevArrow: $(".prizes__prev"),
    nextArrow: $(".prizes__next"),
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 3500
  });

  var prizesBtn = $(".prizes__list button");

  slider.on("beforeChange", function(event, slick, currentSlide, nextSlide) {
    setActive(prizesBtn, nextSlide);
  });
  prizesBtn.on("click", function(e) {
    var index = $(this).index();
    slider.slick("slickGoTo", index);
  });
};

var langSwitcher = function() {
  var language = window.navigator ? (window.navigator.language ||
      window.navigator.systemLanguage ||
      window.navigator.userLanguage) : "en";
  language = language.substr(0, 2).toLowerCase();

  if (language === 'ru') switchLang('ru')

  document.addEventListener('click', function(e) {
      var target = e.target
      if (!target.getAttribute('data-lang-switcher')) return

      var langCurrent = document.body.getAttribute('data-lang-status')
      var langToSwitch = target.getAttribute('data-lang-switcher')

      if (langCurrent !== langToSwitch) switchLang(langToSwitch)
  })

  function switchLang(lang) {
      var langCurrent = document.body.getAttribute('data-lang-status')

      $('[data-lang-status]').attr('data-lang-status', lang)

      $('[data-lang-switcher=' + lang + ']').text(langCurrent).attr('data-lang-switcher', langCurrent)

      $('.lang__current').text(lang)

      var switchers = [].slice.call(document.querySelectorAll('[data-lang-switcher]'))

      switchers.forEach(function(item) {
          item.classList.remove('active')
      })

      var content = [].slice.call(document.querySelectorAll('[data-lang-id]'))

      content.forEach(function(item) {
          var id = +item.getAttribute('data-lang-id')
          item.innerHTML = data[lang][id]
      })

      document.documentElement.lang = lang
  }

}

$(function() {
  $('.lang').on('click', function(event) {
    event.preventDefault();
    $(this).toggleClass('opened')
});
  langSwitcher()
  scrollDetection();
  $(document).on("scroll", scrollDetection);

  $(".sections__item, .scroll").on("click", function(e) {
    e.preventDefault();
    var id = $(this).attr("data-href");
    var section = $("#" + id).offset().top;
    var shift = $(".header").height();
    if ($(window).innerWidth() > 992) shift = 0;
    $("html, body").animate({ scrollTop: section - shift }, 666);
  });

  $(".faq__item-caption").on("click", faq);

  videoPlayer();
  carsSection();
  prizes();

  var navBtn = $(".nav__btn");

  navBtn.on("click", function() {
    navBtn.toggleClass("opened");
    $(".nav__list").toggleClass("opened");
  });

});
