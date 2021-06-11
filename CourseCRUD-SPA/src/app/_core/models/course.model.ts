export interface Course {
  id: string;
  name: string;
  description: string;
  category_ID: number | null;
  price: number | null;
  category_Name: string;
}