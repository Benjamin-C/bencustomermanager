function setupView(uuid) {
  sendRequest('action=view&table=people&key=uuid&value=' + uuid, view_setupPersonForm);
}

let fieldsarr = [];
let view_uuid = "";

function view_setupPersonForm(msg) {
  let test = function(name, value) {
    let elem = new Object();
    elem.name = name;
    elem.value = value;
    elem.type = "text";
    if(elem.name == "uuid") {
      if(elem.value === undefined) {
        elem.value = "NoNoNoNoNo!";
      } else {
        view_uuid = elem.value;
        elem.type = "hidden";
      }
    } else if(name == "uuid_bin") {
      elem = undefined;
    }
    return elem;
  }
  view_setupForm(msg, "edit", test);

}

function view_setupForm(msg, action, test) {
  let h = "";
  h += "<form id=\"editform\" action=\"db\" method=\"POST\">";
  h += "<input type=\"hidden\" name=\"action\" value=\"edit\">";
  h += "<table>"
  var parser = new DOMParser();
  var doc = parser.parseFromString(msg, 'text/html');
  var table = doc.getElementById('data');
  console.log(table);
  if(table !== undefined && table !== null) {
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
    h += "<button onclick=\"view_edit()\" id=\"edit_button\">Edit</button>";
    h += "<button onClick=\"setupNewReccord('orders', 'bottomdatazone','" + view_uuid + "')\">New Order</button>";
    document.getElementById("topdatazone").innerHTML = h;
  } else {
    alert("Table was null: " + msg)
  }
}

function view_edit() {
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
