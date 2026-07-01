> **Architecture Study.** This is a hypothetical system study. The numbers, topology, and traffic patterns are illustrative and do not describe any specific employer or production system.

## Executive summary

We studied a hypothetical **235B-parameter MoE answer-generation platform** running on an NVIDIA H100 fleet. Throughput stopped scaling when GPUs were added — not because of compute limits, but because **collective communication** (expert all-to-all) dominated the per-token critical path.

Three findings define the design space:

1. **MoE decode is a networking problem dressed as a compute problem.** Each token triggers dispatch and combine across expert-parallel ranks. At scale, fabric bandwidth — not FLOPs — binds throughput.

2. **Adding GPUs can make things worse.** More expert-parallel ranks mean more all-to-all participants and higher incast on the fabric.

3. **The fix is topological, not kernel-level.** Hierarchical all-to-all, rail-optimized fabrics, and keeping replicas inside NVLink domains are the levers that matter.

## The throughput plateau

When a replica spans multiple nodes, every decode step incurs collective traffic proportional to `top_k × hidden_size × dtype_bytes` for dispatch and combine. On InfiniBand NDR, this tax exceeds on-chip decode time once `gpus_per_replica` crosses a small threshold.

The roofline for MoE serving has a third axis beyond memory bandwidth and compute: **network time per token**.

## Recommended actions

- Shrink GPUs-per-replica so a replica fits inside one NVLink/NVSwitch domain.
- Use hierarchical all-to-all: NVLink gather → single IB exchange → scatter.
- Adopt rail-optimized topology with adaptive routing to spread converging flows.
- Replicate hot experts and balance across replicas to break per-expert incast.

## References

1. Y. Malkov, D. Yashunin, *Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs* (HNSW), 2016.
2. D. Lepikhin et al., *GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding*, 2020.
