define(function(require) {
    'use strict';
    var module = require('components/eligibility/module');
 
 // Get home page data / variables
	module.factory('getData', function ($http) {
	    return {
    	    getEliData: function(datasource) {
    	       // console.log("datasource");
    	       // console.log(datasource);
    	        return $http(datasource).then(function successCallback(response) {
    	           // console.log("response");
    	           // console.log(response);
    	            return response.data;
    	        },
    	        function errorCallback(response) {
    	            console.log("datasource no data");
    	        });
    	    }
	    }
	}); // End Factory
});