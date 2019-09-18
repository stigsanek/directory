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

  // Методы блокировки/разблокировки фокуса на элементах при взаимодействии с модальным окном
  var allElement = null;
  var onElementFocus = null;
  var lastFocus = null;

  var restrictFocus = function (focusElement) {
    onElementFocus = function (evt) {
      if (evt.target !== focusElement) {
        evt.stopPropagation();
        focusElement.focus();
      }
    };

    allElement = document.querySelectorAll('*');
    allElement.forEach(function (item) {
      item.addEventListener('focus', onElementFocus);
    });

    lastFocus = document.activeElement;
  };

  var returnFocus = function () {
    allElement.forEach(function (item) {
      item.removeEventListener('focus', onElementFocus);
    });

    lastFocus.focus();
  };

  // Методы отключения/включения прокрутки документа при всплытии модального окна
  var htmlElement = document.querySelector('html');
  var addOverflow = function () {
    bodyElement.classList.add('modal-open');
    htmlElement.classList.add('modal-open');
  };

  var hiddenOverflow = function () {
    bodyElement.classList.remove('modal-open');
    htmlElement.classList.remove('modal-open');
  };

  window.util = {
    date: currentDate,
    convert: convertMonth,
    pressEsc: pressEscKey,
    blockFocus: restrictFocus,
    unblockFocus: returnFocus,
    blockOverflow: addOverflow,
    unblockOverflow: hiddenOverflow
  };
})();
