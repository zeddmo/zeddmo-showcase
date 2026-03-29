# Rocket League Freelook Plugin (BakkesMod) - Case Study

## Project Type
Native plugin development in C++ for BakkesMod (Rocket League tooling ecosystem).

## Problem
Standard camera behavior can limit precision and comfort for certain gameplay and training workflows. A controlled freelook utility is needed with smooth response and predictable reset behavior.

## Scope Delivered
- Freelook activation/deactivation command model
- Raw mouse input handling for accurate camera deltas
- Dynamic keybind system with runtime capture and validation
- In-game settings UI with sensitivity controls
- Safety logic for focus loss and state recovery

## Technical Details
- Language: C++
- Runtime context: BakkesMod plugin SDK
- Input pipeline: Win32 raw input + async key state checks
- Camera control: direct swivel updates with pitch clamp and reset paths

## Reliability Features
- Graceful reset when key-up events are missed
- Focus-aware handling for alt-tab and foreground changes
- Raw input thread lifecycle management
- Defensive checks for invalid bind configurations

## UX Features
- Enable/disable plugin toggle
- Sensitivity slider with reset option
- "Click To Set Bind" interaction for keyboard/mouse mapping
- Hold-to-look behavior for intuitive control

## Engineering Focus
- Low-latency response path
- Stable state transitions under edge cases
- Maintainable key mapping strategy across multiple input types

## Source Code Availability
Source is private by design.

Can be shared in controlled settings as:
- Build demo
- Technical walkthrough
- Plugin behavior review
