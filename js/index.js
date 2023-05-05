// index.js
const displayLeaderboard = async () => {
  const leaderboardTable = document.getElementById("leaderboard-table").querySelector("tbody");
  leaderboardTable.innerHTML = "";

  const pointsPerUser = await calculateUserPoints();

  for (const userId in pointsPerUser) {
    const userDoc = await db.collection("users").doc(userId).get();
    const user = userDoc.data();

    const row = document.createElement("tr");

    const userNameCell = document.createElement("td");
    userNameCell.textContent = user.name;
    userNameCell.style.cursor = "pointer"; // Change the cursor to a pointer when hovering over the user's name
    userNameCell.addEventListener("click", () => {
      window.location.href = `html/userDetails.html?userId=${userId}`; // Open userDetails.html with the user's ID as a URL parameter
    });
    row.appendChild(userNameCell);

    const userPointsCell = document.createElement("td");
    userPointsCell.textContent = pointsPerUser[userId];
    row.appendChild(userPointsCell);

    leaderboardTable.appendChild(row);
  }
};


async function displayPieChart() {
  const pointsPerUser = await calculateUserPoints();
  const usersSnapshot = await db.collection("users").get();

  const pieChartLabels = [];
  const pieChartData = [];

  usersSnapshot.forEach((userDoc) => {
    const user = userDoc.data();
    const userId = userDoc.id;

    pieChartLabels.push(user.name);
    pieChartData.push(pointsPerUser[userId]);
  });

  const pieChartElement = document.getElementById("pie-chart").getContext("2d");
  new Chart(pieChartElement, {
    type: "pie",
    data: {
      labels: pieChartLabels,
      datasets: [
        {
          data: pieChartData,
          backgroundColor: [
            // Add as many colors as needed for your users
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
      },
    },
  });
}
displayLeaderboard().then(() => {
  displayPieChart();
});
