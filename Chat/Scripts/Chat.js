/// <reference path="jquery-1.6.4.js" />
/// <reference path="knockout-3.4.0.js" />
//var xhrPool = [];
//$(document).ajaxSend(function (e, jqXHR, options) {
//    xhrPool.push(jqXHR);
//});
//$(document).ajaxComplete(function (e, jqXHR, options) {
//    xhrPool = $.grep(xhrPool, function (x) { return x != jqXHR });
//});
//var abortxhr = function () {
//    $.each(xhrPool, function (idx, jqXHR) {
//        jqXHR.abort();
//    });
//    alert("dkhefj");
//};
var usersOnlineViewModel = (function () {
    var usersOnline = ko.observableArray();
    var isMusicEnabled = ko.observable(true);
    return {
        usersOnline:usersOnline,
    isMusicEnabled:isMusicEnabled
    }
})();
ko.applyBindings(usersOnlineViewModel)
var id;
//$("form").submit(function (e) {
//    e.preventDefault(e);
//});
//$("#addProductForm").submit(function (event) {

//    //disable the default form submission
//    event.preventDefault();
//    //grab all form data  
//    var formData = $(this).serialize();

//    $.ajax({
//        url: '/Chat/Home/UploadFiles',
//        type: 'POST',
//        data: formData,
//        async: false,
//        cache: false,
//        contentType: false,
//        processData: false,
//        success: function (data) {
//            alert(data);
//        },
//        error: function () {
//            alert("error in ajax form submission");
//        }
//    });

//    return false;
//});
//$("form#data").submit(function (e) {
//    e.preventDefault();
//    var formData = $(this);

//    $.ajax({
//        url: '/Chat/Home/Index',
//        type: 'POST',
//        data: formData,
//        async: false,
//        success: function (data) {
//            alert(data)
//        },
//        cache: false,
//        contentType: false,
//        processData: false
//    });

//    return false;
//});

