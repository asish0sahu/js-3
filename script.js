document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("dataForm");
  const tableBody = document.querySelector("#dataTable tbody");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
    };

    fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        addUserToTable(data);

        form.reset();
      })
      .catch((error) => console.error("Error:", error));
  });

  function addUserToTable(user) {
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td><input type="text" value="${user.name}" id="name_${user.id}" required></td>
      <td><input type="email" value="${user.email}" id="email_${user.id}" required></td>
      <td>
        <button onclick="updateUser(${user.id})">Update</button>
        <button onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
  }

  function fetchUsers() {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((users) => {
        users.forEach((user) => {
          addUserToTable(user);
        });
      })
      .catch((error) => console.error("Error:", error));
  }

  fetchUsers();
});

function deleteUser(userId) {
  fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
    method: "DELETE",
  })
    .then(() => {
      const row = document.querySelector(
        `#dataTable tbody tr:nth-child(${userId})`
      );
      row.remove();
    })
    .catch((error) => console.error("Error:", error));
}

function updateUser(userId) {
  const nameInput = document.getElementById(`name_${userId}`).value;
  const emailInput = document.getElementById(`email_${userId}`).value;

  const userData = {
    name: nameInput,
    email: emailInput,
  };

  fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("User updated:", data);
    })
    .catch((error) => console.error("Error:", error));
}
