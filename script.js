const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const itemFilter = document.getElementById("filter");
const clearBtn = document.getElementById("clear");

const displayItems = () => {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
};

const onAddItemSubmit = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;

  //  Validate Input
  if (newItem === "") {
    alert("Please type something");
    return;
  }

  // Create Item DOM Element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  // Check if there is items in the listo to return the UI
  checkUI();

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
  }
};

// Remove Items

const removeItem = (item) => {
  if (confirm("Are you Sure?")) {
    // Remove Item from DOM
    item.remove();

    // Removes Item from local storage
    removeItemFromStorage(item.textContent);

    checkUI();
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

  checkUI();
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

const checkUI = (e) => {
  const itens = itemList.querySelectorAll("li");

  if (itens.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }
};

// Init APP
function init() {
  // Event Listener

  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();
