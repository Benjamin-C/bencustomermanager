let fields = "";

function setupSearch() {
  let h = "";
  h += "Customer Search<br/>";
  h += "Search <select id=\"table_select\" onchange=\"search_onSelect()\">";
  h += "<option value=\"people\">People</option><option value=\"orders\">Orders</option>"
  h += "</select> by <select id=\"field_select\"></select>&nbsp";
  h += "<div class=\"dropdown\">[hover]<div class=\"dropdown-content\">";
  h += "<b><i>Wildcard use in searches</b></i><br/>";
  h += "% is added before and after search term unless<br/>[exact match] is checked";
  h += "<table style=\"border: 1px solid black; width: 100%\"><tr><td><b>Wildcards:</b></td></tr>";
  h += "<tr><td>%</td><td>0+ characters</td><td>b%t</td><td>&gt bot, bit, boot</td></tr>";
  h += "<tr><td>_</td><td>1 character</td><td>b_t</td><td>&gt bot, bit, bet</td></tr></table></div>";
  h += "</div><br/>";
  h += "<input id=\"namebox\", type=\"text\" value=\"\"></input><br/>";
  h += "<input id=\"exactmatch\", type=\"checkbox\">Exact Match</id>";
  h += "<button onclick=\"search_requestSearch()\">Search</button><br/>";
  h += "<button onClick=\"alert(\"hi\");\">New Person</button>";
  h += "<button onclick=\"alert(\"hi2\")\">e</button>";
    // h += "<button onClick=\"setupNewPerson(\"people\", \"topdatazone\")\">New Person</button>";
  document.getElementById("topdatazone").innerHTML = h;
  search_onSelect();
}

function search_onSelect() {
  let func = function() {alert("NO THIS SHOULD NOT HAPPEN! IT HAPPENED?!!! THAT'S NOT GOOD AT ALL!!!!!");}
  switch($("#table_select").val()) {
  case "people": {
    func = search_setupPeople;
  } break;
  case "orders": {
    func = search_setupOrders;
  } break;
  }
  sendRequest('action=fields&table=' + $("#table_select").val(), func);
}

function search_setupOrders(msg) {
  search_setupPeople(msg);
}

function search_setupPeople(msg) {
  $('#field_select').empty();
  var parser = new DOMParser();
  var doc = parser.parseFromString(msg, 'text/html');
  var table = doc.getElementById('data');
  let num = table.rows.length;
  let firstField = true;
  fields = "";
  let hasuuid = false;
  for(let i = 1; i < num; i++) {
    let name = table.rows[i].cells[0].textContent;
    if(name != "uuid_bin" && name != "puuid" && name != "puuid_bin" ) {
      if(firstField) {
        firstField = false;
      } else {
        fields += ",";
      }
      fields += name;
      if(name == "uuid") {
        hasuuid = true;
      } else {
        var option = document.createElement("option");
        option.text = name;
        document.getElementById("field_select").add(option);
      }
    }
  }
  if(hasuuid) {
    var option = document.createElement("option");
    option.text = "uuid";
    document.getElementById("field_select").add(option);
  }
}

function search_requestSearch() {
  let search = "%25";
  if(document.getElementById("exactmatch").checked) {
    search = "";
  }
  let key = document.getElementById("field_select").value;
  let value = search + document.getElementById('namebox').value + search;
  sendRequest('action=view&table=' + $("#table_select").val() + '&fields=' + fields + '&key=' + key + '&value=' + value, getData);
}

let winid = 0;
function getData(msg) {
  setupResultPage(msg);
}
