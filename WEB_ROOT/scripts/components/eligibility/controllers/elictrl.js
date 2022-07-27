define(function (require) {
	'use strict'
		var module = require('components/eligibility/module');
		var $j = require('jquery');
		module.controller('eliAppCtrl',['$scope', '$q', '$http', 'getData', '$attrs', '$filter', function($scope, $q, $http, getData, $attrs, $filter) {
			$scope.message = 'eliAppCtrl message.';
			$scope.site = $attrs.ngSite;    // schoolid
			$scope.gl = $attrs.ngGl;        // grade level
			$scope.p1 = $attrs.ngP1;        // u_eligibility.id first f list object
			$scope.p2 = $attrs.ngP2;        // u_eligibility.id 2nd f list object
			$scope.gr1Data = [];            // array for 1st f list
			$scope.gr2Data = [];            // array for 2nd f list
			$scope.cData = [];              // current selection, or grade level of students array of objects
			$scope.stat_arr = [];            // 1st list of students with probation status from gr1Data
			
			// ajax object to send for first list of students in the selection with an f in any class
			var g1Data = {
				"method": 'POST',
				"url": `js/grade_data.json?param=${$scope.p1}`,
				"headers": {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"dataType": "json"
				}
			};
			
			// ajax object to send for second list of students in the selection wath an f in any class
			var g2Data = {
				"method": 'POST',
				"url": `js/grade_data.json?param=${$scope.p2}`,
				"headers": {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"dataType": "json"
				}
			};
			
			// ajax object to retrieve student data current selection or grade_level to compare with f lists and create probation lists
			var curData = {
				"method": 'POST',
				"url": `js/cur_stud.json?site=${$scope.site}&gl=${$scope.gl}`,
				"headers": {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"dataType": "json"
				}
			};
			
			// get first f list
			let gradeData1 = 
			getData.getEliData(g1Data).then(function(retData) {
				if(!retData) {
					console.log("Demographics data retData not returned.");
				}
				else {
					$scope.gr1Data = (retData);
				// 	console.log("gr1Data");
				// 	console.log($scope.gr1Data);
					return $scope.gr1Data;
					}
				}); // End function
			
			// get second f list			
			let gradeData2 = 
			getData.getEliData(g2Data).then(function(retData) {
				if(!retData) {
					console.log("Demographics data retData not returned.");
				}
				else {
					$scope.gr2Data = (retData);
				// 	console.log("gr2Data");
				// 	console.log($scope.gr2Data);
					return $scope.gr2Data;
					}
				}); // End function
			
			
			// get student data for current selection / grade_level			
			let gradeData3 = 
			getData.getEliData(curData).then(function(retData) {
			 //   console.log("retData");
			 //   console.log(retData);
				if(!retData) {
					console.log("Demographics data retData not returned.");
				}
				else {
					$scope.cData = (retData);
				//  	console.log("cData");
				//  	console.log($scope.cData);
					return $scope.cData;
					}
				}); // End function
				
				// process results
				$q.all([gradeData1, gradeData2, gradeData3]).then(function(result) {
				    // localize objects
					var gd1 = gradeData1.$$state.value;
					var gd2 = gradeData2.$$state.value;
					var gd3 =  gradeData3.$$state.value;
    				// console.log("GD1");
    				// console.log(gd1);
    				// console.log("GD2");
    				// console.log(gd2);
    				// loop counters
    				var gd1_ctr = gd1.length - 1;
    				var gd2_ctr = gd2.length - 1;
    				var gd3_ctr = gd3.length - 1;
    				// local probation object arrays
    				var gdr1 = [];
    				var gdr2 = [];
    				var fin = [];
					
					
					for(let i = 0; i < gd3_ctr; i++) {  // outer loop for 1st probation object array current student data
						for(let j = 1; j < gd1_ctr; j++) { // inner loop for 1st probation object array first f list
                		    var	stuObj1 = {};               // 1st local probation student object
							if(gd3[i].s_number == gd1[j].s_number) {
							    stuObj1.name = gd1[j].student;
							    stuObj1.num = gd1[j].s_number;
							    stuObj1.status = "Probation";
							    //console.log($scope.gd_arr[$scope.gd_arr.length - 1].num) + " " + stuObj.num;
							}

							var gdr_ctr1 = gdr1.length;
							    if(gdr_ctr1 <= 2 && stuObj1.status == "Probation") {
							        gdr1.push(stuObj1);
							    }
							    else if(gdr_ctr1 > 2 && stuObj1.num != gdr1[gdr_ctr1 - 1].num && stuObj1.status == "Probation") {
							        gdr1.push(stuObj1);
							    }
						}
						// process second probation list
						for(let k = 0; k < gd2_ctr; k++) { // inner loop for second probation list
                		    var	stuObj2 = {};               // 2nd local probation student object
							if(gd3[i].s_number == gd2[k].s_number) {
							    stuObj2.name = gd2[k].student;
							    stuObj2.num = gd2[k].s_number;
							    stuObj2.status = "Probation";
							    //console.log($scope.gd_arr[$scope.gd_arr.length - 1].num) + " " + stuObj.num;
							}

							var gdr_ctr2 = gdr2.length;
							    if(gdr_ctr2 <= 2 && stuObj2.status == "Probation") {
							        gdr2.push(stuObj2);
							    }
							    else if(gdr_ctr2 > 2 && stuObj2.num != gdr2[gdr_ctr2 - 1].num && stuObj2.status == "Probation") {
							        gdr2.push(stuObj2);
							    }
						}
					}
					console.log("gdr1");
					console.log(gdr1);
					console.log("gdr2");
					console.log(gdr2);
					for(let i = 0; i < gd3_ctr; i++) {
					    var fino = {};
					    if(i == 0) {
					    console.log("gdr1 filter");
					    console.log(gd3[i].s_number);
					    console.log($filter('filter')(gdr1, {'num': gd3[i].s_number}).length);
					    console.log($filter('filter')(gdr1, {'num': gd3[i].s_number}));
					    console.log("gdr2 filter");
					    console.log(gd3[i].s_number);
					    console.log($filter('filter')(gdr2, {'num': gd3[i].s_number}).length);
					    console.log($filter('filter')(gdr2, {'num': gd3[i].s_number}));
					    }
					    
					    if(!(($filter('filter')(gdr1, {'num': gd3[i].s_number}).length && $filter('filter')(gdr2, {'num': gd3[i].s_number}).length))) {
					      fino.num = gd3[i].s_number;
					      fino.name = gd3[i].student;
					      fino.status = "Eligible";
					      fino.color = "green";
					      console.log("fina eligible");
					      console.log(fino);
					    }
					    if($filter('filter')(gdr1, {'num': gd3[i].s_number}).length > 0 || $filter('filter')(gdr2, {'num': gd3[i].s_number}).length > 0) {
					      fino.num = gd3[i].s_number;
					      fino.name = gd3[i].student;
					      fino.status = "Probation";
					      fino.color = "orange";
					      console.log("fina prob");
					      console.log(fino);
					    }
					    if($filter('filter')(gdr1, {'num': gd3[i].s_number}).length && $filter('filter')(gdr2, {'num': gd3[i].s_number}).length){
					      fino.num = gd3[i].s_number;
					      fino.name = gd3[i].student;
					      fino.status = "Ineligible";
					      fino.color = "red";
					      console.log("fina ineligible");
					      console.log(fino);
					    }
					    fin.push(fino);
					}
    				console.log("GD3");
    				console.log(gd3);
				// 	console.log("fin");
				// 	console.log(fin);

                    $scope.stat_arr = fin;
                    console.log($scope.stat_arr);
				});
	
		}]); 
		
		// End Controller
		
	})