'use strict';

(function () {
  var bodyElement = document.querySelector('body');

  // Функция рендеринга всех карточек и запись объектов в массив
  var workerLists = [];
  var wrapperElement = bodyElement.querySelector('.wrapper');
  var workerListElement = bodyElement.querySelector('.worker-list');

  var insertWorker = function (data) {
    var newNodeElement = null;

    if (Array.isArray(data)) {
      var fragmentElement = document.createDocumentFragment();

      data.forEach(function (item) {
        newNodeElement = window.worker.create(item);
        fragmentElement.appendChild(newNodeElement);
        workerLists.push(newNodeElement);
      });

      workerListElement.appendChild(fragmentElement);
    } else {
      newNodeElement = window.worker.showPhoto(data);
      wrapperElement.insertAdjacentElement('afterEnd', newNodeElement);
    }
  };

  // Функция удаления карточек из DOM
  var removeWorker = function () {
    workerLists.forEach(function (item) {
      item.remove();
    });
  };

  // Cортировка данных по должности, алфавиту и ренедеринг на страницу
  var data = window.data.workers;
  var sortData = data.sort(function (itemFirst, itemSecond) {
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
    window.util.block(closeAttentionElement);
    inputTextElement.removeEventListener('focus', onInputTextFocus);
  };

  var onButtonAttentionClick = function () {
    modalAttentionElement.style.display = 'none';
    closeAttentionElement.removeEventListener('click', onButtonAttentionClick);
    overlayAttentionElement.removeEventListener('click', onButtonAttentionClick);
    document.removeEventListener('keydown', onModalAttentionEscPress);
    window.util.unblock();
  };

  var onModalAttentionEscPress = function (evt) {
    window.util.pressEsc(evt, onButtonAttentionClick);
  };

  // Функция фильтрации сотрудников по отделам
  var filterButtonsElement = bodyElement.querySelectorAll('.filter-button__item');
  var btnAllElement = bodyElement.querySelector('#all');

  var onFilterButtonClick = function (evt, departament) {
    if (!searchModalFlag) {
      inputTextElement.addEventListener('focus', onInputTextFocus);
      closeAttentionElement.addEventListener('click', onButtonAttentionClick);
      overlayAttentionElement.addEventListener('click', onButtonAttentionClick);
      document.addEventListener('keydown', onModalAttentionEscPress);
    }

    if (evt.target === btnAllElement) {
      removeWorker();
      insertWorker(sortData);
      inputTextElement.removeEventListener('focus', onInputTextFocus);
    } else {
      var filterData = sortData.filter(function (item) {
        return item.departament === departament;
      });
      removeWorker();
      insertWorker(filterData);
    }

    filterButtonsElement.forEach(function (item) {
      item.classList.remove('filter-button__item--active');
    });
    evt.target.classList.add('filter-button__item--active');
  };

  filterButtonsElement.forEach(function (item) {
    item.addEventListener('click', function (evt) {
      onFilterButtonClick(evt, item.value);
    });
  });

  window.main = {
    render: insertWorker
  };
})();
