class DataTable {
    // Constructor
    constructor(table, data = [], columns = []) {
        console.log("DataTable constructor");
        console.log("table:", table);
        console.log("data:", data);
        console.log("columns:", columns);

        this.table = table;
        this.data = data;
        this.columns = columns;

        this.selectedRow = null;
        this.newRow = null;
        this.modifiedRow = null;
        this.editMode = false;

        this.createTable();
    }

    // Create table
    createTable() {

        this.table.innerHTML = "";

        this.selectedRow = null;
        this.newRow = null;
        this.modifiedRow = null;
        this.editMode = false;

        this.createColgroup();
        this.createHeader();
        this.createBody();

        this.selectRowListener();

        return this;
    }

    // Create column widths
    createColgroup() {

        const colgroup = document.createElement("colgroup");

        this.columns.forEach(column => {

            const col = document.createElement("col");

            col.style.width = `${column.width}%`;

            colgroup.appendChild(col);
        });

        this.table.appendChild(colgroup);
    }

    // Create header
    createHeader() {

        const thead = this.table.createTHead();
        const row = thead.insertRow();

        this.columns.forEach(column => {

            const th = document.createElement("th");

            th.textContent = column.header;

            row.appendChild(th);
        });
    }

    // Create body
    createBody() {
        const tbody = this.table.createTBody();
        this.data.forEach(item => {
            const row = tbody.insertRow();
            row.rowData = item;
            this.columns.forEach(column => {
                const cell = row.insertCell();
                this.createCell(
                    cell,
                    item[column.field],
                    column.inputType,
                    column
                );
            });
        });
    }

    // Create normal read-only cell
    createCell(cell, value, inputType, column = {}) {
        cell.replaceChildren();
        switch (inputType) {
            case "checkbox": {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = Boolean(value);
                checkbox.disabled = true;
                cell.appendChild(checkbox);
                break;
            }
            case "date": {
                cell.textContent = value
                    ? new Date(value).toLocaleDateString("en-GB")
                    : "";
                break;
            }
            case "select": {
                // Display option text instead of its ID
                const option = column.options?.find(
                    opt => String(opt.value) === String(value)
                );
                cell.textContent = option?.text ?? value ?? "";
                break;
            }
            default: {
                cell.textContent = value ?? "";
                break;
            }
        }
    }

    // Create an input with an optional initial value
    createInput(column, value = null) {
        let input;
        switch (column.inputType) {
            case "select": {
                input = document.createElement("select");
                (column.options ?? []).forEach(option => {
                    const opt = document.createElement("option");
                    opt.value = option.value;
                    opt.textContent = option.text;
                    input.appendChild(opt);
                });
                if (value !== null && value !== undefined) {
                    input.value = String(value);
                }
                break;
            }
            case "textarea": {
                input = document.createElement("textarea");
                input.value = value ?? "";
                break;
            }
            default: {
                input = document.createElement("input");
                input.type = column.inputType ?? "text";
                if (column.inputType === "checkbox") {
                    input.checked = Boolean(value);
                } else if (column.inputType === "date") {
                    // HTML date inputs require YYYY-MM-DD
                    input.value = value
                        ? value instanceof Date
                            ? value.toISOString().slice(0, 10)
                            : String(value).slice(0, 10)
                        : "";
                } else {
                    input.value = value ?? "";
                }
                break;
            }
        }
        input.name = column.field;
        input.classList.add("table-input");
        input.dataset.field = column.field;
        return input;
    }

    // Add a new editable row
    addRow() {
        if (this.editMode) return this;
        const tbody = this.table.tBodies[0];
        const row = tbody.insertRow(0);
        row.classList.add("new-row");
        this.newRow = row;
        this.editMode = true;
        this.columns.forEach(column => {
            const cell = row.insertCell();
            if (column.editable === false) {
                cell.textContent = "";
                return;
            }
            const input = this.createInput(column);
            cell.appendChild(input);
        });
        this.selectRow(row);

        // this.setEditingButtons(true);
//     document.getElementById("edit-manager").focus();
//     status.textContent = "Adding new row...";


        return this;
    }

