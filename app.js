// storage controller
const StorageCtrl = (function(){
    
    //public methods
    return {
        storeItem: function(item){
            let items = [];

            if(localStorage.getItem('items') !== null){
                items = JSON.parse(localStorage.getItem('items'));
            }

            items.push(item);

            localStorage.setItem('items', JSON.stringify(items));

        },

        getItemsFromStorage: function(){
            let items = [];

            if(localStorage.getItem('items') !== null){
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },

        updateList: function(targetItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(item.id === targetItem.id){
                    items.splice(index, 1, targetItem);
                }
            })

            localStorage.setItem('items', JSON.stringify(items));
        },

        removeItem: function(target){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){

                if(item.id === target.id){
                    items.splice(index, 1);
                }
            })

            localStorage.setItem('items', JSON.stringify(items));
        },

        clearEverything: function(){

            localStorage.removeItem('items');
        }
    }
})();

//item controller
const ItemCtrl = (function(){
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //data structure / state
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currItem: null,
        totalCalories: 0
    }

    return {
        logData: function(){
            return data;
        },

        getItems: function(){
            return data.items;
        },

        getItemById: function(id){
            return data.items[id];

        },

        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(function(item){
                total += parseInt(item.calories);
            })

            data.totalCalories = total;

            return data.totalCalories;
        },

        addItem: function(name, calories){

            let id = 0;

            //create id
            if(data.items.length > 0){
                id = data.items[data.items.length - 1].id + 1;
            }else{
                id = 0;
            }

            //calroies to number
            calories = parseInt(calories);

            //create new item
            newItem = new Item(id, name, calories);

            //add to array
            data.items.push(newItem);

            return newItem;
        },

        updateItem: function(name, calories){
            let id = data.currItem.id;

            data.items[id].name = name;
            data.items[id].calories = parseInt(calories);

            return data.items[id];
            
        },

        deleteItem: function(item){
            let id = item.id;
            data.items.splice(id, 1);
            data.currItem = null;
            
            return data.items;
        },

        clearAll: function(){
            data.items = [];
            data.currItem = null;
            data.calories = 0;

            return data.items;
        },

        setCurrItem: function(item){
            data.currItem = item;
        },

        getCurrItem: function(){
            return data.currItem;
        }
    }

})();



//ui controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        delBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCal: '.total-calories',
        listItems: '#item-list li'
    }

    return {
        populateItemList: function(items){
            let html = '';

            items.forEach(function(item){
                html += `<li id="item-${item.id}" class="collection-item">
                            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>
                         </li>`
            });

            //insert to html
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getSelectors: function(){
            return UISelectors;
        },

        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        addListItem: function(item){

            document.querySelector(UISelectors.itemList).style.display = 'block';

            //create li element and add to ui
            let li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>`;
            

            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },

        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrItem().calories;

            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.delBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },

        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.delBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCal).textContent = totalCalories;
        },

        deleteListItem: function(item){
            let targetID = `#item-${item.id}`;

            let itemRemove = document.querySelector(targetID);
            itemRemove.remove();


        },

        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            })
        },

        clearEverything: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            })
        }
    }
})();



//app controller
const AppCtrl = (function(ItemCtrl, UICtrl, StorageCtrl){
    //console.log(ItemCtrl.logData());

    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();

        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        document.addEventListener('keypress', function(e){
            if( e.which === 13 || e.key === 13){
                e.preventDefault();
                return false;
            }
        });
    
        //event delegation for edits
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    
        //update btn
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateClick);
    
        //back btn
        document.querySelector(UISelectors.backBtn).addEventListener('click', backUp);
    
        //delete event
        document.querySelector(UISelectors.delBtn).addEventListener('click', itemDeleteSubmit);

        //clear all event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAll);
    }

    //add item submit
    const itemAddSubmit = function(e){
        
        const input = UICtrl.getItemInput();

        //console.log(input);

        //check for input
        if(input.name !== '' && input.calories !== '')
        {
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //add item to ui list
            UICtrl.addListItem(newItem);

            //add to storage
            StorageCtrl.storeItem(newItem);

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //add total to ui
            UICtrl.showTotalCalories(totalCalories);

            //clear inputs
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    const itemEditClick = function(e){
       
        if(e.target.tagName !== 'I')
            return;
        
        //edit if icon clicked
        else{
            //get list item id
            const listId = e.target.parentNode.parentNode.id;

            //break into array
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);

            const itemToEdit = ItemCtrl.getItemById(id);

            //set item
            ItemCtrl.setCurrItem(itemToEdit);

            //add item to form
            UICtrl.addItemToForm();
            
        }

        e.preventDefault();
    }

    //update event listener
    const itemUpdateClick = function(e){

        //get item input
        const input = UICtrl.getItemInput();

        //update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(updatedItem);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total to ui
        UICtrl.showTotalCalories(totalCalories);

        //update storage
        StorageCtrl.updateList(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    //back btn event
    const backUp = function(){
        UICtrl.clearEditState();
    }

    //delete btn event
    const itemDeleteSubmit = function(e){
        //get item
        const targetItem = ItemCtrl.getCurrItem();

        //delete item from data structure
        ItemCtrl.deleteItem(targetItem);

        //remove from ui
        UICtrl.deleteListItem(targetItem);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total to ui
        UICtrl.showTotalCalories(totalCalories);

        //delete from storage
        StorageCtrl.removeItem(targetItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    //clear all event
    const clearAll = function(e){
        //clear from data structure
        ItemCtrl.clearAll();

        //clear from ui
        UICtrl.clearEverything();
        UICtrl.hideList();


        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total to ui
        UICtrl.showTotalCalories(totalCalories);

        //clear storage
        StorageCtrl.clearEverything();

        UICtrl.clearEditState();

        e.preventDefault();
    }

    return {
        init: function(){
            UICtrl.clearEditState();

            const items = ItemCtrl.getItems();

            //check if items
            if(items.length === 0){
                UICtrl.hideList();
            }else
                UICtrl.populateItemList(items);
            
            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //add total to ui
            UICtrl.showTotalCalories(totalCalories);

            //load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl, StorageCtrl);


AppCtrl.init();