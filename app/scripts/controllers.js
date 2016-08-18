'use strict';


angular.module('partyNestApp')

        .controller('MenuController', ['$scope', 'ngDialog', 'menuFactory', function($scope, ngDialog, menuFactory) {
            
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.emptyWislist = false;
            $scope.message = "Loading ...";
            menuFactory.getDishes().query(
                function(response) {
                    $scope.dishes = response;
                    $scope.showMenu = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                });
                        
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
      
            /* Should be in the FavoritesController */
            $scope.openRequest = function () { 
                ngDialog.open({ template: 'views/request.html', scope: $scope, className: 'ngdialog-theme-default dialoglarge', controller:"RequestController" });
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {id:1, mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            $scope.channels = channels;
            $scope.invalidChannelSelection = false; 
                                                
        }])




        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {
            
            function JSONEmpty(obj){
                return !obj.length || 
                !obj.filter(function(a){return Object.keys(a).length;}).length;
            } 

            // The first time the page starts we need to check how many are already in the array (to avoid duplicate ids)
            $scope.id = 1;
            feedbackFactory.query(
                function(response){
                    feedbackLst = response;
                    if(!JSONEmpty(feedbackLst)) {
                        $scope.id = feedbackLst.length + 1;
                        $scope.feedback.id = $scope.id;
                    }
                },
                function(response) {
                    $scope.message = "Error:  "+response.status + " " + response.statusText;
                    console.log($scope.message);
                }
            );      
                                    
            $scope.sendFeedback = function() {
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback,
                                    function(success){
                                        console.log('data saved');
                                        console.log(success)
                                    },
                                    function(error){
                                        console.log('data not saved');
                                        console.log(error)
                                    });
                    $scope.id = $scope.id + 1;
                    $scope.feedback = {id: $scope.id, mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedbackForm.$setPristine();
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

            $scope.dish = {};
            $scope.showDish = false;
            $scope.message="Loading ...";
            $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
            .$promise.then(
                            function(response){
                                $scope.dish = response;
                                $scope.showDish = true;
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }
            );
            
        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            
            $scope.newcomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.newcomment.date = new Date().toISOString();
                console.log($scope.newcomment);
                $scope.dish.comments.push($scope.newcomment);
                menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
                $scope.commentForm.$setPristine();
                $scope.newcomment = {rating:5, comment:"", author:"", date:""};
                
            };
        }])

        // implement the IndexController and About Controller here
        .controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {
            
            $scope.showLeaders = false;
            $scope.message = "Loading ...";
            corporateFactory.getLeaders().query(
                function(response) {
                    $scope.leadership = response;
                    $scope.showLeaders = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                });

        }])

       .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory) {

            //var rnd = Math.random() * 4;
            //rnd = Math.floor (rnd);
            
            $scope.showDish = false;
            $scope.message = "Loading ...";
            
            $scope.showPromotion = false;
            $scope.msgpromo = "Loading promo ...";
           
            $scope.showChef = false;
            $scope.msgchef = "Loading chef ...";
           
            $scope.featuredish = menuFactory.getDishes().get({id:0})
            .$promise.then(
                function(response){
                    $scope.featuredish = response;
                    $scope.showDish = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );
           
            $scope.promotion = menuFactory.getPromotion(0).get()
            .$promise.then(
                function(response){
                    $scope.promotion = response;
                    $scope.showPromotion = true;
                },
                function(response) {
                    $scope.msgpromo = "Error: "+response.status + " " + response.statusText;
                }
            );
            
            $scope.execchef = corporateFactory.getLeaders().get({id:3})
            .$promise.then(
                function(response){
                    $scope.execchef = response;
                    $scope.showChef = true;
                },
                function(response) {
                    $scope.msgchef = "Error: "+response.status + " " + response.statusText;
                }
            );
                        
        }])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-plain', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default dialoglarge', controller:"RegisterController" });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])

.controller('RequestController', ['$scope', function ($scope) {
    
}])

;
