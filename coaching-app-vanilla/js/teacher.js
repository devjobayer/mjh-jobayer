// Mock Data & LocalStorage Utils
const initialData = {
    students: [
        { id: 1, name: 'Rahim Uddin', class: '10', batch: 'Morning', phone: '01700000000', feesPaid: true },
        { id: 2, name: 'Karim Ahmed', class: '12', batch: 'Evening', phone: '01800000000', feesPaid: false },
        { id: 3, name: 'Sumaiya Akter', class: '10', batch: 'Morning', phone: '01900000000', feesPaid: true }
    ],
    fees: [
        { id: 1, studentId: 1, amount: 1500, date: '2023-10-01', month: 'October' },
        { id: 2, studentId: 3, amount: 1500, date: '2023-10-02', month: 'October' }
    ],
    expenses: [
        { id: 1, description: 'Marker & Duster', amount: 500, date: '2023-10-05', category: 'Supplies' },
        { id: 2, description: 'Electricity Bill', amount: 2000, date: '2023-10-10', category: 'Utilities' }
    ]
};

// Initialize Data if empty
if (!localStorage.getItem('coachingData')) {
    localStorage.setItem('coachingData', JSON.stringify(initialData));
}

const getData = () => JSON.parse(localStorage.getItem('coachingData'));
const saveData = (data) => localStorage.setItem('coachingData', JSON.stringify(data));

// State
let appData = getData();

// DOM Elements
const wrapper = document.getElementById("wrapper");
const menuToggle = document.getElementById("menu-toggle");
const pageTitle = document.getElementById("page-title");
const sections = {
    dashboard: document.getElementById("dashboard"),
    students: document.getElementById("students"),
    fees: document.getElementById("fees"),
    expenses: document.getElementById("expenses"),
    reports: document.getElementById("reports")
};

// Navigation Logic
menuToggle.addEventListener("click", () => {
    wrapper.classList.toggle("toggled");
});

const navLinks = document.querySelectorAll('.list-group-item-action');
const mobileNavLinks = document.querySelectorAll('#mob-nav-dashboard, #mob-nav-students, #mob-nav-fees, #mob-nav-expenses, #mob-nav-reports');

// Combine both lists
const allNavLinks = [...navLinks, ...mobileNavLinks];

allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Handle Sidebar/Bottom Navigation only (ignore logout)
        if (link.innerText.includes('Logout')) return;

        e.preventDefault();

        // Determine Target ID
        let targetId = '';
        if (link.id.startsWith('nav-')) {
            targetId = link.id.replace('nav-', '');
        } else if (link.id.startsWith('mob-nav-')) {
            targetId = link.id.replace('mob-nav-', '');
        }

        // Update Active State (Sidebar + Mobile Nav)
        navLinks.forEach(l => l.classList.remove('active-nav-link'));
        mobileNavLinks.forEach(l => {
            l.classList.remove('active-nav-link');
            l.classList.add('text-white-50'); // Reset opacity style
            l.classList.remove('text-white');
        });

        // Set active for clicked link and its counterpart
        const sidebarLink = document.getElementById(`nav-${targetId}`);
        const mobileLink = document.getElementById(`mob-nav-${targetId}`);

        if (sidebarLink) sidebarLink.classList.add('active-nav-link');
        if (mobileLink) {
            mobileLink.classList.add('active-nav-link');
            mobileLink.classList.remove('text-white-50');
            mobileLink.classList.add('text-white');
        }

        // Show Content
        showSection(targetId);

        // Update Title (Get text from sidebar link for consistency)
        if(sidebarLink) {
             pageTitle.innerText = sidebarLink.innerText.trim();
        }

        // Refresh Data on View Change
        refreshViews();
    });
});

function showSection(sectionId) {
    Object.values(sections).forEach(sec => sec.classList.add('d-none'));
    if(sections[sectionId]) sections[sectionId].classList.remove('d-none');
}

// Render Functions

