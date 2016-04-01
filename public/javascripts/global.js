/**
 * Created by Raymond Phua on 31-Mar-16.
 */

//userlist
var users = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserDetail);
    //add user
    $('#btnAddUser').on('click', addUser);
    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});


// FUNCTIONS ==========================================
function populateTable() {

    //Empty content string
    var tableContent = "";

    //jquery ajax call for JSON
    $.getJSON('/users', function(data) {

        users = data;

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
}

//Show user detail
function showUserDetail(event) {

    //Prevent link from firing
    event.preventDefault();

    //retrieve username from link rel attribute
    var selectedUsername = $(this).attr('rel');

    //get index of object based on id value
    var arrayPosition = users.map(function(arrayItem) { return arrayItem.username; }).indexOf(selectedUsername);

    //get user from list
    var user = users[arrayPosition];

    //Populate Info Box
    $('#userInfoUsername').text(user.username);
    $('#userInfoFirstName').text(user.firstname);
    $('#userInfoLastName').text(user.lastname);
    $('#userInfoUid').text(user.uid);
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

function handleError(jqXHR, textStatus, errorThrown) {
    jsonValue = jQuery.parseJSON(jqXHR.responseText);
    console.log(jsonValue.Message);
}