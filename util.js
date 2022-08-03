
let today = new Date();
let curMonth = null;
let edit_id = null;
let user = null;
let cur_tag = 'All Events';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]; 


//Fetch and display the current user
function getCurrentUser(){
    fetch("currentUser.php", {
        method: 'POST',
        body: JSON.stringify({})
    }) 
    .then(response => response.json())
    .then(data => {
        if(data.success){
            console.log(`The current user is ${data.user}`);
            document.getElementById('status').innerHTML = "Welcome, " + data.user;
            user = data.user;
            //Create logout button
            let status = document.getElementById("status");
            let logout = document.createElement('button');
            logout.innerHTML = "Logout";
            logout.id = "logout";
            status.appendChild(logout);
            document.getElementById('logout').addEventListener('click',logoutAjax, false);
            get_event();
            load_tag();
        }
        else{
            //remind user to log in
            console.log("Fetch current user failed.");
            document.getElementById('status').innerHTML = "Visitor Mode. Please login to see events.";
        }
    })
    .catch(err => console.error(err));
}


//give inital month to the calendar
function initiate_calendar(){
    getCurrentUser();
    let today = new Date();
    curMonth = new Month(today.getFullYear(), today.getMonth());
    upadte_calendar();
}
 
//display current month
function display_month(event){
    let year = parseInt(document.getElementById('year').value);
    let month = parseInt(document.getElementById('month').value)-1;
    curMonth = new Month(year, month);
    upadte_calendar();
}

//handle the next month button
function next_month(){
    curMonth = curMonth.nextMonth();
    upadte_calendar();
}

//handle the last month button
function last_month(){
    curMonth = curMonth.prevMonth();
    upadte_calendar();
}

//update the layout of the calendar based on cur_month
function upadte_calendar(){

    //display login status


    //get a list of week objects
    let weeks = curMonth.getWeeks();
    let table = document.getElementById('table');

    //update title
    document.getElementById('table_title').innerHTML = monthNames[curMonth.month]+', '+curMonth.year;

    //clear the cells
    let cells = document.querySelectorAll('.day_cell');
    cells.forEach(c => {
        c.remove();
    });

    //for each week, inser a tr with 7 td
    for(var w = 0; w<weeks.length; w++){
         
        //create a new tr
        const tr = document.createElement('tr');
        tr.className = 'day_cell';
       
        //insert each day as a td into the tr
        let days = weeks[w].getDates();
        for(var d = 0; d<days.length; d++){
            const td = document.createElement('td');
            const node = document.createTextNode(days[d].getDate());
            td.appendChild(node);
            td.id = (days[d].getMonth()+1)+'-'+days[d].getDate();
            tr.appendChild(td);
        }

        //add the tr into the table
        table.appendChild(tr);
        
    }

    format_calendar();
    get_event();
    load_tag();

}

//make days out of the cur_month grey
function format_calendar(){
   
    //make dates outside this month '.outsider'

    const trs = document.querySelectorAll('.day_cell');
    first_row = trs[0].childNodes;
    first_row.forEach(c => {
        day = parseInt(c.innerHTML);
        if(day > 8){
            c.className = 'outsider';
        }
    });

    last_row = trs[trs.length-1].childNodes;
    last_row.forEach(c => {
        day = parseInt(c.innerHTML);
        if(day <20){
            c.className = 'outsider';
        }
    });
}


//fetch event data from SQL
function get_event(){

    //prepare parameters
    const data = {
        'month': curMonth.month+1,
        'cur_tag': cur_tag,
    };

    //fetch events in cur_month
    fetch("event.php", {
            method: "POST",
            body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                display_event(data)
            })
            .catch(err => console.error(err));
}

//display events in a json list
function display_event(json_data){

    const events = document.getElementsByClassName('event');
    while(events.length>0){
        events[0].remove();
    }

    json_data.forEach(function(event){
        console.log(event);
        insert_event(event);
    });
}

