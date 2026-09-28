function loadTable(table, data) {

    const colgroup = table.querySelector("#data-table colgroup");
    const thead = table.querySelector("#data-table thead");
    const tbody = table.querySelector("#data-table tbody");

    colgroup.innerHTML = "";
    thead.innerHTML = "";
    tbody.innerHTML = "";

    if (!data || data.length === 0) return;

    const columns = Object.keys(data[0]);

    // 1. DETECT COLUMN TYPES
    const columnInfo = columns.map(column => {

        // Find first non-null value
        const value = data.find(row =>
            row[column] !== null &&
            row[column] !== undefined
        )?.[column];

        let type = "string";

        if (typeof value === "boolean") {
            type = "boolean";
        }
        else if (typeof value === "number") {
            type = "number";
        }
        else if (
            value instanceof Date ||
            (
                typeof value === "string" &&
                /^\d{4}-\d{2}-\d{2}/.test(value)
            )
        ) {
            type = "date";
        }

        return {
            name: column,
            type: type
        };
    });

    // 2. CALCULATE WIDTHS
    let usedWidth = 0;
    columnInfo.forEach(column => {

        if (column.type === "boolean") {
            column.width = 10;
            usedWidth += 10;
        }

        else if (
            column.type === "number" ||
            column.type === "date"
        ) {
            column.width = 20;
            usedWidth += 20;
        }
    });

    // Find string columns
    const stringColumns = columnInfo.filter(
        column => column.type === "string"
    );

    // Remaining space
    const remainingWidth = 100 - usedWidth;

    // Divide it between strings
    const stringWidth =
        stringColumns.length > 0
            ? remainingWidth / stringColumns.length
            : 0;

    stringColumns.forEach(column => {
        column.width = stringWidth;
    });

    // 3. CREATE COLGROUP
    columnInfo.forEach(column => {
        const col = document.createElement("col");
        col.style.width = `${column.width}%`;
        colgroup.appendChild(col);
    });

    // 4. CREATE HEADER
    const headerRow = thead.insertRow();
    columnInfo.forEach(column => {
        // insertCell() creates TD, not TH,
        // so for headers we still use createElement()
        const th = document.createElement("th");
        th.textContent = column.name;
        headerRow.appendChild(th);
    });

    // 5. CREATE BODY
    data.forEach(rowData => {

        // Create <tr>
        const row = tbody.insertRow();

        // Store original object inside the row
        row.rowData = rowData;

        columnInfo.forEach(column => {
            // Automatically creates <td>
            const cell = row.insertCell();
            const value = rowData[column.name];

            // ------------------------------------------
            // BOOLEAN
            // ------------------------------------------
            if (column.type === "boolean") {
                const checkbox =
                    document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = Boolean(value);
                checkbox.disabled = true;
                cell.appendChild(checkbox);
            }

            // ------------------------------------------
            // DATE
            // ------------------------------------------
            else if (column.type === "date") {
                cell.textContent =
                    value
                        ? new Date(value)
                            .toLocaleDateString("en-GB")
                        : "";
            }

            // ------------------------------------------
            // STRING / NUMBER
            // ------------------------------------------
            else {
                cell.textContent = value ?? "";
            }
        });
    });
    document.getElementById("row-count").textContent = `${data.length} rows`;
}

export {
    loadTable
}