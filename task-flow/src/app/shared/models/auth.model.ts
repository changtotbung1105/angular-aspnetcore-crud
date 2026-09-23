export interface RegisterDto {
  username: string;
  password: string;
}
export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  username: string;
}