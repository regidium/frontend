/**
 *  Agent application constants service
 */
(function(angular){

    'use strict';

    angular.module('regidiumApp')
        .factory('constantsService', constantsService)

    function constantsService(){
        return {

            /**
             * Application constants array
             *
             * @returns {{}}
             */
            getApplicationConstants: function(){

                var c = {};

                c.AGENT_STATUS_ONLINE   = 1;
                c.AGENT_STATUS_OFFLINE  = 3;

                c.CHAT_STATUS_ONLINE   = 1;
                c.CHAT_STATUS_CHATTING = 2;
                c.CHAT_STATUS_OFFLINE  = 3;
                c.CHAT_STATUS_CLOSED   = 4;

                c.PAYMENT_METHOD_YANDEX_MONEY   = 1;
                c.PAYMENT_METHOD_CREDIT_CARD   = 2;

                c.TRIGGER_EVENT_WIDGET_CREATED = 1;
                c.TRIGGER_EVENT_WORD_SEND = 2;
                c.TRIGGER_EVENT_TIME_ONE_PAGE = 3;
                c.TRIGGER_EVENT_VISIT_PAGE = 4;
                c.TRIGGER_EVENT_VISIT_FROM_URL = 5;
                c.TRIGGER_EVENT_VISIT_FROM_KEY_WORD = 6;
                c.TRIGGER_EVENT_CHAT_OPENED = 7;
                c.TRIGGER_EVENT_CHAT_CLOSED = 8;
                c.TRIGGER_EVENT_MESSAGE_START = 9;
                c.TRIGGER_EVENT_MESSAGE_SEND = 10;

                c.TRIGGER_RESULT_MESSAGE_SEND = 1;
                c.TRIGGER_RESULT_AGENTS_ALERT = 2;
                c.TRIGGER_RESULT_WIDGET_OPEN = 3;
                c.TRIGGER_RESULT_WIDGET_BELL = 4;

                c.MESSAGE_SENDER_TYPE_USER = 1;
                c.MESSAGE_SENDER_TYPE_AGENT = 2;
                c.MESSAGE_SENDER_TYPE_ROBOT_TO_USER = 3;
                c.MESSAGE_SENDER_TYPE_ROBOT_TO_AGENT= 4;

                return c;
            }
        }
    }

})(angular);