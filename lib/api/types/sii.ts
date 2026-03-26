export interface SiiStatusResponse {
  has_credentials: boolean;
  rut: string | null;
}

export interface SiiSaveRequest {
  rut: string;
  password: string;
}

export interface SiiMessageResponse {
  message: string;
}
