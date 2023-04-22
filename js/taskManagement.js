// Get DOM elements
const userSelect = document.getElementById("user-select");
const taskSelect = document.getElementById("task-select");
const taskForm = document.getElementById("task-form");
const taskDate = document.getElementById("task-date");
const completedTask = document.getElementById("completed-task").querySelector("tbody");

populateDropdowns();

// Handle task form submission
taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userId = userSelect.value;
  const taskId = taskSelect.value;
  const date = taskDate.value;

  await db.collection("done").add({
    user_id: userId,
    task_id: taskId,
    date: firebase.firestore.Timestamp.fromDate(new Date(date))
  });

  userSelect.value = "";
  taskSelect.value = "";
  taskDate.value = "";
  displayCompletedTask();
});

// Display completed tasks in the table
const displayCompletedTask = async () => {
  completedTask.innerHTML = "";

  const doneSnapshot = await db.collection("done").get();
  for (const doneDoc of doneSnapshot.docs) {
    const doneData = doneDoc.data();

    const userDoc = await db.collection("users").doc(doneData.user_id).get();
    const taskDoc = await db.collection("task").doc(doneData.task_id).get();

    // Check if user and task documents exist
    if (userDoc.exists && taskDoc.exists) {
      const user = userDoc.data();
      const task = taskDoc.data();

      const row = document.createElement("tr");

      const userNameCell = document.createElement("td");
      userNameCell.textContent = user.name;
      row.appendChild(userNameCell);

      const taskNameCell = document.createElement("td");
      taskNameCell.textContent = task.name;
      row.appendChild(taskNameCell);

      const taskDateCell = document.createElement("td");
      taskDateCell.textContent = doneData
      taskDateCell.textContent = doneData.date.toDate().toLocaleDateString();
      row.appendChild(taskDateCell);

      const taskPointsCell = document.createElement("td");
      taskPointsCell.textContent = task.points;
      row.appendChild(taskPointsCell);

      completedTask.appendChild(row);
    }
  }
};

// Initially display completed task
displayCompletedTask();
