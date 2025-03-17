(() => {
  fetch("http://localhost:3000/items")
    .then((res) => res.json())
    .then((data) => {
      console.log("Datan lataus onnistui:", data); // Datan lataus onnistui
      displayUser(data);
    })
    .catch((error) => {
      console.error("Virhe datan lataamisessa:", error); // Virhe datan lataamisessa
    });
})();

const userDisplay = document.querySelector("#user-table");

// Funktio datan näyttämiseen taulukossa
displayUser = (data) => {
  userDisplay.innerHTML = `
    <thead>
      <tr>
        <th>Id</th>
        <th>Nimi</th>
        <th>Puhelin</th>
        <th>Muokkaa</th>
        <th>Poista</th>
      </tr>
    </thead>
    <tbody>
      ${data
        .map(
          (user) => `
        <tr>
          <td>${user.id}</td>
          <td>${user.nimi}</td>
          <td>${user.puhelin}</td>
          <td><button class="edit-button" data-id="${user.id}">Muokkaa</button></td>
          <td><button class="delete-button" data-id="${user.id}">x</button></td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;
};

// Muokkauspainikkeen klikkaustapahtuman käsittelijä
document.addEventListener("click", function (e) {
  if (e.target && e.target.matches("button.edit-button")) {
    const userId = e.target.dataset.id;
    const userRow = e.target.closest("tr");
    const phoneNumber = userRow.querySelector("td:nth-child(3)").textContent;

    // Näytetään muokkauslomake
    document.getElementById("edit-container").style.display = "block";
    document.getElementById("edit-puhelin").value = phoneNumber;

    // Tallennuspainikkeen toiminta
    document.getElementById("save-button").onclick = function () {
      updatePhoneNumber(userId, document.getElementById("edit-puhelin").value);
    };
  }
});

// Poistopainikkeen klikkaustapahtuman käsittelijä
document.addEventListener("click", function (e) {
  if (e.target && e.target.matches("button.delete-button")) {
    const userId = e.target.dataset.id;
    deleteUser(userId); // Poistetaan käyttäjä
  }
});

// Funktio puhelinnumeron päivittämiseen palvelimelle
function updatePhoneNumber(id, newPhone) {
  fetch(`http://localhost:3000/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ puhelin: newPhone }), // Uusi puhelinnumero
  })
    .then((res) => res.json())
    .then(() => {
      alert("Puhelinnumero päivitetty!"); // Ilmoitus päivityksestä
      location.reload(); // Sivun päivitys, jotta muutokset näkyvät
    });
}

// Funktio käyttäjän poistamiseen palvelimelta
function deleteUser(id) {
  fetch(`http://localhost:3000/items/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      alert("Käyttäjä poistettu!"); // Ilmoitus poistamisesta
      location.reload(); // Sivun päivitys, jotta käyttäjä poistetaan taulukosta
    })
    .catch((error) => console.error("Virhe käyttäjän poistamisessa:", error)); // Virhe poistamisessa
}
