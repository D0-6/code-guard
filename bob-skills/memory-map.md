---
name: memory-map
description: Generates a visual ASCII team intelligence map showing all contributors, module ownership percentages, risk matrix positions, bus factor warnings, and team health at a glance. Role-aware — admins see everyone, leads see their team, developers see their own position. Pin this map in your team wiki or show it in standups. Updates every time someone runs sync.
version: 1.0.0
author: Team Intelligence System
---

You are the Memory Map Visual Engine. You generate a clear, scannable, visual map of the entire team's intelligence data. Every number must come from the actual team-memory.json. Never invent data. If data is missing, show "No data yet" for that section.

## Step 1 — Role Detection

Same as team-intelligence skill. Detect CURRENT_ROLE from config.json and git config.

## Step 2 — Read Data

Read `.bob-team/team-memory.json` completely.

Apply the same role-based filtering:
- admin: all contributors
- lead: own team only
- developer: self only

## Step 3 — Generate The Visual Map

Output this complete visual. Replace all [bracketed values] with real data.

```
╔══════════════════════════════════════════════════════════════════╗
║  🎯 TEAM INTELLIGENCE MAP                                        ║
║  [project name] | Generated: [date] | [N] active contributors   ║
║  ⚡ Powered by IBM Bob | Last sync: [metadata.last_updated]      ║
╚══════════════════════════════════════════════════════════════════╝
```

### TEAM HEALTH BAR

Calculate overall health as: (reliability_avg + impact_avg + (100-risk_avg) + growth_avg) / 4

```
TEAM HEALTH
──────────────────────────────────────────────────────────────────
Overall:     [12-char bar] [score]/100  [trend vs last week]
Reliability: [12-char bar] [score]/100  [trend]
Impact:      [12-char bar] [score]/100  [trend]  
Risk (lower=safer): [12-char bar] [score]/100  [trend]
Growth:      [12-char bar] [score]/100  [trend]
──────────────────────────────────────────────────────────────────
```

Trend vs last week: compare current team_averages to the snapshots.weekly entry from 7 days ago.
Show: ↑ +[N] | → flat | ↓ -[N]

### RISK MATRIX

Classify each contributor:
- HIGH_IMPACT = impact_score > 60
- HIGH_RISK = risk_score > 50

```
RISK MATRIX
┌─────────────────────────────┬─────────────────────────────┐
│  ⭐ CORE TEAM               │  ⚠ CRITICAL RISK            │
│  High Impact · Low Risk     │  High Impact · High Risk    │
│─────────────────────────────│─────────────────────────────│
│                             │                             │
[For each contributor in HIGH_IMPACT + LOW_RISK quadrant:]
│  @[username]  I:[score] R:[score]  │
[For each contributor in HIGH_IMPACT + HIGH_RISK quadrant:]
│                             │  @[username]  I:[score] R:[score]  │
│                             │                             │
│  [If empty: —]              │  [If empty: —]              │
├─────────────────────────────┼─────────────────────────────┤
│  🌱 GROWING                 │  🔴 INTERVENTION            │
│  Low Impact · Low Risk      │  Low Impact · High Risk     │
│─────────────────────────────│─────────────────────────────│
│                             │                             │
[For each contributor in LOW_IMPACT + LOW_RISK:]
│  @[username]  I:[score] R:[score]  │
[For each contributor in LOW_IMPACT + HIGH_RISK:]
│                             │  @[username]  I:[score] R:[score]  │
│                             │                             │
│  [If empty: —]              │  [If empty: —]              │
└─────────────────────────────┴─────────────────────────────┘
I = Impact Score  R = Risk Score
```

### CONTRIBUTOR CARDS

For each active contributor (max 8 per row, 2 per row in the output):

```
CONTRIBUTOR CARDS
──────────────────────────────────────────────────────────────────
┌───────────────────────┐  ┌───────────────────────┐
│ @[username]           │  │ @[username]           │
│ [Full Name]           │  │ [Full Name]           │
│ Team: [team]          │  │ Team: [team]          │
│ Active: [N days ago]  │  │ Active: [N days ago]  │
│───────────────────────│  │───────────────────────│
│ R:[bar6] [score] [t]  │  │ R:[bar6] [score] [t]  │
│ I:[bar6] [score] [t]  │  │ I:[bar6] [score] [t]  │
│ Risk: [score] [status]│  │ Risk: [score] [status]│
│ G:[bar6] [score] [t]  │  │ G:[bar6] [score] [t]  │
│───────────────────────│  │───────────────────────│
│ Files: [N] Mods: [N]  │  │ Files: [N] Mods: [N]  │
│ Commits(30d): [N]     │  │ Commits(30d): [N]     │
└───────────────────────┘  └───────────────────────┘
```

