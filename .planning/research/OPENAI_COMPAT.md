# OpenAI Compatibility Research

## Summary
Building a proxy that maps OpenAI's `/v1/chat/completions` to Gemini's internal format.

## Mapping Details
- **Role Mapping:**
  - `system` -> `system_instruction`
  - `user` -> `user`
  - `assistant` -> `model`
- **Role Alternation:** Gemini requires `user`, then `model`, then `user`. Consecutive messages of the same role must be merged.
- **Parameter Mapping:**
  - `max_tokens` -> `max_output_tokens`
  - `temperature` -> `temperature`
  - `top_p` -> `top_p`

## Endpoints
- Standard OpenAI endpoint: `/v1/chat/completions`
- Gemini native: `/generate` (keep as is for backwards compatibility)
