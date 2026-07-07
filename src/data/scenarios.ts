export const infrastructureScenarios = [
  {
    id: "swap",
    label: "swap",
    question: "Swap to a smaller model?",
    code: 'model="llama-3.1-8b"',
  },
  {
    id: "scale",
    label: "scale",
    question: "Traffic doubles next quarter?",
    code: "traffic_rps=240",
  },
  {
    id: "degrade",
    label: "degrade",
    question: "KV cache grows 2×?",
    code: "context_len=32768",
  },
  {
    id: "drop",
    label: "drop",
    question: "Remove tensor parallelism?",
    code: "tensor_parallel=1",
  },
  {
    id: "cost",
    label: "cost",
    question: "Move from H100 to L40S?",
    code: 'gpu="L40S"',
  },
] as const;
