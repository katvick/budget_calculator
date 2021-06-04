// 3. УРОК. Скрипт для тестовых данных

// 3.1) Пишем модуль для подстановки тестовых данных в форму, чтобы не заоплнять ее каждый раз вручную для тестирования

var generateTestData = (function() {

    // Задача - создать неких список из доходов и расходов, а потом случайно их подставлять в поля
    var ExampleItem = function(type, desc, sum) {
        this.type = type,
        this.desc = desc,
        this.sum = sum
    }

    var testDate = [
        new ExampleItem('inc', 'Зарплата', 1245),
        new ExampleItem('inc', 'Фриланс', 820),
        new ExampleItem('inc', 'Партнерская программа', 110),
        new ExampleItem('inc', 'Продажи digital', 90),
        new ExampleItem('exp', 'Рента', 400),
        new ExampleItem('exp', 'Бензин', 60),
        new ExampleItem('exp', 'Продукты', 300),
        new ExampleItem('exp', 'Развлечения', 100),
    ];

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    getRandomInt(testDate.length);

    // вставляем тестовый пример в UI
    function insertInUI() {
        var random = getRandomInt(testDate.length);
        var randomItem = testDate[random];

        // размещаем тестовые данные в разметке
        // сначала находим их
        document.querySelector('#input__type').value = randomItem.type;
        document.querySelector('#input__description').value = randomItem.desc;
        document.querySelector('#input__value').value = randomItem.sum;
        
    }

    return {
        init: insertInUI
    }
    

})();
    
generateTestData.init();