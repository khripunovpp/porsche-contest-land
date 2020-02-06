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
var sectionsNav = $(".sections");
var shift = 150;

var car1 = $(".top__cartrack--1 .top__car"),
  car2 = $(".top__cartrack--2 .top__car"),
  modelSign1 = $(".top__cartrack--1 .top__model"),
  modelSign2 = $(".top__cartrack--2 .top__model");

var scrollDetection = function() {
  $("section").each(function() {
    var that = this;

    if ($(that).isOnScreen(shift)) {
      hightlight($(that).attr("id"));
    }
  });

  var scrollTop = $(document).scrollTop(),
    viewportHeight = $(window).innerHeight();

  if (scrollTop + viewportHeight - shift >= menuTriggerStart) {
    sectionsNav.addClass("show");
  } else {
    sectionsNav.removeClass("show expanded");
  }

  var coeff = scrollTop / 0.8 < 0 ? 0 : scrollTop / 0.8;
  var carMoveCoeff = Math.ceil(coeff);
  var opacity = 1 - Math.abs(coeff / 250);
  var opacityCoeff = opacity < 0 ? 0 : opacity;

  car1.css("transform", "translate3d(-" + carMoveCoeff + "px,0,0)");
  car2.css("transform", "translate3d(" + carMoveCoeff + "px,0,0)");
  modelSign1.add(modelSign2).css("opacity", opacityCoeff);
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
  faqItems
    .not(item)
    .find(".faq__item-text")
    .slideUp();
  faqItems.not(item).removeClass("active");
};

var videoPlayer = function() {
  $("video").each(function() {
    if ($(this).data("url")) {
      var posterUrl = $(this).attr("poster");
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
          '<div class="video__poster" style="background-image: url(' +
            posterUrl +
            ')"></div>'
        )
      );
    }
  });

  var playBtn = $(".video__play");
  videoWrap = $(".video");

  var videos = $("video");

  playBtn.on("click", function() {
    stopAll();
    var video = $(this)
      .closest(videoWrap)
      .find("video")
      .get(0);

    video.play();

    $(video)
      .closest(videoWrap)
      .addClass("playing");
  });

  function stopAll(exept) {
    $("video")
      .not(exept)
      .each(function(el) {
        var v = $(this).get(0);
        v.pause();
      });
  }

  videos.on("play", function() {
    stopAll(this);
  });

  var navs = $(".media__btn");
  navs.on("click", function(event) {
    event.preventDefault();
    var sectionId = $(this).attr("data-media-href");
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
    $('.media__section[data-media="' + sectionId + '"]')
      .addClass("active")
      .siblings()
      .removeClass("active");
  });

  var gallerySlider = $(".media__section[data-media='gallery']").slick({
    slidesToShow: 3,
    infinite: true,
    speed: 300,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: false,
    pauseOnDotsHover: false,
    lazyLoad: "ondemand",
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });
  var videoSlider = $(".media__section[data-media='video']").slick({
    slidesToShow: 2,
    infinite: true,
    speed: 300,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: false,
    pauseOnDotsHover: false,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });
};

function setActive(collection, i) {
  collection.siblings().removeClass("active");
  collection.eq(i).addClass("active");
}

var carsSection = function() {
  var modelsImg = $(".cars__models img"),
    bg = $(".cars__bg"),
    info = $(".cars__info"),
    carWrap = $(".cars__car");

  $(".cars__slider-wrap").on("init", function(event, slick) {
    setActive(modelsImg, 0);
    setActive(bg, 0);
    setActive(info, 0);
    $(".car--1").addClass("active");
  });

  var slider = $(".cars__slider-wrap").slick({
    infinite: false,
    fade: true,
    speed: 300,
    prevArrow: $(".cars__prev"),
    nextArrow: $(".cars__next"),
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: false,
    pauseOnDotsHover: false
  }).on("beforeChange", function(event, slick, currentSlide, nextSlide) {
    setActive(modelsImg, nextSlide);
    setActive(bg, nextSlide);
    setActive(info, nextSlide);
    setTimeout(function() {
      $(".cars__item")
        .eq(currentSlide)
        .find(carWrap)
        .removeClass("active");
    }, 300);
  }).on("afterChange", function(event, slick, currentSlide) {
    $(".cars__item")
      .eq(currentSlide)
      .find(carWrap)
      .addClass("active");
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
  var language = window.navigator
    ? window.navigator.language ||
      window.navigator.systemLanguage ||
      window.navigator.userLanguage
    : "en";
  language = language.substr(0, 2).toLowerCase();

  fillInitial();

  if (language === "ru") switchLang("ru");

  document.addEventListener("click", function(e) {
    var target = e.target;
    if (!target.getAttribute("data-lang-switcher")) return;

    var langCurrent = document.body.getAttribute("data-lang-status");
    var langToSwitch = target.getAttribute("data-lang-switcher");

    if (langCurrent !== langToSwitch) switchLang(langToSwitch);
  });

  function fillInitial() {
    var langInitial = document.body.getAttribute("data-lang-status");

    var content = [].slice.call(document.querySelectorAll("[data-lang-id]"));

    content.forEach(function(item) {
      var id = +item.getAttribute("data-lang-id");
      data[langInitial][id] = item.innerHTML;
    });
  }

  function switchLang(lang) {
    var langCurrent = document.body.getAttribute("data-lang-status");

    $("[data-lang-status]").attr("data-lang-status", lang);

    $("[data-lang-switcher=" + lang + "]")
      .text(langCurrent)
      .attr("data-lang-switcher", langCurrent);

    $(".lang__current").text(lang);

    var switchers = [].slice.call(
      document.querySelectorAll("[data-lang-switcher]")
    );

    switchers.forEach(function(item) {
      item.classList.remove("active");
    });

    var content = [].slice.call(document.querySelectorAll("[data-lang-id]"));

    content.forEach(function(item) {
      var id = +item.getAttribute("data-lang-id");
      var replaceHTML = data[lang][id];
      if (replaceHTML.length > 0) item.innerHTML = replaceHTML;
    });

    document.documentElement.lang = lang;
  }
};

$(function() {
  $(".lang").on("click", function(event) {
    event.preventDefault();
    $(this).toggleClass("opened");
  });
  langSwitcher();
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
