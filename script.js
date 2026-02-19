let chart;

function getFiltered(branch="All"){
    return branch==="All" ? revenueData : revenueData.filter(d=>d.branch===branch);
}

function buildChart(branch="All"){
    const filtered=getFiltered(branch);
    const months=[...new Set(filtered.map(d=>d.month))];

    const revenue=months.map(m=>filtered.filter(d=>d.month===m)
                        .reduce((s,r)=>s+r.revenue,0));

    const patients=revenue.map(v=>Math.round(v/500));

    if(chart) chart.destroy();

    chart=new Chart(document.getElementById("revenueChart"),{
        type:'line',
        data:{labels:months,datasets:[
            {label:"Revenue",data:revenue,borderWidth:3,tension:.3},
            {label:"Patients",data:patients,borderDash:[6,4],borderWidth:3}
        ]},
        options:{maintainAspectRatio:false}
    });
}

function updateCards(branch="All"){
    const f=getFiltered(branch);
    const total=f.reduce((s,r)=>s+r.revenue,0);
    const patients=Math.round(total/500);

    document.querySelector("#revenueCard .kpi-value").innerText=total.toLocaleString("en-IN");
    document.querySelector("#patientsCard .kpi-value").innerText=patients.toLocaleString("en-IN");

    const growth=((f[f.length-1].revenue-f[0].revenue)/f[0].revenue)*100;
    const g=document.querySelector("#growthCard .kpi-value");
    g.innerText=growth.toFixed(1)+"%";
    g.style.color=growth>=0?"#16a34a":"#dc2626";
}

function updateTable(branch="All"){
    const f=getFiltered(branch);
    const months=[...new Set(f.map(d=>d.month))];
    const tbody=document.querySelector("#summaryTable tbody");
    tbody.innerHTML="";
    months.forEach(m=>{
        const r=f.filter(d=>d.month===m).reduce((s,x)=>s+x.revenue,0);
        const p=Math.round(r/500);
        tbody.insertAdjacentHTML("beforeend",
        `<tr><td>${m}</td><td>${r.toLocaleString("en-IN")}</td><td>${p}</td></tr>`);
    });
}

function buildBar(branch="All"){
    const f=getFiltered(branch);
    const months=[...new Set(f.map(d=>d.month))];
    const vals=months.map(m=>f.filter(d=>d.month===m).reduce((s,r)=>s+r.revenue,0));
    new Chart(document.getElementById("monthlyBarChart"),{
        type:"bar",data:{labels:months,datasets:[{data:vals,label:"Monthly Revenue"}]},
        options:{maintainAspectRatio:false}
    });
}

function buildDept(branch="All"){
    const f=getFiltered(branch);
    const depts=[...new Set(f.map(d=>d.dept))];
    const vals=depts.map(dep=>f.filter(d=>d.dept===dep).reduce((s,r)=>s+r.revenue,0));
    new Chart(document.getElementById("deptChart"),{
        type:"bar",data:{labels:depts,datasets:[{data:vals,label:"Dept Revenue"}]},
        options:{maintainAspectRatio:false}
    });
}

function buildService(branch="All"){
    const f=getFiltered(branch);
    const services=[...new Set(f.map(d=>d.service))];
    const vals=services.map(s=>f.filter(d=>d.service===s).reduce((s1,r)=>s1+r.revenue,0));
    new Chart(document.getElementById("serviceChart"),{
        type:"pie",data:{labels:services,datasets:[{data:vals}]},
        options:{maintainAspectRatio:false}
    });
}

function buildBranchSplit(){
    const branches=[...new Set(revenueData.map(d=>d.branch))];
    const vals=branches.map(b=>revenueData.filter(d=>d.branch===b)
                        .reduce((s,r)=>s+r.revenue,0));
    new Chart(document.getElementById("yearPieChart"),{
        type:"doughnut",data:{labels:branches,datasets:[{data:vals}]},
        options:{maintainAspectRatio:false}
    });
}

// INITIAL LOAD
buildChart(); updateCards(); updateTable();
buildBar(); buildDept(); buildService(); buildBranchSplit();

// TOP FILTER
document.getElementById("branchFilter").onchange=e=>{
    const b=e.target.value;
    buildChart(b); updateCards(b); updateTable(b);
    buildBar(b); buildDept(b); buildService(b);
};

// PANEL TOGGLE
document.getElementById("filterBtn").onclick=()=>{
    document.getElementById("filterPanel").classList.add("open");
};
document.getElementById("closeFilters").onclick=()=>{
    document.getElementById("filterPanel").classList.remove("open");
};
function toggleFilters(){
    document.getElementById("filterPanel").classList.toggle("open");
}
