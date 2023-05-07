const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");

const userNameElement = document.getElementById("user-name");
const userPointsElement = document.getElementById("user-points");
const taskHistoryList = document.getElementById("task-history");

let totalPoints = 0; // Keep track of the total points for the user

if (!userId) {
  window.location.href = "/";
}

function showLoadingAnimation() {
  document.getElementById("loading-animation").style.display = "flex";
  document.getElementById("content").style.display = "none";
}

function hideLoadingAnimation() {
  document.getElementById("loading-animation").style.display = "none";
  document.getElementById("content").style.display = "block";
}

showLoadingAnimation();

Promise.all([
  // Fetch user details
  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userNameElement.textContent = doc.data().name;
      } else {
        window.location.href = "/";
      }
    }),

  // Fetch user's task history
  firebase
    .firestore()
    .collection("done")
    .where("user_id", "==", userId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const doneData = doc.data();
        const taskId = doneData.task_id;
        const date = doneData.date.toDate();

        firebase
          .firestore()
          .collection("task")
          .doc(taskId)
          .get()
          .then((taskDoc) => {
            if (taskDoc.exists) {
              const taskData = taskDoc.data();
              const taskName = taskData.name;
              const taskPoints = parseInt(taskData.points, 10); // Parse points as integers

              totalPoints += taskPoints; // Add task points to the total points

              const listItem = document.createElement("li");
              listItem.textContent = `${taskName} - ${date.toLocaleDateString()} - Points: ${taskPoints}`;
              taskHistoryList.appendChild(listItem);

              userPointsElement.textContent = `Total Points: ${totalPoints}`; // Update the total points displayed
            }
          });
      });
    }),
]).then(() => {
  // Hide the loading animation and show the content when both functions are done
  hideLoadingAnimation();
});
