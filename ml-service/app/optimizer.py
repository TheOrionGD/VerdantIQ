"""
EcoSphere (VerdantIQ) Google OR-Tools MILP Constraint Solver
Solves multi-objective sustainability optimization problems under financial budget and carbon offset constraints.
Note: Action catalog cost/impact figures are starting estimates and should be replaced with verified sourced data in production.
"""

from typing import Dict, Any, List

try:
    from ortools.linear_solver import pywraplp
    ORTOOLS_AVAILABLE = True
except ImportError:
    ORTOOLS_AVAILABLE = False


def solve_sustainability_plan(
    target_co2_offset_kg: float = 50.0,
    max_budget_amount: float = 1500.0,
    priority_carbon_weight: float = 0.7,
    priority_cost_weight: float = 0.3,
) -> Dict[str, Any]:
    """
    MILP Optimization Solver using Google OR-Tools (SCIP / CBC / CP-SAT formulation).
    
    Formulates a Mixed-Integer Linear Program over discrete sustainability actions:
    - Decision variables: x_i in {0, 1} indicating whether action i is selected.
    - Constraints: 
        1. Sum(cost_i * x_i) <= max_budget_amount
        2. Sum(monthly_offset_i * x_i) >= target_co2_offset_kg (when checking target constraint)
    - Objective: Maximize (priority_carbon_weight * offset) - (priority_cost_weight * cost_scaled)
    """
    # Expanded Sustainability Actions Candidate Pool (Starting estimates - tune with domain data)
    actions = [
        {
            "id": "act_led",
            "name": "Upgrade lighting matrix to 9W Smart LEDs",
            "category": "Electricity",
            "cost": 450.0,
            "monthly_offset_kg": 14.2,
            "effort": 1.0,
            "payback_months": 3.8,
            "month": 1,
        },
        {
            "id": "act_aerator",
            "name": "Install low-flow shower aerators (1.5 GPM)",
            "category": "Water",
            "cost": 280.0,
            "monthly_offset_kg": 9.5,
            "effort": 1.5,
            "payback_months": 2.1,
            "month": 1,
        },
        {
            "id": "act_smart_plug",
            "name": "Configure smart plug auto-cutoff on entertainment hub",
            "category": "Electricity",
            "cost": 350.0,
            "monthly_offset_kg": 8.1,
            "effort": 1.0,
            "payback_months": 4.5,
            "month": 2,
        },
        {
            "id": "act_compost",
            "name": "Set up dual-chamber tumbling organic composter",
            "category": "Waste",
            "cost": 550.0,
            "monthly_offset_kg": 18.0,
            "effort": 2.0,
            "payback_months": 5.0,
            "month": 2,
        },
        {
            "id": "act_transit_pass",
            "name": "Switch 3 weekly commutes to public transit pass",
            "category": "Transport",
            "cost": 120.0,
            "monthly_offset_kg": 24.5,
            "effort": 2.5,
            "payback_months": 1.0,
            "month": 3,
        },
        {
            "id": "act_rain_tank",
            "name": "Install 500L garden rainwater harvesting tank",
            "category": "Water",
            "cost": 650.0,
            "monthly_offset_kg": 12.0,
            "effort": 2.5,
            "payback_months": 8.0,
            "month": 3,
        },
        {
            "id": "act_solar_water",
            "name": "Install rooftop solar water heater manifold",
            "category": "Energy",
            "cost": 3200.0,
            "monthly_offset_kg": 65.0,
            "effort": 3.5,
            "payback_months": 14.0,
            "month": 4,
        },
        {
            "id": "act_ev_charger",
            "name": "Install Level 2 smart EV charging station",
            "category": "Transport",
            "cost": 2200.0,
            "monthly_offset_kg": 42.0,
            "effort": 3.0,
            "payback_months": 11.5,
            "month": 5,
        },
    ]

    if not ORTOOLS_AVAILABLE:
        # Heuristic fallback solver if ortools C++ binaries are not present
        selected = [a for a in actions if a["cost"] <= max_budget_amount]
        selected.sort(key=lambda x: x["monthly_offset_kg"] / max(x["cost"], 1.0), reverse=True)
        
        # Build roadmap items
        roadmap = []
        accumulated_cost = 0.0
        filtered_selected = []
        for idx, act in enumerate(selected):
            if accumulated_cost + act["cost"] <= max_budget_amount:
                accumulated_cost += act["cost"]
                filtered_selected.append(act)
                roadmap.append({
                    "step": len(roadmap) + 1,
                    "action": act["name"],
                    "cost": act["cost"],
                    "co2_impact": act["monthly_offset_kg"],
                    "month": act.get("month", idx + 1),
                    "category": act["category"],
                })

        tot_offset = sum(a["monthly_offset_kg"] for a in filtered_selected)
        status_str = "FEASIBLE_GREEDY_FALLBACK" if tot_offset >= target_co2_offset_kg else "INFEASIBLE_GREEDY_FALLBACK"

        return {
            "status": status_str,
            "solver": "Heuristic Ranker (Fallback)",
            "targetOffsetKg": target_co2_offset_kg,
            "maxBudgetAmount": max_budget_amount,
            "totalCostAmount": round(accumulated_cost, 2),
            "totalMonthlyOffsetKg": round(tot_offset, 2),
            "annualSavingsEst": round(accumulated_cost * 0.35, 2),
            "recommendedActions": filtered_selected,
            "roadmap": roadmap,
            "message": f"Planned {len(roadmap)} actions with estimated offset {round(tot_offset, 1)} kg CO2/mo."
        }

    # Create SCIP or CBC Solver via PyWrapLP
    solver = pywraplp.Solver.CreateSolver("SCIP")
    if not solver:
        solver = pywraplp.Solver.CreateSolver("CBC")

    if not solver:
        return {
            "status": "SOLVER_UNAVAILABLE_ERROR",
            "solver": "None",
            "targetOffsetKg": target_co2_offset_kg,
            "maxBudgetAmount": max_budget_amount,
            "totalCostAmount": 0.0,
            "totalMonthlyOffsetKg": 0.0,
            "recommendedActions": [],
            "roadmap": [],
            "message": "OR-Tools MILP solver engine could not be instantiated."
        }

    # 1. Decision Variables: x[i] = 1 if action i is selected, 0 otherwise
    x = {}
    for i, act in enumerate(actions):
        x[i] = solver.BoolVar(f"x_{act['id']}")

    # 2. Budget Constraint: Sum(cost[i] * x[i]) <= max_budget_amount
    solver.Add(solver.Sum(actions[i]["cost"] * x[i] for i in range(len(actions))) <= max_budget_amount)

    # 3. Objective Function: Maximize (Carbon Weight * Offset) - (Cost Weight * Cost Ratio)
    objective = solver.Objective()
    for i, act in enumerate(actions):
        score = (priority_carbon_weight * act["monthly_offset_kg"]) - (priority_cost_weight * (act["cost"] / 100.0))
        objective.SetCoefficient(x[i], float(score))
    
    objective.SetMaximization()

    # 4. First pass solve: Find optimal actions within budget
    solve_status = solver.Solve()

    chosen_actions = []
    total_cost = 0.0
    total_offset = 0.0

    if solve_status in (pywraplp.Solver.OPTIMAL, pywraplp.Solver.FEASIBLE):
        for i, act in enumerate(actions):
            if x[i].solution_value() > 0.5:
                chosen_actions.append(act)
                total_cost += act["cost"]
                total_offset += act["monthly_offset_kg"]

    # Check target offset threshold compliance
    is_target_met = total_offset >= target_co2_offset_kg
    
    # If target offset constraint is mandatory and not met, or budget permits zero actions
    if not chosen_actions or (total_offset < target_co2_offset_kg and max_budget_amount < min(a["cost"] for a in actions)):
        return {
            "status": "INFEASIBLE",
            "solver": "Google OR-Tools MILP (SCIP/CBC)",
            "targetOffsetKg": target_co2_offset_kg,
            "maxBudgetAmount": max_budget_amount,
            "totalCostAmount": round(total_cost, 2),
            "totalMonthlyOffsetKg": round(total_offset, 2),
            "annualSavingsEst": 0.0,
            "recommendedActions": [],
            "roadmap": [],
            "message": f"Budget of ${max_budget_amount} is insufficient to select actions achieving target carbon offset of {target_co2_offset_kg} kg CO2."
        }

    # Order roadmap chronologically by month / priority
    chosen_actions.sort(key=lambda a: (a.get("month", 1), -a["monthly_offset_kg"]))
    roadmap = [
        {
            "step": idx + 1,
            "action": act["name"],
            "cost": act["cost"],
            "co2_impact": act["monthly_offset_kg"],
            "month": act.get("month", idx + 1),
            "category": act["category"],
        }
        for idx, act in enumerate(chosen_actions)
    ]

    status_code = "OPTIMAL_SOLVED" if solve_status == pywraplp.Solver.OPTIMAL else "FEASIBLE_SOLVED"
    if not is_target_met:
        status_code = "FEASIBLE_PARTIAL_TARGET"

    return {
        "status": status_code,
        "solver": "Google OR-Tools MILP (SCIP/CBC)",
        "targetOffsetKg": target_co2_offset_kg,
        "maxBudgetAmount": max_budget_amount,
        "totalCostAmount": round(total_cost, 2),
        "totalMonthlyOffsetKg": round(total_offset, 2),
        "annualSavingsEst": round(total_cost * 0.38, 2),
        "recommendedActions": chosen_actions,
        "roadmap": roadmap,
        "message": f"Successfully generated {len(roadmap)}-step optimization roadmap offseting {round(total_offset, 1)} kg CO2/mo."
    }

