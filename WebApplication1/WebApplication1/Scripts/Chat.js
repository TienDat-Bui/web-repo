
$(function () {
    // Reference the auto-generated proxy for the hub.
    var chat = $.connection.chatHub;
    var userName = localStorage.getItem('userName')
    console.log(userName);
    // Create a function that the hub can call back to display messages.
    chat.client.addNewMessageToPage = function (name, message) {
        // Add the message to the page.
        if (name != userName) {
            // Add the message to the page.
            $('#discussion').append('<p style="color:green; text-align:left; width:300px"><strong>' + name + ':'
                + ' </strong> ' + htmlEncode(message) + '</p>');
        }
        else if (name == userName) {
            // Add the message to the page.
            $('#discussion').append('<p style="color:blue;text-align:right;"><strong>' + name + ':'
                + ' </strong> ' + htmlEncode(message) + '</p>');
        }
    };
    // Set initial focus to message input box.
    $('#message').focus();
    // Start the connection.
    $.connection.hub.start().done(function () {
        $('#sendmessage').click(function () {
            // Call the Send method on the hub.

            // chat.server.send($('#displayname').val(), $('#message').val());
            var message = $('#message').val()
            if (message != '') {
                chat.server.send(userName, message);
                // Clear text box and reset focus for next comment.
                $('#message').val('').focus();
            }
        });
    });
});
// This optional function html-encodes messages for display in the page.
function htmlEncode(value) {
    var encodedValue = $('<div />').text(value).html();
    return encodedValue;
}