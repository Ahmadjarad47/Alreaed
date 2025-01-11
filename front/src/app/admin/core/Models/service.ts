export class IService{
    id:number=0
    name:string="";
    description:string=""
    arabicName: string = '';
    arabicDescription: string = '';
    isActive:boolean=false;
    createdAt: string = '';
    updatedAt: string = '';
    createdByWho: string |"system";
    updatedByWho: string |"system";
}