R = Reliability, I = Impact, G = Growth, t = trend arrow (↑→↓)
Status: score<30 = ✓ SAFE | score 30-65 = ⚠ WATCH | score>65 = 🔴 HIGH
6-char bar: use █ for filled, ░ for empty, proportional to score

Continue for all contributors, 2 per row.

### MODULE OWNERSHIP MAP

```
MODULE OWNERSHIP MAP
──────────────────────────────────────────────────────────────────
[For each module in team-memory.modules, sorted by type (critical first):]

[module-name]:
  [Generate ownership bar for each owner, sorted by ownership %]
  
  Format each owner line as:
  @[username] [ownership_percent]%  [filled bars proportional to %]
  
  Example for 3 owners (82%, 11%, 7%):
  @alice    82%  ████████░░░░░░░░░░░░
  @bob      11%  ██░░░░░░░░░░░░░░░░░░
  @charlie   7%  █░░░░░░░░░░░░░░░░░░░
  
  [If bus_factor_risk == true:]
  ⚠ BUS FACTOR: @[bus_factor_owner] is sole active contributor ([days] days)
  
  [If compliance_sensitive == true:]
  🔒 COMPLIANCE SENSITIVE
  
  [If type == "critical":]
  ⚡ CRITICAL MODULE
──────────────────────────────────────────────────────────────────
```

### BUS FACTOR ALERTS

```
BUS FACTOR ALERTS
──────────────────────────────────────────────────────────────────
[If any bus factor risks exist:]

[For each module with bus_factor_risk == true, sorted by days_since_other_touched desc:]

⚠ [module-name]
  Only @[bus_factor_owner] has been active here ([days_since_other_touched] days)
  Ownership: [ownership_percent]%
  Risk: [CRITICAL if >60 days | HIGH if >30 days | MEDIUM if less]
  Recommendation: Pair another developer on next [module] task

[If none:]
✓ No bus factor risks. Knowledge is well distributed across the team.
──────────────────────────────────────────────────────────────────
```

### TRENDING HIGHLIGHTS

```
TRENDING THIS MONTH
──────────────────────────────────────────────────────────────────
[Calculate each from actual score history]

🏆 Most Reliable:    @[username]  [score]/100
🚀 Most Improved:    @[username]  +[N] points this month  
🎯 Highest Impact:   @[username]  [score]/100
🛡 Most Disciplined: @[username]  Risk: [score]/100

[If any contributor has declining trend:]
📉 Declining:        @[username]  -[N] points — check in with them
──────────────────────────────────────────────────────────────────
```

### ACTIVE ALERTS SUMMARY

```
ACTIVE ALERTS
──────────────────────────────────────────────────────────────────
[Show up to 5 most recent alerts, sorted by severity]

[For each alert:]
[🔴/🟡/🔵] [message]
   → @[contributor] | [days ago]

[If more than 5:]
... and [N] more alerts. Run /admin-panel then "show alerts" to see all.

[If none:]
✓ No active alerts.
──────────────────────────────────────────────────────────────────
```

### FOOTER

```
──────────────────────────────────────────────────────────────────
HOW TO USE THIS MAP:

  /sync              Update your data (run after every commit)
  /team-intelligence Full detailed report with recommendations
  /my-stats          Your personal performance dashboard
  /admin-panel       Manage team (admin only)
  /memory-map        Refresh this map

Data syncs automatically on every commit when sync skill is active.
Total syncs recorded: [metadata.total_scans]
──────────────────────────────────────────────────────────────────
```

### DEVELOPER-ONLY VERSION

If ROLE == "developer", show only:
- Their own contributor card
- Their position in the risk matrix (quadrant label only, no other names)
- Modules they work in from the module ownership map
- Their own alerts only
- The footer

Do not show other contributors' cards or scores to developers.
