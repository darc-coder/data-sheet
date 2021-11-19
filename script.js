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
            let button = document.createElement('input');

            // set input attributes.
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'Remove');

            // add button's 'onclick' event.
            button.setAttribute('onclick', 'removeRow(this)');

            td.appendChild(button);
        }
        else {
            // rest column, will have textbox.


            td.innerText = "Click to edit R";

        }
    }
}

function Loadtable() {
    let datacols = data.monthlyStatusReport.columns;
    let datarows = data.monthlyStatusReport.rows;
    let tableheader = document.querySelector('table thead');
    let tablebody = document.querySelector('table tbody');

    tableheader.innerHTML = '';
    tablebody.innerHTML = '';

    let newheadrow = document.createElement('tr');
    tableheader.append(newheadrow);

    datacols.forEach((colString, index) => {
        let newrowdata = document.createElement('th');
        newrowdata.innerText = colString;
        newheadrow.append(newrowdata);
    });

    for (const it in datarows) {
        let newbodyrow = document.createElement('tr');

        datarows[it].forEach((colString, index) => {
            let newrowdata = document.createElement('td');
            newrowdata.innerText = colString;
            newbodyrow.append(newrowdata);
        })
        tablebody.append(newbodyrow);
    }
}