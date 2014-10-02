/**
 *  Agent application cookie service
 */
(function(angular){

    'use strict';

    angular.module('regidiumApp')
        .factory('cookieService', cookieService);

    /**
     * Get agent from cookie
     *
     * @param $cookieStore
     * @returns {{getAgent: Function}}
     */
    function cookieService($cookieStore){
        return {
            getAgent: function(){
                var agent = $cookieStore.get('agent');
                if (agent) {
                    decodeAgentData(agent)
                }
                return agent;
            }
        }
    }

    /**
     * Decode agent fields if existed
     *
     * @param agent
     * @returns {*}
     */
    function decodeAgentData(agent){
        if (agent.first_name) {
            agent.first_name = decodeURIComponent(agent.first_name);
        } else {
            agent.first_name = '';
        }

        if (agent.last_name) {
            agent.last_name = decodeURIComponent(agent.last_name);
        } else {
            agent.last_name = '';
        }

        if (agent.job_title) {
            agent.job_title = decodeURIComponent(agent.job_title);
        } else {
            agent.job_title = '';
        }

        return agent;
    }

})(angular);