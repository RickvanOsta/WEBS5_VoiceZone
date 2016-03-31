/**
 * Created by Raymond Phua on 31-Mar-16.
 */

//userlist
var users = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

});


// FUNCTIONS ==========================================
function populateTable() {

    //Empty content string
    var tableContent = "";

    //jquery ajax call for JSON
    $.getJSON('/users', function(data) {

        $.each(data, function() {
           tableContent += "<tr>";
           tableContent += "<td><a href='#' class='linkshowuser' rel='" + this.username + "'>" + this.username + "</a></td>";
           tableContent += "<td>" + this.firstname + "</td>";
           tableContent += "<td>" + this.lastname + "</td>";
           tableContent += "<td><a href='#' class='linkdeleteuser' rel='" + this._id + "'>delete</a></td>";
        });
    });
}