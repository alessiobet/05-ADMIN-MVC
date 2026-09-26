import { getManagers, addNewManager } from "../api/api.fetch.managers.js";
import { getDepts } from "../api/api.fetch.depts.js";

// table
const table = document.getElementById("data-table");
const tbody = document.getElementById("table-body");

// buttons
const btnAdd = document.getElementById("btn-add");
const btnModify = document.getElementById("btn-modify");
const btnDelete = document.getElementById("btn-delete");
const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");

// status bar
const rowCount = document.getElementById("row-count");
const status = document.getElementById("status");

// call API
const managers = await getManagers();
const sectors = await getDepts();

console.log("=============================");
console.log(managers);
console.log("=============================");
console.log(sectors);
console.log("=============================");


// STATE  null - add - modify
let selectedId = null;
let editMode = null;

// LOAD TABLE
async function loadTable() {
    
    // TABLE HEADER WIDTH -- fill table => colGroup => col
    const colGroup = table.querySelector("colgroup")
    colGroup.innerHTML = "";
    const headerTable = table.querySelector("thead")
    headerTable.innerHTML = "";
    
    const lg = Object.keys(managers[0]).length
    const colWidth = 100 / lg
    
    // TABLE HEADER TH -- fill table => thead => tr => th 
    const trHead = document.createElement("tr");

    Object.keys(managers[0]).forEach(key => {

        const col = document.createElement("col");
        col.style.width = `${colWidth}%`;
        colGroup.appendChild(col);

        const th = document.createElement("th");
        th.textContent = key
        trHead.appendChild(th);
    });
    headerTable.appendChild(trHead)

    // TABLE HEADER TD -- fill table => tbody => tr => td
    tbody.innerHTML = "";

    managers.forEach(manager => {
        const tr = document.createElement("tr");
        tr.dataset.id = manager.idMng;
        tr.innerHTML = `
            <td>${manager.idMng}</td>
            <td>${manager.mng}</td>
            <td>${manager.dept}</td>
            <td>
                <input
                    type="checkbox"
                    ${manager.isActive ? "checked" : ""}
                    disabled
                >
            </td>
        `;
        tr.addEventListener("click", () => {
            selectRow(tr);
        });
        tbody.appendChild(tr);
    });
    rowCount.textContent = `${managers.length} rows`;
};
// SELECT ROW
function selectRow(row) {
    if (editMode) return;
    document.querySelectorAll("#table-body tr")
        .forEach(tr => {
            tr.classList.remove("selected");
        });
    row.classList.add("selected");
    selectedId = Number(row.dataset.id);
    btnModify.disabled = false;
    btnDelete.disabled = false;
    status.textContent = `Selected ID: ${selectedId}`;
}
// ADD
btnAdd.addEventListener("click", () => {
    if (editMode) return;
    editMode = "add";
    clearSelection();
    const tr = document.createElement("tr");
    tr.classList.add("selected", "editing");
    tr.innerHTML = `
        <td>NEW</td>

        <td>
            <input type="text" id="edit-manager" placeholder="Manager name">
        </td>

        <td>
            <select id="edit-dept">
                <option value="">-- Choose a Dept --</option>
                ${sectors
                    .map(sector => `
                        <option value="${sector.idDept}">
                            ${sector.dept}
                        </option>
                    `).join("")}
            </select>
        </td>

        <td>
            <input type="checkbox" id="edit-active" checked>
        </td>
    `;
    tbody.prepend(tr);
    setEditingButtons(true);
    document.getElementById("edit-manager").focus();
    status.textContent = "Adding new row...";
});
// MODIFY
btnModify.addEventListener("click", () => {
    if (selectedId === null) return;
    const manager = managers.find(m => m.idMng === selectedId);
    if (!manager) return;
    editMode = "modify";
    const row = document.querySelector(`tr[data-id="${selectedId}"]`);
    row.innerHTML = `
        <td>${manager.idMng}</td>

        <td>
            <input type="text" id="edit-manager" value="${manager.mng}">
        </td>

        <td>
            <select id="edit-dept">
                ${sectors
                    .map(sector => `
                        <option value="${sector.idDept}">${sector.dept}</option>
                    `).join("")}
            </select>
        </td>

        <td>
            <input type="checkbox" id="edit-active" ${manager.isActive ? "checked" : ""}>
        </td>
    `;
    const deptSelect = document.getElementById("edit-dept")
    const option = [...deptSelect.options].find(
        option => option.textContent === manager.dept
    );
    if (option) option.selected = true;
    setEditingButtons(true);
    document.getElementById("edit-manager").focus();
    status.textContent = `Editing ID: ${selectedId}`;
});
// SAVE
btnSave.addEventListener("click", async () => {
    const dept = document.getElementById("edit-dept").value;
    const managerName = document.getElementById("edit-manager").value.trim();
    const isActive = document.getElementById("edit-active").checked;

    if (!managerName) return alert("Please enter a manager name.");
    const payload = { 
        deptId: dept, 
        mng: managerName, 
        isActive: isActive 
    };

    // ADD
    if (editMode === "add") {
        const result = await addNewManager(payload);
        alert(result.message)
    }



    
    // MODIFY
    // get manager id
    const managerId = 1; /////////////////////////////////
    if (editMode === "modify") {
        const result = await updateManager(managerId, payload);
        alert(result.message)
    }

    editMode = null;
    selectedId = null;
    setEditingButtons(false);
    loadTable();
    status.textContent = "Changes saved";
});

// DELETE
btnDelete.addEventListener("click", () => {
    if (selectedId === null) return;
    const manager = managers.find(m => m.idMng === selectedId);
    if (!manager) return;
    const confirmed = confirm(`Delete manager "${manager.mng}"?`);
    if (!confirmed) return;
    managers = managers.filter(m => m.idMng !== selectedId);

    /*
    Later:

    await fetch(`/api/managers/${selectedId}`, {
        method: "DELETE"
    });
    */

    // reload table
    loadTable();

    selectedId = null;
    loadTable();
    btnModify.disabled = true;
    btnDelete.disabled = true;
    status.textContent = "Row deleted";
});

// CANCEL
btnCancel.addEventListener("click", () => {
    editMode = null;
    selectedId = null;
    setEditingButtons(false);
    loadTable();
    status.textContent = "Changes cancelled";
});
// BUTTON STATE
function setEditingButtons(editing) {
    btnAdd.disabled = editing;
    btnModify.disabled = true;
    btnDelete.disabled = true;
    btnSave.hidden = !editing;
    btnCancel.hidden = !editing;
};
// CLEAR SELECTION
function clearSelection() {
    document.querySelectorAll("#table-body tr")
        .forEach(tr => {
            tr.classList.remove("selected");
        });
    selectedId = null;
    btnModify.disabled = true;
    btnDelete.disabled = true;
};
// Initial load
loadTable();