//insert an event into the right cell
function insert_event(json_event){
    let month = parseInt(json_event.month, 10);
    let day = parseInt(json_event.day, 10);
    let id = month+'-'+day;
    if(cell = document.getElementById(id)){
        //create a div with title and time
        let div = document.createElement('div');
        div.className = "event";
        let node = document.createTextNode(json_event.title);
        div.appendChild(node);
        div.appendChild(document.createElement('br'));
        node = document.createTextNode(json_event.time);
        div.appendChild(node);
        //inbed id
        div.id = json_event.id;

        //add eventlistener
        div.addEventListener('click', choose_event, false);

        //add the event to the cell
        cell.appendChild(div);
        
        
    }
   
}


//Add an event
function add_event(){
    const title = document.getElementById('title').value;
    let time = document.getElementById('time').value;
    const tag = document.getElementById('tag').value;
    time = time.replace("T", " ");
    let ppl = document.getElementsByClassName('ppl');
    let shared = [];
    for (let i = 0; i < ppl.length; i++) {
        shared[i] = ppl[i].value;
    }
    
    document.getElementById('title').value = '';
    document.getElementById('time').value = '';
    document.getElementById('tag').value = '';
    
    const body = {
        'title': title,
        'time': time,
        'tag': tag,
        '1': shared[0],
        '2': shared[1],
        '3': shared[2],
        '4': shared[3],
        '5': shared[4]
    };

    fetch("add_event.php", {
        method: "POST",
        body: JSON.stringify(body),
        })
        .then(response => response.json())
        .then(data => {
            let people = document.getElementsByClassName('ppl');
            for(let i=0;i<5;i++){
                people[i].value = "";
            }
            console.log(data);

        })
        .catch(err => console.error(err));
    
    
    get_event();
}

//Select an event by clicking
function choose_event(event){
    let allEvents = document.getElementsByClassName("event");
    for (let i = 0; i < allEvents.length; i++) {
        allEvents[i].style.color = "black";
    }
    edit_id = event.target.id;
    let edit_button = document.getElementById('edit_event');
    let delete_button = document.getElementById('delete_event');
    let share_text = document.getElementById('shared_event');
    share_text.innerHTML = "Share " + event.target.innerText + " with ";
    edit_button.innerHTML = "edit event : "+event.target.innerText;
    delete_button.innerHTML = "Delete: "+event.target.innerText;
    document.getElementById(edit_id).style.color = "red";
}


//Edit the title, time, and tag of an selected event
function edit_event(event){
    let title = document.getElementById('edit_title').value;
    let edit_tag = document.getElementById('edit_tag').value;
    let time = document.getElementById('edit_time').value;
    time = time.replace("T", " ");
    const body = {
        'id' : edit_id,
        'title': title,
        'time': time,
        'tag' : edit_tag,
    };

    fetch("edit_event", {
        method: "POST",
        body: JSON.stringify(body),
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            console.log(data);
            load_tag();
            document.getElementById('edit_title').value = "";
            document.getElementById('edit_time').value = "";
            document.getElementById('edit_tag').value = "";
        }
        else{
            alert("No event selected! Please click to select the event you want to edit.");
            console.log("Edit Failed.");
        }
    })
    .catch(err => console.error(err));

    
    get_event();
    
}


//Delet the selected event
function delete_event(event){

    const body = {
        'id' : edit_id
    };
    
    fetch('delete_event.php', {
        method:'POST',
        body: JSON.stringify(body),
    })
    .catch(err => console.log(err));

    get_event();
    
}

function select_tag(){
    cur_tag = document.getElementById('select_tag').value;
    get_event();
}

//Display tags
function load_tag(){
    //fetch events in cur_month
    fetch("tag.php", {
            method: "POST",
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                $('#select_tag').empty();
                let all = document.createElement('option');
                all.innerHTML = 'All Events';
                all.value = 'All Events';
                $('#select_tag').append(all);
                data.forEach(function(tag){
                    console.log(tag);
                    insert_tag(tag);
                });
                
            })
            .catch(err => console.error(err));
}

function insert_tag(tag){
    let select = $('#select_tag');
    let tag_element = document.createElement('option');
    tag_element.innerHTML = tag;
    tag_element.value = tag;
    select.append(tag_element);
}


//Inform backend of the user to whom the event is shared and create a event whose author is that user
function share_event(event){
    const body = {
        'share_user': document.getElementById('share_user').value,
        'event_id': edit_id,
    };
    fetch('share_event.php', {
        method:"POST",
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => console.log(data));
}

