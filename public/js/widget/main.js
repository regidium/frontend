// Шаблон сообщения
function msgOutput(text){
    var lt = new Date();

    var msgOutputTpl = '<div class="msg msg-output">';
    msgOutputTpl += '<img src="img/user-photo-default.jpg" class="msg-photo">';
    msgOutputTpl += '<div class="msg-content-arrow">';
    msgOutputTpl += '<div class="msg-content">';
    msgOutputTpl += '<div class="msg-date">'+lt.toLocaleTimeString()+'</div>';
    msgOutputTpl += '<div class="msg-user">Вы</div>';
    msgOutputTpl += '<div class="msg-text">'+text+'</div>';
    msgOutputTpl += '</div>';
    msgOutputTpl += '</div>';
    msgOutputTpl += '</div>';
    $('#dialogue .content').append(msgOutputTpl);
}

function scroll_to_bottom(speed) {
    var height= $("#dialogue .content").height();
    $("#dialogue").animate({"scrollTop":height},speed);
}

// Разворачивание формы
function chatSlide(){
    $('#dialogue').slideToggle(300);
    $('#message-input').toggleClass('full');
    if ($('#message-input').attr('class') != 'full'){
        $('#message-input textarea').animate({height: '15px'});
        $('#message-input .message-input-content span').text('Напишите сообщение и нажмите Enter');
    }
    else {
        // Высота поля для ввода
        $('#message-input textarea').animate({height: '55px'});
        // Текст в поле
        setTimeout("$('#message-input .message-input-content span').delay(1000).text('Напишите сообщение и нажмите Enter, чтобы его отправить');", 300);
    }
    // Копирайт
    $('#copyright .copyright-content').slideToggle(300);
}

// Авторизация
function chatAuthAnimation(){
    $('#auth')
        .delay(500)
        .animate({left: "0px"}, 100)
        .animate({left: "18px"}, 100)
        .animate({left: "9px"}, 100)
}
function chatAuthReg(){
    $('#auth').fadeOut(300);
}

// Нажатие Enter
function Enter(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode == 13) {
        evt.returnValue = false;
        if ($('#message-input').attr('class') != 'full'){
            chatSlide();
        }
        var text = $('#message-input textarea').val();
        msgOutput(text);
        $('#message-input textarea').val('');
        scroll_to_bottom(200);
        chatAuthAnimation();
    }
    return false;
}

$(document).ready(function(){
    $('#header .status').click(function(){
        chatSlide();
    })
    $('#message-input .message-input-content span').click(function(){
        $(this).fadeOut(500);
        $('#message-input .message-input-content textarea').focus();
    })
})