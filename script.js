const ctx = document.getElementById('revenueChart');
let chart;

// BUILD CHART
function buildChart(branch = "All") {

    let filtered = revenueData;
    if (branch !== "All") {
        filtered = revenueData.filter(d => d.branch === branch);
    }

    const months = [...new Set(filtered.map(d => d.month))];

    const revenueValues = months.map(m =>
        filtered.filter(d => d.month === m)
                .reduce((sum, r) => sum + r.revenue, 0)
    );

    const patientValues = revenueValues.map(v => Math.round(v / 500));

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: "Revenue",
                    data: revenueValues,
                    borderWidth: 3,
                    tension: 0.3,
                    yAxisID: 'yRevenue'
                },
                {
                    label: "Patients",
                    data: patientValues,
                    borderDash: [6,4],
                    borderWidth: 3,
                    tension: 0.3,
                    yAxisID: 'yPatients'
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yRevenue: { position: 'left' },
                yPatients: {
                    position: 'right',
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}

// UPDATE KPI CARDS
function updateCards(branch = "All") {

    let filtered = revenueData;
    if (branch !== "All") {
        filtered = revenueData.filter(d => d.branch === branch);
    }

    const totalRevenue = filtered.reduce((sum, r) => sum + r.revenue, 0);
    const patients = Math.round(totalRevenue / 500);

    document.querySelector("#revenueCard .kpi-value").innerText =
        totalRevenue.toLocaleString("en-IN");

    document.querySelector("#patientsCard .kpi-value").innerText =
        patients.toLocaleString("en-IN");

    const first = filtered[0]?.revenue || 0;
    const last = filtered[filtered.length - 1]?.revenue || 0;

    let growth = first > 0 ? ((last-first)/first)*100 : 0;

    const growthEl = document.querySelector("#growthCard .kpi-value");
    growthEl.innerText = growth.toFixed(1) + "%";
    growthEl.style.color = growth >= 0 ? "#16a34a" : "#dc2626";
}

// UPDATE TABLE
function updateTable(branch = "All") {

    let filtered = revenueData;
    if (branch !== "All") {
        filtered = revenueData.filter(d => d.branch === branch);
    }

    const months = [...new Set(filtered.map(d => d.month))];
    const tbody = document.querySelector("#summaryTable tbody");
    tbody.innerHTML = "";

    months.forEach(month => {
        const revenue = filtered
            .filter(d => d.month === month)
            .reduce((sum, r) => sum + r.revenue, 0);

        const patients = Math.round(revenue / 500);

        tbody.insertAdjacentHTML("beforeend", `
            <tr>
                <td>${month}</td>
                <td>${revenue.toLocaleString("en-IN")}</td>
                <td>${patients.toLocaleString("en-IN")}</td>
            </tr>
        `);
    });
}

// INITIAL LOAD
buildChart();
updateCards();
updateTable();

// FILTER EVENT
document.getElementById("branchFilter").addEventListener("change", function() {
    const branch = this.value;
    buildChart(branch);
    updateCards(branch);
    updateTable(branch);
});
