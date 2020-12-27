let rsp = "";

function setupResultPage(rst) {
  rsp = JSON.parse(rst);
  let h = "";
  result = rsp.result;
  if(result.length == 0) {
    h += "No results";
  } else {
    let t = "";
    let n = "";
    for(let i = 0; i < result.length; i++) {
      t += "<tr>";
      n += (i==0) ? "<tr><td></td>" : "";
      t += "<td style=\"border:1px solid black;\"><button class=\"smallbutton\" onclick=\"setupView('" + result[i].uuid + "')\">V</button></td>";
      for (let [key, value] of Object.entries(result[i])) {
        if(`${key}` != "uuid") {
          t += "<td>" + `${value}` + "</td>";
          if(i == 0) {
            n += "<td>" + `${key}` + "</td>";
          }
        }
      }
      t += "</tr>";
      n += (i==0) ? "</tr>" : "";
    }
    h += "<table>" + n + t + "</table>";
  }
  document.getElementById("topdatazone").innerHTML = h;
}
