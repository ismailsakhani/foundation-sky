import client from "./api";
import type { GateInfo } from "@/types/api";

export const gateService = {
  /** Fetch flights assigned to a specific gate. */
  getGateInfo: async (gate: string): Promise<GateInfo> => {
    const { data } = await client.get<GateInfo>(`/gates/${gate}`);
    return data;
  },
};
