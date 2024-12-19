// #main.js - Placeholder to include dynamic functionality
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('revenueChart')) {
        updateChart('7days'); 
    }

    const navButtons = document.querySelectorAll('.nav-menu button');
    if (navButtons.length > 0) {
        navButtons.forEach(button => {
            button.addEventListener('click', function () {
                document.querySelectorAll('.nav-menu button').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    if (document.querySelector('#ordersTable tbody')) {
        fetchOrders();
    }

    if (document.getElementById('searchInput')) {
        document.getElementById('searchInput').addEventListener('input', searchTable);
    }

    if (document.getElementById('filterStatus')) {
        document.getElementById('filterStatus').addEventListener('change', filterTable);
    }
});

function searchContainer() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#salesTable tbody tr');

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? '' : 'none';
    });
}

let chartInstance;

function createChart(chartId, labels, data, gradientBorderColors, gradientFillColors) {
    const canvas = document.getElementById(chartId);
    if (!canvas) return; 

    const ctx = canvas.getContext('2d');

    const gradientBorder = ctx.createLinearGradient(0, 0, 0, 400);
    gradientBorder.addColorStop(0, gradientBorderColors[0]);
    gradientBorder.addColorStop(1, gradientBorderColors[1]);

    const gradientFill = ctx.createLinearGradient(0, 400, 0, 0);
    gradientFill.addColorStop(0, gradientFillColors[0]);
    gradientFill.addColorStop(1, gradientFillColors[1]);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Activity',
                data: data,
                borderColor: gradientBorder,
                backgroundColor: gradientFill,
                fill: true,
                tension:0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'right',
                    ticks: {
                        stepSize: 200
                    }
                }
            }
        }
    });
}
function updateChart(filter) {
    let labels, data;

    switch (filter) {
        case 'today':
            labels = ['12 AM', '6 AM', '12 PM', '6 PM'];
            data = [50, 120, 300, 150];
            break;
        case 'yesterday':
            labels = ['12 AM', '6 AM', '12 PM', '6 PM'];
            data = [100, 200, 400, 250];
            break;
        case '7days':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            data = [200, 400, 1000, 600, 1200, 800, 0];
            break;
        case '30days':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            data = [1500, 2000, 1700, 2500];
            break;
        case '60days':
            labels = ['Month 1', 'Month 2'];
            data = [4000, 4500];
            break;
        case '1year':
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            data = [3000, 3200, 4000, 3700, 4200, 3900, 4500, 4800, 4300, 4600, 5000, 5200];
            break;
        default:
            labels = [];
            data = [];
    }

    const gradientBorderColors = ['#09E82C', '#3E80FE'];
    const gradientFillColors = ['#EAFEEA80', '#84AEFF80'];

    createChart('revenueChart', labels, data, gradientBorderColors, gradientFillColors);
}

document.querySelectorAll('.nav-menu button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.nav-menu button').forEach(btn => btn.classList.remove('active'));
        
        this.classList.add('active');
    });
});

