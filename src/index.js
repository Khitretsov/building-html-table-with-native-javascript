// Надеюсь, первой строкой кода я не нарушил условия "чистый джаваскрипт без сторонних библиотек",
// ведь стандартные средства ES6, как "import", всё равно конвертируются с помощью "babel" в
// commonJS, где взамен названного "import" ставится "require".
var data = require('./data.json');

// eslint-disable-next-line no-console
// console.log(b);

// Ф-ция по отрисовке таблицы по массиву данных
function createTable(data) {
  var tblBody = document.createElement('tbody');

  // Сделаем шапку таблицы
  function title(item) {
    var a = data[item];
    var row = document.createElement('tr');
    for (var key in a) {
      var cell = document.createElement('td');
      var cellText = document.createTextNode(key);
      cell.appendChild(cellText);
      cell.setAttribute('class', 'thead');
      row.appendChild(cell);
    }
    tblBody.appendChild(row);
  }
  title(0);

  // Нарисуем таблицу по данным
  data.forEach(function(item) {
    var row = document.createElement('tr'); // требует "AppendCild"
    for (var key in item) {
      var cell = document.createElement('td');
      var cellText = document.createTextNode(item[key]);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }
    tblBody.appendChild(row);
  });
  // tbl.appendChild(tableHead); // Для "title2" и "title3"
  tbl.appendChild(tblBody);
  // tbl.setAttribute('border', '2');
}

// Ф-ция пагинации
function pagination(data, NumberOfTable) {
  var lenghtOfData = data.length; // Узнаем количество строк
  var rowsInTable = 8; // Количество отображаемых строк
  quantityOfTables =
    lenghtOfData / rowsInTable - (lenghtOfData / rowsInTable) % 1 + 1; // Количество таблиц

  // Создание кнопок навигации
  // Первая кнопка
  var buttonPrevious = document.createElement('button');
  buttonPrevious.setAttribute('id', 0);
  buttonPrevious.innerHTML = 'Previous';
  buttonArea.appendChild(buttonPrevious);
  // Деланье кнопки не работающей
  if (NumberOfTable == 1) {
    buttonPrevious.setAttribute('disabled', '');
    buttonPrevious.setAttribute('class', 'disabled');
  }
  buttonPrevious.addEventListener('click', function() {
    previousNext(true); // Previous();
  });
  // Порядковые кнопки
  for (var i = 0; i < quantityOfTables; i++) {
    var button = document.createElement('button');
    button.setAttribute('id', i + 1);
    button.addEventListener('click', function() {
      newTable(this);
    });
    button.innerHTML = i + 1;
    buttonArea.appendChild(button);
    document.body.appendChild(buttonArea);
  }
  var asd = document.getElementById(NumberOfTable); // Делает не работающей кнопку, что соответствует текущей таблице
  asd.setAttribute('disabled', ''); // Наверно, стоит присваивать класс
  asd.setAttribute('class', 'page');
  // Последняя кнопка
  var buttonNext = document.createElement('button');
  buttonNext.setAttribute('id', quantityOfTables + 1);
  buttonNext.innerHTML = 'Next';
  buttonArea.appendChild(buttonNext);
  // Деланье кнопки не работающей
  if (NumberOfTable == quantityOfTables) {
    buttonNext.setAttribute('disabled', '');
    buttonNext.setAttribute('class', 'disabled');
  }
  buttonNext.addEventListener('click', function() {
    previousNext(false); // Next();
  });

  // Нарезка массивов из основного массива значений. По этим массивам сторются таблицы, переключаемые по кнопкам пагинации
  var startIndex = (NumberOfTable - 1) * rowsInTable; // С какого индекса беруться значения
  var finishIndex = NumberOfTable * rowsInTable;
  var ArrayForTable = data.slice(startIndex, finishIndex).concat(); // Массив, по которому будет строится таблица
  return ArrayForTable;
}

// Ф-ция удаления нарисованных таблиц
function remove() {
  var cd = document.getElementsByClassName('grid'); // Удаляем уже нарисованную таблицу
  while (cd.firstChild) {
    cd.removeChild(cd.firstChild);
  }
  var dc = document.getElementsByClassName('pagin'); // Удаляем старые кнопки
  while (dc.firstChild) {
    dc.removeChild(dc.firstChild);
  }
}

// Подф-ция для определения, какая порядковая кнопка для пагинации была нажата, и для
// отрисовки новой таблицы, соответствующей нажатой кнопке
function newTable(obj) {
  NumberOfTable = +obj.id;
  remove();
  var e = pagination(data, NumberOfTable); // Рисуем новую таблицу
  createTable(e);
}

// Ф-ция по управлению крайними кнопками: "Previous" и "Next"
function previousNext(t) {
  if (t) {
    if (NumberOfTable != 1) {
      NumberOfTable = NumberOfTable - 1;
      remove();
      var p = pagination(data, NumberOfTable);
      createTable(p);
    }
  } else {
    if (NumberOfTable != quantityOfTables) {
      NumberOfTable = NumberOfTable + 1;
      remove();
      var u = pagination(data, NumberOfTable);
      createTable(u);
    }
  }
}