$('#message').css('lineHeight', '110%');
var msg = function (name, msg,time) {
    this.name = name;
    this.msg = msg;
    this.time = time;
};
var frndsList = ['varsha.mathukumalli', 'karthik.bandi', 'shashi.dadi', 'saikiriti.sambangi', 'raghu.gudapati', 'saikumar.vanam', 'jagadish.chigurupati', 'shiva.potharaju', 'niteesha.jupally', 'sreeja.banswada', 'srinivasa.yella', 'mallesham.musuni', 'ajay.bejjam'];
var messages = [];
if (JSON.parse(localStorage.getItem("msgs"))!=null)
messages=JSON.parse(localStorage.getItem("msgs"));
$(function () {
    /// <reference path="Chat.js" />
    var files;

    // Add events
    $('input[type=file]').on('change', prepareUpload);

    // Grab the files and set them to our variable
    function prepareUpload(event) {
        files = event.target.files;

        if (files.length > 0)
            if(files[0].type.startsWith("image"))
                uploadFiles();
            else
                alert("Upload Only Images...........")
    }


    // Catch the form submit and upload the files
    function uploadFiles(event) {
        if (event)
            {
        event.stopPropagation(); // Stop stuff happening
        event.preventDefault(); // Totally stop stuff happening
        }
        // START A LOADING SPINNER HERE

        // Create a formdata object and add the files
        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
        });

        $.ajax({
            url: '/ChatAPP/Home/UploadFiles',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request


        });

    }
    $(document).ajaxComplete(function (a, b, c) {
        //$('#messageList').append("<li><img src='/Chat/Content/" + b.responseText + "'/></li>")
        chat.server.send($('#displayname').val(), b.responseText, $('#reciever').val(), $.connection.hub.id,true);
        //uploadImage(b.responseText, "image");
    }
        );
    
    var chat = $.connection.myHub;
    var uploadImage = function (imgname, image) {
        alert(imgname);
    };

    chat.client.broadcastMessage = function (name, message, reciever,conId,isImage) {

        if ($('#displayname').val() == reciever) {
            var encodedName = $('<div />').text(name).html();
            var encodedMsg = $('<div />').text(message).html();
            if (usersOnlineViewModel.isMusicEnabled() && conId !== $.connection.hub.id)
                audioElement.play();
            $('#messageList').scrollTo($("#messageList")[0].scrollHeight);
            var t=new Date();
            messages.push(new msg(name, message,t.toLocaleTimeString()));
            localStorage.setItem("msgs", JSON.stringify(messages));

            if (conId === $.connection.hub.id)
                {
                if(!isImage)
                $('#discussion').append('<li class="bubbler" style="text-align:left;list-style:none;padding:10px;left:50%;position:relative"><span style="position:absolute;right:12px;color:gray">' + t.toLocaleTimeString() + '</span><br><strong>' + encodedName
                + '</strong>:&nbsp;&nbsp;' + message + '</li><br/>');
                else
                    $('#discussion').append('<li class="bubbler" style="text-align:left;list-style:none;padding:10px;left:50%;position:relative"><span style="position:absolute;right:12px;color:gray">' + t.toLocaleTimeString() + '</span><br><strong>' + encodedName
                + '</strong><br><img class="msgimg" style="width:250px;height:250px" src="/ChatAPP/ImagesUploaded/' + message + '"/></li><br/>');
}
            else
            {
                if (!isImage)
                $('#discussion').append('<li class="bubblel" style="text-align:left;list-style:none;padding:10px;left:12px;position:relative"><span style="position:absolute;right:12px;color:gray">' + t.toLocaleTimeString() + '</span><br><strong>' + encodedName
                + '</strong>:&nbsp;&nbsp;' + message + '</li><br/>');
                else
                    $('#discussion').append('<li class="bubblel" style="text-align:left;list-style:none;padding:10px;left:12px;position:relative"><span style="position:absolute;right:12px;color:gray">' + t.toLocaleTimeString() + '</span><br><strong>' + encodedName
                + '</strong><br><img class="msgimg" style="width:250px;height:250px" src="/ChatAPP/ImagesUploaded/' + message + '"/></li><br/>');
            }
        }
    };
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', '/ChatAPP/Content/sound.wav');

    chat.client.popup = function () {
        alert("you have already opened in another tab or browser please go to that !!");
    }
    chat.client.Connected = function (data) {
        $('#UsersOnline').append('<li><span style="color:green">*</span><strong>' + data + '</strong></li>');
    };
    chat.client.disconnected = function (data) {
        $.each(usersOnlineViewModel.usersOnline(), function (indx, item) {
            if (item.machineName.split('\\')[1] ==data ) {
                usersOnlineViewModel.usersOnline.splice(indx, 1);
            }
        });
        $.each($('#UsersOnline').find('strong'), function (i, li) {
            if (li.innerText == data) {
                li.parentNode.remove();
            }
        });

    }
    $("#message").keydown(function (e) {

        if (e.keyCode == 13 && !e.shiftKey) {
            e.preventDefault();
            $('#message').scrollTo($("#message")[0].scrollHeight);
            if ($('#message').html()!="")
                chat.server.send($('#displayname').val(), $('#message').html().replace("<br><br>", "<br>"), $('#reciever').val(), $.connection.hub.id,false);
            $('#message').html('');
            $('#message').focus();
        }
        
    });
    $('.image').click(function (x) {
        var y = x.currentTarget.innerHTML;
        // $('#message').html($('#message').html()+y);
        
        $('#message').append(y);
        $('#message').scrollTo($("#message")[0].scrollHeight);

    }
);

   
        






    $('#emoticons').click(function()
    {
        //$('#smileys').toggle('show');
        if ($('#smileys').css('display') == 'none')
        {
            //$('#smileys').show();
            $('#smileys').toggle('show');
            $('#messageList').height('70%');
        }
           
        else
        {
            //$('#smileys').hide();
            $('#smileys').toggle('show');
            $('#messageList').height('90%');
        }
            
       
        
    }
    )
    chat.client.getUsers = function (Users) {
        alert(Users);
    };


    



    chat.client.generateUsers = function (data) {
        //_.each(usersOnlineViewModel.usersOnline(), function (x) {
        //    if (x.machineName.split('\\')[1] !== data.machineName.split('\\')[1])
        //        usersOnlineViewModel.usersOnline.push(data);
        //});
        if ($.inArray(data.machineName.split('\\')[1], $.map(usersOnlineViewModel.usersOnline(), function (names) { return names.machineName.split('\\')[1]; }))==-1) {
            usersOnlineViewModel.usersOnline.push(data);
        }
        //usersOnlineViewModel.usersOnline(_.uniq(usersOnlineViewModel.usersOnline()));
        //$('#UsersOnline').append('<li><span style="color:green">*</span><strong>' + data.machineName.split('\\')[1] + '</strong></li>');

    }
    
    chat.client.generateUsersOnStart = function (data) {
        
        if (data) {
            for (var i in data) {
                usersOnlineViewModel.usersOnline.push(data[i]);
                //$('#UsersOnline').append('<li><span style="color:green">*</span><strong>' + data[i].machineName.split('\\')[1] + '</strong></li>');
            }
        }
    }
    $('#music').click(function () {
        if (usersOnlineViewModel.isMusicEnabled())
        {
            $('#music').attr('src', '/ChatAPP/Content/music_off.png');
            usersOnlineViewModel.isMusicEnabled(false);
        }
        else
        {
            $('#music').attr('src', '/ChatAPP/Content/music-on.png');
            usersOnlineViewModel.isMusicEnabled(true);
        }
    });

    $('#displayname').val('');

    $('#message').focus();
    
    $.connection.hub.start().done(function () {
        $('#id').val($.connection.hub.id);
        chat.server.setUsers($.connection.hub.id, $('#displayname').val());
        chat.server.setUsers($.connection.hub.id, $('#displayname').val());
        $('#sendmessage').click(function () {
            if (document.getElementById('message').innerHTML!="")
                chat.server.send($('#displayname').val(), $('#message').html().replace("<br><br>", "<br>"), $('#reciever').val(),$.connection.hub.id,false);

            $('#message').html('');
            $('#message').focus();
        });
    });
});

