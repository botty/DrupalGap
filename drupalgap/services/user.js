// define global variables to hold the latest service resource call result json
var drupalgap_services_user_login_result;
var drupalgap_services_user_logout_result;
var drupalgap_services_user_update_result;
var drupalgap_services_user_register_result;

/**
 * Makes a synchronous call to Drupal's User Login Service Resource. 
 *
 * @param name
 *   A string containing the drupal user name.
 * @param pass
 *   A string containing the drupal user password.
 *   
 * @return
 *   TRUE if the login is successful, false otherwise.
 */
function drupalgap_services_user_login (name, pass) {
	/* if the login is successful, the json result will be something like this:
	 * {
	 *   "sessid":"random-session-id-here",
	 *   "session_name":"random-session-name-here",
	 *   "user":{
	 *     "uid":"1",
	 *     "name":"admin",
	 *     "mail":"admin@example.com",
	 *     "theme":"",
	 *     "signature":"",
	 *     "signature_format":null,
	 *     "created":"1327346051",
	 *     "access":"1327429006",
	 *     "login":1327429219,
	 *     "status":"1",
	 *     "timezone":"America/New_York",
	 *     "language":"",
	 *     "picture":null,
	 *     "init":"admin@example.com",
	 *     "data":false,
	 *     "roles":{
	 *       "2":"authenticated user",
	 *       "3":"administrator"
	 *     },
	 *     "rdf_mapping":{
	 *       "rdftype":["sioc:UserAccount"],
	 *       "name":{
	 *         "predicates":["foaf:name"]
	 *       },
	 *       "homepage":{
	 *         "predicates":["foaf:page"],
	 *         "type":"rel"
	 *       }
	 *     }
	 *   }
	 * } 
	 */ 
	try {
		if (!name || !pass) { return false; }
		
		// make the service call
		drupalgap_services_user_login_result = drupalgap_services_resource_call({"resource_path":"user/login.json","data":'username=' + encodeURIComponent(name) + '&password=' + encodeURIComponent(pass)});
		
		if (drupalgap_services_user_login_result.errorThrown) { return false; }
		else {
			drupalgap_services_system_connect(); // make another call to system connect to refresh global variables
			return true;
		}
	}
	catch (error) {
		console.log("drupalgap_services_user_login");
		console.log(error);
	}
	return false; // if it made it this fair, the user login call failed
}

/**
 * Makes a synchronous call to Drupal's User Logout Service Resource. 
 *   
 * @return
 *   TRUE if the logout was successful, false otherwise.
 */
function drupalgap_services_user_logout () {
	/* example json result if logout failed: 
	{
		"readyState":4,
		"responseText":"null",
		"status":406,
		"statusText":"Not Acceptable: User is not logged in."
	} */

	try {
		
		// make the service call
		drupalgap_services_user_logout_result = drupalgap_services_resource_call({"resource_path":"user/logout.json"});
		
		if (drupalgap_services_user_logout_result.errorThrown) { return false; }
		else {
			drupalgap_services_system_connect(); // make another call to system connect to refresh global variables
			return true;
		}
	
	}
	catch (error) {
		console.log("drupalgap_services_user_logout - " + error);
		alert("drupalgap_services_user_logout - " + error);	
	}
	return false; // if it made it this fair, the user logout call failed
}

function drupalgap_services_user_update (user) {
	try {
		if (!user) {
			console.log("drupalgap_services_user_update - user empty");
			return false;
		}
	  
		// build url path to user login service resource call
		var user_update_url = drupalgap_settings.services_endpoint_default + "/user/" + user.uid  + ".json";
		console.log(user_update_url);
	  
		// make the service call...
		var successful = false;
		$.ajax({
		    url: user_update_url,
		    type: 'put',
		    /*data: 'data[name]=' + encodeURIComponent(user.name) + '&data[mail]=' + encodeURIComponent(user.mail) + '&data[pass]=' + encodeURIComponent(user.pass),*/
		    dataType: 'json',
		    async: false,
		    error: function(XMLHttpRequest, textStatus, errorThrown) {
			drupalgap_services_user_update_result = XMLHttpRequest; // hold on to a copy of the json that came back
		      console.log(JSON.stringify(XMLHttpRequest));
		      console.log(JSON.stringify(textStatus));
		      console.log(JSON.stringify(errorThrown));
		    },
		    success: function (data) {
		    	drupalgap_services_user_update_result = data; // hold on to a copy of the json that came back
		      //drupalgap_user = null; // clear global drupalgap_user variable
		      console.log(JSON.stringify(drupalgap_services_user_update_result));
		      successful = true;
		      //drupalgap_services_system_connect(); // make another call to system connect to refresh global variables
		    }
		});
	  return successful;
	}
	catch (error) {
		console.log("drupalgap_services_user_update - " + error);
	}
	return false; // if it made it this fair, the user update call failed
}

function drupalgap_services_user_register (name,mail) {
	
	// example success json
	/* {
	 *   "uid":"2",
	 *   "uri":"http://localhost/drupal-7.10/?q=drupalgap/user/2"
	 * }*/
	
	// example failure json
	/* {
	 *   "form_errors":{
	 *     "name":"Username field is required.",
	 *     "mail":"E-mail address field is required."
	 *   }
	 * }
	 */
	
	try {
		
		// validate input
		if (!name) {
			alert("drupalgap_services_user_register - name empty");
			return false;
		}
		if (!mail) {
			alert("drupalgap_services_user_register - mail empty");
			return false;
		}
		
		// make the service call
		drupalgap_services_user_register_result = drupalgap_services_resource_call({"resource_path":"user/register.json","data":'name=' + encodeURIComponent(name) + '&mail=' + encodeURIComponent(mail)});
		
		if (drupalgap_services_user_register_result.errorThrown) { return false; }
		else {
			// @todo - we need to inform the user of what happened depending on drupal's user registration settings...
			return true; 
		}
	  
	}
	catch (error) {
		console.log("drupalgap_services_user_register");
		console.log(error);	
	}
	return false; // if it made it this fair, the user register call failed
}