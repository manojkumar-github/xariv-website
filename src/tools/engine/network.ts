import type { Model, Network } from "@/tools/types";
import { DTYPE_BYTES } from "./constants";

export interface NetworkModel {
  bytes_per_token: number;
  t_net_tok: number;
  on_critical_path: boolean;
}

export function networkModel(
  model: Model,
  dtype: string,
  net: Network,
  gpusPerReplica: number,
  tOnchipTok: number,
): NetworkModel {
  if (gpusPerReplica <= 1) {
    return { bytes_per_token: 0, t_net_tok: 0, on_critical_path: false };
  }

  const dbytes = DTYPE_BYTES[dtype];
  const bytesPerToken = model.is_moe
    ? 2 * model.top_k * model.hidden_size * dbytes
    : 2 * model.num_layers * model.hidden_size * dbytes;

  const fabricBps = net.per_gpu_gbs * 1e9;
  const tNetTok = bytesPerToken / fabricBps;

  return {
    bytes_per_token: bytesPerToken,
    t_net_tok: tNetTok,
    on_critical_path: tNetTok > tOnchipTok,
  };
}
