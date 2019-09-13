'use strict';

(function () {
  var ARROW_PADDING = 15;
  var MONTH = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  var bodyElement = document.querySelector('body');

  // Определение текущей даты
  var date = new Date();
  var currenDate = date.toLocaleDateString().toString().slice(0, 5);

  // Функция конвертации даты в текстовый формат
  var convertMonth = function (element) {
    var day = element.slice(0, 2);
    var month = element.slice(3, 5);
    if (month[0] === '0') {
      month = element.slice(4, 5);
    }
    return day + ' ' + MONTH[month - 1];
  };

  // Обработчик определения дня рождения сотрудников
  var modalBirthdayElement = bodyElement.querySelector('#birthday');
  var birthdayWorkers = [];

  var onDocumentDOMContentLoaded = function () {
    if (birthdayWorkers.length !== 0) {
      var templateBirthdayElement = bodyElement.querySelector('#worker-birthday').content.querySelector('.birthday-container');
      var closeBirthdayElement = modalBirthdayElement.querySelector('.button-close');
      var overlayBirthdayElement = modalBirthdayElement.querySelector('.overlay');

      birthdayWorkers.forEach(item => {
        var newBirthdayElement = templateBirthdayElement.cloneNode(true);
        newBirthdayElement.querySelector('.birthday-container__img').style = 'background-image: url("' + item.photo + '");';
        newBirthdayElement.querySelector('.birthday-container__text').textContent = item.name;
        closeBirthdayElement.insertAdjacentElement('beforebegin', newBirthdayElement);
      });

      var onButtonBirthdayClick = function () {
        modalBirthdayElement.style.display = 'none';
        closeBirthdayElement.removeEventListener('click', onButtonBirthdayClick);
        overlayBirthdayElement.removeEventListener('click', onButtonBirthdayClick);
      };

      closeBirthdayElement.addEventListener('click', onButtonBirthdayClick);
      overlayBirthdayElement.addEventListener('click', onButtonBirthdayClick);
      modalBirthdayElement.style.display = 'block';
    }

    document.removeEventListener('DOMContentLoaded', onDocumentDOMContentLoaded);
  };

  document.addEventListener('DOMContentLoaded', onDocumentDOMContentLoaded);

  // Функция создания карточки сотрудника
  var workerListElement = bodyElement.querySelector('.worker-list');
  var templateOfficerElement = bodyElement.querySelector('#worker').content.querySelector('.worker-item');

  var createWorker = function (element) {
    var newWorkerElement = templateOfficerElement.cloneNode(true);
    var avatarElement = newWorkerElement.querySelector('.worker-item__avatar');
    avatarElement.style = 'background-image: url("' + element.photo + '");';
    newWorkerElement.querySelector('.worker-item__name').textContent = element.name;
    newWorkerElement.querySelector('.worker-item__position').textContent = element.position;
    if (element.secretary) {
      newWorkerElement.querySelector('.worker-item__departament').textContent = element.secretary;
    } else {
      newWorkerElement.querySelector('.worker-item__departament').textContent = element.departament;
    }
    newWorkerElement.querySelector('.worker-item__phone').textContent = element.phone;

    var birthdayElement = newWorkerElement.querySelector('.worker-item__birthday');

    if (element.birthday) {
      birthdayElement.textContent = convertMonth(element.birthday);
      if (element.birthday === currenDate) {
        birthdayWorkers.push(element);
      }
    } else {
      birthdayElement.remove();
    }

    // Функция открытия большой фотографии
    var onAvatarClick = function () {
      insertWorker(element);
    };

    avatarElement.addEventListener('click', onAvatarClick);

    return newWorkerElement;
  };

  // Функция создания большой фотографии
  var templateBigPhotoElement = bodyElement.querySelector('#photo').content.querySelector('.big-photo');

  var createPhoto = function (element) {
    var newPhotoElement = templateBigPhotoElement.cloneNode(true);
    newPhotoElement.querySelector('.big-photo__container').style = 'background-image: url("' + element.photo + '");';

    // Функция закрытия большой фотографии
    var closePhotoElement = newPhotoElement.querySelector('.button-close');
    var overlayPhotoElement = newPhotoElement.querySelector('.overlay');

    var onPhotoCloseClick = function () {
      newPhotoElement.remove();
      closePhotoElement.removeEventListener('click', onPhotoCloseClick);
      overlayPhotoElement.removeEventListener('click', onPhotoCloseClick);
    };

    closePhotoElement.addEventListener('click', onPhotoCloseClick);
    overlayPhotoElement.addEventListener('click', onPhotoCloseClick);

    return newPhotoElement;
  };

  // Функция рендеринга всех карточек и запись объектов в массив
  var workerLists = [];
  var wrapperElement = bodyElement.querySelector('.wrapper');

  var insertWorker = function (data) {
    var newNodeElement = null;

    if (Array.isArray(data)) {
      var fragmentElement = document.createDocumentFragment();

      data.forEach(item => {
          newNodeElement = createWorker(item);
          fragmentElement.appendChild(newNodeElement);
          workerLists.push(newNodeElement);
      });

      workerListElement.appendChild(fragmentElement);
    } else {
      newNodeElement = createPhoto(data);
      wrapperElement.insertAdjacentElement('afterEnd', newNodeElement);
    }
  };

  // Функция удаления карточек из DOM
  var removeWorker = function () {
    workerLists.forEach(item => {
      item.remove();
    });
  };

  // Cортировка данных по должности, алфавиту и ренедеринг на страницу
  var data = window.data.workers;
  var sortData = data.sort((itemFirst, itemSecond) => {
    return (itemFirst.rang > itemSecond.rang) - (itemSecond.rang > itemFirst.rang) || (itemSecond.name < itemFirst.name) - (itemFirst.name < itemSecond.name);
  });
  insertWorker(sortData);

  // Функции предупреждаего сообщения пользователю о возможностях поиска
  var inputTextElement = bodyElement.querySelector('.main-form__search');
  var modalAttentionElement = bodyElement.querySelector('#attention');
  var closeAttentionElement = modalAttentionElement.querySelector('.button-close');
  var overlayAttentionElement = modalAttentionElement.querySelector('.overlay');
  var searchModalFlag = false;

  var onInputTextFocus = function () {
    modalAttentionElement.style.display = 'block';
    searchModalFlag = true;
    inputTextElement.removeEventListener('focus', onInputTextFocus);
  };

  var onButtonAttentionClick = function () {
    modalAttentionElement.style.display = 'none';
    closeAttentionElement.removeEventListener('click', onButtonAttentionClick);
    overlayAttentionElement.removeEventListener('click', onButtonAttentionClick);
  };

  // Функция фильтрации сотрудников по отделам
  var filterButtonsElement = bodyElement.querySelectorAll('.filter-button__item');
  var btnAllElement = bodyElement.querySelector('#all');

  var onFilterButtonClick = function (evt, departament) {
    if (!searchModalFlag) {
      inputTextElement.addEventListener('focus', onInputTextFocus);
      closeAttentionElement.addEventListener('click', onButtonAttentionClick);
      overlayAttentionElement.addEventListener('click', onButtonAttentionClick);
    }

    if (evt.target === btnAllElement) {
      removeWorker();
      insertWorker(sortData);
      inputTextElement.removeEventListener('focus', onInputTextFocus);
    } else {
      var filterData = sortData.filter(item => {
        return item.departament === departament;
      });
      removeWorker();
      insertWorker(filterData);
    }

    filterButtonsElement.forEach(item => {
      item.classList.remove('filter-button__item--active');
    });
    evt.target.classList.add('filter-button__item--active');
  };

  filterButtonsElement.forEach(item => {
    item.addEventListener('click', function (evt) {
      onFilterButtonClick(evt, item.value);
    });
  });

  // Функции поиска сотрудников и отображения модального окна в случае если информация не найдена
  var seacrhButtonElement = bodyElement.querySelector('.main-form__button');
  var modalSeacrhElement = bodyElement.querySelector('#search');
  var closeSeacrhElement = modalSeacrhElement.querySelector('.button-close');
  var overlaySeacrhElement = modalSeacrhElement.querySelector('.overlay');

  var showModal = function () {
    modalSeacrhElement.style.display = 'block';
  };

  var onButtonSeacrhClick = function () {
    modalSeacrhElement.style.display = 'none';
    closeSeacrhElement.removeEventListener('click', onButtonSeacrhClick);
    overlaySeacrhElement.removeEventListener('click', onButtonSeacrhClick);
  };

  var onSearchButtonClick = function () {
    var requiredElement = workerListElement.querySelectorAll('.worker-item__name');
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
      }
    }

    // Функция отмены выделения найденного текста
    var onDocumentMouseDown = function () {
      requiredElement.forEach(item => {
        item.classList.remove('worker-item__name--mark');
      });
      document.removeEventListener('mousedown', onDocumentMouseDown);
    };

    if (targetElement) {
      document.addEventListener('mousedown', onDocumentMouseDown);
    }
  };

  seacrhButtonElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    onSearchButtonClick();
  });

  // Кнопка "Наверх"
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
})();
