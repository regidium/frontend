// export function for listening to the socket
module.exports = function (socket) {
    /** todo Получать пользователя из куки */
    var name = 'Guest';

    // send the new user their name and a list of users
    socket.emit('init', {
        name: name
    });

    // передать сообщение пользователя, всем участникам чата
    socket.on('send:message', function (data) {
        socket.broadcast.emit('send:message', {
            owner: data.owner,
            text: data.message
        });
    });

    // оповестить всех участников чата, о выходе пользователя
    socket.on('disconnect', function () {
        socket.broadcast.emit('user:left', {
            name: name
        });
    });
};