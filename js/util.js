'use strict';

(function () {
  var MONTH = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  var ARROW_PADDING = 15;
  var ESC_KEYCODE = 27;

  // Определение текущей даты
  var date = new Date();
  var currentDate = date.toLocaleDateString().toString().slice(0, 5);

  // Метод конвертации даты в текстовый формат
  var convertMonth = function (element) {
    var day = element.slice(0, 2);
    var month = element.slice(3, 5);
    if (month[0] === '0') {
      month = element.slice(4, 5);
    }
    return day + ' ' + MONTH[month - 1];
  };

  // Кнопка "Наверх"
  var bodyElement = document.querySelector('body');
  var wrapperElement = bodyElement.querySelector('.wrapper');
  var arrowTopElement = bodyElement.querySelector('.arrow-top');

  var bodyCoord = bodyElement.getBoundingClientRect();
  var wrapperCoord = wrapperElement.getBoundingClientRect();
  arrowTopElement.style.right = bodyCoord.right - wrapperCoord.right + ARROW_PADDING + 'px';

  arrowTopElement.addEventListener('click', function () {
    window.scrollTo(pageXOffset, 0);
  });

  window.addEventListener('scroll', function () {
    arrowTopElement.hidden = (pageYOffset < document.documentElement.clientHeight);
  });

  // Метод выполнения функций по нажатию ESC
  var pressEscKey = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  window.util = {
    date: currentDate,
    convert: convertMonth,
    pressEsc: pressEscKey
  };
})();
