// ─── Corridas del Bot ─────────────────────────────────────────────────────────

export interface CollectionRun {
  id:                 number;
  uuid:               string;
  status:             "running" | "completed" | "failed";
  started_at:         string;
  finished_at:        string | null;
  n8n_execution_id:   string | null;
  debtors_processed:  number;
  messages_email:     number;
  messages_whatsapp:  number;
  messages_sms:       number;
  triggered_by:       "manual" | "scheduled";
  error_message:      string | null;
  created:            string;
}
