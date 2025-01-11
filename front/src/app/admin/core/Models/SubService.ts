export class ReadSubService {
  name: string = '';
  description: string = '';
  image: string = '';
  id: number = 0;
  arabicName: string = '';
  arabicDescription: string = '';
  createdAt: string = '';
  updatedAt: string = '';
  createdByWho: string = '';
  updatedByWho: string = '';
  isActive: boolean = false;
}
export class AddSubService {
  constructor(
    public name: string = '',
    public arabicName: string = '',
    public arabicDescription: string = '',
    public description: string = '',
    public image: File | null = null,
    public isActive: boolean = true
  ) {}
}
export class UpdateSubService {
  constructor(
    public id: number = 0, // Hero ID for updating
    public name: string = '',
    public arabicName: string = '',
    public arabicDescription: string = '',
    public description: string = '',
    public image: File | null = null, // For new file uploads
    public isActive: boolean = true
  ) {}
}