const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const itemFilter = document.getElementById("filter");
const clearBtn = document.getElementById("clear");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

const displayItems = () => {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  resetUI();
};

const onAddItemSubmit = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;

  //  Validate Input
  if (newItem === "") {
    alert("Please type something");
    return;
  }

  // Check for Edit Mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();

    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("That Item Already Exists!");
      itemInput.value = "";
      return;
    }
  }

  // Create Item DOM Element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  // Check if there is items in the listo to return the UI
  resetUI();

  // Clears the input values after the item was added
  itemInput.value = "";
};

const addItemToDOM = (item) => {
  //  Create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  // Add UI to the DOM
  itemList.appendChild(li);
};

const addItemToStorage = (item) => {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);

  // Convert to JSON String and set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

// Create Button Component
const createButton = (classes) => {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
};

// Create Icon Component
const createIcon = (classes) => {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
};

// Get Items from storage

const getItemsFromStorage = () => {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
};

//  onClickItem Function
const onClickItem = (e) => {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
};

// Check if Item Already Exists
const checkIfItemExists = (item) => {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
};

// Edit Mode
const setItemToEdit = (item) => {
  isEditMode = true;

  itemList.querySelectorAll("li").forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  formBtn.innerHTML = "<i class='fa-solid fa-pen'></i> Update Item";
  itemInput.value = item.textContent;
  formBtn.classList.add("edit-mode-button");
};

// Remove Items

const removeItem = (item) => {
  if (confirm("Are you Sure?")) {
    // Remove Item from DOM
    item.remove();

    // Removes Item from local storage
    removeItemFromStorage(item.textContent);

    resetUI();
  }
};

const removeItemFromStorage = (item) => {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i != item);

  // Re-set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

// Clear all items

const clearItems = (e) => {
  // Clear from DOM
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // Clear from local storage
  localStorage.removeItem("items");

  resetUI();
};

// Filter Items
const filterItems = (e) => {
  const itens = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();

  itens.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
};

// Check UI for items

const resetUI = (e) => {
  itemInput.value = "";

  const itens = itemList.querySelectorAll("li");

  if (itens.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }

  formBtn.innerHTML = "<i class='fa-solid fa-plus'></i> Add Item";
  formBtn.classList.remove("edit-mode-button");
  itemList.querySelectorAll("li").forEach((i) => i.classList.remove("edit-mode"));

  isEditMode = false;
};

// Init APP
function init() {
  // Event Listener

  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  resetUI();
}

init();
