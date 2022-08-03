
//Response to the log out option, destorying session
function logoutAjax(event) {

    fetch("logout.php", {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            console.log(`You were logged out ${data.success}`);
            alert("You were logged out!");
            document.getElementById('status').innerHTML = "Visitor Mode. Please login to see events.";
            user = null;
        }
        else{
            console.log(`You were not logged out ${data.success}`);
            alert("You were not logged out!");
        } 
    })
    .catch(err => console.error(err));

    get_event();
    load_tag();
    edit_event = null;

}


