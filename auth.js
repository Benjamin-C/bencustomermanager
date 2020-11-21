function setupAuth() {
  let h = "";
  h += ""
  h += "<form id=\"authform\" method=\"POST\">";
  h += "<input type=\"hidden\" name=\"action\" value=\"auth\">";
  h += "<table><tr><td><label for=\"username\">username</label></td>";
  h += "<td><input type=\"text\" name=\"username\"></td></tr>";
  h += "<tr><td><input type=\"submit\" value=\"Login\"></td></tr>";
  h += "</table></form>";
  document.getElementById("datazone").innerHTML = h;
  document.getElementById("headerzone").innerHTML = "";
  document.getElementById("authform").addEventListener("submit", (e) => {asyncSubmitForm(e, (data) => {
    alert(data)});
    document.getElementById("headerzone").innerHTML = headerHTML;
    setupSearch();
  });
}

function setupUnAuth() {

}
