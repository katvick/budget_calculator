// Контроллер будет управлять и данными, и внешним видом, поэтому он будет принимать в себя и model, и view и работать с ними

// Все действия оформляем в методы

// 1.1) Создаем файлы под каждый модуль
var controller = (function(budgetCtrl, uiCtrl) {
    // budgetCtrl - модуль Model
    // uiCtrl - модуль View

    // 4.1) В контроллере создаем отдельную функцию setupEventListeners по прослушке событий и запуску других функций
    var setupEventListeners = function() {
        // 2.2) В контроллере получаем селекторы и записываем в переменную DOM. Получаем значение DOMstrings
        var DOM = uiCtrl.getDomstrings();
        // 2.3) В контроллере обрабатываем submit формы и запускаем ф-ю ctrlAddItem()
        document.querySelector(DOM.form).addEventListener('submit', ctrlAddItem);

        // клик по таблице с доходами и расходами
        document.querySelector(DOM.budgetTable).addEventListener('click', ctrlDeleteItem);
    }

    // ф-ия, кот. обновляет проценты у каждой записи расходов
    function updatePercentages() {

        // 1. Посчитаем проценты для каждой записи типа Expense
        budgetCtrl.calculatePercentages();
        budgetCtrl.test();

        // 2. Получаем данные по процентам из модели
        // [ [0, 15], [1, 25], [2, 50] ] -> [id, %]
        var idsAndPercents = budgetCtrl.getAllIdsAndPercentages();

        // 3. Обновляем UI с новыми процентами
        uiCtrl.updateItemsPercentages(idsAndPercents);

    }

    // ф-я, кот. срабатывает при отправке формы
    function ctrlAddItem(event) {
        // отмена стандартного поведения
        event.preventDefault();

        // 1. Получить данные с формы
        var input = uiCtrl.getInput();

        // Проверка на пустые поля
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

            // 2. Добавить полученные данные в модель
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Добавить "запись" в UI (т.е. выводит ее на страницу)
            uiCtrl.renderListItem(newItem, input.type);
            uiCtrl.clearFields();
            generateTestData.init();

            // 4. Посчитать бюджет и вывести его в интерфейс
            updateBudget();

            // 5. Пересчитали проценты
            updatePercentages();

        } // endIf
        

    }

    function ctrlDeleteItem(event) {
        var itemID, splitID, type, ID


        if (event.target.closest('.item__remove')) {

            // 1. Находим id записи, которую надо удалить
            itemID = event.target.closest('li.budget-list__item').id; // inc-0
            // метод split разбивает строчку на массив по заданному разделителю
            splitID = itemID.split('-') // inc-0 => ['inc', '0']
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 2. Удаляем запись из модели
            budgetCtrl.deleteItem(type, ID);
            
            // 3. Удаляем запись из шаблона
            uiCtrl.deleteListItem(itemID);

            // 4. Пересчитать бюджет
            updateBudget();

            // 5. Пересчитали проценты
            updatePercentages();

        }
    }

    function updateBudget() {
        // 1. Рассчитать бюджет в модели
        budgetCtrl.calculateBudget();

        // 2. Получить рассчитанный бюджет из модели
        var budgetObj = budgetCtrl.getBudget();

        // 3. Отобразить бюджет в шаблоне
        uiCtrl.updateBudget(budgetObj);
    }

    

    return {
        // 2) Возвращаем ф-ю setupEventListeners е через return как метод init
        init: function() {
            console.log('App started');
            uiCtrl.displayMonth();
            setupEventListeners();
            uiCtrl.updateBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
        }
    }    
    
})(modelController, viewController); // 1.2) В контроллер передаем модель и шаблон

controller.init();