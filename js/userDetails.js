const getParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

const displayUserDetails = async () => {
    const userId = getParam("userId");
  
    if (!userId) {
      return;
    }
  
    const userDoc = await db.collection("users").doc(userId).get();
    const user = userDoc.data();
  
    document.getElementById("user-name").innerText = user.name;
  
    const pointsPerUser = await calculateUserPoints();
    document.getElementById("user-points").innerText = pointsPerUser[userId];
  
    const doneSnapshot = await db.collection("done")
      .where("user_id", "==", userId)
      .get();
  
    const taskCount = {};
    const taskTimestamps = {};
  
    doneSnapshot.forEach(async (doneDoc) => {
      const taskId = doneDoc.data().task_id;
      const timestampData = doneDoc.data().timestamp;
  
      // Check if timestamp exists before converting it
      const timestamp = timestampData ? timestampData.toDate().toLocaleString() : 'N/A';
  
      const taskDoc = await db.collection("task").doc(taskId).get();
  
      if (taskDoc.exists) {
        const task = taskDoc.data();
  
        if (!taskCount[taskId]) {
          taskCount[taskId] = 0;
        }
  
        taskCount[taskId]++;
  
        if (!taskTimestamps[taskId]) {
          taskTimestamps[taskId] = [];
        }
  
        taskTimestamps[taskId].push(timestamp);
      }
    });
  
    displayTaskHistory(taskCount, taskTimestamps);
  };
  
  const displayTaskHistory = async (taskCount, taskTimestamps) => {
    const taskHistoryList = document.getElementById("task-history");
  
    for (const taskId in taskCount) {
      const taskDoc = await db.collection("task").doc(taskId).get();
      const task = taskDoc.data();
  
      const taskItem = document.createElement("li");
      taskItem.textContent = `${task.name} - Completed ${taskCount[taskId]} times`;
  
      const timestampList = document.createElement("ul");
  
      taskTimestamps[taskId].forEach((timestamp) => {
        const timestampItem = document.createElement("li");
        timestampItem.textContent = `Completed on: ${timestamp}`;
        timestampList.appendChild(timestampItem);
      });
  
      taskItem.appendChild(timestampList);
      taskHistoryList.appendChild(taskItem);
    }
  };
    

displayUserDetails();
