function regAjax(event) {

    const username = document.getElementById("username_reg").value; // Get the username from the form
    const password = document.getElementById("password_reg").value; // Get the password from the form
    const password2 = document.getElementById("password2").value;

    document.getElementById("username_reg").value = '';
    document.getElementById("password_reg").value = '';
    document.getElementById("password2").value = '';

    
    // Make a URL-encoded string for passing POST data:
    const data = { 'username_reg': username, 'password_reg': password, 'password2': password2};
 

    fetch("registration.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                alert("Registration Succeeded!");
                console.log("You ve been registered!");
            }
            else{
                alert("Registration Failed: " + data.message);
                console.log(`You were not registered ${data.message}`);
            }
        })
        .catch(err => console.error(err));
}

 