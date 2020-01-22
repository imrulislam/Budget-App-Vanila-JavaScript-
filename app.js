// BUDGET CONTROLLER
var budgetController = (function () {

    // Income constructor function
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // Expense constructor function
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // Calculate the total of income or expense
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItem[type].forEach(function (current) {
            sum += current.value;
        });

        data.totals[type] = sum;
    }

    // Data Structure for income and expense item
    var data = {
        allItem: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function (type, des, val) {
            var newItem, Id;

            if (data.allItem[type].length > 0) {
                Id = data.allItem[type][data.allItem[type].length - 1].id + 1;
            } else {
                Id = 0;
            }

            if (type === 'exp') {
                newItem = new Expense(Id, des, val);
            } else if (type === 'inc') {
                newItem = new Income(Id, des, val);
            }

            data.allItem[type].push(newItem);
            return newItem;
        },

        deleteItem: function (type, id) {
            var ids, index;

            ids = data.allItem[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItem[type].splice(index, 1);
            }


        },
        calculateBudget: function () {
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function () {
            console.log(data);
        }
    }

})();


// UI CONTROLLER
var UIController = (function () {

    //Reuseable Dom string for useing multiple controller
    var DomString = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn',
        incomeList: '.income__list',
        expenseList: '.expenses__list',
        budgetLable: '.budget__value',
        incomeLable: '.budget__income--value',
        expenseLable: '.budget__expenses--value',
        percentageLable: '.budget__expenses--percentage',
        container: '.container'
    }


    return {
        getInput: function () {
            // This will return the value of the input type of the three field
            return {
                type: document.querySelector(DomString.inputType).value,
                description: document.querySelector(DomString.inputDescription).value,
                value: parseFloat(document.querySelector(DomString.inputValue).value)
            }
        },
        addListItem: function (obj, type) {
            var html, newHtml;

            if (type === 'inc') {
                element = DomString.incomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DomString.expenseList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function (itemId) {
            var el;
            el = document.getElementById(itemId);
            el.parentNode.removeChild(el);
        },
        clearInputFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DomString.inputDescription + ', ' + DomString.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();
        },

        displayBudget: function (obj) {
            document.querySelector(DomString.budgetLable).textContent = obj.budget;
            document.querySelector(DomString.incomeLable).textContent = obj.totalInc;
            document.querySelector(DomString.expenseLable).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DomString.percentageLable).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DomString.percentageLable).textContent = '-';
            }
        },
        getDomString: function () {
            return DomString
        }
    }

})();


// APP CONTROLLER
var appController = (function (budgetCtrl, UICtrl) {
    var setEventListner = function () {
        //Get All Dom String from UI Controller
        var uiDom = UICtrl.getDomString();

        // Add Button Click event listner
        document.querySelector(uiDom.addButton).addEventListener('click', ctrlAddItem);

        // Enter button press event listner
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(uiDom.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function () {
        var budget;
        // Calculate the  budget 
        budgetCtrl.calculateBudget();

        budget = budgetCtrl.getBudget();

        UICtrl.displayBudget(budget);

    }

    var updatePercentages = function () {

        //Calculate Percentages

        //Read percentage from the budget controller

        // Update the user interface
    }


    // Add item function in app controlller
    var ctrlAddItem = function () {
        var input, newItem;

        //  Get the field input data
        input = UICtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            //  Add New item to through the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // List item created through the UI controller
            UICtrl.addListItem(newItem, input.type);

            // Clear input fields after inster data
            UICtrl.clearInputFields();

            // Calculate and update budget
            updateBudget();

            //Update percentage
            updatePercentages();
        }
    };


    // Delete and item from the ui
    var ctrlDeleteItem = function (event) {
        var itemId, splitId, type, ID;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            ID = parseFloat(splitId[1]);

            budgetCtrl.deleteItem(type, ID);

            UICtrl.deleteListItem(itemId);

            // Update Budget
            updateBudget();

            //Update percentage
            updatePercentages();
        }
    }


    return {
        init: function () {
            console.log('Application Started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setEventListner();

        }
    }
})(budgetController, UIController);

appController.init();