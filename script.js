function addColumn() {
    console.log('Adding column');
    [...document.querySelectorAll('table tr')].forEach((row, i) => {
        const cell = document.createElement(i ? "td" : "th");
        cell.innerText = "Click to edit C";
        row.appendChild(cell);
    });
}

document.querySelector('.add-column').onclick = addColumn
document.querySelector('.add-row').onclick = addRow

function getRemoveButton() {
    let button = document.createElement('input');

    button.type = 'button';
    button.value = 'Remove';

    // add button's 'onclick' event.
    button.setAttribute('onclick', 'removeRow(this)');

    return button;
}

// now, add a new to the TABLE.
function addRow() {
    let table = document.querySelector('table');

    let rowCnt = table.rows.length;   // table row count.
    let tr = table.insertRow(rowCnt); // the table row.

    let arrHead = document.querySelectorAll('table tr:nth-child(1) th');

    for (let c = 0; c < arrHead.length; c++) {
        let td = document.createElement('td'); // table definition.
        td = tr.insertCell(c);

        if (c == 0) {      // the first column.
            // add a button in every new row in the first column.

            let button = getRemoveButton();

            td.appendChild(button);
        }
        else {
            // rest column
            td.innerText = "Click to edit R";
        }
    }
}

function removeRow(event) {
    let table = document.querySelector('table');
    // button -> td -> tr.
    table.deleteRow(event.parentNode.parentNode.rowIndex);
}

function Loadtable(chartName) {
    let datacols = data[chartName].columns;
    let datarows = data[chartName].rows;
    let tableheader = document.querySelector('table thead');
    let tablebody = document.querySelector('table tbody');

    tableheader.innerHTML = '';
    tablebody.innerHTML = '';

    let newheadrow = document.createElement('tr');
    tableheader.append(newheadrow);

    // setting table header, top-left cell blank
    let newrowdata = document.createElement('th');
    let primarycol = document.createElement('th');

    primarycol.innerText = data[chartName].primarycolumn;

    newheadrow.append(newrowdata, primarycol);

    datacols.forEach((colString, index) => {
        let newrowdata = document.createElement('th');
        newrowdata.innerText = colString;
        newheadrow.append(newrowdata);
    });

    // now setting table body, first create rows then columns
    for (const it in datarows) {
        let newbodyrow = document.createElement('tr');
        let newrowdata = document.createElement('td');
        let primarycol = document.createElement('td');

        primarycol.innerText = it;
        newrowdata.append(getRemoveButton());
        newbodyrow.append(newrowdata, primarycol);

        datarows[it].forEach((colString, index) => {
            let newrowdata = document.createElement('td');
            newrowdata.innerText = colString;
            newbodyrow.append(newrowdata);
        })
        tablebody.append(newbodyrow);
    }
}

// Call the Load Function
for (const it in chartNames) {
    Loadtable(it);
    break;
}