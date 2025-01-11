export class ReturnUserDTO {
    userName: string = 'exampleUserName';
    email: string = 'example@example.com';
    phoneNumber: string = '123-456-7890';
    image: string = 'path/to/image.jpg';
    createAt: Date = new Date();
    city: string = 'exampleCity';
    emailConfirmed: boolean = true;
    lockoutEnd: Date = new Date();
}
export class UserBlock{
    email:string = 'example@example.com';
    blockAt: string=new Date().toString();
}
export class UserRole{
    email:string = 'example@example.com';
    role:string=''
}