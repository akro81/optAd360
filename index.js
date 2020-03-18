var xmlhttp = new XMLHttpRequest();
var table_string = "";
var is_checkbox_checked = false; // need for Select All module to select all policy acceptance checkboxes

xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var partners = JSON.parse(this.responseText); // list of partners from vendorlist.json file
    
    for(var i = 0; i < partners.vendors.length; i++) {
    	table_string += "<tr><td class = \"table-name\">" + 
    		partners.vendors[i].name + "</td><td class = \"table-policyurl\"><a href = \"" + partners.vendors[i].policyUrl + "\">" + 
    		partners.vendors[i].policyUrl + "</td><td class = \"table-checkbox\"><input type = \"checkbox\" name = \"policycheck\" id = \"checkbox" + 
    		partners.vendors[i].id + "\"</td></tr>"
		document.cookie = "Number " + i + " partner name=" + partners.vendors[i].name; // writes all partners to document cookies
	}
	table_string = "<table class = \"partners-table\"><tr><th>Partner</th><th>Link do polityki cookie</th><th class = \"th center\">Zgoda</th></tr>" + table_string + "</table>"; //adds entire table to string with partners listed from json file
    document.getElementById("json-table").innerHTML = table_string;
  }
};
xmlhttp.open("GET", "https://vendorlist.consensu.org/vendorlist.json", true);
xmlhttp.send();

/* function closes Popup when user will accept cookies policy */
function closePopup() { 
	var element = document.getElementById("popup");
	var background = document.getElementById("popup-background");
	var site_body = document.getElementById("site-body");

	element.classList.remove("active");
	background.classList.remove("active");
	site_body.classList.remove("noScroll");
}

/*Select All policy checkboxes module */
function selectAndUnselectAll() {
	var check = document.getElementsByName("policycheck");

	for(var i = 0; i < check.length; i++) {
		if(check[i].type == "checkbox") {
			if(!is_checkbox_checked) {
				check[i].checked = true;
			}
			else if(is_checkbox_checked) {
				check[i].checked = false;
			}
		}
	}
	is_checkbox_checked = !is_checkbox_checked;
}

/* function closes Popup and kick user from site when he would not agree with cookies policy (X or reject button in popup) */
function windowClose() {
	if(confirm("Czy na pewno chcesz odrzucić politykę cookie i wyjść ze strony?")) {
		window.location.href = "about:blank";
	}
}

/* function used when user accepts cookies policy */
function acceptCookies() {
	var check = document.getElementsByName("policycheck");

	is_checkbox_checked = true;
	for(var i = 0; i < check.length; i++) {
		if(check[i].checked == false)
			is_checkbox_checked = false;
	}
	if(is_checkbox_checked == true) {
		closePopup();
		document.cookie = "Are_cookies_accepted=yes"; // saves user decision about accepting cookies
		document.cookie = "popupShown=true; max-age=86400"; // after acceptation this line saves information that popup should be shown next time in 24 hours
	}
	else if(is_checkbox_checked == false) {
		alert("Aby przejść dalej, musisz potwierdzić politykę Cookie każdego z naszych partnerów.");
	}
}

/* popup should appear once per 24h - function checks if time has elapsed and shows popup if yes */
function shouldPopupAppear() {
	var body = document.getElementById("site-body");
	var popup = document.getElementById("popup");
	var background = document.getElementById("popup-background");

	if(location.protocol == "https:") { 
		// checks if the site uses https protocol and decline to show popup if it doesn't
		if(document.cookie.indexOf("popupShown=true") == -1) {
			body.classList.add("noScroll");
			popup.classList.add("active");
			background.classList.add("active");
		}
	}
} 