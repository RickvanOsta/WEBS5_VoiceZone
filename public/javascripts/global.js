/**
 * Created by Raymond Phua on 31-Mar-16.
 */

//userlist
var users = [];
var voices = [];

var userId = null;
var voiceName, voiceUser;

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    //show user/voice
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUser);
    $('#voiceList table tbody').on('click', 'td a.linkshowvoice', showVoice);
    //edit user/voice
    $('#btnEditUser').on('click', editUser);
    $('#btnEditVoice').on('click', editVoice);
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
            if (this.local) {
                tableContent += "<td><a href='#' class='linkshowuser' rel='" + this._id + "'>" + this.local.email + "</a></td>";
            } else {
                tableContent += "<td>null</td>";
            }
            if (this.facebook) {
                tableContent += "<td>" + this.facebook.email + "</td>";
                tableContent += "<td>" + this.facebook.name + "</td>";
            } else {
                tableContent += "<td>null</td>";
                tableContent += "<td>null</td>";
            }
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
            tableContentVoices += "<td><a href='#' class='linkshowvoice' rel='" + this._id + "'>" + this.title + "</a></td>";
            tableContentVoices += "<td>" + this.fileName + "</td>";
            tableContentVoices += "<td>" + this.fileLocation + "</td>";
            if (this.user) {
                tableContentVoices += "<td>" + this.user._id + "</td>";
                tableContentVoices += "<td><a href='#' class='linkdeletevoice' rel='" + this._id + "'>delete</a></td>";
            } else {
                tableContentVoices += "<td>null</td>";
                tableContentVoices += "<td>null</td>";
            }
            tableContentVoices += "</tr>";
        });
        $('#voiceList table tbody').html(tableContentVoices);
    });
}

//Show user
function showUser(event) {
    event.preventDefault();

    var id = $(this).attr('rel');
    var arrayPosition = users.map(function(arrayItem) { return arrayItem._id; }).indexOf(id);

    var user = users[arrayPosition];

    console.log(id);
    console.log(arrayPosition);
    console.log(user);
    //populate
    $('#inputEmail').val(user.local.email);
    userId = user._id;
}

//Show voice
function showVoice(event) {
    event.preventDefault();

    var id = $(this).attr('rel');
    var arrayPosition = voices.map(function(arrayItem) { return arrayItem._id; }).indexOf(id);

    var voice = voices[arrayPosition];

    console.log(id);
    console.log(arrayPosition);
    console.log(voice);
    //populate
    $('#inputTitle').val(voice.title);
    voiceName = voice.fileName;
    voiceUser = voice.user._id;
    console.log(voiceName);
}

//Edit user
function editUser(event) {
    event.preventDefault();

    //basic validation if input = empty
    var errorCount = 0;
    $('#editUser input').each(function(index, val) {
        if($(this).val() === '') {
            errorCount++;
        }
    });

    if (errorCount === 0) {

        var newUser = {
            "email": $('#editUser fieldset input#inputEmail').val()
        };

        console.log(newUser);

        //ajax post
        $.ajax({
           type:'PUT',
           data: newUser,
           url: '/users/' + userId,
           dataType: 'JSON',
           error: handleError
        }).done(function(response) {
            //clear form
            $('#editUser fieldset input').val('');

            //update
            populateTable();
        });
    } else {
        //validation fail
        alert('Please fill in all fields');
        return false;
    }
}

//edit voice
function editVoice(event) {
    event.preventDefault();

    //basic validation if input = empty
    var errorCount = 0;
    $('#editVoice input').each(function(index, val) {
        if($(this).val() === '') {
            errorCount++;
        }
    });

    if (errorCount === 0) {

        var voice = {
            "uid": voiceUser,
            "title": $('#editVoice fieldset input#inputTitle').val()
        };

        console.log(voice);

        //ajax post
        $.ajax({
            type:'PUT',
            data: voice,
            url: '/voices/' + voiceName,
            dataType: 'JSON',
            error: handleError
        }).done(function(response) {
            //clear form
            $('#editUser fieldset input').val('');

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