export interface ProductoRequestDto {
  name:        string;
  stock:       number;
  price:       number;
  description: string;
  taxesId:     number[];
}
