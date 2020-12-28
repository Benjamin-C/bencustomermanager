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
  h += "<form id=\"person_form\">";
  h += "<input type=\"hidden\" name=\"table\" value=\"people\">";
  h += "<input type=\"hidden\" name=\"action\" value=\"print\">";
  h += "<table class=\"hidden\">";

  let message = JSON.parse(msg);
  let result = message.result;
  if(result.length == 1) {
    let person = result[0];
    viewperson_fieldsarr = [];
    h += "<h1>" + person.name + "</h1>";
    h += "<h3>Customer Information Ha Ha Hi</h3>";
    h += viewperson_getText("name", "text", "Name: ", person.name);
    h += viewperson_getText("address", "text", "Address: ", person.address);
    h += viewperson_getText("phone", "tel", "Phone: ", person.phone);
    h += viewperson_getText("email", "email", "Email: ", person.email);
    h += viewperson_getText("cross", "text", "Cross Street: ", person.cross);
    h += viewperson_getText("pet", "text", "Pet: ", person.pet_name, false);

    h += "</table></form>";
    h += "<button onclick=\"viewperson_edit()\" id=\"edit_button\">Edit</button>";
    if(div === undefined) {
      div = "topdatazone";
    }
    // alert(div);
    document.getElementById(div).innerHTML = h;
  } else {
    alert("Result was the wrong length " + result.length);
    console.log(result);
  }
}

function viewperson_getText(name, type, label, value, linebreak) {
  let id = name + "_" + type;
  let h = "";
  h += "<tr><td class=\"hidden\"><label for=\"" + id + "\">" + label + "</label></td>";
  h += "<td class=\"hidden\"><input id=\"" + id + "\" type=\"" + type + "\" name=\"" + name + "\" value=\"" + value + "\" readonly></td></tr>";
  viewperson_fieldsarr.push(id);
  return h;
}

function viewperson_edit() {
  viewperson_fieldsarr.forEach(element => {
    $('#' + element).prop("readonly", false);
  });
  document.getElementById("edit_button").innerHTML = "Save";
  document.getElementById("edit_button").onclick = function() { viewperson_save(); }
}

function viewperson_save() {
  viewperson_fieldsarr.forEach(element => { document.getElementById(element).readOnly = true; });
  alert($('#person_form').serialize());
  $.ajax({
    url: 'db',
    type: 'post',
    data: $('#person_form').serialize(),
    success: function(data){
        alert(data);
    }
  });
  document.getElementById("edit_button").innerHTML = "Edit";
  document.getElementById("edit_button").onclick = function() { viewperson_edit(); }
}
