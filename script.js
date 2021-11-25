let currentChartName = "default";
let datatable = document.querySelector('table.data-table');
let tableheader = document.querySelector('table thead');
let tablebody = document.querySelector('table tbody');
let addRowBtn = document.querySelector('.add-row');
let addColBtn = document.querySelector('.add-column');
let saveDataBtn = document.querySelector('.save-data');
let sheetTitle = document.querySelector('.sheet-title');
let selectChart = document.querySelector('#select-chart');
let dialogBox = document.querySelector('.dialog-box');
let dialogHead = document.querySelector('.dialog .head');
let dialogText = document.querySelector('.dialog .body-text');
let dialogSubmit = document.querySelector('.dialog-box .primary');
let dialogCancel = document.querySelector('.dialog-box .secondary');
let addChartBtn = document.querySelector('#add-chart');
let delChartBtn = document.querySelector('#del-chart');
let dialogValue = document.querySelector('.dialog #dialog-value');
let delColBtn = document.querySelector('.Del-column');
let downloadBtn = document.querySelector('.download-data');

function addColumn() {
    let tablerows = document.querySelectorAll('table tr');
    [...tablerows].forEach((row, i) => {
        const cell = document.createElement(i ? "td" : "th");
        cell.innerText = "[edit]";
        row.appendChild(cell);
    });
}

addRowBtn.onclick = addRow;
addColBtn.onclick = addColumn;
saveDataBtn.onclick = saveData.bind(this, false);
downloadBtn.onclick = saveData.bind(this, true);

let dataTableChanges = false;
let dataTableContent = "";
let dialogBoxName = "";

function unsaveChanges(addListener = true) {
    if (addListener) {
        addEventListener("beforeunload", beforeUnloadListener, { capture: true });
        dataTableChanges = true;
        saveDataBtn.classList.add('active');
    }
    else {
        removeEventListener("beforeunload", beforeUnloadListener, { capture: true });
        dataTableChanges = false;
        saveDataBtn.classList.remove('active');
    }
};

const beforeUnloadListener = (event) => {
    event.preventDefault();
    return event.returnValue = "Are you sure you want to exit?";
};

datatable.oninput = (event) => {
    if (dataTableContent != datatable.textContent) {
        unsaveChanges(true);
    }
    else {
        unsaveChanges(false);
    }
}

function getRemoveButton() {
    let button = document.createElement('button');

    button.className = 'remove-row';

    // add button's 'onclick' event.
    button.setAttribute('onclick', 'removeRow(this)');

    return button;
}

// now, add a new to the TABLE.
function addRow() {

    let tr = datatable.insertRow(); // the table row.

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
            td.innerText = "[edit]";
        }
    }
}

function removeRow(event) {
    // button -> td -> tr.
    datatable.deleteRow(event.parentNode.parentNode.rowIndex);
}

function Loadtable(chartName) {
    // updating sheet title
    sheetTitle.innerText = chartNames[chartName];

    let datacols = data[chartName].columns;
    let datarows = data[chartName].rows;

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

    dataTableContent = datatable.textContent;
}


// extracting table data and saving
function saveData(download = false) {
    let tableArr = new Array();
    let rowArray = new Array();

    // loop through each row of the table.
    for (row = 0; row < datatable.rows.length; row++) {
        // loop through each cell in a row.
        rowArray = [];
        for (c = 1; c < datatable.rows[row].cells.length; c++) {
            var element = datatable.rows.item(row).cells[c];
            rowArray.push(element.textContent);
        }
        tableArr.push(rowArray);
    }
    updateDataObject(tableArr);
    createDataTextFile(download);
    unsaveChanges(false);
    dataTableContent = datatable.textContent;
}

// creating data object from Array
function updateDataObject(tableArray = [[]]) {
    let primarycolumn = tableArray[0][0];
    let columns = tableArray[0].filter((_value, index) => index > 0);
    let rows = {};

    tableArray.forEach((arr, index) => {
        if (index > 0) {
            let columnDataforRow = arr.filter((_value, index) => index > 0);
            let keyForRowObj = arr[0];

            rows[keyForRowObj] = columnDataforRow;
        }
    })

    data[currentChartName].primarycolumn = primarycolumn;
    data[currentChartName].columns = columns;
    data[currentChartName].rows = rows;
}

