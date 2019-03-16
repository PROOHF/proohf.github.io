const errorColor = "#FF0000";
const okColor = "#000000";

function tagio() {
  var xmlInput = document.getElementById('input').value;
  var xmlTag   = document.getElementById('tag').value;

  if (xmlInput == "" || xmlTag == "") {
    document.getElementById("output").value = "Input textarea or tag field seems empty, please check above.";
    document.getElementById("output").style.color = errorColor;
  } else {
    if (window.DOMParser) {
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(xmlInput, "text/xml");
    } else { // Internet Explorer
      document.getElementById("output").value = "Browser not supported!";
      document.getElementById("output").style.color = errorColor;
    }

    var x, i, tagCount;
    var xmlTags = "";
    var tagCount = 0;
    x = xmlDoc.getElementsByTagName(xmlTag);
    for (i = 0; i < x.length; i++) { 
      xmlTags += x[i].childNodes[0].nodeValue + ",";
      tagCount++; 
    }
    
    if (tagCount == 0) {
      document.getElementById("output").value = "No XML-tag named <" + xmlTag + "> found!";
      document.getElementById("output").style.color = errorColor;
      document.getElementById("tagCountLabel").innerHTML = tagCount;
    } else {
      // Removes the last , char to prevent an extra linebreak at the bottom
      xmlTags = xmlTags.substring(0, xmlTags.length - 1);
      document.getElementById("output").value = xmlTags.split(',').join("\r\n");
      document.getElementById("output").style.color = okColor;
      document.getElementById("tagCountLabel").innerHTML = tagCount;
    }
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
    var tagTextarea = document.getElementById("tag");
    var outputTextarea = document.getElementById("output");
    var tagCountLabel = document.getElementById("tagCountLabel");
    inputTextarea.value = '';
    tagTextarea.value = '';
    outputTextarea.value = '';
    outputTextarea.style.color = okColor;
    tagCountLabel.innerHTML = "0"
}
