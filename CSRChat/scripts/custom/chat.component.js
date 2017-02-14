/**
 * This JS module provides the online chat fuctionalities 
 * Author: Ahmad Harb
 * Version: 1.0
 * Created: 30 Jan, 2016
 * Updated: NA
 */
var onlineChat = (function () {

    var _init = function () {

        _setScreen(false);

        // Declare a proxy to reference the hub.
        var chatHub = $.connection.chatHub;

        _registerClientMethods(chatHub);

        // Start Hub
        $.connection.hub.start().done(function () {

            _registerEvents(chatHub)

        });

        // UI prepare
        $('.chat').slideToggle(300, 'swing');
        $('.chat-message-counter').fadeToggle(300, 'swing');

        $('#live-chat header').on('click', function () {

            $('.chat').slideToggle(300, 'swing');
            $('.chat-message-counter').fadeToggle(300, 'swing');

        });

        $('.chat-close').on('click', function (e) {

            e.preventDefault();
            $('#live-chat').fadeOut(300);

        });

    };


    var _setScreen = function (isLogin) {

        if (!isLogin) {

            $("#divChat").hide();
            $("#divLogin").show();
        }
        else {

            $("#divChat").show();
            $("#divLogin").hide();
        }

    };


    var _registerEvents = function (chatHub) {

        var name = "Customer " + Math.floor((Math.random() * 100) + 1);; // TOOD !!!

        if (name.length > 0) {
            chatHub.server.connect(name);
        }
        

        $('#btnSendMsg').click(function () {

            var msg = $("#txtMessage").val();
            if (msg.length > 0) {

                var userName = $('#hdUserName').val();
                chatHub.server.sendMessageToAll(userName, msg);
                $("#txtMessage").val('');
            }
        });


        $("#txtNickName").keypress(function (e) {
            if (e.which == 13) {
                $("#btnStartChat").click();
            }
        });

        $("#txtMessage").keypress(function (e) {
            if (e.which == 13) {
                $('#btnSendMsg').click();
            }
        });


    };


    var _registerClientMethods = function (chatHub) {

        // Calls when user successfully logged in
        chatHub.client.onConnected = function (id, userName, allUsers, messages) {

            _setScreen(true);

            $('#hdId').val(id);
            $('#hdUserName').val(userName);
            $('#spanUser').html(userName);

            // Add All Users
            for (i = 0; i < allUsers.length; i++) {
                _addUser(chatHub, allUsers[i].ConnectionId, allUsers[i].UserName);
            }

            // Add Existing Messages
            for (i = 0; i < messages.length; i++) {
                _addMessage(messages[i].UserName, messages[i].Message);
            }


        }

        // On New User Connected
        chatHub.client.onNewUserConnected = function (id, name) {
            _addUser(chatHub, id, name);
        }


        // On User Disconnected
        chatHub.client.onUserDisconnected = function (id, userName) {

            $('#' + id).remove();

            var ctrId = 'private_' + id;
            $('#' + ctrId).remove();


            var disc = $('<div class="disconnect">"' + userName + '" logged off.</div>');

            $(disc).hide();
            $('#divusers').prepend(disc);
            $(disc).fadeIn(200).delay(2000).fadeOut(200);

        }

        chatHub.client.messageReceived = function (userName, message) {

            _addMessage(userName, message);
        }


        chatHub.client.sendPrivateMessage = function (windowId, fromUserName, message) {

            var ctrId = 'private_' + windowId;

            if ($('#' + ctrId).length == 0) {

                _createPrivateChatWindow(chatHub, windowId, ctrId, fromUserName);

            }

            $('#' + ctrId).find('#divMessage').append('<div class="message"><span class="userName">' + fromUserName + '</span>: ' + message + '</div>');

            // set scrollbar
            var height = $('#' + ctrId).find('#divMessage')[0].scrollHeight;
            $('#' + ctrId).find('#divMessage').scrollTop(height);

        }

    };

    
    var _HideOriginal = function () {
        document.getElementById("form").style.display = 'none';
    };


    var _addUser = function(chatHub, id, name) {

        var userId = $('#hdId').val();

        var code = "";

        if (userId == id) {

            code = $('<div class="loginUser">' + name + "</div>");

        }
        else {
            if (name.search("_CSR") > 0) {
                code = $('<a id="' + id + '" class="user" ondblclick="HideOriginal()">' + name + '<a>');

                $(code).dblclick(function () {

                    var id = $(this).attr('id');

                    if (userId != id)
                        _openPrivateChatWindow(chatHub, id, name);

                });
            }

            $("#divusers").append(code);
        }

    }


    var _addMessage = function AddMessage(userName, message) {
        $('#divChatWindow').append('<div class="message"><span class="userName">' + userName + '</span>: ' + message + '</div>');

        var height = $('#divChatWindow')[0].scrollHeight;
        $('#divChatWindow').scrollTop(height);
    }


    var _openPrivateChatWindow = function (chatHub, id, userName) {

        var ctrId = 'private_' + id;

        if ($('#' + ctrId).length > 0) return;

        _createPrivateChatWindow(chatHub, id, ctrId, userName);

    }


    var _createPrivateChatWindow = function (chatHub, userId, ctrId, userName) {

        // Very quick and dirty function that should be refactored using knockout ASAP
        var div = '<div id="' + ctrId + '" class="ui-widget-content draggable" rel="0">' +
                   '<div class="header">' +
                      '<div  style="float:right;">' +
                          '<img id="imgDelete"  style="cursor:pointer;" src="/Images/delete.png"/>' +
                       '</div>' +

                       '<span class="selText" rel="0">' + userName + '</span>' +
                   '</div>' +
                   '<div id="divMessage" class="messageArea">' +

                   '</div>' +
                   '<div class="buttonBar">' +
                      '<input id="txtPrivateMessage" class="msgText" type="text"   />' +
                      '<input id="btnSendMessage" class="submitButton button" type="button" value="Send"   />' +
                   '</div>' +
                '</div>';

        var $div = $(div);

        // DELETE BUTTON IMAGE
        $div.find('#imgDelete').click(function () {
            $('#' + ctrId).remove();
        });

        // Send Button event
        $div.find("#btnSendMessage").click(function () {

            $textBox = $div.find("#txtPrivateMessage");
            var msg = $textBox.val();
            if (msg.length > 0) {

                chatHub.server.sendPrivateMessage(userId, msg);
                $textBox.val('');
            }
        });

        // Text Box event
        $div.find("#txtPrivateMessage").keypress(function (e) {
            if (e.which == 13) {
                $div.find("#btnSendMessage").click();
            }
        });

        AddDivToContainer($div);

    };


    var _addDivToContainer = function ($div) {
        $('#divContainer').prepend($div);

        $div.draggable({

            handle: ".header",
            stop: function () {

            }
        });

    };

    return {
        init: _init
    };

})();