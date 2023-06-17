const inputBox = document.getElementById("input-box");
const todoList = document.getElementById("list-container");
const url = "http://localhost:3000/todos/";

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.setAttribute("id", todo.id);
  if (todo.isImportant) {
    li.classList.add("is-important");
  }
  console.log(todo);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("completed-checkbox");
  checkbox.checked = todo.completed;
  li.appendChild(checkbox);

  const span = document.createElement("span");
  span.classList.add("delete-icon");
  span.innerHTML = "\u00d7";
  li.appendChild(span);

  const input = document.createElement("input");
  input.type = "text";
  input.value = todo.description;
  li.appendChild(input);

  return li;
}

// GET

async function fetchTodos() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const sortedData = sortTodos(data);

    sortedData.forEach(function (todo) {
      const todoElement = createTodoElement(todo);
      todoList.appendChild(todoElement);
      console.log(todoElement);
    });
  } catch (error) {
    console.log("Error with get request", error);
  }
}
fetchTodos();

// POST

function addTask() {
  if (inputBox.value === "") {
    alert("Add your to-do task!");
  } else {
    const task = inputBox.value;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: task,
        completed: false,
        isImportant: false,
      }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log("Error with post request");
      });
  }
}

// DELETE

todoList.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-icon")) {
    const taskId = e.target.parentElement.getAttribute("id");
    fetch(url + taskId, {
      method: "DELETE",
    })
      .then(function () {
        e.target.parentElement.remove();
      })
      .catch(function () {
        console.log("Error with delete request");
      });
  }
});

// PUT

function updateTask(taskId, newData) {
  fetch(url + taskId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error with put request");
    });
}

//CHECKBOX

todoList.addEventListener("change", function (e) {
  if (e.target.classList.contains("completed-checkbox")) {
    const taskId = e.target.parentElement.getAttribute("id");
    const completed = e.target.checked;
    const liElement = e.target.parentElement;
    const inputTask = liElement.querySelector("input[type='text']");
    const newDescription = inputTask.value;
    const isImportant = liElement.classList.contains("is-important");
    const newData = {
      description: newDescription,
      completed: completed,
      isImportant: isImportant,
    };
    updateTask(taskId, newData);
  }
});

// EDIT

const popup = document.querySelector(".popup");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const editDescriptionInput = document.getElementById("editDescription");
const editImportantCheckbox = document.getElementById("editImportant");

todoList.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    const oldDescription = e.target.querySelector('input[type="text"]').value;
    editDescriptionInput.value = oldDescription;
    const taskId = e.target.getAttribute("id");
    const completed = e.target.querySelector('input[type="checkbox"]').checked;
    popup.classList.add("show");
    confirmBtn.addEventListener("click", function () {
      const newDescription = editDescriptionInput.value;
      const newData = {
        description: newDescription,
        completed: completed,
        isImportant: editImportantCheckbox.checked,
      };
      updateTask(taskId, newData);
      popup.classList.remove("show");
    });
    cancelBtn.addEventListener("click", function () {
      popup.classList.remove("show");
    });
  }
});

//SORT

function sortTodos(data) {
  data.sort((a, b) => {
    if (a.isImportant && !a.completed) return -1;
    if (b.isImportant && !b.completed) return 1;
    if (!a.completed) return -1;
    if (!b.completed) return 1;
    return 0;
  });

  return data;
}
