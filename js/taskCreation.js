// Get DOM elements for task creation
const createTaskForm = document.getElementById("create-task-form");
const taskNameInput = document.getElementById("task-name");
const taskdescripsionInput = document.getElementById("task-descripsion");
const taskPointsInput = document.getElementById("task-points");

// Handle task creation form submission
createTaskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const taskName = taskNameInput.value;
  const taskdescripsion = taskdescripsionInput.value;
  const taskPoints = parseInt(taskPointsInput.value, 10);

  await db.collection("task").add({
    name: taskName,
    descripsion: taskdescripsion,
    points: taskPoints,
  });

  taskNameInput.value = "";
  taskdescripsionInput.value = "";
  taskPointsInput.value = "";

  // Refresh task dropdown
  taskSelect.innerHTML = "<option value=''>-- Select a task --</option>";
  populateDropdowns();
});
