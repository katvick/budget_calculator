// 1.1) Создаем файлы под каждый модуль
var modelController = (function() {

    // 5.1) Создаем структуру данных в модели
    // Конструктор для объектов типа доход
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // Конструктор для объектов типа расход
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1; // -1 это флаг для нас, что значение еще установлено
    }

    // метод для расчета процентов
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }

    // метод для возврата значений процентов
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }


    function addItem(type, desc, val) {
        var newItem, ID;
        ID = 0;
        
        // Генерируем ID
        if (data.allItems[type].length > 0) {
            // находим индекс последнего эл-та
            var lastIndex = data.allItems[type].length - 1;
            // получаем id следующего эл-та
            ID = data.allItems[type][lastIndex].id + 1;
        }

        // В зависимости от типа записи используем соответствующий конструктор и создаем объект
        if (type === 'inc') {
            newItem = new Income(ID, desc, parseFloat(val))
            // parseFloat конвертирует в число с плавающей точкой
        } else if (type === 'exp') {
            newItem = new Expense(ID, desc, parseFloat(val))
        }

        // записываем "запись"/объект в нашу структуру данных/переменную data
        data.allItems[type].push(newItem);

        // Возвращаем новый объект
        return newItem;
    }

    function deleteItem(type, id) {

        // inc, id = 4
        // data.allItems[inc][item][id]
        // ids = [0, 2, 4, 5, 10]
        // index = 2

        // 1. Находим запись по id в массиве с доходами или расходами
        // map возвращает массив
        // var ids = data.allItems[type].map(function(item) {
        //     return item.id
        // })
        
        // // Находим индекс записи
        // var index = ids.indexOf(id);

        // АЛЬТЕРНАТИВНЫЙ СПОСОБ РЕШЕНИЯ
        // Для поиска индекса в массиве есть хороший метод findIndex:
        const index = data.allItems[type].findIndex(item => item.id === id)
        // Если функция возвращает true, поиск прерывается и возвращается индекс item. Если ничего не найдено, возвращается undefined

        // 2. Удаляем найденную запись из массива по индексу
        if (index != -1) {
            data.allItems[type].splice(index, 1);
        }

    }

    // рассчитываем общую сумму доходов или расходов
    function calculateTotalSum(type) {
        var sum = 0;
        
        // метод map, как и forEach принимает в себя ф-ию callback
        // data.allItems[type].forEach(function(item) {
        //     sum = sum + item.value;
        // });

        // АЛЬТЕРНАТИВНЫЙ СПОСОБ РЕШЕНИЯ
        // 1. Для функции calculateTotalSum хорошо подойдет метод массива reduce:
        var sum = data.allItems[type].reduce((acc, item) => acc + item.value, 0)
        // acc – результат предыдущего вызова ф-ии
        // "0" в конце – это initial (значение, которому равно acc при первом вызове ф-ии)

        return sum;
    }

    // рассчитываем бюджет
    function calculateBudget() {
        // Посчитаем все Доходы
        data.totals.inc = calculateTotalSum('inc')

        // Посчитаем все Расходы
        data.totals.exp = calculateTotalSum('exp')

        // Посчитаем общий бюджет
        data.budget = data.totals.inc - data.totals.exp;

        // Посчитаем % для расходов
        if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else {
            data.percentage = -1;
        }

    }

    // возвращаем наружу данные по бюджету: totals, budget, percent
    function getBudget() {
        return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage,
        }
    }

    // для каждого item рассчитываем проценты
    function calculatePercentages() {
        data.allItems.exp.forEach(function(item) {
            item.calcPercentage(data.totals.inc);
        });
    }

    // вовзращаем список id и процентов, кот. нужно обновить в view
    function getAllIdsAndPercentages() {
        // [ [0, 15], [1, 25], [2, 50] ] -> [id, %]
        
        var allPerc = data.allItems.exp.map(function(item) {
            // map запускает цикл обхода массива и возвращает новый массив, т.е. в данном случае обходим каждый item и вохвращем массив [id, %]
            return [item.id, item.getPercentage()];
        });

        return allPerc;
        
    }

    // Переменная, в которой будет находится объект со всеми данными нашего приложения
    var data = {
        // св-во, включающее все доходы и расходы
        allItems: {
            inc: [],
            exp: []
        },
        // св-во, отвечающее за ВСЕГО доходов и ВСЕГО расходов 
        totals: {
            inc: 0,
            exp: 0
        },

        budget: 0,
        percentage: -1
        // -1 часто используется во многих встроенных ф-ях как обозначение незаданного св-ва

    }

    return {
        addItem: addItem,
        calculateBudget: calculateBudget,
        getBudget: getBudget,
        deleteItem: deleteItem,
        calculatePercentages: calculatePercentages,
        getAllIdsAndPercentages: getAllIdsAndPercentages,
        // ф-я для проверки data
        test: function() {
		    console.log("TCL: modelController -> data", data)
        }
    }
    
})();