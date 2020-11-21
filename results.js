let rsp = "";

function setupResultPage(rst) {
  rsp = rst;
  let h = "";

  var parser = new DOMParser();
  var doc = parser.parseFromString(rst, 'text/html');
  if(rst.startsWith("<div id=\"command\">")) {
    var rsptable = doc.getElementById('data'); // table.rows[i].cells[0].textContent
    if(rsptable.rows[0].cells[0].textContent == "null") {
      h += "No results";
    } else {
      h += doc.getElementById("response").innerHTML;
    }
    document.getElementById("topdatazone").innerHTML = h;
    table = document.getElementById('data');
    if(table === undefined) {
      alert("Table was undefined");
    } else {
      uuidcol = 0;
      while(table.rows[0].cells[uuidcol].textContent != "uuid" && uuidcol < table.rows[0].cells.length) {
        uuidcol++;
      }
      if(uuidcol != 0 && table.rows[0].cells[0].textContent != "null") {
        alert("Response was in the wrong order");
      }
      if(uuidcol < 0 || uuidcol >= table.rows[0].cells.length) {
        alert("No UUId sent");
        uuidcol = 0;
      }
      if(table.rows[0].cells[uuidcol].textContent == "uuid") { // Fix if table is null
        table.rows[0].cells[uuidcol].textContent = "";
        for(let i = 1; i < table.rows.length; i++) {
          let uuid = table.rows[i].cells[uuidcol].textContent;
          table.rows[i].cells[uuidcol].innerHTML = "<button class=\"smallbutton\" onclick=\"setupView('" + uuid + "')\">V</button>";
        }
      }
    }
  } else {
    alert("Response DB Error" + rst);
  }
}
