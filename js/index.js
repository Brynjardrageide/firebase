// index.js
const displayLeaderboard = async () => {
    const leaderboardTable = document.getElementById("leaderboard").querySelector("tbody");
    leaderboardTable.innerHTML = "";
  
    const pointsPerUser = await calculateUserPoints();
  
    for (const userId in pointsPerUser) {
      const userDoc = await db.collection("users").doc(userId).get();
      const user = userDoc.data();
  
      const row = document.createElement("tr");
  
      const userNameCell = document.createElement("td");
      userNameCell.textContent = user.name;
      row.appendChild(userNameCell);
  
      const userPointsCell = document.createElement("td");
      userPointsCell.textContent = pointsPerUser[userId];
      row.appendChild(userPointsCell);
  
      leaderboardTable.appendChild(row);
    }
  };
  
  const calculateUserPoints = async () => {
    const usersSnapshot = await db.collection("users").get();
    const pointsPerUser = {};
  
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      pointsPerUser[userId] = 0;
  
      const doneSnapshot = await db.collection("done")
        .where("user_id", "==", userId)
        .get();
  
      for (const doneDoc of doneSnapshot.docs) {
        const taskId = doneDoc.data().task_id;
        const taskDoc = await db.collection("task").doc(taskId).get();
  
        if (taskDoc.exists) {
          const taskPoints = parseInt(taskDoc.data().points, 10); // Parse points as integers
          pointsPerUser[userId] += taskPoints;
        }
      }
    }
  
    return pointsPerUser;
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    displayLeaderboard();
  });
  