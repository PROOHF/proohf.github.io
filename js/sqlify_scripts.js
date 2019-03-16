const errorColor = "#FF0000";
const okColor = "#000000";

function sqlifyTheInputText() {
    var sqlStart = "('", sqlEnd = "')";
    var sqlifyString = document.getElementById('input').value;
    // Replace all linebreaks with ','
    var sqlifyString = sqlifyString.replace(/\n/g, "','");
    // Remove all whitespaces with nothing (trim string)
    var sqlifyString = sqlifyString.replace(/\s/g, '');
    // Let's add (' before and ') to the sqlifystring.
    var sqlifyString = sqlStart.concat(sqlifyString, sqlEnd);
    // If input textfield starts with an empty line, remove it.
    if (sqlifyString.includes("'','")) {
        var sqlifyString = sqlifyString.replace("'','", "'");
    }
    // If empty linebreaks exists, remove them (Can only handle 3 linebreaks in a row)
    if (sqlifyString.includes(",'',")) {
        var sqlifyString = sqlifyString.replace(/,'',/g, ",");
    }
    // If input textfield ends with an empty line, remove it.
    if (sqlifyString.includes("',''")) {
        var sqlifyString = sqlifyString.replace("',''", "'");
    }
    // Values in sqlifystring counter.
    var valueCount = sqlifyString.split("','").length;
    if (sqlifyString == "('')") {
        document.getElementById("output").value = "Please add some data in the input field above.";
        document.getElementById("output").style.color = errorColor;
    } else {
        document.getElementById("output").value = sqlifyString;
        document.getElementById("output").style.color = okColor;
        document.getElementById("valueCountLabel").innerHTML = valueCount;
    }
 }

function highlightOutput() {
    var element = document.getElementById("output");
    element.classList.add("is-valid");
}

function copyOutputToClipboard() {
    var copyText = document.getElementById("output");
    copyText.select();
    document.execCommand("Copy");

    highlightOutput()

    setTimeout(function () {
        var element = document.getElementById("output");
        element.classList.remove("is-valid");
    }, 250);
}

function clearTextareas() {
    var inputTextarea = document.getElementById("input");
    var outputTextarea = document.getElementById("output");
    var valueCountLabel = document.getElementById("valueCountLabel");
    inputTextarea.value = '';
    outputTextarea.value = '';
    outputTextarea.style.color = okColor;
    valueCountLabel.innerHTML = "0"
}

function changeToPipesInstead() {
    var ransackString = document.getElementById('output').value;
    if (!ransackString || ransackString.includes("|")) {
    } else {
    var ransackString = ransackString.replace(/','/g, "|");
    var ransackString = ransackString.substring(2);
    var ransackString = ransackString.substring(0, ransackString.length - 2);
    document.getElementById("output").value = ransackString;
    }
}
