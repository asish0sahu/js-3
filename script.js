document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("dataForm");
  const tableBody = document.querySelector("#dataTable tbody");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    if (!name || !email || !phone) {
      alert("Please fill out all fields.");
      return;
    }

    await addUserToTable(name, email, phone);
    form.reset();
  });

  async function addUserToTable(name, email, phone) {
    const response = await fetch("http://localhost:5000/userspost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, phone }),
    });

    if (!response.ok) {
      throw new Error("Failed to add user");
    }

    const userData = await response.json();

    const row = tableBody.insertRow();
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit");
    editButton.onclick = function () {
      editUser(row, userData.id);
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete");
    deleteButton.onclick = function () {
      deleteUser(row, userData.id);
    };

    row.innerHTML = `
          <td>${name}</td>
          <td>${email}</td>
          <td>${phone}</td>
          <td class="actions"></td>
        `;
    row.querySelector(".actions").append(editButton, deleteButton);
  }

  async function editUser(row, userId) {
    const cells = row.querySelectorAll("td:not(.actions)");
    const name = cells[0].textContent;
    const email = cells[1].textContent;
    const phone = cells[2].textContent;

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = name;

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.value = email;

    const phoneInput = document.createElement("input");
    phoneInput.type = "tel";
    phoneInput.value = phone;

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("edit");
    saveButton.onclick = async function () {
      await saveUser(
        row,
        userId,
        nameInput.value,
        emailInput.value,
        phoneInput.value
      );
    };

    row.innerHTML = "";
    row.appendChild(nameInput);
    row.appendChild(emailInput);
    row.appendChild(phoneInput);
    row.appendChild(saveButton);
  }

  async function saveUser(row, userId, name, email, phone) {
    const response = await fetch(`http://localhost:5000/usersput/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, phone }),
    });

    if (!response.ok) {
      throw new Error("Failed to save user");
    }

    row.innerHTML = `
          <td>${name}</td>
          <td>${email}</td>
          <td>${phone}</td>
          <td class="actions">
            <button class="edit" onclick="editUser(this.parentElement.parentElement, ${userId})">Edit</button>
            <button class="delete" onclick="deleteUser(this.parentElement.parentElement, ${userId})">Delete</button>
          </td>
        `;
  }

  async function deleteUser(row, userId) {
    const response = await fetch(
      `http://localhost:5000/usersdelete/${userId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    row.parentNode.removeChild(row);
  }
});
