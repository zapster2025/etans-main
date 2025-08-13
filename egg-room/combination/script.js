
document.querySelectorAll("table input").forEach(input => {
  input.type = "number";
  input.min = 0;
  input.addEventListener("input", function() {
    this.value = this.value.replace(/[^0-9]/g, "");
  });
});

const inputs = document.querySelectorAll("#eggTable input");
const sumCells = document.querySelectorAll("#sumRow .sumCell");
const simpCells = document.querySelectorAll("#simplifiedRow .simpCell");

function saveData() {
  const data = Array.from(inputs).map(input => input.value);
  const hiddenRows = Array.from(document.querySelectorAll("[id^='row-']")).map(row =>
    row.style.display === "none"
  );
  localStorage.setItem("eggTableData", JSON.stringify({ data, hiddenRows }));
}

function loadData() {
  const saved = localStorage.getItem("eggTableData");
  if (saved) {
    const { data, hiddenRows } = JSON.parse(saved);
    inputs.forEach((input, i) => input.value = data[i] || "");
    document.querySelectorAll("[id^='row-']").forEach((row, i) => {
      if (hiddenRows[i]) {
        row.style.display = "none";
        row.querySelector(".hide-btn").textContent = "Show";
      }
    });
    updateSums();
  }
}

function resetData() {
  if (confirm("⚠ Are you sure you want to reset all data? This will clear all entered numbers.")) {
    inputs.forEach(input => input.value = "");
    localStorage.removeItem("eggTableData");
    updateSums();
  }
}

function updateSums(){
  const sums = Array(sumCells.length).fill(0);
  inputs.forEach((input, idx) => {
    const val = parseFloat(input.value) || 0;
    sums[idx % sums.length] += val;
  });
  sums.forEach((sum, i) => {
    sumCells[i].textContent = sum;
  });
  for(let i = 0; i < sums.length; i += 3) {
    let cs = sums[i], tr = sums[i+1], pcs = sums[i+2];
    if(pcs >= 30){
      let addTr = Math.floor(pcs / 30);
      tr += addTr;
      pcs = pcs % 30;
    }
    if(tr >= 12){
      let addCs = Math.floor(tr / 12);
      cs += addCs;
      tr = tr % 12;
    }
    simpCells[i].textContent = cs;
    simpCells[i+1].textContent = tr;
    simpCells[i+2].textContent = pcs;
  }
  saveData();
}

// Validation for Tr and Pcs columns
inputs.forEach((input, idx) => {
  input.addEventListener("input", function() {
    const colPosition = (idx % (13 * 3)) % 3; // 0=Cs, 1=Tr, 2=Pcs
    let val = parseInt(this.value) || 0;

    if (colPosition === 1 && val > 11) {
      alert("wrong input");
      this.value = "";
    }
    if (colPosition === 2 && val > 29) {
      alert("wrong input");
      this.value = "";
    }

    updateSums();
  });
});

function toggleRow(b){
  const row = document.getElementById(`row-${b}`);
  const btn = row.querySelector(".hide-btn");
  if(row.style.display === "none"){
    row.style.display = "";
    btn.textContent = "Hide";
  } else {
    row.style.display = "none";
    btn.textContent = "Show";
  }
  saveData();
}

function showAllRows(){
  const rows = document.querySelectorAll("[id^='row-']");
  rows.forEach(row => {
    row.style.display = "";
    row.querySelector(".hide-btn").textContent = "Hide";
  });
  saveData();
}

function checkOrientation(){
  document.getElementById("rotateNotice").style.display =
    (window.innerHeight > window.innerWidth) ? "block" : "none";
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("load", () => {
  checkOrientation();
  loadData();
});