    // Modify the selected row
    modifyRow() {

        if (this.editMode || !this.selectedRow) return this;

        const row = this.selectedRow;
        const item = row.rowData;

        if (!item) return this;

        this.modifiedRow = row;
        this.editMode = true;

        row.classList.add("editing-row");

        this.columns.forEach((column, index) => {

            const cell = row.cells[index];

            const value = item[column.field];

            // Keep non-editable columns as normal cells
            if (column.editable === false) return;

            const input = this.createInput(column, value);

            cell.replaceChildren(input);
        });

        return this;
    }

    // Read input values from a row
    readRowInputs(row, includeOriginal = false) {

        if (!row) return null;

        // For modifications, preserve the original fields
        const result = includeOriginal
            ? { ...row.rowData }
            : {};

        this.columns.forEach((column, index) => {

            if (column.editable === false) return;

            const cell = row.cells[index];

            const input = cell.querySelector(
                "input, select, textarea"
            );

            if (!input) return;

            let value;

            switch (column.inputType) {

                case "checkbox": {

                    value = input.checked;
                    break;
                }

                case "number": {

                    value = input.value === ""
                        ? null
                        : Number(input.value);

                    break;
                }

                default: {

                    value = input.value;
                    break;
                }
            }

            result[column.field] = value;
        });

        return result;
    }

    // Get new row data
    getNewRowData() {

        return this.readRowInputs(this.newRow);
    }

    // Get modified row data
    getModifiedData() {

        return this.readRowInputs(this.modifiedRow, true);
    }

    // Cancel a new row
    cancelNewRow() {
        if (!this.newRow) return this;
        if (this.selectedRow === this.newRow) {
            this.unselectRow();
        }
        this.newRow.remove();
        this.newRow = null;
        this.editMode = false;
        return this;
    }

    // Cancel modification and restore original values
    cancelModify() {
        if (!this.modifiedRow) return this;
        const row = this.modifiedRow;
        const item = row.rowData;
        this.columns.forEach((column, index) => {
            const cell = row.cells[index];
            this.createCell(
                cell,
                item[column.field],
                column.inputType,
                column
            );
        });
        row.classList.remove("editing-row");
        this.modifiedRow = null;
        this.editMode = false;
        return this;
    }

    // Delete selected row
    deleteRow() {
    
        // Prevent deletion while adding or modifying
        if (this.editMode) return null;
    
        // Check if a row is selected
        if (!this.selectedRow) return null;
    
        const row = this.selectedRow;
    
        // Get original object
        const item = row.rowData;
    
        // Remove object from internal data array
        this.data = this.data.filter(data => data !== item);
    
        // Remove row from HTML table
        row.remove();
    
        // Reset selection
        this.selectedRow = null;
    
        // Return deleted object
        return item;
    }

    // Activate row selection
    selectRowListener() {

        const tbody = this.table.tBodies[0];

        tbody.addEventListener("click", event => {

            const row = event.target.closest("tr");

            if (!row || !tbody.contains(row)) return;

            // Prevent changing selection while editing
            if (this.editMode && row !== this.selectedRow) return;

            this.selectRow(row);
        });

        return this;
    }

    // Select row
    selectRow(row) {

        this.unselectRow();

        row.classList.add("selected");

        this.selectedRow = row;

        return this;
    }

    // Unselect row
    unselectRow() {

        if (!this.selectedRow) return this;

        this.selectedRow.classList.remove("selected");

        this.selectedRow = null;

        return this;
    }

    // Get selected row data
    getSelectedData() {

        if (this.selectedRow === this.newRow) {
            return this.getNewRowData();
        }

        if (this.selectedRow === this.modifiedRow) {
            return this.getModifiedData();
        }

        return this.selectedRow?.rowData ?? null;
    }

    // Set edit mode
    setEditMode(value) {

        this.editMode = Boolean(value);

        return this;
    }

