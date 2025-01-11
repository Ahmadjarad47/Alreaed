export class Paging {
  pageNumber: number = 1;
  pageSize: number = 3;
  total: number = 0;
  search: string='';
  status:string=''
  data: IOrderUser[] = [];
}
export interface IOrderUser {
  id: number;
  Machine:string,
  createdAt: string;
  status: string;
  totalPrice: number;
  orderItem: OrderItem;
  gearbox: Gearbox;
  readingDevice: Gearbox;
  vehicle: Vehicle;
  appUser: AppUser;
  process: string;
}
export interface AppUser {
  appUserId: string;
  userName: string;
  email: string;
}
export interface Vehicle {
  modelName: string;
  brandName: string;
  year: string;
}
export interface Gearbox {
  id: number;
  name: string;
}
export interface OrderItem {
  id: number;
  orderName: string;
  vim: string;
  ecu: string;
  file: string;
}