function renderDashboard() {
    const { students, fees, expenses } = appData;

    // Calculate Totals
    const totalStudents = students.length;
    const totalIncome = fees.reduce((sum, item) => sum + Number(item.amount), 0);
    const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    const netProfit = totalIncome - totalExpense;

    // Update Cards
    document.getElementById('dash-total-students').innerText = totalStudents;
    document.getElementById('dash-total-income').innerText = '৳' + totalIncome.toLocaleString();
    document.getElementById('dash-total-expense').innerText = '৳' + totalExpense.toLocaleString();
    document.getElementById('dash-net-profit').innerText = '৳' + netProfit.toLocaleString();

    // Recent Students Table
    const recentStudents = students.slice(-5).reverse();
    const studentTable = document.getElementById('dash-recent-students');
    studentTable.innerHTML = recentStudents.map(s => `
        <tr>
            <td>${s.name}</td>
            <td>${s.class}</td>
            <td>${s.batch}</td>
            <td>${s.phone}</td>
        </tr>
    `).join('');

    // Recent Activity
    const recentFees = fees.slice(-3).reverse().map(f => ({...f, type: 'income'}));
    const recentExpenses = expenses.slice(-3).reverse().map(e => ({...e, type: 'expense'}));
    const activity = [...recentFees, ...recentExpenses]
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)) // simplistic sort
        .slice(0, 5);

    const activityContainer = document.getElementById('dash-recent-activity');
    activityContainer.innerHTML = activity.map(item => {
        const isIncome = item.type === 'income';
        const color = isIncome ? 'text-success' : 'text-danger';
        const icon = isIncome ? 'bi-cash-coin' : 'bi-receipt';
        const title = isIncome ? 'Fee Received' : item.description;
        const sub = isIncome ? `Student ID: ${item.studentId}` : item.category;

        return `
        <div class="d-flex align-items-center border-bottom py-2">
            <i class="bi ${icon} fs-4 me-3 ${color}"></i>
            <div class="flex-grow-1">
                <h6 class="m-0">${title}</h6>
                <small class="text-muted">${sub}</small>
            </div>
            <span class="fw-bold ${color}">${isIncome ? '+' : '-'}৳${item.amount}</span>
        </div>`;
    }).join('');
}

function renderStudents() {
    const tableBody = document.getElementById('students-table-body');
    const searchTerm = document.getElementById('student-search').value.toLowerCase();

    const filtered = appData.students.filter(s =>
        s.name.toLowerCase().includes(searchTerm) ||
        s.phone.includes(searchTerm)
    );

    tableBody.innerHTML = filtered.map(s => `
        <tr>
            <td><span class="text-muted">#${s.id}</span></td>
            <td><span class="fw-bold text-dark">${s.name}</span></td>
            <td>${s.class}</td>
            <td><span class="badge bg-light text-dark border">${s.batch}</span></td>
            <td>${s.phone}</td>
            <td><span class="badge ${s.feesPaid ? 'success-bg' : 'bg-warning text-dark'}">${s.feesPaid ? 'Paid' : 'Pending'}</span></td>
            <td>
                <button class="btn btn-sm btn-light border me-1 text-primary" onclick="viewStudent(${s.id})" title="View Profile"><i class="bi bi-eye"></i></button>
                <button class="btn btn-sm btn-light border text-danger" onclick="deleteStudent(${s.id})" title="Delete"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `).join('');

    if(filtered.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No students found</td></tr>';
    }
}

function renderFees() {
    // Populate Select
    const select = document.getElementById('fee-student-select');
    select.innerHTML = '<option value="">-- Select Student --</option>' +
        appData.students.map(s => `<option value="${s.id}">${s.name} (ID: ${s.id})</option>`).join('');

    // Render History
    const historyBody = document.getElementById('fees-history-table');
    const history = appData.fees.slice().reverse();

    historyBody.innerHTML = history.map(f => {
        const student = appData.students.find(s => s.id === f.studentId);
        const studentName = student ? student.name : 'Unknown';
        return `
        <tr>
            <td>${f.date}</td>
            <td><span class="fw-bold">${studentName}</span></td>
            <td>${f.month}</td>
            <td class="text-end fw-bold text-success">৳${f.amount}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-light border text-secondary" onclick="printReceipt(${f.id})"><i class="bi bi-printer"></i></button>
            </td>
        </tr>`;
    }).join('');
}

