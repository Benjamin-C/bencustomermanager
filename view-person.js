let viewperson_fieldsarr = [];
let viewperson_uuid = "";

function viewperson_setupPersonForm(msg, div) {
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
  viewperson_setupForm(msg, "edit", test, div);

}

function viewperson_setupForm(msg, action, test, div) {
  let h = "";
  h += "<form id=\"editform\" action=\"db\" method=\"POST\">";
  h += "<input type=\"hidden\" name=\"action\" value=\"edit\">";
  h += "<table>"

  let message = JSON.parse(msg);
  let result = message.result;
  if(result.length == 1) {
    let person = result[0];
    h += "<h1>" + person.name + "</h1>";
    h += "<h3>Customer Information Ha Ha Ha</h3>";
    h += "<form id=\"person_form\">"
    h += viewperson_getText("name", "text", "Name: ", person.name);
    h += viewperson_getText("address", "text", "Address: ", person.address);
    h += viewperson_getText("phone", "tel", "Phone: ", person.phone);
    h += viewperson_getText("email", "email", "Email: ", person.email);
    h += viewperson_getText("cross", "text", "Cross Street: ", person.cross);
    h += viewperson_getText("pet", "text", "Pet: ", person.pet_name);
    h += "</form>";
    viewperson_fieldsarr = [];
    // for(let i = 0; i < num; i++) {
    //   let elem = test(table.rows[0].cells[i].textContent, table.rows[1].cells[i].textContent);
    //   if(elem !== undefined) {
    //     fieldsarr.push(elem.name);
    //     if(elem.type != "hidden") {
    //       h += "<tr><td><label for=\"" + elem.name + "\">" + elem.name + "</label></td>";
    //     } else {
    //       h += "<tr>";
    //     }
    //     h += "<td><input id=\"" + elem.name + "_text\" type=\"" + elem.type + "\" name=\"" + elem.name + "\" value=\"" + elem.value + "\" readonly></td></tr>";
    //   }
    // }
    // let keys = Object.keys(person);
    // alert(keys);
    //
    // let msg = "";
    // for (let [key, value] of Object.entries(person)) {
    //   msg += `${key}:${value}\n`;
    // }
    // alert(msg);

    // h += "<input type=\"submit\" value=\"Submit\">";
    h += "</table></form>";
    h += "<button onclick=\"viewperson_edit()\" id=\"edit_button\">Edit</button>";
    h += "<button onClick=\"setupNewReccord('orders', 'bottomdatazone','" + view_uuid + "')\">New Order</button>";
    h += "This should be some data";
    if(div === undefined) {
      div = "topdatazone";
    }
    alert(div);
    document.getElementById(div).innerHTML = h;
  } else {
    alert("Result was the wrong length " + result.length);
    console.log(result);
  }
}

function viewperson_getText(name, type, label, value) {
  let id = name + "_" + type;
  let h = "";
  h += "<label for=\"" + id + "\">" + label + "</label>";
  h += "<input id=\"" + id + "\" type=\"" + type + "\" name=\"" + name + "\" value=\"" + value + "\" readonly><br/><br/>";
  viewperson_fieldsarr.push(id);
  return h;
}
function viewperson_edit() {
  for(const name in viewperson_fieldsarr) {
    document.getElementById(viewperson_fieldsarr[name]).readOnly = false;
  }
  document.getElementById("edit_button").innerHTML = "Save";
  document.getElementById("edit_button").onclick = function() { save(); }
}

function viewperson_save() {
  for(const name in viewperson_fieldsarr) {
    let box = document.getElementById(viewperson_fieldsarr[name]);
    box.readOnly = true;
  }
  alert($('#editform').serialize());
  $.ajax({
    url: 'dbt',
    type: 'post',
    data: $('#editform').serialize(),
    success: function(data){
        alert(data);
    }
  });
  document.getElementById("edit_button").innerHTML = "Edit";
  document.getElementById("edit_button").onclick = function() { edit(); }
}
