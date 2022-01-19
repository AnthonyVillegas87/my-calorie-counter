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
            {id: 0, name: 'Steak Dinner', calories: 800},
            {id: 1, name: 'Cookie', calories: 400},
            {id: 2, name: 'Eggs', calories: 300}


        ],
        currentItem: null,
        totalCalories: 0
    }
    return {
        getItems: function() {
           return data.items;
        },
       logData: function() {
           return data
       }
    }
})();





//UI Controller
const UICtrl = (function() {
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
            document.querySelector('#item-list').innerHTML = html;
        }
    }
})();





//App Controller
const AppCtrl = (function(ItemCtrl, UICtrl) {
return {
    init: function() {



        //Fetch items from data structure
        const items = ItemCtrl.getItems();

        //Populate list with items
        UICtrl.populateItemList(items);

    }
}
})(ItemCtrl, UICtrl);

AppCtrl.init();