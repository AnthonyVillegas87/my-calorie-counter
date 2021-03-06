// ======================   Storage Controller
const StorageCtrl = (function() {
    //Public Methods
  return {
      storeItem: function(item) {
          let items;
          //Check if any items are in ls
          if(localStorage.getItem('items') === null) {
              items = [];
              items.push(item);
            //Set ls
              localStorage.setItem('items', JSON.stringify(items));
          } else {
              items = JSON.parse(localStorage.getItem('items'));
              //Push item
              items.push(item);
              //Reset ls
              localStorage.setItem('items', JSON.stringify(items));
          }
      },
      getItemsFromStorage: function() {
          let items;
          if(localStorage.getItem('items') === null) {
              items = [];
          } else {
              items = JSON.parse(localStorage.getItem('items'));
          }
          return items;
      },
      updateItemStorage: function(updatedItem) {
          let items = JSON.parse(localStorage.getItem('items'));
          items.forEach(function(item, index) {
              if(updatedItem.id === item.id) {
                  items.splice(index, 1, updatedItem);
              }
          });
          localStorage.setItem('items', JSON.stringify(items));
      },
      deleteItemFromStorage: function(id) {
          let items = JSON.parse(localStorage.getItem('items'));
          items.forEach(function(item, index) {
              if(id === item.id) {
                  items.splice(index, 1);
              }
          });
          localStorage.setItem('items', JSON.stringify(items));
      },
      clearAllStorage: function() {
          localStorage.removeItem('items');
      }
  }
})();



//===========================    Item Controller
const ItemCtrl = (function() {
    //Item Constructor
    const Item = function(id, name, calories) {
      this.id = id;
      this.name = name;
      this.calories = calories;

    }

    //Data / State Constructor
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
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

        getItemById: function(id) {
            let found =null;
            //Loop thru items
            data.items.forEach(function(item) {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories) {
          //Parse calories 'STRING' into 'Integer'
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item) {
                if(item.id === data.currentItem.id) {
                   item.name = name;
                   item.calories = calories;
                   found = item;
                }
            });
            return found;
        },
        deleteItem: function(id) {
            //Get item ids
           const ids = data.items.map(function(item) {
                return item.id;
            });

           //GET INDEX
            const index = ids.indexOf(id);
            //Remove by splice()
            data.items.splice(index, 1);
        },
        clearItems: function() {
            data.items = [];
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
           return data.currentItem;
        },

        getTotalCalories: function() {
          let total = 0;
          //loop thru items to add to cals
          data.items.forEach(function(item) {
              total += item.calories;
          });
          //set total for cals
          data.totalCalories = total;
          return data.totalCalories;
        },
       logData: function() {
           return data
       }
    }
})();





//========================   UI Controller
const UICtrl = (function() {
    const UISelectors = {
        listItems: '#item-list li',
        itemList: '#item-list',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn'
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
        updateListItem: function(item) {
           let listItems = document.querySelectorAll(UISelectors.listItems);

           //Turn listItems into array
           listItems = Array.from(listItems);
           listItems.forEach(function(listItem) {
               const itemId = listItem.getAttribute('id');
               if(itemId === `item-${item.id}`) {
                   document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item material-icons">create</i>
                            </a>`;
               }
           }) ;


        },
        deleteListItem: function(id) {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        clearInput: function() {
           document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';

        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function() {
           let listItems = document.querySelectorAll(UISelectors.listItems);

           //Turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function(item) {
                item.remove();
            })
        },
        hideList: function() {
          document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
           document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
           UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';

        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';

        },
        getSelectors: function() {
            return UISelectors;
        }
    }
})();





//================================   App Controller
const AppCtrl = (function(ItemCtrl, UICtrl, StorageCtrl) {
  //Init Event Listeners
  const initEventListeners = function() {
      //Get UI Selectors
      const UISelectors = UICtrl.getSelectors();
      //Add Event Listeners for items
      document.querySelector(UISelectors.addBtn).addEventListener('click', itemSubmit);

      //Disable submit on <ENTER>
      document.addEventListener('keypress', function(e) {
          console.log(e);
          if(e.key === 'U+000A'||e.key ==='Enter') {
              e.preventDefault();
            return false;
          }
      })

      //Edit icon event listener
      document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

      //Update Item Event
      document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

      //Delete Item Event
      document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);


      //Back button event
      document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

      //Clear Items event
      document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItems);


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

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //append data to UI
            UICtrl.showTotalCalories(totalCalories);

            //Persist to Local Storage
                StorageCtrl.storeItem(newItem);
            //clear form fields
            UICtrl.clearInput();
        }
      e.preventDefault();
    }

    //Click edit item()
    const itemEditClick = function(e) {
      if(e.target.classList.contains('edit-item')) {
        // Get list-item id
        const listId = e.target.parentNode.parentNode.id;

        const listIdArr = listId.split('-');

        //Get integer Id
          const id = parseInt(listIdArr[1]);
          //Get list item to edit
          const itemEdit = ItemCtrl.getItemById(id);
          //Set current item
          ItemCtrl.setCurrentItem(itemEdit);
          //Add item to form
          UICtrl.addItemToForm();
      }
      e.preventDefault();
    }
    // Submit/Update item
    const itemUpdateSubmit = function(e) {
      //Get item to update
       const input = UICtrl.getItemInput();
       // Update an item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update UI
        UICtrl.updateListItem(updatedItem);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //append data to UI
        UICtrl.showTotalCalories(totalCalories);

        //Update LS
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

      e.preventDefault();
    }
    //Delete Item
    const itemDeleteSubmit = function(e)  {
      //GET CURRENT ITEM
        const currentItem = ItemCtrl.getCurrentItem();
        // DELETE FROM DATA STRUCTURE
        ItemCtrl.deleteItem(currentItem.id);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //append data to UI
        UICtrl.showTotalCalories(totalCalories);

        //Delete from ls
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        //DELETE FROM UI
        UICtrl.deleteListItem(currentItem.id);
      e.preventDefault();
    }

    const clearAllItems = function() {
      //clear all items from data structure
        ItemCtrl.clearItems();

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //append data to UI
        UICtrl.showTotalCalories(totalCalories);

        //Remove from UI
        UICtrl.removeItems();

        //clear from ls
        StorageCtrl.clearAllStorage();

        //Hide UL
        UICtrl.hideList();
    }


return {
    init: function() {
        //Set init state
        UICtrl.clearEditState();

        //Fetch items from data structure
        const items = ItemCtrl.getItems();
        //Check for items
        if(items.length === 0){
            UICtrl.hideList();
        } else {
            //Populate list with items
            UICtrl.populateItemList(items);
        }


        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //append data to UI
        UICtrl.showTotalCalories(totalCalories);


        //Init event listeners
        initEventListeners();

    }
}
})(ItemCtrl, UICtrl, StorageCtrl);

AppCtrl.init();