function prettyPrintArray(json) {
    if (typeof json === 'string') {
        json = JSON.parse(json);
    }
    output = JSON.stringify(json, function (k, v) {
        if (v instanceof Array)
            return JSON.stringify(v);
        return v;
    }, 2).replace(/\\/g, '')
        .replace(/\"\[/g, '[')
        .replace(/\]\"/g, ']')
        .replace(/\"\{/g, '{')
        .replace(/\}\"/g, '}');

    return output;
}

function createDataTextFile(download = false) {
    // need to create data text file in JS Object format
    let result = "";

    // replacer function for Array
    function replacer(key, value) {
        if (Array.isArray(value))
            return value;
        return value;
    }


    result += "let data = ";
    result += prettyPrintArray(data)

    result += "\n\n";

    result += "let chartNames = ";
    result += prettyPrintArray(chartNames);

    if (download) {
        let blob = new Blob([result], { type: "text/plain" });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "data.txt";
        a.click();
    }

    return result;
}

function loadChartNames() {
    selectChart.innerHTML = "";
    for (key in chartNames) {
        let value = chartNames[key];
        let newoption = document.createElement("option");
        newoption.value = key;
        newoption.innerHTML = value;

        selectChart.append(newoption);
    }
    Loadtable(selectChart.value);
    currentChartName = selectChart.value;

    selectChart.onclick = (event) => {
        if (dataTableChanges)
            alert("You should save before changing chart")

        dataTableChanges = false;
    }

    selectChart.addEventListener("change", () => {
        Loadtable(selectChart.value);
        currentChartName = selectChart.value;
    })
}

loadChartNames();

// Handling Dialog Box Stuffs
dialogBox.addEventListener('click', (ev) => {
    ev.target.classList.remove('shown');
}, false);

dialogCancel.onclick = () => {
    dialogBox.classList.remove('shown');
}

addChartBtn.onclick = () => {
    dialogBoxName = "addchart";
    dialogBox.classList.add('shown');
    dialogHead.innerText = "Add New Chart";
    dialogText.innerText = "Enter New Chart Name:";
}

delColBtn.onclick = () => {
    dialogBoxName = "delcol";
    dialogBox.classList.add('shown');
    dialogHead.innerText = "Delete A Column";
    dialogText.innerText = "Enter a Column Index (2 - 99):";
}

delChartBtn.onclick = () => {
    dialogBoxName = "delchart";
    dialogBox.classList.add('shown');
    dialogHead.innerText = "Delete A Chart";
    dialogText.innerText = "Enter a Chart Index (0 - 99):";
}

dialogSubmit.onclick = () => {

    if (dialogBoxName == "delcol") {
        if (/^\d+$/.test(dialogValue.value.trim())) {
            let index = parseInt(dialogValue.value);
            if (index > 1) {
                let tablerows = document.querySelectorAll('table tr');
                [...tablerows].forEach((row, i) => {
                    if (row.cells.length >= index)
                        row.removeChild(row.cells[index]);
                });
            }
        }
        dialogBox.classList.remove('shown');
    }
    else if (dialogBoxName == "addchart") {
        let newChartName = dialogValue.value.trim();
        let newChartKey = "data-" + parseInt(Math.random() * 100 + 0);
        while (chartNames.hasOwnProperty(newChartName)) {
            newChartKey = "data-" + parseInt(Math.random() * 100 + 0);
        }
        chartNames[newChartKey] = newChartName;
        data[newChartKey] = {
            primarycolumn: "Full Name", columns: [""], rows: {
                "": [""]
            }
        };
        dialogBox.classList.remove('shown');
        loadChartNames();
        let lastChartOption = selectChart.options.length - 1;
        selectChart.options[lastChartOption].selected = true;
        let event = new Event('change');
        selectChart.dispatchEvent(event);
    }
    else if (dialogBoxName == "delchart") {
        if (/^\d+$/.test(dialogValue.value.trim())) {
            let index = parseInt(dialogValue.value);
            if (selectChart.options.length >= index) {
                let option = selectChart.options[index];
                delete chartNames[option.value];
                delete data[option.value];
                selectChart.removeChild(option);
                dialogBox.classList.remove('shown');
                loadChartNames();
            }

        }
    }
}

// End of File.