document.addEventListener('DOMContentLoaded', () => {
    loadStudentData();
});

function loadStudentData() {
    // Mock Student Data
    const student = {
        name: "Rahim Uddin",
        id: "1001",
        class: "10",
        batch: "Morning",
        payments: [
            { month: "October", date: "2023-10-05", amount: 1500 },
            { month: "September", date: "2023-09-02", amount: 1500 },
            { month: "August", date: "2023-08-03", amount: 1500 }
        ]
    };

    // Update UI
    document.getElementById('stu-name').innerText = student.name;
    document.getElementById('stu-detail').innerText = `Class ${student.class} | ID: ${student.id}`;

    // Render Payment History
    const tbody = document.getElementById('stu-payment-history');
    tbody.innerHTML = '';

    student.payments.forEach(pay => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="ps-4 fw-medium">${pay.month}</td>
            <td class="text-muted small">${pay.date}</td>
            <td class="text-end pe-4 fw-bold text-success">৳${pay.amount}</td>
        `;
        tbody.appendChild(row);
    });
}
