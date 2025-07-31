export interface Drink {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface SelectedItem {
  drinkId: string;
  quantity: number;
} 