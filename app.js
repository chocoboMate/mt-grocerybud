// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');
//
// edit option
let editElement;
let editFlag = false;
let editID = '';
//
// ****** EVENT LISTENERS **********
//
// submit form
form.addEventListener('submit', addItem);

// clear items
clearBtn.addEventListener('click', clearItems);
//

//Load items
window.addEventListener('DOMContentLoaded', setupItems);
//
//
//
//
//
/////////////////////////////////////////////
// ****** FUNCTIONS **********
//
// Add Item
function addItem(e) {
  e.preventDefault(); //this prevents the form to send it automatically in server

  const value = grocery.value;
  const id = new Date().getTime().toString();

  // if (value !== '' && editFlag === false) {
  //   console.log('add item to the list');
  // } else if (value !== '' && editFlag === true) {
  //   console.log('edit item');
  // } else {
  //   console.log('empty');
  // }
  //
  // shortcut of truthy from the code above. Remember that in JS the value is always either truthy or falsy.
  // Example is '' empty string is falsy
  //
  // if value is true/not empty and editFlag is false
  if (value && !editFlag) {
    createListItem(id, value);
    //
    // display alert
    displayAlert(`Item added to the list`, `success`);

    // show grocery container
    container.classList.add('show-container');

    // add to local storage
    addToLocalStorage(id, value);

    // set back to default
    setBackToDefault();
  }
  //
  //
  //
  //
  //
  // if value is true/not empty and editFlag is true
  else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert(`value changed`, `success`);
    // edit local storage
    editLocalStorage(editID, value);

    setBackToDefault();
  }
  //
  //
  //
  //
  //
  // empty value
  else {
    displayAlert(`Please Enter Value`, `danger`);
  }
} //end of Add item
//
//
// ****************************************
// display Alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // Remove the alert after 1 seconds..this is to not show the alert infinitely
  setTimeout(function () {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}
// ****************************************
//
// clear items
function clearItems() {
  const items = document.querySelectorAll('.grocery-item');
  // console.log(items);
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }

  container.classList.remove('show-container');
  displayAlert(`empty list`, `danger`);
  setBackToDefault();
  localStorage.removeItem('list');
}
//
// ****************************************
// delete function
function deleteItem(e) {
  // the element is the grocery-item and the e here is the delete button
  const element = e.currentTarget.parentElement.parentElement;
  //
  const id = element.dataset.id; //will get the id from the dynamically html code we created before

  list.removeChild(element);
  //
  if (list.children.length === 0) {
    //if there is no item then do not the container
    container.classList.remove('show-container');
  }
  //

  displayAlert(`item removed`, `danger`);
  setBackToDefault();

  // remove from local storage
  removeFromLocalStorage(id);
}
//
// ****************************************
// edit function
function editItem(e) {
  // the element is the grocery-item and the e here is the delete button
  const element = e.currentTarget.parentElement.parentElement;

  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;

  // set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;

  submitBtn.textContent = 'edit'; //change the text in the button
}

//
// ****************************************
// setback to default
function setBackToDefault() {
  grocery.value = '';
  editFlag = false;
  editID = '';
  submitBtn.textContent = 'submit';
}
//
//
//
// /////////////////////////////////////////////////
// ****** LOCAL STORAGE **********
// add item to local storage
function addToLocalStorage(id, value) {
  // const grocery = {id:id, value:value}
  // this is the shorthand for the code above since we have same property and value name
  const grocery = { id, value };

  // let items = localStorage.getItem('list')
  //   ? JSON.parse(localStorage.getItem('list'))
  //   : [];
  let items = getLocalStorage();
  console.log(items);

  items.push(grocery);
  localStorage.setItem('list', JSON.stringify(items));
}
//
//
// ***********************
// remove from local storage
function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem('list', JSON.stringify(items));
}
//
//
//
//
// edit local storage
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  //
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  //
  localStorage.setItem('list', JSON.stringify(items));
}
//
//
//
//
//
//
function getLocalStorage() {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}
// ////////////////////////////////////////////////////
// ****** SETUP ITEMS **********
function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });

    container.classList.add('show-container');
  }
}

function createListItem(id, value) {
  const element = document.createElement('article');
  // add class
  element.classList.add('grocery-item');
  // add id
  const attr = document.createAttribute('data-id');
  attr.value = id;
  // set the id to attribute node
  element.setAttributeNode(attr);
  // set the innerHTML of element dynamically
  element.innerHTML = `
<p class="title">${value}</p>
<div class="btn-container">
  <button type="button" class="edit-btn">
    <i class="fas fa-edit"></i>
  </button>

  <button type="button" class="delete-btn">
    <i class="fas fa-trash"></i>
  </button>
</div>`;
  //
  //NOTE
  // we did this because we create the html codes dynamically, and we can only access/use the buttons
  // after the code above
  const deleteBtn = element.querySelector('.delete-btn');
  const editBtn = element.querySelector('.edit-btn');

  deleteBtn.addEventListener('click', deleteItem);
  editBtn.addEventListener('click', editItem);
  //
  //
  // append the element to the grocery list
  list.appendChild(element);
}
