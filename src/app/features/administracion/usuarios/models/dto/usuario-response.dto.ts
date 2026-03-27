export interface RoleDto {
  id:   number;
  name: string;
}

export interface UsuarioResponseDto {
  id:         number;
  name:       string;
  email:      string;
  signUpDate: string;
  totalSpent: number;
  role:       RoleDto;
}
