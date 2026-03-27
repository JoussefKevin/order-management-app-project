export interface ProductoResponseDto {
  id:          number;
  name:        string;
  stock:       number;
  price:       number;
  description: string;
  taxes?:      TaxDto[];
}
export interface TaxDto {
  id:   number;
  name: string;
  rate: number;
}
