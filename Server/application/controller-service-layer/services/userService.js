var BaseService = require('./BaseService');



         userService = function(app) {
             this.app = app;
         };

         userService.prototype = new BaseService();

userService.prototype.fetchData = function (request, response, callback) {
domain.Audit.find({ }).then(function (result){
callback(null, result);
}).catch(function (error) {
    callback(null, error);
});
}
// Server Side Pagination
 userService.prototype.getLoginAudit = function (request, response, callback)
 {
  var pageNo = request.params.pageNumbe == undefined ? 1 : parseInt(request.params.pageNumbe);
  var size = request.params.size == undefined ? 10 : parseInt(request.params.size);
  var query = {};
  var odata ={};

  if(pageNo < 0 || pageNo === 0) {
        response = {"error" : true,"message" : "invalid page number, should start with 1"};
        callback(null, error);
  }
query.skip = size * (pageNo - 1);
query.limit = size;

domain.Audit.count({ },).then(function (totalCount){ 
domain.Audit.find({ },{},query).then(function (result){
    odata = ({
        requestType:'GET',
        count: totalCount,
         value:result
    })
    callback(null, odata);
}).catch(function (error) {
    callback(null, error);
})
}).catch(function (error) {
    callback(null, error);
})
}

userService.prototype.fetchData2 = function (request, response, callback) {
var result = [
    {Id: "2032dcf2-b9f7-46db-aac6-3c43e35af278", UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099", ObjectBhCode: "Bureau Pull", IdInObject: "7141ca98-86b0-4621-9a70-523897e60af9", TypeLabel: "Dun and Bradstreet",UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099"},
{Id: "2143b269-2d39-40f8-91c8-46aeb5442d4c", UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099", ObjectBhCode: "Bureau Pull", IdInObject: "a359c6ef-f6c9-4f6d-8d2d-f040639dfc4e", TypeLabel: "Experian Net Connect",UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099"},
{Id: "d4105360-3302-452d-91d3-6cb3efec718f", UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099", ObjectBhCode: "Bureau Pull", IdInObject: "f32615c5-0623-4255-a7a2-a19c8ab8c2fa", TypeLabel: "FICO ARM", UserId:"fbeb20d8-016b-4c36-a480-d759c9c75099"},
{Id: "2df80a03-0dfa-45ce-bf78-16c0fb39e8b0", UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099", ObjectBhCode: "Classification", IdInObject: "0ec902fc-a7ca-4731-b250-32275f04289e", TypeLabel: "Loan Grade", UserId:"fbeb20d8-016b-4c36-a480-d759c9c75099"},
{Id: "61ebe077-7512-4db5-83e1-3ee6b1298aa9", UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099", ObjectBhCode: "Classification", IdInObject: "ecacf5fc-4595-4f81-8ce1-dbc0de0cd78d", TypeLabel: "Sales Channel",UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099"},
{Id: "98b20f67-d755-43f1-96b3-449f6b1b7222", UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099", ObjectBhCode: "Classification", IdInObject: "d53e88f4-bffc-422b-a948-1269c9ed2954", TypeLabel: "Prospect Segmentation",UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099"},
{Id: "191a1ca2-3f25-4f5a-9caa-61cbcbed2ec8", UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099", ObjectBhCode: "Client", IdInObject: "ac3ae904-590e-401c-b44c-a81368a33807", TypeLabel: "Business",UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099"},
{Id: "3d128e1f-6b6f-4f56-b4df-800aadec551b", UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099", ObjectBhCode: "Client", IdInObject: "ddfb6ba6-9ee1-471b-b215-88fb78311ebf", TypeLabel: "Unassigned",UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099"},
{Id: "63dbc382-9c2a-41ed-b1d3-84aef1908784", UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099", ObjectBhCode: "Client", IdInObject: "2354e94e-d626-4bec-9e95-620e0dfa192a", TypeLabel: "Trust",UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099"},
{Id: "6e763175-5f92-4efa-ae7b-3cf650db0fb5", UserId: "7ddfd79d-e207-4a60-abf4-908225ec1c1b", ObjectBhCode: "Opportunity", IdInObject: "22cbd8fc-a8b8-407b-92cb-9389511cf9e8", TypeLabel: "Commercial",UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099"},
{Id: "93247ad3-5e0f-4bf2-ab4b-72f2994c01dc", UserId: "7ddfd79d-e207-4a60-abf4-908225ec1c1b", ObjectBhCode: "Opportunity", IdInObject: "84da088b-e440-4d48-ba2c-479b59933c49", TypeLabel: "Other",UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099"},
{Id: "42d67c4c-1617-4101-af4a-bc3781e3c388", UserId: "7ddfd79d-e207-4a60-abf4-908225ec1c1b", ObjectBhCode: "Opportunity", IdInObject: "f95bab7e-fbcc-48fa-93eb-2c963e4b2215", TypeLabel: "Jignesh",UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099"},
{Id: "a870cf4b-bfdd-42e0-a44b-c95d83e7e4fc", UserId: "7ddfd79d-e207-4a60-abf4-908225ec1c1b", ObjectBhCode: "Opportunity", IdInObject: "e9d61d09-d418-4647-bf69-5e717ea4ce75", TypeLabel: "JJTEST",UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099"},
{Id: "f91063de-4c81-4bb4-8835-d173a830b39e", UserId: "7ddfd79d-e207-4a60-abf4-908225ec1c1b", ObjectBhCode: "Opportunity", IdInObject: "aad7f3ef-5ca8-4a7b-9061-d0bb0d4ed0c6", TypeLabel: "JIGNESH1",UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099"},
{Id: "df226f65-572a-41a9-9e97-e0bc07b9e2ca", UserId: "7ddfd79d-e207-4a60-abf4-908225ec1c1b", ObjectBhCode: "Opportunity", IdInObject: "0a612123-18b4-4533-83b8-7ea0b0a32ac8", TypeLabel: "Retail",UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099"},
{Id: "cfac000e-5214-4d90-9fb3-fb2413257fc9", UserId: "7ddfd79d-e207-4a60-abf4-908225ec1c1b", ObjectBhCode: "Opportunity", IdInObject: "538c4463-1706-4d59-a42b-1c6c90f872d3", TypeLabel: "Credit",UserId: "fbeb20d8-016b-4c36-a480-d759c9c75099"}
]
callback(null, result);
}
module.exports = function(app) {
return new userService(app);
};
