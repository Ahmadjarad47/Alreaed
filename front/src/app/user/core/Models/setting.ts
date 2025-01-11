export class UserSettings {
    id: string;
    userName: string;
    email: string;
    phoneNumber: string;
    city: string;
    balance: number;
    createAccount: Date;
    image: string; // URL or base64 string
    emailConfirmed: boolean;
  
    constructor(data: Partial<UserSettings>) {
      this.id = data.id || '';
      this.userName = data.userName || '';
      this.email = data.email || '';
      this.phoneNumber = data.phoneNumber || '';
      this.city = data.city || '';
      this.balance = data.balance || 0;
      this.createAccount = data.createAccount ? new Date(data.createAccount) : new Date();
      this.image = data.image || 'https://via.placeholder.com/150';
      this.emailConfirmed = data.emailConfirmed || false;
    }
  }
  