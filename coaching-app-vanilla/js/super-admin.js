document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
});

function loadDashboardData() {
    // Mock Data for SaaS
    const centers = [
        { name: "Sunrise Coaching", admin: "Mr. Ahmed", plan: "Premium", status: "Active", date: "2023-01-15", revenue: 5000 },
        { name: "Elite Science Academy", admin: "Dr. Kabir", plan: "Basic", status: "Active", date: "2023-02-10", revenue: 2000 },
        { name: "Math Whiz", admin: "Mrs. Fatima", plan: "Premium", status: "Pending", date: "2023-10-01", revenue: 0 },
        { name: "English Care", admin: "Mr. Robert", plan: "Basic", status: "Expired", date: "2022-11-20", revenue: 24000 },
    ];

    // Calculate Totals
    const activeCenters = centers.filter(c => c.status === 'Active').length;
    const totalRevenue = centers.reduce((acc, curr) => acc + curr.revenue, 0);

    // Update UI
    document.getElementById('total-centers').innerText = activeCenters;
    document.getElementById('total-revenue').innerText = '৳' + totalRevenue.toLocaleString();

    // Render Table
    const tableBody = document.getElementById('centers-table-body');
    tableBody.innerHTML = '';

    centers.forEach(center => {
        const row = document.createElement('tr');

        let badgeClass = 'bg-success';
        if (center.status === 'Pending') badgeClass = 'bg-warning text-dark';
        if (center.status === 'Expired') badgeClass = 'bg-danger';

        row.innerHTML = `
            <td><span class="fw-bold">${center.name}</span></td>
            <td>${center.admin}</td>
            <td>${center.plan}</td>
            <td><span class="badge ${badgeClass}">${center.status}</span></td>
            <td>${center.date}</td>
            <td>৳${center.revenue}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary"><i class="bi bi-eye"></i></button>
                <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}
