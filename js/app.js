const firebaseConfig = {
    apiKey: "AIzaSyD9NN0A_tERRYyLiViBW85HJX3Jj1BGPV0",
    authDomain: "todo-a70a6.firebaseapp.com",
    projectId: "todo-a70a6",
    storageBucket: "todo-a70a6.appspot.com",
    messagingSenderId: "308583427307",
    appId: "1:308583427307:web:47ace86fba9274aa4b22ae"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  // Populate user and task dropdowns
  const populateDropdowns = async () => {
    const usersSnapshot = await db.collection("users").get();
    usersSnapshot.forEach(userDoc => {
      const user = userDoc.data();
      const userOption = document.createElement("option");
      userOption.value = userDoc.id;
      userOption.textContent = user.name;
      userSelect.appendChild(userOption);
    });
  
    const taskSnapshot = await db.collection("task").get();
    taskSnapshot.forEach(taskDoc => {
      const task = taskDoc.data();
      const taskOption = document.createElement("option");
      taskOption.value = taskDoc.id;
      taskOption.textContent = task.name;
      taskSelect.appendChild(taskOption);
    });
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
  