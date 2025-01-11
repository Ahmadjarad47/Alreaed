export class ReadMessage {
    adminMessage: string='';
    emailForUser: string='';
    userMessage: string='';
    isReadByAdmin: boolean=false;
    isReadByUser: boolean=false;
    appUserId: string='';
    id: number=0;
    createdAt: string='';
    updatedAt: string='';
    createdByWho: string='';
    updatedByWho: string='';
    isActive: boolean=false;
}
export class AddMessageFromAdmin{
    email:string='';
    Content:string=''
}
