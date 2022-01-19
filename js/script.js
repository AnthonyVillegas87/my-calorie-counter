// Storage Controller




//Item Controller
const ItemCtrl = (function() {
    //Item Constructor
    const Item = function(id, name, calories) {
      this.id = id;
      this.name = name;
      this.calories = calories;

    }

    //Data / State Constructor
    const data = {
        items: [
            // {id: 0, name: 'Steak Dinner', calories: 800},
            // {id: 1, name: 'Cookie', calories: 400},
            // {id: 2, name: 'Eggs', calories: 300}


        ],
        currentItem: null,
        totalCalories: 0
    }
    return {
        getItems: function() {
           return data.items;
        },
        addItem: function(name, calories) {
            let ID;
          // create id for each item
          if(data.items.length > 0) {
              ID = data.items[data.items.length - 1].id + 1;
          } else {
             ID = 0;
          }

          //Calories parsed to integer
           calories = parseInt(calories);
          //instantiate a new item
             newItem = new Item(ID, name, calories);
            //Add item to array
            data.items.push(newItem);
            return newItem
        },
       logData: function() {
           return data
       }
    }
})();





//UI Controller
const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
    }

    return {
        populateItemList: function(items) {
           let html = '';
           items.forEach(function(item) {
               html += `<li id="item-${item.id}" class="collection-item">
                            <strong>${item.name}: </strong><em>${item.calories} calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item material-icons">create</i>
                            </a>
                        </li>`;
           });
           //insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function() {
           return {
               name: document.querySelector(UISelectors.itemNameInput).value,
               calories: document.querySelector(UISelectors.itemCaloriesInput).value
           }
        },
        addListItem: function(item) {
            //Show list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Create li element
            const li = document.createElement('li');
            //add clas name
            li.className = 'collection-item';
            //add element id
            li.id = `item-${item.id}`;
            //add html
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item material-icons">create</i>
                            </a>`;
            //append li
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

        },
        clearInput: function() {
           document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';

        },
        hideList: function() {
          document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        getSelectors: function() {
            return UISelectors;
        }
    }
})();





//App Controller
const AppCtrl = (function(ItemCtrl, UICtrl) {
  //Init Event Listeners
  const initEventListeners = function() {
      //Get UI Selectors
      const UISelectors = UICtrl.getSelectors();
      //Add Event Listeners for items
      document.querySelector(UISelectors.addBtn).addEventListener('click', itemSubmit)
  }
  //Add itemSubmit()
    const itemSubmit = function(e) {
        //get form input from UI Controller
        const input = UICtrl.getItemInput();
        //check for form input
        if(input.name !== '' && input.calories !== '') {
            //add item
          const newItem = ItemCtrl.addItem(input.name, input.calories);
          //add input to UI list
            UICtrl.addListItem(newItem);
            //clear form fields
            UICtrl.clearInput();
        }
      e.preventDefault();
    }


return {
    init: function() {

        //Fetch items from data structure
        const items = ItemCtrl.getItems();
        //Check for items
        if(items.length === 0){
            UICtrl.hideList();
        } else {
            UICtrl.populateItemList(items);
        }
        //Populate list with items
        UICtrl.populateItemList(items);

        //Init event listeners
        initEventListeners();

    }
}
})(ItemCtrl, UICtrl);

AppCtrl.init();