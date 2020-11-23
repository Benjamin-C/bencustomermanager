let headerHTML = "<button class=\"smallbutton\" onclick=\"setupSearch()\">H</button>";
headerHTML += "<button class=\"smallbutton\" onclick=\"setupSearch()\">X</button>";

function setupHeader() {
  document.getElementById("headerzone").innerHTML = headerHTML;
}
function removeHeader() {
  document.getElementById("headerzone").innerHTML = "";
}
function asyncSubmitForm(e, success){
  if(success === undefined) {
    success = function(d) { alert(d); }
  }
  e.preventDefault();
  $.ajax({
    url: 'db',
    type: 'post',
    data: $('#' + e.target.id).serialize(),
    success: success
  });
}

function sendRequest(request, callback) {
  const Http = new XMLHttpRequest();
  let url= window.location.href + 'db';
  if(!(request == null || request == "")) {
    url += "?" + request;
  }
  const urlf = url;
  Http.open("GET", urlf);
  Http.send();

  let lastMsg = "";
//
  Http.onreadystatechange = (e) => {
    let msg = Http.responseText;
    if(msg != lastMsg) {
      callback(msg);
      lastMsg = msg;
    }
    // console.log(Http.responseText);
  }
}
