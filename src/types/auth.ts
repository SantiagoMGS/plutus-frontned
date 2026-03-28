export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  currency_default: string;
  document_type: string | null;
  document_number: string | null;
  date_joined: string;
}

export type DocumentType = "CC" | "CE" | "NIT" | "PP" | "TI";

export interface DocumentMetadataRequest {
  document_type: DocumentType;
  document_number: string;
}
