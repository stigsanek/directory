# Справочник сотрудников организации

Универсальный шаблон для создания справочника небольшой организации. Для использования приложения не нужен сервер, так как все данные хранятся в виде объекта JavaScript.

---

_Не удаляйте и не обращайте внимание на файл:_ `.editorconfig`.

---

### Памятка по использованию

#### 1. Скопируйте репозиторий к себе на компьютер

Внесите изменения в текстовые данные разметки (файл `index.html`) для создания структуры подразделений организации. При смене названий подразделений не забудьте прописать аналогичное название в атрибуте `value` тега `<button>`.

#### 2. Для наполнения справочника сотрудниками в файле `js/data.js` сформируйте массив объектов по шаблону:

```
{
  photo: 'img/photos/default_avatar.png',
  name: 'Дейенерис Таргариен',
  departament: 'Руководство',
  position: 'Директор',
  rang: 1,
  phone: '100'
}
```
Свойство `rang` ранжируется от меньшего к большему, т.е. у самой высокой должности `rang` равен 1.
Возможно ранжирование секретарей сразу после руководителей путем проставления соответсвующего `rang` и добавлением свойства `secretary` с произвольным текстом.

#### 3. Добавьте фото сотрудников в каталог `img/photo`

По умолчанию используется стандартный аватар `default_avatar.png`.