// Программа по созданию таблицы, вызывающая ф-ции, которые выше
function print(data) {
  quantityOfTables = undefined;
  NumberOfTable = 1;

  var t = pagination(data, NumberOfTable);
  createTable(t);

  var table = document.getElementsByTagName('table')[0];
  table.onclick = function(event) {
    sortData(event, data);
  };
}

// Ф-ция сортировки
function sortData(event, data) {
  var target = event.target; // где был клик?
  var g = target.getAttribute('class');
  if (g == 'thead') {
    var index = target.cellIndex;
    // Узнаем имя свойства, соответствующего колонке
    var properties = Object.keys(data[0]);
    nameOfProperty = properties[index];
    var rtrt = data[0];
    if (typeof rtrt[nameOfProperty] == 'string') {
      if (indexOfSort == index) {
        directionOfSort = -1;
        data.sort(compareSymbol);
        directionOfSort = 1;
        indexOfSort = undefined;
      } else {
        data.sort(compareSymbol);
        indexOfSort = index;
      }
    } else {
      if (indexOfSort == index) {
        directionOfSort = -1;
        data.sort(compare);
        directionOfSort = 1;
        indexOfSort = undefined;
      } else {
        data.sort(compare);
        indexOfSort = index;
      }
    }
    remove();
    print(data);
  }
}
// Две ф-ции для коректных сортировок
var nameOfProperty = undefined;
var indexOfSort = undefined;
var directionOfSort = 1; // Если отрицательное, то в обратном порядке
function compare(a, b) {
  if (a[nameOfProperty] > b[nameOfProperty]) return 1 * directionOfSort;
  if (a[nameOfProperty] < b[nameOfProperty]) return -1 * directionOfSort;
}
function compareSymbol(a, b) {
  if (a[nameOfProperty] > b[nameOfProperty]) return 1 * directionOfSort;
  if (a[nameOfProperty] < b[nameOfProperty]) return -1 * directionOfSort;
}

// Ф-ция поиска
function filter() {
  var array = [];
  var txt = document.getElementById('search').value;
  if (txt == '') {
    return;
  }
  txt = txt.toLowerCase();
  data.forEach(function(item) {
    for (var key in item) {
      var dfdf = 0;
      if (typeof item[key] == 'string') {
        var textOfProperty = item[key];
        textOfProperty = textOfProperty.toLowerCase();
        if (textOfProperty.indexOf(txt) > -1) {
          dfdf = dfdf + 1;
        }
      }
      if (dfdf != 0) {
        array = array.concat(item);
      }
    }
  });
  remove();
  print(array);
}

////////////////////////////////////////////////////////////////////////////////////////////////

var body = document.getElementsByTagName('body')[0];

// Создаём графу поиска
var searchArea = document.createElement('div');
searchArea.setAttribute('class', 'searchArea');
searchArea.innerHTML = 'Search: ';
var search = document.createElement('input');
search.setAttribute('id', 'search');
var searchButton = document.createElement('button');
searchButton.innerHTML = 'Search';
searchButton.addEventListener('click', function() {
  filter();
});
searchArea.appendChild(search);
searchArea.appendChild(searchButton);
body.appendChild(searchArea);
// Создадим тег таблицы

var tbl = document.createElement('table');
tbl.setAttribute('class', 'grid');
body.appendChild(tbl);

// Создадим тег "див" для кнопок навигации
var buttonArea = document.createElement('Div');
buttonArea.setAttribute('class', 'pagin');

var quantityOfTables;
var NumberOfTable = 1;

print(data);

//////////////////////////////////////////////////////////////////////

// eslint-disable-next-line no-console
// console.log(ArrayForTable);

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

/*
class HelloWorld {
  message = 'Hello World';
  print = () => this.message;
}

const hello = new HelloWorld();
// eslint-disable-next-line no-console
console.log(
  `%c ${hello.print()}`,
  `color: green; font-size:48px; weight: bold`,
);
*/
/*
function Previous() {
  if (NumberOfTable != 1) {
    NumberOfTable = NumberOfTable - 1;
    remove();
    var t = pagination(data, NumberOfTable);
    createTable(t);
  }
}

function Next() {
  if (NumberOfTable != quantityOfTables) {
    NumberOfTable = NumberOfTable + 1;
    remove();
    var t = pagination(data, NumberOfTable);
    createTable(t);
  }
}
*/
/*
  function title(item) {
    var a = data[item];
    var row = document.createElement('tr');
    for (var key in a) {
      var cell = document.createElement('td');
      var cellText = document.createTextNode(key);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }
    tblBody.appendChild(row);
  }
  title(0);
  */
/*
  var tableHead = document.createElement('thead');
  function title2(item) {
    var a = data[item];
    for (var key in a) {
      var cell = document.createElement('th');
      var cellText = document.createTextNode(key);
      cell.appendChild(cellText);
      tableHead.appendChild(cell);
    }
  }
  title2(0);
  */
/*
  var tableHead = document.createElement('thead');
  function title3(item) {
    var a = Object.keys(data[item]);
    for (var i = 0; i < a.length - 1; i++) {
      var cell = document.createElement('th');
      var cellText = document.createTextNode(a[i]);
      cell.appendChild(cellText);
      tableHead.appendChild(cell);
    }
  }
  title3(0);
  */
// var cd = document.getElementsByTagName('tbody')[0];
// cd.parentNode.removeChild(cd);
