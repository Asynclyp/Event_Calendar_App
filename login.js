function loginAjax(event) {
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form
   
    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };
    console.log(JSON.stringify(data));

    fetch("login.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){ 
            user = data.username;
            document.getElementById("status").innerHTML = "Welcome, " + data.username + "!";
            console.log("You've been logged in!");
            alert("You are currently logged in as " + user);
            
            //Clear the input
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            
            //Create logout button
            let status = document.getElementById("status");
            let logout = document.createElement('button');
            logout.innerHTML = "Logout";
            logout.id = "logout";
            status.appendChild(logout);
            
            //let listener = document.createElement('script');
            document.getElementById('logout').addEventListener('click',logoutAjax, false);
            get_event();
            load_tag();

        }
        else{
            //Return error message if not logged in
            document.getElementById("status").innerHTML = "Calendar: You are not logged in. Please try again.";
            console.log(`You were not logged in ${data.message}`);
            alert("You were not logged in " + data.message);
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        }
    })
    .catch(err => console.error(err));
}

 