    // Replace table data
    setData(data) {

        this.data = data;

        this.createTable();

        return this;
    }
}

export default DataTable;


/* | Method | Creates |
|---|---|
| `table.createTHead()` | `<thead>` |
| `table.createTBody()` | `<tbody>` |
| `table.insertRow()` | `<tr>` |
| `tbody.insertRow()` | `<tr>` |
| `row.insertCell()` | `<td>` |
| `table.deleteRow()` | Removes a row |
| `row.deleteCell()` | Removes a cell | */

/* | Code | Creates | Automatically inserts? |
|---|---|---|
| `document.createElement("thead")` | `<thead>` | ❌ |
| `table.createTHead()` | `<thead>` | ✅ |
| `table.createTBody()` | `<tbody>` | ✅ |
| `tbody.insertRow()` | `<tr>` | ✅ |
| `row.insertCell()` | `<td>` | ✅ |
| `document.createElement("th")` | `<th>` | ❌ | */

/* | Method | What it does |
|---|---|
| `table.createTHead()` | Creates/inserts `<thead>` |
| `table.deleteTHead()` | Deletes `<thead>` |
| `table.createTBody()` | Creates/inserts `<tbody>` |
| `table.createTFoot()` | Creates/inserts `<tfoot>` |
| `table.deleteTFoot()` | Deletes `<tfoot>` |
| `table.createCaption()` | Creates/inserts `<caption>` |
| `table.deleteCaption()` | Deletes `<caption>` |
| `table.insertRow()` | Creates/inserts a `<tr>` |
| `table.deleteRow(index)` | Deletes a row | */

/* // TABLE
table.createTHead()
table.createTBody()
table.insertRow()
table.deleteRow()

table.tHead
table.tBodies
table.rows

// ROW
row.insertCell()
row.deleteCell()

row.cells
row.rowIndex
row.sectionRowIndex

// CELL
cell.cellIndex
cell.colSpan
cell.rowSpan */


/* const columns = [
    {
        field: "idMng",
        header: "ID",
        inputType: "number",
        width: 10,
        editable: false
    },
    {
        field: "deptId",
        header: "Department",
        inputType: "select",
        width: 25,
        options: [
            { value: 1, text: "LG" },
            { value: 2, text: "GASTRO" },
            { value: 3, text: "SLOT" }
        ]
    },
    {
        field: "mng",
        header: "Manager",
        inputType: "text",
        width: 45
    },
    {
        field: "isActive",
        header: "Active",
        inputType: "checkbox",
        width: 20
    }
]; */


/* inputType: "text"
inputType: "number"
inputType: "date"
inputType: "checkbox"
inputType: "select"
inputType: "textarea"
inputType: "email"
inputType: "time" */



/* CSS
table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
}

th,
td {
    padding: .6rem;
    border: 1px solid #ccc;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

tbody tr {
    cursor: pointer;
}

tbody tr:hover {
    background-color: #e9f2ff;
}

tbody tr.selected {
    background-color: #b8d8ff;
}

td input[type="checkbox"] {
    display: block;
    margin: auto;
}


table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
}

th,
td {
    padding: .5rem;
    border: 1px solid #ccc;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

tbody tr {
    cursor: pointer;
}

tbody tr:hover {
    background-color: #e8f1ff;
}

tbody tr.selected {
    background-color: #b8d8ff;
}

tbody tr.new-row {
    background-color: #fff4d6;
}

.table-input {
    width: 100%;
    min-width: 0;
    padding: .4rem;
    box-sizing: border-box;
    font: inherit;
}

.table-input[type="checkbox"] {
    width: auto;
    display: block;
    margin: auto;
}



tr.editing-row {
    background-color: #fff4d6;
}

tr.new-row {
    background-color: #e4f5e8;
}

.table-input {
    width: 100%;
    min-width: 0;
    padding: .4rem;
    box-sizing: border-box;
    font: inherit;
}

.table-input[type="checkbox"] {
    width: auto;
    display: block;
    margin: auto;
} */

