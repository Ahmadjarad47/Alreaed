export class ReadHero {
  name: string = '';
  description: string = '';
  arabicName: string = '';
  arabicDescription: string = '';
  image: string = '';
  id: number = 0;
  createdAt: string = '';
  updatedAt: string = '';
  createdByWho: string = '';
  updatedByWho: string = '';
  isActive: boolean = false;
}
export class AddHero {
  constructor(
    public name: string = '',
    public description: string = '',
    public arabicName: string = '',
    public arabicDescription: string = '',
    public image: File | null = null,
    public isActive: boolean = true
  ) {}
}
export class UpdateHero {
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
