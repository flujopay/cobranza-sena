import { apiGet, apiPost, apiDelete } from "./client";
import type { SiiStatusResponse, SiiSaveRequest, SiiMessageResponse } from "./types/sii";

const PREFIX = "/collection/sii";

export const getSiiStatus  = ()                     => apiGet<SiiStatusResponse>(`${PREFIX}/status/`);
export const saveSiiCreds  = (data: SiiSaveRequest) => apiPost<SiiMessageResponse>(`${PREFIX}/save/`, data);
export const deleteSiiCreds = ()                    => apiDelete<SiiMessageResponse>(`${PREFIX}/delete/`);
