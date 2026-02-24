let chart;
let dayChart;
let barChart;
let deptChart;
let serviceChart;
let branchChart;

let exportData= {
  revenueTrend: [], tableData: []
}

;

function getFiltered(branch="All", month="All", year="All") {
  let data=revenueData;
  if(branch !=="All") data=data.filter(d=>d.branch===branch);
  if(month !=="All") data=data.filter(d=>d.month===month);
  if(year !=="All") data=data.filter(d=>d.year==year);
  return data;
}

function buildChart(branch="All", month="All", year="All") {
  const filtered=getFiltered(branch, month, year);
  const months=[...new Set(filtered.map(d=>d.month))];
  const revenue=months.map(m=>filtered.filter(d=>d.month===m) .reduce((s, r)=>s+r.revenue, 0));
  const patients=revenue.map(v=>Math.round(v/500));

  exportData.revenueTrend=months.map((m, i)=>( {
        Month:m, Revenue:revenue[i], Patients:patients[i]
      }

    ));
  if(chart) chart.destroy();

  chart=new Chart(document.getElementById("revenueChart"), {
      type:'line', data: {
        labels:months, datasets:[ {
          label:"Revenue", data:revenue, borderWidth:3, tension:.3
        }

        , {
          label:"Patients", data:patients, borderDash:[6, 4], borderWidth:3
        }

        ]
      }

      , options: {
        maintainAspectRatio:false
      }
    }

  );
}

function updateCards(branch="All", month="All", year="All") {
  const f=getFiltered(branch, month, year);
  const total=f.reduce((s, r)=>s+r.revenue, 0);
  const patients=Math.round(total/500);
  document.querySelector("#revenueCard .kpi-value").innerText=total.toLocaleString("en-IN");
  document.querySelector("#patientsCard .kpi-value").innerText=patients.toLocaleString("en-IN");
  const growth=f.length>1?((f[f.length-1].revenue-f[0].revenue)/f[0].revenue)*100: 0;
  const g=document.querySelector("#growthCard .kpi-value");
  g.innerText=growth.toFixed(1)+"%";
  g.style.color=growth>=0?"#16a34a": "#dc2626";
}

function updateTable(branch="All", month="All", year="All") {
  const f=getFiltered(branch, month, year);
  const months=[...new Set(f.map(d=>d.month))];
  const tbody=document.querySelector("#summaryTable tbody");
  tbody.innerHTML="";
  exportData.tableData=[];

  months.forEach(m=> {
      const r=f.filter(d=>d.month===m).reduce((s, x)=>s+x.revenue, 0); const p=Math.round(r/500); exportData.tableData.push( {
          Month:m, Revenue:r, Patients:p
        }

      ); tbody.insertAdjacentHTML("beforeend",
`<tr>
    <td>${m}</td>
    <td>${r.toLocaleString("en-IN")}</td>
    <td>${p}</td>
</tr>`);
    }

  );
}

function buildBar(branch="All", month="All", year="All") {
  const f=getFiltered(branch, month, year);
  const months=[...new Set(f.map(d=>d.month))];
  const vals=months.map(m=>f.filter(d=>d.month===m).reduce((s, r)=>s+r.revenue, 0));

  exportData.monthlyBar=months.map((m, i)=>( {
        Month:m, Revenue:vals[i]
      }

    ));
  if(barChart) barChart.destroy();

  barChart=new Chart(document.getElementById("monthlyBarChart"), {
      type:"bar", data: {
        labels:months, datasets:[ {
          data:vals, label:"Monthly Revenue"
        }

        ]
      }

      , options: {
        maintainAspectRatio:false
      }
    }

  );
}

function buildDept(branch="All", month="All", year="All") {
  const f=getFiltered(branch, month, year);
  const depts=[...new Set(f.map(d=>d.dept))];
  const vals=depts.map(dep=>f.filter(d=>d.dept===dep).reduce((s, r)=>s+r.revenue, 0));

  exportData.department=depts.map((d, i)=>( {
        Department:d, Revenue:vals[i]
      }

    ));
  if(deptChart) deptChart.destroy();

  deptChart=new Chart(document.getElementById("deptChart"), {
      type:"bar", data: {
        labels:depts, datasets:[ {
          data:vals, label:"Dept Revenue"
        }

        ]
      }

      , options: {
        maintainAspectRatio:false
      }
    }

  );
}