document.onreadystatechange = function () {
    var state = document.readyState
    if (state == 'interactive') {
        document.getElementById('main').style.visibility = "hidden";
    } else if (state == 'complete') {
        setTimeout(function () {
            document.getElementById('interactive');
            document.getElementById('load').style.visibility = "hidden";
            document.getElementById('main').style.visibility = "visible";
        }, 1000);
    }
}
$.fn.scrollTo = function (target, options, callback) {
    if (typeof options == 'function' && arguments.length == 2) { callback = options; options = target; }
    var settings = $.extend({
        scrollTarget: target,
        offsetTop: 50,
        duration: 500,
        easing: 'swing'
    }, options);
    return this.each(function () {
        var scrollPane = $(this);
        var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
        var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
        scrollPane.animate({ scrollTop: scrollY }, parseInt(settings.duration), settings.easing, function () {
            if (typeof callback == 'function') { callback.call(this); }
        });
    });
}
var getHistory=function()
{
    if ($('#msgHistory').css('display') == 'none') {
        $('#msgHistoryList').empty();
        var msgHistory = JSON.parse(localStorage.getItem("msgs"));
        if (msgHistory == null) {
            alert("No history found!");
            return;
        }
        else {
            $.each(msgHistory, function (idx, item) {
                $('#msgHistoryList').append("<li><strong>" + item.name + ":</strong>" + item.msg + "<strong>(</strong>" + item.time + "<strong>)</strong></li>")


            });
            $('#msgHistory').toggle('show');
            $('#viewHistory').text('Go Back');
        }

    }

    else {
        $('#msgHistory').toggle('show');
        $('#viewHistory').text('View History');
    }
    $('#msgHistory').css('overflow-y', 'scroll');
}
var clearHistory = function () {
    localStorage.removeItem('msgs'); messages = [];
    $('#msgHistoryList').empty();
}