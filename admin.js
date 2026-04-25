// const API_URL = "http://localhost:3000/orders";

// ===== LOAD ORDERS =====
function loadOrders() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => displayOrders(data))
    .catch(err => console.log("Error loading orders:", err));
}

// ===== DISPLAY ORDERS =====
function displayOrders(data) {
  const tbody = document.getElementById("orderTableBody");
  tbody.innerHTML = "";

  data.forEach(order => {
    // Ensure order.id is a string for onclick
    const orderId = order.id;

    tbody.innerHTML += `
      <tr>
        <td>${order.name}</td>
        <td>${order.date}</td>
        <td>${order.time}</td>
        <td>Rs ${order.total}</td>
        <td><span class="status ${order.status}">${order.status}</span></td>
        <td>
         <button class="action-btn view-btn" onclick="viewDetails('${order.id}')">👁️</button>
          <button class="action-btn approve-btn" onclick="updateStatus('${orderId}','Approved')">✓</button>
                <button class="action-btn reject-btn" onclick="rejectOrder('${orderId}')">✕</button>
        </td>
      </tr>
    `;
  });
}

// ===== UPDATE ORDER STATUS =====
function updateStatus(id, status) {
  fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({status})
  })
  .then(res => res.json())
  .then(() => loadOrders())
  .catch(err => console.log("Error updating status:", err));
}

let currentOrderId = null;

async function rejectOrder(id) {
    currentOrderId = id; // save id
    const res = await fetch(`${API_URL}/${id}`);
    const b = await res.json();

    const modal = new bootstrap.Modal(document.getElementById("rejectOrder"));
    modal.show();
}

async function reject() {
    if (!currentOrderId) return;

    await fetch(`${API_URL}/${currentOrderId}`, {
        method: "DELETE"
    });

    location.reload();
}

// VIEW DETAILS
async function viewDetails(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const b = await res.json();

    document.getElementById("modalContent").innerHTML = `
        <p><strong>Name:</strong> ${b.name}</p>
        <p><strong>Email:</strong> ${b.email}</p>
        <p><strong>Phone:</strong> ${b.phone}</p>
        <p><strong>Address:</strong> ${b.address}</p>
    `;

    new bootstrap.Modal(document.getElementById("detailsModal")).show();
}

// SEARCH
async function searchData() {
    const q = document.getElementById("searchName").value.toLowerCase();
    const res = await fetch(API_URL);
    const data = await res.json();
    displayOrders(data.filter(b => b.name.toLowerCase().includes(q)));
}

// LOGOUT
function logout() {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "login.html";
}

// ===== INIT =====
window.onload = loadOrders;

