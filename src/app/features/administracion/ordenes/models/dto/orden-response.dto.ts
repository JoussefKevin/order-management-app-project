export interface OrdenStateDto {
  id:   number;
  name: string;
}

export interface OrdenListResponseDto {
  id:          number;
  date:        string;
  totalAmount: number;
  state:       OrdenStateDto;
}

export interface OrdenItemResponseDto {
  id:        number;
  productId: number;
  quantity:  number;
  price?:    number;
}

export interface OrdenResponseDto {
  id:     number;
  userId: number;
  status: string;
  items:  OrdenItemResponseDto[];
  total?: number;
}

export interface PageOrdenResponse {
  content: OrdenListResponseDto[];
  page: {
    size:          number;
    totalElements: number;
    totalPages:    number;
    number:        number;
  };
}

export interface OrdenDetalleItemDto {
  id:        number;
  productId: number;
  quantity:  number;
  price?:    number;
}

export interface OrdenResponseDto {
  id:          number;
  userId:     number;
  status:     string;
  state?:      OrdenStateDto;
  items:       OrdenDetalleItemDto[];
  total?:      number;
  totalAmount?: number;
  date?:       string;
}

export interface OrdenItemListDto {
  productId:   number;
  productName: string;
  quantity:    number;
  price?:      number;
}

export interface OrdenListResponseDto {
  id:          number;
  date:        string;
  totalAmount: number;
  state:       OrdenStateDto;
  items?:      OrdenItemListDto[];
}
