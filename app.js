const API_BASE = "https://api-caoamigo.onrender.com";

// alternar páginas
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'home') loadDogs();
}

// carregar lista de cães
async function loadDogs() {
  const list = document.getElementById("dogList");
  list.innerHTML = "Carregando...";
  try {
    const res = await fetch(API_BASE + "/caes");
    const dogs = await res.json();
    list.innerHTML = "";
    dogs.forEach(dog => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<h3>${dog.nome}</h3><p>${dog.raca || ""}</p>`;
      card.onclick = () => showDogDetails(dog.id);
      list.appendChild(card);
    });
  } catch (e) {
    list.innerHTML = "Erro ao carregar cães.";
  }
}

// detalhes do cão
async function showDogDetails(id) {
  showPage("detalhes");
  const details = document.getElementById("dogDetails");
  details.innerHTML = "Carregando...";
  try {
    const res = await fetch(API_BASE + "/caes/" + id);
    const dog = await res.json();
    details.innerHTML = `
      <h2>${dog.nome}</h2>
      <p><b>Raça:</b> ${dog.raca || "Não informada"}</p>
      <p><b>Idade:</b> ${dog.idade || "?"} anos</p>
      <p>${dog.descricao || ""}</p>
    `;
  } catch (e) {
    details.innerHTML = "Erro ao carregar detalhes.";
  }
}

// cadastrar novo cão
document.getElementById("dogForm").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    const res = await fetch(API_BASE + "/caes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      document.getElementById("formMsg").textContent = "Cão cadastrado com sucesso!";
      form.reset();
      showPage("home");
    } else {
      document.getElementById("formMsg").textContent = "Erro ao cadastrar.";
    }
  } catch (e) {
    document.getElementById("formMsg").textContent = "Falha de conexão.";
  }
});

// Explorer manual
async function sendRequest() {
  const method = document.getElementById("method").value;
  const path = document.getElementById("path").value;
  const body = document.getElementById("reqBody").value;
  const url = API_BASE + path;

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: ["POST","PUT","PATCH"].includes(method) ? body : undefined
    });
    const text = await res.text();
    document.getElementById("response").textContent = text;
  } catch (e) {
    document.getElementById("response").textContent = "Erro: " + e.message;
  }
}

// carregar cães logo na inicial
loadDogs();