function renderExpenses() {
    const listBody = document.getElementById('expense-list-table');
    const totalDisplay = document.getElementById('expense-total-display');

    const total = appData.expenses.reduce((sum, e) => sum + e.amount, 0);
    totalDisplay.innerText = total.toLocaleString();

    listBody.innerHTML = appData.expenses.slice().reverse().map(e => `
        <tr>
            <td>${e.date}</td>
            <td>${e.description}</td>
            <td><span class="badge bg-secondary">${e.category}</span></td>
            <td class="text-end fw-bold text-danger">-৳${e.amount}</td>
            <td class="text-end"><button class="btn btn-sm text-danger" onclick="deleteExpense(${e.id})"><i class="bi bi-trash"></i></button></td>
        </tr>
    `).join('');
}

let incomeExpenseChart = null;
let expensePieChart = null;

function renderReports() {
    // Data Prep
    const monthlyData = {};

    appData.fees.forEach(f => {
        if(!monthlyData[f.month]) monthlyData[f.month] = { income: 0, expense: 0 };
        monthlyData[f.month].income += f.amount;
    });

    appData.expenses.forEach(e => {
        const date = new Date(e.date);
        const month = date.toLocaleString('default', { month: 'long' });
        if(!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
        monthlyData[month].expense += e.amount;
    });

    const labels = Object.keys(monthlyData);
    const incomeData = labels.map(l => monthlyData[l].income);
    const expenseData = labels.map(l => monthlyData[l].expense);

    // Bar Chart
    const ctx1 = document.getElementById('incomeExpenseChart').getContext('2d');
    if(incomeExpenseChart) incomeExpenseChart.destroy();

    // Gradients
    const gradientIncome = ctx1.createLinearGradient(0, 0, 0, 400);
    gradientIncome.addColorStop(0, '#4361ee');
    gradientIncome.addColorStop(1, 'rgba(67, 97, 238, 0.3)');

    const gradientExpense = ctx1.createLinearGradient(0, 0, 0, 400);
    gradientExpense.addColorStop(0, '#ef476f');
    gradientExpense.addColorStop(1, 'rgba(239, 71, 111, 0.3)');

    incomeExpenseChart = new Chart(ctx1, {
        type: 'line', // Changed to Line for trend visualization
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#4361ee',
                    backgroundColor: gradientIncome,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#4361ee',
                    pointRadius: 4
                },
                {
                    label: 'Expense',
                    data: expenseData,
                    borderColor: '#ef476f',
                    backgroundColor: gradientExpense,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#ef476f',
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top', labels: { usePointStyle: true, font: { family: 'Poppins' } } },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    titleFont: { family: 'Poppins', weight: '600' },
                    bodyFont: { family: 'Poppins' },
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: true
                }
            },
            scales: {
                y: { grid: { borderDash: [5, 5], color: '#f0f0f0' }, ticks: { font: { family: 'Poppins' } } },
                x: { grid: { display: false }, ticks: { font: { family: 'Poppins' } } }
            }
        }
    });

    // Pie Chart
    const categories = {};
    appData.expenses.forEach(e => {
        categories[e.category] = (categories[e.category] || 0) + e.amount;
    });

    const ctx2 = document.getElementById('expensePieChart').getContext('2d');
    if(expensePieChart) expensePieChart.destroy();

    expensePieChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#4361ee', '#3f37c9', '#4cc9f0', '#f72585', '#7209b7', '#480ca8'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: {
                legend: { position: 'right', labels: { font: { family: 'Poppins' }, boxWidth: 15 } }
            }
        }
    });
}

function refreshViews() {
    renderDashboard();
    renderStudents();
    renderFees();
    renderExpenses();
    renderReports();
}

// Helper: Toast Notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type} border-0 show`;
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    container.appendChild(toastEl);
    setTimeout(() => {
        toastEl.remove();
    }, 3000);
}

