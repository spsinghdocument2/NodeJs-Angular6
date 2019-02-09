export class DocumentModel {
    TemplateId: string = null;
    ObjectIds: string[] = [];
    ContextTypeBhCode: string = null;
    CategoryCode: string = null;
    DocumentType: string = null;
    AttachDocument: boolean = false;
    LogAsComment: boolean = false;
    CommentFamilyId: string = null;
    CommentTypeId: string = null;
    Subject: string = null; 
    Comments: string = null;
    ContactId: string = null;
    AddressId: string = null;
    ClientId: string = null;
    ContactCapacityIds: string[] = [];
    IsMultiDataSource: boolean = false;
}