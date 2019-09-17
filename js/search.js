'use strict';

(function () {
  // Функции поиска сотрудников
  var inputTextElement = document.querySelector('.main-form__search');
  var seacrhButtonElement = document.querySelector('.main-form__button');
  var modalSeacrhElement = document.querySelector('#search');
  var closeSeacrhElement = modalSeacrhElement.querySelector('.button-close');
  var overlaySeacrhElement = modalSeacrhElement.querySelector('.overlay');

  var showModal = function () {
    modalSeacrhElement.style.display = 'block';
  };

  var onButtonSeacrhClick = function () {
    modalSeacrhElement.style.display = 'none';
    closeSeacrhElement.removeEventListener('click', onButtonSeacrhClick);
    overlaySeacrhElement.removeEventListener('click', onButtonSeacrhClick);
    document.removeEventListener('keydown', onModalSeacrhElementEscPress);
  };

  var onModalSeacrhElementEscPress = function (evt) {
    window.util.pressEsc(evt, onButtonSeacrhClick)
  };

  var onSearchButtonClick = function () {
    var requiredElement = document.querySelectorAll('.worker-item__name');
    var searсhQuery = inputTextElement.value.trim();

    if (searсhQuery) {
      var userQuery = searсhQuery.toLowerCase();
      var targetElement = null;
      var searchFlag = false;

      for (var i = 0; i < requiredElement.length; i++) {
        var index = requiredElement[i].innerText.toLowerCase().indexOf(userQuery);

        if (index !== -1) {
          targetElement = requiredElement[i];
          targetElement.classList.add('worker-item__name--mark');
          targetElement.scrollIntoView({block: "center"});
          searchFlag = true;
        }
      }

      if (!searchFlag) {
        showModal();
        closeSeacrhElement.addEventListener('click', onButtonSeacrhClick);
        overlaySeacrhElement.addEventListener('click', onButtonSeacrhClick);
        document.addEventListener('keydown', onModalSeacrhElementEscPress);
      }
    }

    // Функция отмены выделения найденного текста
    var onRequiredElementNoneMark = function () {
      requiredElement.forEach(item => {
        item.classList.remove('worker-item__name--mark');
      });
      document.removeEventListener('mousedown', onRequiredElementNoneMark);
      inputTextElement.removeEventListener('input', onRequiredElementNoneMark);
    };

    if (targetElement) {
      document.addEventListener('mousedown', onRequiredElementNoneMark);
      inputTextElement.addEventListener('input', onRequiredElementNoneMark);
    }
  };

  seacrhButtonElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    onSearchButtonClick();
  });
})();
