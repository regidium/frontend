var self = module.exports = {};
var _ = require('underscore');

// export function for listening to the socket
self.init = function (io) {
    self.io = io;
    /** Все online посетители */
    self.visitors = {};
    /** Все online пользователи */
    self.users = {};
    /** Все online агенты */
    self.agents = {};
    /** Все online чаты */
    self.chats = {};
}

self.run = function (socket) {
    socket.on('agent:connected', function(data) {
        /** @todo Передать агенту список ожидающих */
        data.avatar = 'img/employee-photo-small.jpg';
        socket.agent = data;
        self.agents[socket.agent.uid] = socket;
    });

    socket.on('agent:registered', function(data) {
        /** @todo реализовать */
        socket.broadcast.emit('agent:registered', data);
    });

    socket.on('agent:edited', function(data) {
        /** @todo реализовать */
        socket.broadcast.emit('agent:edited', data);
    });

    socket.on('visitor:connected', function(data) {
        /** @todo Оповестить всех агентов, о входе посетителя */
        data.uid = socket.id;
        data.model_type = 'visitor';
        data.avatar = 'img/user-photo-default.jpg';
        socket.visitor = data;
        self.visitors[socket.id] = data;
        socket.broadcast.emit('visitor:connected', data);
        socket.emit('visitor:connected', data);
    });

    socket.on('agent:chat:exited', function(data) {
        socket.leave(data.chat);
    });

    socket.on('user:logined', function(data) {
        /** @todo Оповестить всех агентов, о входе пользователя */
        socket.user = data;
        self.users[socket.user.uid] = socket;
    });

    socket.on('user:registered', function(data) {
        /** @todo реализовать */
    });

    socket.on('user:logined', function(data) {
        /** @todo реализовать */
    });

    socket.on('user:edited', function(data) {
        /** @todo реализовать */
    });

    socket.on('user:edited', function(data) {
        /** @todo реализовать */
    });

    socket.on('chat:created', function(data) {
        self.chats[data.chat.uid] = data.chat;
        socket.join(data.chat.uid);
        socket.broadcast.emit('chat:created', data);
    });

    socket.on('chat:started', function(data) {
        /** @todo реализовать */
        self.chats[data.chat.uid] = data.chat;
        socket.join(data.chat.uid);
        socket.broadcast.emit('chat:started', data);
    });

    socket.on('chat:ended', function(data) {
        socket.leave(data.chat.uid);
        /** @todo реализовать */
    });

    socket.on('chat:destroyed', function(data) {
        delete self.chats[data.uid];
        socket.broadcast.emit('chat:destroyed', data);
    });

    socket.on('chat:message:created', function(data) {
        /** @todo реализовать */
    });

    socket.on('chat:message:readed', function(data) {
        /** @todo реализовать */
    });

    socket.on('chat:message:removed', function(data) {
        /** @todo реализовать */
    });

    // ========================================= //
    // Выдаем список чатов
    socket.on('chats:online', function(data, cb) {
        cb(self.chats);
        //cb(self.io.sockets.manager.rooms)
    });

    // Выдаем список чатов
    socket.on('visitors:online', function(data, cb) {
        cb(self.visitors);
    });

    // Подключаем агента к чату
    socket.on('chat:agent:enter', function(data) {
        socket.join(data.chat);
        socket.broadcast.to(data.chat).emit('chat:agent:enter', data)
    });

    // передать сообщение посетителя агенту
    socket.on('chat:visitor:message:send', function (data) {
        console.log(data.chat);
        socket.broadcast.to(data.chat).emit('chat:visitor:message:send', data)
    });

    // передать сообщение пользователя агенту
    socket.on('chat:user:message:send', function (data) {
        socket.broadcast.to(data.chat).emit('chat:user:message:send', data)
    });

    // передать сообщение пользователя агенту
    socket.on('chat:agent:message:send', function (data) {
        socket.broadcast.to(data.chat).emit('chat:agent:message:send', data)
    });

    socket.on('disconnect', function () {
        if (socket.user) {
            delete self.users[socket.user.uid];
            var chats = Object.keys(self.io.sockets.manager.roomClients[socket.id]).map(function(room) { return room.replace('/', ''); });
            _.each(chats, function(uid) {
                socket.broadcast.emit('chat:destroyed', {uid: uid});
                delete self.chats[uid];
            });
        } else if (socket.agent) {
            delete self.agents[socket.agent.uid];
        } else if (socket.visitor) {
            delete self.visitors[socket.visitor.uid];
            socket.broadcast.emit('visitor:exited', {uid: socket.visitor.uid});
        } else {
            return;
        }
    });
};