async function fetchOrders() {
    try {
        const response = await fetch('https://675d8ea663b05ed079782f36.mockapi.io/orders');
        const orders = await response.json();

        const tableBody = document.querySelector('#ordersTable tbody');
        if (!tableBody) return;
        tableBody.innerHTML = ''; 

        orders.forEach(order => {

             let statusClass = order.status.toLowerCase().replace(/\s/g, '');
             if (order.status === "Waiting for pickup") {
                 statusClass = "waiting";
             }
             
            const row = document.createElement('tr');
            row.innerHTML = `
                <th>${order.id}</th>
                <td>${order.buyer}</td>
                <td>${order.merchant}</td>
                <td><span class="status status-${statusClass}">${order.status}</span></td>
                <td>${order.amount}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

fetchOrders();

function searchTable() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#salesTable tbody tr');

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? '' : 'none';
    });
}

async function fetchAllOrders() {
    try {
        const response = await fetch('https://675d8ea663b05ed079782f36.mockapi.io/orders');
        const orders = await response.json();

        const tableBody = document.querySelector('#salesTable tbody');
        if (!tableBody) return;
        tableBody.innerHTML = '';

        orders.forEach(order => {

             let statusClass = order.status.toLowerCase().replace(/\s/g, '');
             if (order.status === "Waiting for pickup") {
                 statusClass = "waiting";
             }
             
            const row = document.createElement('tr');
            row.innerHTML = `
                <th>${order.id}</th>
                <td>${order.buyer}</td>
                <td>${order.merchant}</td>
                <td><span class="status status-${statusClass}">${order.status}</span></td>
                <td>${order.date}</td>
                <td>${order.amount}</td>
                <td>
        <div class="menu-container">
            <button class="menu-btn">...</button>
            <div class="dropdown-menu hidden">
                <div class="menu-item" onclick="viewOrderDetails(${order.id})">
                    <img src="assets/visibility.png" alt="View Icon" class="menu-icon">
                    View Sales Order Details
                </div>
                <div class="menu-item">
                    <img src="assets/visibility.png" alt="View Icon" class="menu-icon">
                    View Transaction
                </div>
                <div class="menu-divider"></div>
                <div class="menu-item delete"data-id="${order.id}">Delete this Order</div>
            </div>
        </div>
    </td>
                
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

fetchAllOrders();

async function viewOrderDetails(orderId) {
    try {
        const response = await fetch(`https://675d8ea663b05ed079782f36.mockapi.io/orderDetails/${orderId}`);
        const order = await response.json();

        const detailsContent = document.getElementById('orderDetailsContent');
        detailsContent.innerHTML = `
            <h2>Order details</h2>
            <p><strong>Payment method</strong><br>${order.paymentMethod}</p>
            <div class="menu-divider"></div>
            <p><strong>Pickup time</strong><br>${order.date}</p>

            <h3>Items</h3>
            <div class="item">
                <img src="${order.imageUrl}" alt="item" class="item-image">
                <div class="item-details">
                    <p>${order.items}<br><small>3 days from expiry date.</small></p>
                </div>
                <div class="item-price">RM ${parseFloat(order.price).toFixed(2)}</div>
            </div>

            <div class="summary">
                <p><strong>Subtotal:</strong> RM ${parseFloat(order.subtotal).toFixed(2)}</p>
                <p><strong>Service Tax:</strong> RM 0.73</p>
                <p><strong>Voucher Applied:</strong> - RM 0.00</p>
            </div>

            <div class="voucher-notice">
                10% Voucher applied
            </div>
        `;

        const detailsContainer = document.getElementById("orderDetails");
        if (detailsContainer) {
            detailsContainer.classList.add('active');
        } else {
            console.error('Order details container not found');
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
}

function closeOrderDetails() {
    const detailsContainer = document.getElementById('orderDetails');
    if (detailsContainer) {
        detailsContainer.classList.remove('active'); 
    } 
}


document.addEventListener('click', (event) => {
    const isMenuBtn = event.target.closest('.menu-btn');
    const allDropdowns = document.querySelectorAll('.dropdown-menu');

    if (isMenuBtn) {
        const dropdownMenu = isMenuBtn.nextElementSibling;

        allDropdowns.forEach(menu => {
            if (menu !== dropdownMenu) {
                menu.classList.remove('show');
            }
        });

        dropdownMenu.classList.toggle('show');
    } else {
        allDropdowns.forEach(menu => menu.classList.remove('show'));
    }
});

let currentPage = 1;
let rowsPerPage = 10; 
let tableData = []; 

async function fetchData() {
    try {
        const response = await fetch('https://675d8ea663b05ed079782f36.mockapi.io/orders');
        tableData = await response.json();
        renderTable();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderTable() {
    const tableBody = document.querySelector('#salesTable tbody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const paginatedData = tableData.slice(startIndex, endIndex);

    paginatedData.forEach((row) => {

        let statusClass = row.status.toLowerCase().replace(/\s/g, '');
        if (row.status === "Waiting for pickup") {
            statusClass = "waiting";
        }
        const tr = `
            <tr>
                <td>${row.id}</td>
                <td>${row.buyer}</td>
                <td>${row.merchant}</td>
                <td><span class="status status-${statusClass}">${row.status}</span></td>
                <td>${row.date}</td>
                <td>${row.amount}</td>
                <td>
        <div class="menu-container">
            <button class="menu-btn">...</button>
            <div class="dropdown-menu hidden">
                <div class="menu-item" onclick="viewOrderDetails(${row.id})">
                    <img src="assets/visibility.png" alt="View Icon" class="menu-icon">
                    View Sales Order Details
                </div>
                <div class="menu-item">
                    <img src="assets/visibility.png" alt="View Icon" class="menu-icon">
                    View Transaction
                </div>
                <div class="menu-divider"></div>
                <div class="menu-item delete" data-id="${row.id}">Delete this Order</div>
            </div>
        </div>
    </td>
            </tr>
        `;
        tableBody.innerHTML += tr;
    });

    attachDeleteEventListeners();

    updatePaginationInfo();
    updatePaginationButtons();
}

function attachDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.menu-item.delete');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', handleDelete);
    });
}

async function handleDelete(event) {
    const deleteButton = event.currentTarget;
    const orderId = deleteButton.getAttribute('data-id');
    const confirmed = confirm(`Are you sure you want to delete order #${orderId}?`);

    if (confirmed) {
        try {
            const response = await fetch(`https://675d8ea663b05ed079782f36.mockapi.io/orders/${orderId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete order. Status: ${response.status}`);
            }

            tableData = tableData.filter((row) => row.id !== orderId);

            renderTable();

            alert(`Order #${orderId} deleted successfully.`);
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete the order. Please try again.');
        }
    }
}

function updateRowsPerPage() {
    rowsPerPage = parseInt(document.getElementById('rowsPerPageSelect').value);
    currentPage = 1;
    renderTable();
}

function updatePaginationInfo() {
    const totalRows = tableData.length;
    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(start + rowsPerPage - 1, totalRows);
    document.getElementById('paginationInfo').innerText = `${start}-${end} of ${totalRows}`;
}

function changePage(direction) {
    const maxPage = Math.ceil(tableData.length / rowsPerPage);
    currentPage += direction;

    if (currentPage < 1) currentPage = 1;
    if (currentPage > maxPage) currentPage = maxPage;

    renderTable();
}

function updatePaginationButtons() {
    const maxPage = Math.ceil(tableData.length / rowsPerPage);
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === maxPage;
}

fetchData();


