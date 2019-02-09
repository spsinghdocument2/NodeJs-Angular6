       module.exports = function() {
           var fetchData = function(request, response, callback) {
               this.services.userService.fetchData(request,response, callback);
           }

           var fetchData2 = function(request, response, callback) {
               this.services.userService.fetchData2(request,response, callback);
           }
           var getLoginAudit = function(request, response, callback) {
               this.services.userService.getLoginAudit(request,response, callback);
           }
           return {
               fetchData: fetchData,
               fetchData2:fetchData2,
               getLoginAudit:getLoginAudit,

           }
       };
