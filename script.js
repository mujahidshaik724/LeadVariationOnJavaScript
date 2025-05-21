let users = JSON.parse(localStorage.getItem("userList")) ;
  
const tbody = document.getElementById("dashboard-body");
const savedStates = JSON.parse(localStorage.getItem("userStates")) || {};

function saveToLocalStorage(states, userList = users) {
  localStorage.setItem("userStates", JSON.stringify(states));
  localStorage.setItem("userList", JSON.stringify(userList));
}

function renderTable() {
  tbody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");

    // Name & username
    const nameTd = document.createElement("td");
    nameTd.textContent = user.name;

    const usernameTd = document.createElement("td");
    usernameTd.textContent = user.username;

    // Switch
    const switchTd = document.createElement("td");
    const label = document.createElement("label");
    label.className = "switch";

    const slider = document.createElement("input");
    slider.type = "checkbox";
    slider.checked = savedStates[user.id] || false;
    slider.dataset.id = user.id;

    const span = document.createElement("span");
    span.className = "slider";

    label.appendChild(slider);
    label.appendChild(span);
    switchTd.appendChild(label);

    // Temperature & Humidity
    const tempTd = document.createElement("td");
    tempTd.textContent = `${user.temperature}°C`;

    const humidityTd = document.createElement("td");
    humidityTd.textContent = `${user.humidity}%`;

    // Status
    const statusTd = document.createElement("td");
    const isActive = slider.checked;
    statusTd.textContent = isActive ? "User is Active" : "User is Offline";
    statusTd.className = isActive ? "active" : "offline";

    // Actions
    const actionTd = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.style.marginRight = "5px";
    editBtn.onclick = () => editUser(user.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.backgroundColor = "#e74c3c";
    deleteBtn.style.color = "white";
    deleteBtn.onclick = () => deleteUser(user.id);

    actionTd.appendChild(editBtn);
    actionTd.appendChild(deleteBtn);

    // Append all tds
    row.appendChild(nameTd);
    row.appendChild(usernameTd);
    row.appendChild(switchTd);
    row.appendChild(tempTd);
    row.appendChild(humidityTd);
    row.appendChild(statusTd);
    row.appendChild(actionTd);

    // Add toggle event AFTER elements are attached
    slider.addEventListener("change", () => {
      const isChecked = slider.checked;
      statusTd.textContent = isChecked ? "User is Active" : "User is Offline";
      statusTd.className = isChecked ? "active" : "offline";
      savedStates[user.id] = isChecked;
      saveToLocalStorage(savedStates);
    });

    tbody.appendChild(row);
  });
}


window.addUser = function () {
  const name = document.getElementById("nameInput").value.trim();
  const username = document.getElementById("usernameInput").value.trim();
  const temp = document.getElementById("tempInput").value.trim();
  const humidity = document.getElementById("humidityInput").value.trim();

  if (!name || !username || !temp || !humidity) {
    alert("Please fill all fields!");
    return;
  }

  const newUser = {
    id: Date.now(),
    name,
    username,
    temperature: temp,
    humidity
  };

  users.push(newUser);
  savedStates[newUser.id] = false;
  saveToLocalStorage(savedStates);
  renderTable();

  document.getElementById("nameInput").value = "";
  document.getElementById("usernameInput").value = "";
  document.getElementById("tempInput").value = "";
  document.getElementById("humidityInput").value = "";

  saveToLocalStorage(savedStates);
};

function editUser(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;

  const name = prompt("Edit name:", user.name);
  const username = prompt("Edit username:", user.username);
  const temperature = prompt("Edit temperature:", user.temperature);
  const humidity = prompt("Edit humidity:", user.humidity);

  if (name && username && temperature && humidity) {
    user.name = name;
    user.username = username;
    user.temperature = temperature;
    user.humidity = humidity;
    saveToLocalStorage(savedStates);
    renderTable();
  } else {
    alert("All fields are required.");
  }
}

function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  users = users.filter(user => user.id !== id);
  delete savedStates[id];

  saveToLocalStorage(savedStates);
  renderTable();
}

document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.clear();
  users = [
    
  ];
  for (let user of users) savedStates[user.id] = false;
  saveToLocalStorage(savedStates);
  renderTable();
});

renderTable();
