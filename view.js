function setupView(uuid) {
  document.getElementById("topdatazone").innerHTML = "<table><tr><td id=\"viewperson_spot\"></td></tr></table>";
  sendRequest('action=view&table=people&key=uuid&value=' + uuid, viewperson_setupPersonForm, "viewperson_spot");
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

  let message = JSON.parse(msg);
  let result = message.result;
  if(result.length == 1) {
    h += "<h1>" + result.name + "</h1>";
    h += "<h3>Customer Information</h3>";
    h += "<label for=\"name_text\">Name:</label>";
    h += "<input id=\"name_text\" type=\"text\" name=\"name\" value=\"" + result.name + "\" readonly><br/><br/>";
    h += "<label for=\"address_text\">Address:</label>";
    h += "<input id=\"address_text\" type=\"text\" name=\"address\" value=\"" + result.name + "\" readonly><br/><br/>";
    h += "<label for=\"phone_tel\">Phone:</label>";
    h += "<input id=\"phone_tel\" type=\"tel\" name=\"phone\" pattern=\"[0-9]{3}-[0-9]{3}-[0-9]{4}\" placeholder=\"123-456-7890\" readonly><br/><br/>";
    h += "<label for=\"email_email\">Email:</label>";
    h += "<input id=\"email_email\" type=\"text\" name=\"email\" value=\"" + "email" + "\" readonly><br/><br/>";
    h += "<label for=\"cross_text\">Cross Street:</label>";
    h += "<input id=\"cross_text\" type=\"text\" name=\"cross\" value=\"" + "cross" + "\" readonly><br/><br/>";
    h += "<hr style=\"width:25%;text-align:left;margin-left:0\"/>";
    h += "<h3>Order</h3>";
    h += "<label for=\"date_date\">Date: </label>";
    h += "<input id=\"date_date\" type=\"text\" name=\"date\" value=\"" + "no date yet" + "\" readonly><br/><br/>";
    h += "<label for=\"donloc_text\">Donation Location: ";
    h += "<input id=\"donloc_text\" type=\"text\" name=\"donloc\" value=\"" + "donloc" + "\" readonly><br/><br/>";
    // fieldsarr = [];
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
    // // h += "<input type=\"submit\" value=\"Submit\">";
    // h += "</table></form>";
    // h += "<button onclick=\"view_edit()\" id=\"edit_button\">Edit</button>";
    // h += "<button onClick=\"setupNewReccord('orders', 'bottomdatazone','" + view_uuid + "')\">New Order</button>";
    h += "This should be some data";
    document.getElementById("topdatazone").innerHTML = h;
  } else {
    alert("Result was the wrong length " + result.length);
    console.log(result);
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
