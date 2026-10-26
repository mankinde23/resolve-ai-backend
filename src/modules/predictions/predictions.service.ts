import { predictTicket } from "../../services/ml-client.service.js";

export async function classifyTicket(text: string) {
  return predictTicket(text);
}
