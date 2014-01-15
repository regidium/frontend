var redis = require('redis');

/** Все online пользователи */
var users = [];

/** Все online агенты */
var agents = [];

var self = module.exports = {};

// export function for listening to the socket
self.init = function (io) {
    self.io = io;
}

self.run = function (socket) {
    self.sub = redis.createClient();
    self.pub = redis.createClient();

    socket.on('agent:connected', function(data) {
        /** @todo Передать агенту список ожидающих */
        socket.agent = data;
        agents[socket.agent.uid] = socket;
    });

    // Выдаем список чатов
    socket.on('agent:list:chats', function(data, cb) {
        cb(self.io.sockets.manager.rooms)
    });

    // Подключаем агента к чату
    socket.on('agent:enter:chat', function(chat) {
        console.log('Agent enter ot chat '+chat);
        socket.join(chat);
    });

    socket.on('user:connected', function(data) {
        /** @todo Оповестить всех агентов, о входе пользователя */
        socket.user = data;
        users[socket.user.uid] = socket;
    });

    socket.on('user:create:chat', function(data) {
        socket.join(data.chat.uid);
        socket.broadcast.emit('user:create:chat', data)
    });

    // передать сообщение пользователя агенту
    socket.on('agent:send:message', function (data) {
        socket.broadcast.to(data.chat).emit('agent:send:message', data)
    });

    // передать сообщение пользователя агенту
    socket.on('user:send:message', function (data) {
        socket.broadcast.to(data.chat).emit('user:send:message', data)
    });

    socket.on('disconnect', function (data) {
        if (socket.user) {
            /** @todo Оповестить всех агентов о выходе пользователя */
            /* socket.broadcast.emit('user:disconnected', {
                user: data
             });*/
            delete users[socket.user.uid];
        } else if (socket.agent) {
            delete agents[socket.agent.uid];
        } else {
            return;
        }
    });
};