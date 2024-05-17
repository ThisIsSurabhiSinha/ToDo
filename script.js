let form = document.querySelector("#form");
let textInput = document.querySelector("#textInput");
let dueDate = document.querySelector("#dateInput");
let taskDescp = document.querySelector("#textarea");
let task_list = document.querySelector(".task-list");
let total = document.querySelector(".total-task span");
let finished = document.querySelector(".finished span");
let pending = document.querySelector(".Pending span");
let date = document.querySelector("#date");
let time = document.querySelector("#time");
let add = document.querySelector("#add");
let closeBtn = document.querySelector("#closeBtn");
let pending_num = document.querySelector(".pending-num");
let finished_num = document.querySelector(".finished-num");
let allTasks = [];

let closeToSubmit = () => {
  closeBtn.addEventListener("click", addingTask);
};

let resetForm = () => {
  textInput.value = "";
  dueDate.value = "";
  taskDescp.value = "";
};

let updateFinished = () => {
  let completedTasks = allTasks.filter((task) => task.status === "Completed");
  finished.innerText = completedTasks.length;
};

let updatePending = () => {
  let pendingTasks = allTasks.filter(
    (task) => task.status === "Pending" || task.status === "Overdue"
  );
  pending.innerText = pendingTasks.length;
};

let finishedTask = (e) => {
  parent = e.parentElement.parentElement;
  allTasks[parent.id].status = "Completed";
  currStatus = parent.querySelector(".status");
  currStatus.className = "";
  currStatus.classList.add("status");
  currStatus.classList.add("Completed");
  currStatus.innerText = "Completed";

  updateFinished();
  updatePending();
};

let updateTotal = () => {
  total.innerText = allTasks.length;
};

let calculateTaskStatus = () => {
  const today = new Date();
  allTasks.forEach((task) => {
    if (
      task.dueDate !== "" &&
      task.dueDate !== null &&
      task.status !== "Completed"
    ) {
      let dateString = task.dueDate;
      let parts = dateString.split("-");
      let date = new Date(parts[0], parts[1] - 1, parts[2]);

      if (date < today) {
        task.status = "Overdue";
      } else if (date > today) {
        task.status = "Pending";
      }
    }
  });
};

let deleteTask = (e) => {
  e.parentElement.parentElement.remove();
  allTasks.splice(e.parentElement.parentElement.id, 1);
  updateTotal();
  updateFinished();
  updatePending();
};

let editTask = (e) => {
  parent = e.parentElement.parentElement;
  let currTextInput = parent.querySelector(".task-number").innerText;
  let currDueDate = parent.querySelector(".dueDate").innerText;
  let currTaskDescp = parent.querySelector(".task-descp").innerText;
  textInput.value = currTextInput;
  taskDescp.value = currTaskDescp;
  if (currDueDate != null && currDueDate !== "") {
    dueDate.value = currDueDate.split("-").reverse().join("-");
  }

  deleteTask(e);
  closeToSubmit();
  updatePending();
};

let displayTask = () => {
  calculateTaskStatus();
  updateTotal();
  updatePending();
  updateFinished();
  resetForm();
  task_list.innerHTML = "";
  allTasks.map((x, y) => {
    return (task_list.innerHTML += ` 
    <div class="task-1 " id=${y}>
                   <span class="task-number">${x.taskTitle}</span>
                   <div class="date-status">
                   <div class="dueDate">${
                     x.dueDate ? x.dueDate.split("-").reverse().join("-") : ""
                   }</div>
                   <div class="status ${x.status}">${
      x.dueDate ? x.status : ""
    }</div>
                   </div>
                   <span class="task-descp">${x.taskDescp}</span>
                   <span class="options">
                       <i class="fa-solid fa-circle-check" onClick="finishedTask(this)"></i>
                       <i class="fa-solid fa-pen-to-square"
                       data-bs-toggle="modal" data-bs-target="#form" onClick="editTask(this); " ></i>
                       <i class="fa-solid fa-trash" onClick="deleteTask(this)"></i>
                   </span>
               </div>`);
  });
};

let storeData = () => {
  newTask = {
    status: "Pending",
    dueDate: dueDate.value,
    taskTitle: textInput.value,
    taskDescp: taskDescp.value,
  };

  allTasks.push(newTask);
  displayTask();
  resetForm();
};

let addingTask = () => {
  closeBtn.removeEventListener("click", addingTask);
  storeData();
  add.setAttribute("data-bs-dismiss", "modal");
  add.click();
  (() => {
    add.setAttribute("data-bs-dismiss", "");
  })();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  closeBtn.setAttribute("type", "button");
  addingTask();
});

function updateClock() {
  let now = new Date();

  let hours = now.getHours().toString().padStart(2, "0");
  let minutes = now.getMinutes().toString().padStart(2, "0");
  let seconds = now.getSeconds().toString().padStart(2, "0");

  let amPM = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 24-hour time to 12-hour time
  hours = hours.toString().padStart(2, "0");

  let month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
  let day = now.getDate().toString().padStart(2, "0");
  let year = now.getFullYear();

  let dateString = `${day}-${month}-${year}`;
  let timeString = `${hours}:${minutes}:${seconds} ${amPM}`;
  date.innerHTML = `${dateString}`;
  time.innerHTML = `${timeString}`;
}

setInterval(updateClock, 1000);

(() => {
  allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  displayTask();
})();

function saveArrayToLocalStorage() {
  localStorage.clear();
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

window.addEventListener("beforeunload", saveArrayToLocalStorage);
window.addEventListener("load", () => {
  updateClock();
});
