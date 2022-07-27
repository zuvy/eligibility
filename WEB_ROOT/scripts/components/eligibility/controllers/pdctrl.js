define(function (require) {
    'use strict'
        var module = require('components/eligibility/module');
        var $j = require('jquery');
        module.controller('pdAppCtrl',['$scope', '$q', '$http', 'getData', '$attrs', '$filter', function($scope, $q, $http, getData, $attrs, $filter) {
            $scope.arData = [];
            $scope.gl = $attrs.ngGl;
            $scope.site = $attrs.ngSite;
            
            console.log("gl = " + $scope.gl);
            console.log("site = " + $scope.site);
            
            var prevData = {
                "method": 'POST',
                "url": "js/arch_data.json",
                "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "dataType": "json"
                }
            };
            
            
            let preData = 
            getData.getEliData(prevData).then(function(retData) {
                if(!retData) {
                    console.log("Demographics data retData not returned.");
                }
                else {
                    $scope.arData = (retData);
                    console.log("arData");
                    console.log($scope.arData);
                    }
                }); // End getHd function
                
            $scope.params = function(val) {
                $scope.param1
                $scope.param2
                
                if($scope.param1 == undefined) {
                    $scope.param1 = val;
                    $scope.param2 = undefined;
                }
                if($scope.param1 != undefined) {
                    $scope.param2 = val;
                }
                
                console.log("param1 = " + $scope.param1 + " param2 = " + $scope.param2);
                $scope.slink = `eli_status.html?p1=${$scope.param1}&p2=${$scope.param2}&gl=${$scope.gl}&site=${$scope.site}`;
            }
            
            // var psDialogHolder = null;
            // $scope.openDialog = function(ID) {}
            // psDialogHolder = $j('#dialogOne').detach();
            
            // psDialog({
            //     content: psDialogHolder,
            //     close: function() {
            //         $j('#dialogContainer').append(psDialogHolder);
            //     }
            // });
    
        }]); 
        
        // End Controller
        
    })