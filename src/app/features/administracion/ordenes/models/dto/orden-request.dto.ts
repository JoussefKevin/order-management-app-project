export interface OrdenItemRequestDto {
  id?:       number;
  productId: number;
  quantity:  number;
}

export interface OrdenRequestDto {
  userId: number;
  items:  OrdenItemRequestDto[];
}
