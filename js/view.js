// 1.1) Создаем файлы под каждый модуль
var viewController = (function() {

    // 2.1) Переносим селекторы в VIEW контроллер, возвращаем их оттуда
    var DOMstrings = {
        inputType: '#input__type',
        inputDescription: '#input__description',
        inputValue: '#input__value',

        form: '#budget-form',

        incomeContainer: '#income__list',
        expenseContainer: '#expenses__list',

        budgetLabel: '#budget-value',
        incomLabel: '#income-label',
        expensesLabel: '#expense-label',
        expensesPercentLabel: '#expense-percent-label',

        budgetTable: '#budget-table',

        monthLabel: '#month',
        yearLabel: '#year'
    }

    // 2.3) Во view создаем и возвращаем функцию getInput для сбора и передачи данных с формы
    // Создаем метод, который получает данные с полей и возвращает их в виде объекта
    function getInput() {
        return {
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: document.querySelector(DOMstrings.inputValue).value
        }
    }

    // function formatNumber(num, type) {
    //     var numSplit, int, dec, newInt, resultNumber;
        
    //     /*
    //     + или - перед числом в зависимости от типа числа
    //     два знака после точки, десятые и сотые
    //     50 -> 50.00
    //     87.56984549211 -> 87.56
    //     */
    //     num = Math.abs(num) // abs возвращает абсолютное число -> Math.abs(-10) = 10
    //     // Приводим к 2-м цифрам после точки
    //     num = num.toFixed(2);

    //     /*
    //     123000 -> 123,000.00
    //     */
    //     numSplit = num.split('.'); // 45.78 -> [45, 78]
    //     // Целая часть
    //     int = numSplit[0]; // 45
    //     // Десятые, от исходной строки
    //     dec = numSplit[1]; // 78

    //     // Расставляем запятые 
    //     // Исходя из длины числа делим его на части по 3 цифры
    //     // Если длина номера больше, чем 3 цифры, значит ставим запятые
    //     if (int.length > 3) {
    //         newInt = '';
            
    //         // 1 2 3 4 5 6 7 8 9 -- число по цифрам
    //         // 0 1 2 3 4 5 6 7 8 -- по индексам в массиве

    //         // Нам нужно понять, сколько раз будет по 3 цифры -> делим свойство length на 3
    //         for (var i = 0; i < int.length / 3; i++) {
                
    //             // формируем новую сттроку с номером
    //             newInt =
    //                 // Добавляем запятую каждые 3 цифры
    //             ',' +
    //             // Вырезанный кусок из исходной строки
    //             // Метод substring() возвращает подстроку строки между двумя индексами, или от одного индекса и до конца строки.
    //             int.substring(int.length - 3 * (i + 1), int.length - 3 * i) +
    //             // Конец строки, первая часть
    //             newInt;

    //         }

    //         // Убираем запятую в начале, если она есть
    //         if (newInt[0] === ',') {
    //             newInt = newInt.substring(1);
    //         }

    //     // Если исходное число равно 0, то в новую строку записываем 0
    //     } else if (int === '0') {
    //         newInt = '0';
    //     // Если исходное целое число имеет 3 и менее символов
    //     } else {
    //         newInt = int;
    //     }

    //     resultNumber = newInt + '.' + dec;

    //     if (num == 0) {
    //         resultNumber = 0;
    //     } else if (type === 'exp') {
    //         resultNumber = '- ' + resultNumber;
    //     } else if (type === 'inc') {
    //         resultNumber = '+ ' + resultNumber;
    //     }

    //     return resultNumber;

    // }

    /* АЛЬТЕРНАТИВНЫЙ СПОСОБ ФОРМАТИРОВАНИЯ ЧИСЛА */ 
    function formatNumber(num, type) {
        var [int, dec] = Math.abs(num).toFixed(2).split('.');

        // Intl.NumberFormat форматирует числа в соответствии с нужным языком.
        var newInt = new Intl.NumberFormat('en-GB').format(int);
        var resultNumber = newInt + '.' + dec + ' \u20BD';

        if (int != '0') {
            resultNumber = type ? (type === 'exp' ? '- ' + resultNumber : '+ ' + resultNumber) : '';
        }

        return resultNumber;
    }

    // пишем метод, который будет генерировать шаблон/кусок html-кода, который мы будем вставлять в разметку
    function renderListItem(obj, type) {
        var containerElement, html, newHtml;

        if(type === 'inc') {
            containerElement = DOMstrings.incomeContainer;
            html = `<li id="inc-${obj.id}" class="budget-list__item item item--income">
                        <div class="item__title">${obj.description}</div>
                        <div class="item__right">
                            <div class="item__amount">${formatNumber(obj.value, type)}</div>
                            <button class="item__remove">
                                <img
                                    src="./img/circle-green.svg"
                                    alt="delete"
                                />
                            </button>
                        </div>
                    </li>`
        } else {
            containerElement = DOMstrings.expenseContainer;
            html = `<li id="exp-${obj.id}" class="budget-list__item item item--expense">
                        <div class="item__title">${obj.description}</div>
                        <div class="item__right">
                            <div class="item__amount">
                                ${formatNumber(obj.value, type)}
                                <div class="item__badge">
                                    <div class="item__percent badge badge--dark">
                                        15%
                                    </div>
                                </div>
                            </div>
                            <button class="item__remove">
                                <img src="./img/circle-red.svg" alt="delete" />
                            </button>
                        </div>
                    </li>`
            // указали placeholder %id%, %description% и %value
        }

        // вставляем разметку в DOM
        // newHtml = html.replace("%id%", obj.id);
        // newHtml = newHtml.replace("%description%", obj.description);
        // newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
        
        document.querySelector(containerElement).insertAdjacentHTML('beforeend', html)
    }

    // В view создаем функцию clearFields для очистки полей формы
    function clearFields() {
        var inputDesc, inputVal;

        inputDesc = document.querySelector(DOMstrings.inputDescription);
        inputVal = document.querySelector(DOMstrings.inputValue);

        inputDesc.value = '';
        inputDesc.focus();
        inputVal.value = '';
    }

    function updateBudget(obj) {

        if (obj.budget > 0) {
            type = 'inc'
        } else {
            type = 'exp'
        }

        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomLabel).textContent = formatNumber(obj.totalInc, 'inc');
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

        if (obj.percentage > 0) {
            document.querySelector(DOMstrings.expensesPercentLabel).textContent = `${obj.percentage}%`;
        } else {
            document.querySelector(DOMstrings.expensesPercentLabel).textContent = '--';
        }

    }

    function deleteListItem(itemID) {
        document.getElementById(itemID).remove();
    }

    function updateItemsPercentages(items) {
        items.forEach(function(item) {
            // item - [id, %]
            // выводим каждую запись массива во вермя прохода

            // находим блок с процентами внутри текущей записи item
            var el = document.getElementById(`exp-${item[0]}`).querySelector('.item__percent')


            if (item[1] >= 0) {
                // Если есть, то показываем блок с %
                el.parentElement.style.display = 'block';

                // Меняем контент внутри бейджа с процентами
                el.textContent = item[1] + '%';
            } else {
                // Если есть, то показываем блок с %
                el.parentElement.style.display = 'none';
            }

        })
    }

    function displayMonth() {
        var now, year, month, monthArr;

        now = new Date();
        year = now.getFullYear(); // 2020
        month = now.getMonth(); // индекс месяца, начиная с 0

        monthArr = [
            'Январь', 'Февраль', 'Март',
            'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь',
            'Октябрь', 'Ноябрь', 'Декабрь',
        ];

        month = monthArr[month];

        document.querySelector(DOMstrings.monthLabel).innerText = month;
        document.querySelector(DOMstrings.yearLabel).innerText = year;
    }

    return {
        getInput: getInput,
        renderListItem: renderListItem,
        clearFields: clearFields,
        updateBudget: updateBudget,
        deleteListItem: deleteListItem,
        updateItemsPercentages: updateItemsPercentages,
        displayMonth: displayMonth,
        getDomstrings() {
            return DOMstrings;
        }
    }
    
})();