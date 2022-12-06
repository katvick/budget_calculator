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