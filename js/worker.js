'use strict';

(function () {
  // Обработчик определения дня рождения сотрудников
  var modalBirthdayElement = document.querySelector('#birthday');
  var birthdayWorkers = [];

  var onDocumentDOMContentLoaded = function () {
    if (birthdayWorkers.length !== 0) {
      var templateBirthdayElement = document.querySelector('#worker-birthday').content.querySelector('.birthday-container');
      var closeBirthdayElement = modalBirthdayElement.querySelector('.button-close');
      var overlayBirthdayElement = modalBirthdayElement.querySelector('.overlay');

      birthdayWorkers.forEach(function (item) {
        var newBirthdayElement = templateBirthdayElement.cloneNode(true);
        newBirthdayElement.querySelector('.birthday-container__img').style = 'background-image: url("' + item.photo + '");';
        newBirthdayElement.querySelector('.birthday-container__text').textContent = item.name;
        closeBirthdayElement.insertAdjacentElement('beforebegin', newBirthdayElement);
      });

      var onButtonBirthdayClick = function () {
        modalBirthdayElement.style.display = 'none';
        closeBirthdayElement.removeEventListener('click', onButtonBirthdayClick);
        overlayBirthdayElement.removeEventListener('click', onButtonBirthdayClick);
        document.removeEventListener('keydown', onModalBirthdayElementEscPress);
      };

      var onModalBirthdayElementEscPress = function (evt) {
        window.util.pressEsc(evt, onButtonBirthdayClick);
      };

      closeBirthdayElement.addEventListener('click', onButtonBirthdayClick);
      overlayBirthdayElement.addEventListener('click', onButtonBirthdayClick);
      document.addEventListener('keydown', onModalBirthdayElementEscPress);
      modalBirthdayElement.style.display = 'block';
    }

    document.removeEventListener('DOMContentLoaded', onDocumentDOMContentLoaded);
  };

  document.addEventListener('DOMContentLoaded', onDocumentDOMContentLoaded);

  // Метод создания карточки сотрудника
  var templateOfficerElement = document.querySelector('#worker').content.querySelector('.worker-item');
  var currentPhoto = null;

  var createWorker = function (element) {
    var newWorkerElement = templateOfficerElement.cloneNode(true);
    var avatarElement = newWorkerElement.querySelector('.worker-item__avatar');
    avatarElement.style = 'background-image: url("' + element.photo + '");';
    var nameElement = newWorkerElement.querySelector('.worker-item__name');
    nameElement.textContent = element.name;
    newWorkerElement.querySelector('.worker-item__position').textContent = element.position;

    if (element.secretary) {
      newWorkerElement.querySelector('.worker-item__departament').textContent = element.secretary;
    } else {
      newWorkerElement.querySelector('.worker-item__departament').textContent = element.departament;
    }

    var phoneElement = newWorkerElement.querySelector('.worker-item__phone');
    if (element.phone) {
      phoneElement.textContent = element.phone;
    } else {
      phoneElement.remove();
    }

    var birthdayElement = newWorkerElement.querySelector('.worker-item__birthday');

    if (element.birthday) {
      birthdayElement.textContent = window.util.convert(element.birthday);
      if (element.birthday === window.util.date) {
        nameElement.innerHTML += '<span class="worker-item__name--ico"></span>';
        birthdayWorkers.push(element);
      }
    } else {
      birthdayElement.remove();
    }

    // Функция открытия большой фотографии
    var onAvatarClick = function () {
      if (currentPhoto) {
        currentPhoto.remove();
      }
      window.main.render(element);
    };

    avatarElement.addEventListener('click', onAvatarClick);

    return newWorkerElement;
  };

  // Метод создания большой фотографии
  var templateBigPhotoElement = document.querySelector('#photo').content.querySelector('.big-photo');

  var createPhoto = function (element) {
    var newPhotoElement = templateBigPhotoElement.cloneNode(true);
    newPhotoElement.querySelector('.big-photo__container').style = 'background-image: url("' + element.photo + '");';
    currentPhoto = newPhotoElement;

    // Функция закрытия большой фотографии
    var closePhotoElement = newPhotoElement.querySelector('.button-close');
    var overlayPhotoElement = newPhotoElement.querySelector('.overlay');

    var onPhotoCloseClick = function () {
      newPhotoElement.remove();
      closePhotoElement.removeEventListener('click', onPhotoCloseClick);
      overlayPhotoElement.removeEventListener('click', onPhotoCloseClick);
      document.removeEventListener('keydown', onPhotoEscPress);
      currentPhoto = null;
    };

    var onPhotoEscPress = function (evt) {
      window.util.pressEsc(evt, onPhotoCloseClick);
    };

    closePhotoElement.addEventListener('click', onPhotoCloseClick);
    overlayPhotoElement.addEventListener('click', onPhotoCloseClick);
    document.addEventListener('keydown', onPhotoEscPress);

    return newPhotoElement;
  };

  window.worker = {
    create: createWorker,
    showPhoto: createPhoto
  };
})();
