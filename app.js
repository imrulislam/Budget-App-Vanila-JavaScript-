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

    // Data Structure for income and expense item
    var data = {
        allItem: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
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
    }


    return {
        getInput: function () {
            // This will return the value of the input type of the three field
            return {
                type: document.querySelector(DomString.inputType).value,
                description: document.querySelector(DomString.inputDescription).value,
                value: document.querySelector(DomString.inputValue).value
            }
        },
        addListItem: function (obj, type) {
            var html, newHtml;

            if (type === 'inc') {
                element = DomString.incomeList;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DomString.expenseList;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
    };


    // Add item function in app controlller
    var ctrlAddItem = function () {
        var input, newItem;

        input = UICtrl.getInput();
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        UICtrl.addListItem(newItem, input.type);
    };


    return {
        init: function () {
            console.log('Application Started')
            setEventListner();
        }
    }
})(budgetController, UIController);

appController.init();