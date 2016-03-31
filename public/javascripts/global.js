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
}