function buildService(branch="All", month="All", year="All") {
  const f=getFiltered(branch, month, year);
  const services=[...new Set(f.map(d=>d.service))];
  const vals=services.map(s=>f.filter(d=>d.service===s).reduce((s1, r)=>s1+r.revenue, 0));

  exportData.service=services.map((s, i)=>( {
        Service:s, Revenue:vals[i]
      }

    ));
  if(serviceChart) serviceChart.destroy();

  serviceChart=new Chart(document.getElementById("serviceChart"), {
      type:"pie", data: {
        labels:services, datasets:[ {
          data:vals
        }

        ]
      }

      , options: {
        maintainAspectRatio:false
      }
    }

  );
}

function buildBranchSplit(branch="All",month="All",year="All"){

    const f = getFiltered(branch,month,year);

    const branches=[...new Set(f.map(d=>d.branch))];

    const vals=branches.map(b =>
        f.filter(d=>d.branch===b)
         .reduce((s,r)=>s+r.revenue,0)
    );

    if(branchChart) branchChart.destroy();

    branchChart=new Chart(document.getElementById("yearPieChart"),{
        type:"doughnut",
        data:{labels:branches,datasets:[{data:vals}]},
        options:{maintainAspectRatio:false}
    });
}

function buildDayPatientChart(branch="All", month="All", year="All") {
  let data=patientDayData;
  if(branch !=="All") data=data.filter(d=>d.branch===branch);
  if(month !=="All") data=data.filter(d=>d.month===month);
  if(year !=="All") data=data.filter(d=>d.year==year);
  const days=[...new Set(data.map(d=>d.day))];
  const values=days.map(day=>data.filter(d=>d.day===day) .reduce((s, r)=>s+r.patients, 0));

  exportData.dayPatients=days.map((d, i)=>( {
        Day:d, Patients:values[i]
      }

    ));
  if(dayChart) dayChart.destroy();

  dayChart=new Chart(document.getElementById("dayPatientChart"), {
      type:"bar", data: {
        labels:days, datasets:[ {
          label:"Patients", data:values
        }

        ]
      }

      , options: {
        maintainAspectRatio:false
      }
    }

  );
}

function applyFilters() {
  const branch=document.getElementById("panelBranch")?.value||"All";
  const year=document.getElementById("panelYear")?.value||"All";
  const month=document.getElementById("panelMonth")?.value||"All";
  buildChart(branch, month, year);
  updateCards(branch, month, year);
  updateTable(branch, month, year);
  buildBar(branch, month, year);
  buildDept(branch, month, year);
  buildService(branch, month, year);
  buildDayPatientChart(branch, month, year);
  buildBranchSplit(branch,month,year);
  console.log(branch, month, year);
  document.getElementById("filterPanel").classList.remove("open");
}

applyFilters();
document.getElementById("panelBranch").onchange=applyFilters;
document.getElementById("panelMonth").onchange=applyFilters;
document.getElementById("panelYear").onchange=applyFilters;
document.getElementById("applyFilters").onclick=applyFilters;
document.getElementById("filterBtn").onclick=()=>document.getElementById("filterPanel").classList.add("open");
document.getElementById("closeFilters").onclick=()=>document.getElementById("filterPanel").classList.remove("open");

function exportExcel(type) {
  const data=exportData[type];

  if( !data || data.length===0) {
    alert("No data to export");
    return;
  }

  const ws=XLSX.utils.json_to_sheet(data);
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, type);
  XLSX.writeFile(wb, type+".xlsx");
}

document.getElementById("darkModeBtn").onclick=()=> {
  document.body.classList.toggle("dark");
}

;

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  const btn=document.getElementById("darkModeBtn");
  btn.classList.add("rotate");

  setTimeout(()=> {
      btn.classList.remove("rotate");
    }

    , 350);
}