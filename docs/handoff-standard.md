# Restartable Handoff Standard

A handoff is not a status update. It is a restartable state package.

## Minimum handoff sections

```md
# Handoff

## Objective

## Current state

## What changed

## Evidence anchor

## Unresolved

## Must preserve

## Restart point

## Stop condition

## Next recommended action
```

## Why restartability matters

AI work often fails at session boundaries. A restartable handoff allows the next human or agent to continue without reconstructing hidden context.

## Handoff quality test

A handoff is acceptable if a new agent can answer:

1. What was the goal?
2. What changed?
3. What evidence exists?
4. What remains unresolved?
5. What must not be broken?
6. Where should I restart?
7. When should I stop?
