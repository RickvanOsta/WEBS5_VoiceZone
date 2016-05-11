/**
 * Created by Raymond Phua on 31-Mar-16.
 */

//userlist
var users = [];
var voices = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    //add user
    $('#btnAddUser').on('click', addUser);
    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
    $('#voiceList table tbody').on('click', 'td a.linkdeletevoice', deleteVoice);
});


// FUNCTIONS ==========================================
function populateTable() {

    //Empty content string
    var tableContent = "";

    //jquery ajax call for JSON
    $.getJSON('/users', function(data) {

        users = data;
        console.log(data);
        $.each(data, function() {
            tableContent += "<tr>";
            tableContent += "<td><a href='#' class='linkshowuser' rel='" + this.username + "'>" + this.username + "</a></td>";
            tableContent += "<td>" + this.firstname + "</td>";
            tableContent += "<td>" + this.lastname + "</td>";
            tableContent += "<td><a href='#' class='linkdeleteuser' rel='" + this._id + "'>delete</a></td>";
            tableContent += "</tr>";
        });

        //inject content in table
        $('#userList table tbody').html(tableContent);
    });

    var tableContentVoices = "";

    $.getJSON('/voices', function(data) {
        console.log(data);
        voices = data;

        $.each(data, function() {
            tableContentVoices += "<tr>";
            tableContentVoices += "<td>" + this.title + "</td>";
            tableContentVoices += "<td>" + this.fileName + "</td>";
            tableContentVoices += "<td>" + this.fileLocation + "</td>";
            tableContentVoices += "<td>" + this.user + "</td>";
            tableContentVoices += "<td><a href='#' class='linkdeletevoice' rel='" + this._id + "'>delete</a></td>";
            tableContentVoices += "</tr>";
        });
        $('#voiceList table tbody').html(tableContentVoices);
    });
}

//Add user
function addUser(event) {
    event.preventDefault();

    //basic validation if input = empty
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') {
            errorCount++;
        }
    });

    if (errorCount === 0) {

        var newUser = {
            "username": $('#addUser fieldset input#inputUserName').val(),
            "firstname": $('#addUser fieldset input#inputFirstName').val(),
            "lastname": $('#addUser fieldset input#inputLastName').val(),
            'uid': $('#addUser fieldset input#inputUid').val()
        };

        console.log(newUser);

        //ajax post
        $.ajax({
           type:'POST',
           data: newUser,
           url: '/users',
           dataType: 'JSON',
           error: handleError
        }).done(function(response) {
            //clear form
            $('#addUser fieldset input').val('');

            //update
            populateTable();
        });
    } else {
        //validation fail
        alert('Please fill in all fields');
        return false;
    }
}

function deleteUser(event) {
    event.preventDefault();

    var confirmation = confirm("Are you sure you want to delete this user?");
    var url = "/users/" + $(this).attr('rel');
    //if yes
    if (confirmation) {

        $.ajax({
           type: "DELETE",
           url: url,
           error: handleError
        }).done(function(response) {
            //update table
            populateTable();
        });
    } else {
        return false;
    }
}

function deleteVoice(event) {
    event.preventDefault();

    var confirmation = confirm('Are you sure you want to delete this voice note?');
    var url = "/voices/" + $(this).attr('rel');

    if (confirmation) {

        $.ajax({
            type: "DELETE",
            url: url,
            error: handleError
        }).done(function(response) {
            populateTable();
        })
    } else {
        return false;
    }
}

function handleError(jqXHR, textStatus, errorThrown) {
    jsonValue = jQuery.parseJSON(jqXHR.responseText);
    console.log(jsonValue.Message);
}