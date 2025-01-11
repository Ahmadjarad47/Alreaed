export class CreateOrderDTO {
  vehicleType: string = '';
  buyerEmail: string = '';
  listprocessPricing: string = '';
  orderItem: CreateOrderItemDTO = new CreateOrderItemDTO();
  totalPrice: number = 1; // decimal.One equivalent
  vehicleBrandId: number = 0;
  vehicleModelId: number = 0;
  readingDeviceId: number = 0;
  gearboxId: number = 0;
  appUserId: string = '';
  notes?: string; // Optional property

  constructor(
    vehicleType: string = '',
    buyerEmail: string = '',
    listprocessPricing: string = '',
    orderItem: CreateOrderItemDTO = new CreateOrderItemDTO(),
    totalPrice: number = 1,
    vehicleBrandId: number = 0,
    vehicleModelId: number = 0,
    readingDeviceId: number = 0,
    gearboxId: number = 0,
    appUserId: string = '',
    notes?: string
  ) {
    this.vehicleType = vehicleType;
    this.buyerEmail = buyerEmail;
    this.listprocessPricing = listprocessPricing;
    this.orderItem = orderItem;
    this.totalPrice = totalPrice;
    this.vehicleBrandId = vehicleBrandId;
    this.vehicleModelId = vehicleModelId;
    this.readingDeviceId = readingDeviceId;
    this.gearboxId = gearboxId;
    this.appUserId = appUserId;
    this.notes = notes;
  }
}
export class CreateOrderItemDTO {
  orderName: string = '';
  licencePlate: string = '';
  vim: string = '';
  ecu: string = '';
  file?: File | null; // TypeScript equivalent for IFormFile

  constructor(
    orderName: string = '',
    licencePlate: string = '',
    vim: string = '',
    ecu: string = '',
    file?: File | null
  ) {
    this.orderName = orderName;
    this.licencePlate = licencePlate;
    this.vim = vim;
    this.ecu = ecu;
    this.file = file;
  }
}
