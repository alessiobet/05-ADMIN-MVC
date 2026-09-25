import { getManagers } from "../api/api.fetch.managers.js";
import { getDepts } from "../api/api.fetch.depts.js";

// import {  getSectors, getAllManagers, addNewManager, updateManager } from "./fetchApi.js";

const tbody = document.getElementById("table-body");

const btnAdd = document.getElementById("btn-add");
const btnModify = document.getElementById("btn-modify");
const btnDelete = document.getElementById("btn-delete");
const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");

const rowCount = document.getElementById("row-count");
const status = document.getElementById("status");

const managers = await getManagers();
// {idMng: 37, mng: 'C...', deptId: 4, dept: 'GASTRO', isActive: true} 

const sectors = await getDepts();
// {idDept: 5, dept: 'ADMIN', isActive: true}


console.log(managers);
console.log("=============================");
console.log(sectors);







// ==========================================================
// STATE  null - add - modify
// ==========================================================
let selectedId = null;
let editMode = null;

// // ==========================================================
// // LOAD TABLE
// // ==========================================================
// async function loadTable() {
//     tbody.innerHTML = "";
//     managers.forEach(manager => {
//         const tr = document.createElement("tr");
//         tr.dataset.id = manager.idMng;
//         tr.innerHTML = `
//             <td>${manager.idMng}</td>
//             <td>${manager.dept}</td>
//             <td>${manager.mng}</td>
//             <td>
//                 <input
//                     type="checkbox"
//                     ${manager.isActive ? "checked" : ""}
//                     disabled
//                 >
//             </td>
//         `;
//         tr.addEventListener("click", () => {
//             selectRow(tr);
//         });
//         tbody.appendChild(tr);
//     });
//     rowCount.textContent = `${managers.length} rows`;
// }

// // ==========================================================
// // SELECT ROW
// // ==========================================================
// function selectRow(row) {
//     if (editMode) return;
//     document.querySelectorAll("#table-body tr")
//         .forEach(tr => {
//             tr.classList.remove("selected");
//         });
//     row.classList.add("selected");
//     selectedId = Number(row.dataset.id);
//     btnModify.disabled = false;
//     btnDelete.disabled = false;
//     status.textContent = `Selected ID: ${selectedId}`;
// }

// // ==========================================================
// // ADD
// // ==========================================================
// btnAdd.addEventListener("click", () => {
//     if (editMode) return;
//     editMode = "add";
//     clearSelection();
//     const tr = document.createElement("tr");
//     tr.classList.add("selected", "editing");
//     tr.innerHTML = `
//         <td>NEW</td>

//         <td>
//             <select id="edit-dept">
//                 <option value="">-- Choose a Department --</option>
//                 ${sectors
//                     .map(sector => `
//                         <option value="${sector.idDept}">
//                             ${sector.dept}
//                         </option>
//                     `)
//                     .join("")}
//             </select>
//         </td>

//         <td>
//             <input
//                 type="text"
//                 id="edit-manager"
//                 placeholder="Manager name"
//             >
//         </td>

//         <td>
//             <input
//                 type="checkbox"
//                 id="edit-active"
//                 checked
//             >
//         </td>
//     `;
//     tbody.prepend(tr);
//     setEditingButtons(true);
//     document.getElementById("edit-manager").focus();
//     status.textContent = "Adding new row...";
// });

// // ==========================================================
// // MODIFY
// // ==========================================================
// btnModify.addEventListener("click", () => {
//     if (selectedId === null) return;
//     const manager = managers.find(m => m.idMng === selectedId);

//     if (!manager) return;
//     editMode = "modify";
//     const row = document.querySelector(`tr[data-id="${selectedId}"]`);
//     row.innerHTML = `
//         <td>${manager.idMng}</td>

//         <td>
//             <select id="edit-dept">
//                 ${sectors
//                     .map(sector => `
//                         <option value="${sector.idDept}">
//                             ${sector.dept}
//                         </option>
//                     `)
//                     .join("")}
//             </select>
//         </td>

//         <td>
//             <input
//                 type="text"
//                 id="edit-manager"
//                 value="${manager.mng}"
//             >
//         </td>

//         <td>
//             <input
//                 type="checkbox"
//                 id="edit-active"
//                 ${manager.isActive ? "checked" : ""}
//             >
//         </td>
//     `;
//     document.getElementById("edit-dept").value = manager.deptId;
//     setEditingButtons(true);
//     document.getElementById("edit-manager").focus();
//     status.textContent = `Editing ID: ${selectedId}`;
// });





// // ==========================================================
// // SAVE
// // ==========================================================
// btnSave.addEventListener("click", async () => {
//     const dept = document.getElementById("edit-dept").value;
//     const managerName = document.getElementById("edit-manager").value.trim();
//     const isActive = document.getElementById("edit-active").checked;

//     if (!managerName) {
//         alert("Please enter a manager name.");
//         return;
//     }

//     const payload = { 
//         deptId: dept, 
//         mng: managerName, 
//         isActive: isActive 
//     };

//     // ADD
//     if (editMode === "add") {
//         const result = await addNewManager(payload);
//         alert(result.message)
//     }

//     // MODIFY
//     // get manager id
//     const managerId = 1; /////////////////////////////////
//     if (editMode === "modify") {
//         const result = await updateManager(managerId, payload);
//         alert(result.message)
//     }


//     editMode = null;
//     selectedId = null;
//     setEditingButtons(false);
//     loadTable();
//     status.textContent = "Changes saved";
// });

// // ==========================================================
// // DELETE
// // ==========================================================
// btnDelete.addEventListener("click", () => {
//     if (selectedId === null) return;
//     const manager = managers.find(m => m.idMng === selectedId);
//     if (!manager) return;
//     const confirmed = confirm(`Delete manager "${manager.mng}"?`);
//     if (!confirmed) return;
//     managers = managers.filter(m => m.idMng !== selectedId);

//     /*
//     Later:

//     await fetch(`/api/managers/${selectedId}`, {
//         method: "DELETE"
//     });
//     */

//     selectedId = null;
//     loadTable();
//     btnModify.disabled = true;
//     btnDelete.disabled = true;
//     status.textContent = "Row deleted";
// });

// // ==========================================================
// // CANCEL
// // ==========================================================
// btnCancel.addEventListener("click", () => {
//     editMode = null;
//     selectedId = null;
//     setEditingButtons(false);
//     loadTable();
//     status.textContent = "Changes cancelled";
// });

// // ==========================================================
// // BUTTON STATE
// // ==========================================================
// function setEditingButtons(editing) {
//     btnAdd.disabled = editing;
//     btnModify.disabled = true;
//     btnDelete.disabled = true;
//     btnSave.hidden = !editing;
//     btnCancel.hidden = !editing;
// }

// // ==========================================================
// // CLEAR SELECTION
// // ==========================================================
// function clearSelection() {
//     document.querySelectorAll("#table-body tr")
//         .forEach(tr => {
//             tr.classList.remove("selected");
//         });
//     selectedId = null;
//     btnModify.disabled = true;
//     btnDelete.disabled = true;
// }

// // ==========================================================
// // INITIAL LOAD
// // ==========================================================

// loadTable();