// Global Actions (exposed for inline onclicks)
window.viewStudent = (id) => {
    const student = appData.students.find(s => s.id === id);
    if(!student) return;

    document.getElementById('detail-name').innerText = student.name;
    document.getElementById('detail-id').innerText = `ID: ${student.id}`;
    document.getElementById('detail-class').innerText = student.class;
    document.getElementById('detail-batch').innerText = student.batch;
    document.getElementById('detail-phone').innerText = student.phone;

    const fees = appData.fees.filter(f => f.studentId === id);
    const feeTable = document.getElementById('detail-fees-table');

    if(fees.length > 0) {
        feeTable.innerHTML = fees.map(f => `
            <tr>
                <td>${f.date}</td>
                <td>${f.month}</td>
                <td class="text-end fw-bold text-success">৳${f.amount}</td>
            </tr>
        `).join('');
    } else {
        feeTable.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No records found</td></tr>';
    }

    new bootstrap.Modal(document.getElementById('studentDetailsModal')).show();
};

window.printReceipt = (feeId) => {
    const fee = appData.fees.find(f => f.id === feeId);
    if(!fee) return;
    const student = appData.students.find(s => s.id === fee.studentId);

    document.getElementById('receipt-id').innerText = `#${fee.id}`;
    document.getElementById('receipt-date').innerText = fee.date;
    document.getElementById('receipt-name').innerText = student ? student.name : 'Unknown';
    document.getElementById('receipt-month').innerText = fee.month;
    document.getElementById('receipt-amount').innerText = `৳${fee.amount}`;

    new bootstrap.Modal(document.getElementById('receiptModal')).show();
};

window.deleteStudent = (id) => {
    if(confirm('Are you sure you want to delete this student?')) {
        appData.students = appData.students.filter(s => s.id !== id);
        // Also remove fees for this student
        appData.fees = appData.fees.filter(f => f.studentId !== id);
        saveData(appData);
        refreshViews();
        showToast('Student deleted successfully', 'danger');
    }
};

window.deleteExpense = (id) => {
    if(confirm('Delete this expense?')) {
        appData.expenses = appData.expenses.filter(e => e.id !== id);
        saveData(appData);
        refreshViews();
        showToast('Expense deleted', 'warning');
    }
};

// Form Event Listeners

// Search Student
document.getElementById('student-search').addEventListener('input', renderStudents);

// Add Student
document.getElementById('add-student-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('student-name').value;
    const sClass = document.getElementById('student-class').value;
    const batch = document.getElementById('student-batch').value;
    const phone = document.getElementById('student-phone').value;

    const newStudent = {
        id: Date.now(),
        name,
        class: sClass,
        batch,
        phone,
        feesPaid: false
    };

    appData.students.push(newStudent);
    saveData(appData);

    // Close Modal and Reset
    const modalEl = document.getElementById('addStudentModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    e.target.reset();

    refreshViews();
});

// Collect Fee
document.getElementById('fees-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const studentId = parseInt(document.getElementById('fee-student-select').value);
    const month = document.getElementById('fee-month').value;
    const amount = parseInt(document.getElementById('fee-amount').value);

    if(!studentId) return;

    appData.fees.push({
        id: Date.now(),
        studentId,
        month,
        amount,
        date: new Date().toISOString().split('T')[0]
    });

    // Update student status if needed (logic simplified)
    const studentIndex = appData.students.findIndex(s => s.id === studentId);
    if(studentIndex > -1) {
        appData.students[studentIndex].feesPaid = true;
    }

    saveData(appData);
    e.target.reset();
    showToast('Fee Recorded Successfully');
    refreshViews();
});

// Add Expense
document.getElementById('expense-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('expense-desc').value;
    const category = document.getElementById('expense-category').value;
    const amount = parseInt(document.getElementById('expense-amount').value);
    const date = document.getElementById('expense-date').value;

    appData.expenses.push({
        id: Date.now(),
        description,
        category,
        amount,
        date
    });

    saveData(appData);
    e.target.reset();
    refreshViews();
});

// Initial Render
refreshViews();
