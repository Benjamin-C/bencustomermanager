function setupView(uuid) {
  sendRequest('action=view&table=people&key=uuid&value=' + uuid, setupPersonForm);
}

let fieldsarr = [];

function setupPersonForm(msg) {
  let test = function(name, value) {
    let elem = new Object();
    elem.name = name;
    elem.value = value;
    elem.type = "text";
    if(elem.name == "uuid") {
      if(elem.value === undefined) {
        elem.value = "NoNoNoNoNo!";
      } else {
        elem.type = "hidden";
      }
    } else if(name == "uuid_bin") {
      elem = undefined;
    }
    return elem;
  }
  setupForm(msg, "edit", test);

}

function setupForm(msg, action, test) {
  let h = "";
  h += "<form id=\"editform\" action=\"db\" method=\"POST\">";
  h += "<input type=\"hidden\" name=\"action\" value=\"edit\">";
  h += "<table>"
  var parser = new DOMParser();
  var doc = parser.parseFromString(msg, 'text/html');
  var table = doc.getElementById('data');
  let num = table.rows[0].cells.length;
  fieldsarr = [];
  for(let i = 0; i < num; i++) {
    let elem = test(table.rows[0].cells[i].textContent, table.rows[1].cells[i].textContent);
    if(elem !== undefined) {
      fieldsarr.push(elem.name);
      if(elem.type != "hidden") {
        h += "<tr><td><label for=\"" + elem.name + "\">" + elem.name + "</label></td>";
      } else {
        h += "<tr>";
      }
      h += "<td><input id=\"" + elem.name + "_text\" type=\"" + elem.type + "\" name=\"" + elem.name + "\" value=\"" + elem.value + "\" readonly></td></tr>";
    }
  }
  // h += "<input type=\"submit\" value=\"Submit\">";
  h += "</table></form>";
  h += "<button onclick=\"edit()\" id=\"edit_button\">Edit</button>";
  document.getElementById("topdatazone").innerHTML = h;
}

function edit() {
  for(const name in fieldsarr) {
    document.getElementById(fieldsarr[name] + "_text").readOnly = false;
  }
  document.getElementById("edit_button").innerHTML = "Save";
  document.getElementById("edit_button").onclick = function() { save(); }
}

function save() {
  for(const name in fieldsarr) {
    let box = document.getElementById(fieldsarr[name] + "_text");
    box.readOnly = true;
  }
  alert($('#editform').serialize());
  $.ajax({
    url: 'db',
    type: 'post',
    data: $('#editform').serialize(),
    success: function(data){
        alert(data);
    }
  });
  document.getElementById("edit_button").innerHTML = "Edit";
  document.getElementById("edit_button").onclick = function() { edit(); }
}
