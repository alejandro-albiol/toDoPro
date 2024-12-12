export interface GroqMessage {
  role: string;
  content: string | null;
}

export interface GroqChoice {
  message: GroqMessage;
  index: number;
  finish_reason: string;
}

export interface GroqCompletion {
  id: string;
  choices: GroqChoice[];
  model: string;
  created: number;
}
