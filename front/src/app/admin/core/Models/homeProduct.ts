export class CreateHomeProduct {
  name: string = '';
  description: string = '';
  image: File | null = null;
  titleList: string = '';
  list: string[] = [];
  arabicName: string = '';
  arabicDescription: string = '';
  arabicTitleList: string = '';
  arabicList: string[] = [];
  isActive: boolean = true;
}
export class UpdateHomeProduct {
  id: number = 0;
  name: string = '';
  description: string = '';
  image: File | null = null;
  titleList: string = '';
  list: string[] = [];
  arabicName: string = '';
  arabicDescription: string = '';
  arabicTitleList: string = '';
  arabicList: string[] = [];
  isActive: boolean = true;
}
export class ReadHomeProduct {
  name: string = '';
  description: string = '';
  titleList: string = '';
  list: string[] = [];
  image: File;
  arabicName: string = '';
  arabicDescription: string = '';
  arabicTitleList: string = '';
  arabicList: string[] = [];
  id: number = 0;
  createdAt: string = '';
  updatedAt: string = '';
  createdByWho: string = '';
  updatedByWho: string = '';
  isActive: boolean = true;
}
