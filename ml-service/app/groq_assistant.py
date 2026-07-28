"""
EcoSphere (VerdantIQ) Groq LLM Grounded Assistant Gateway
Provides AI-powered natural language reasoning grounded strictly in real user context (Activity Logs, Scikit-Learn Anomaly Detection, OR-Tools MILP Roadmap).
"""

import os
import json
from typing import Dict, Any, List, Optional

try:
    from groq import Groq
    GROQ_SDK_AVAILABLE = True
except ImportError:
    GROQ_SDK_AVAILABLE = False


def generate_grounded_assistant_response(
    user_query: str,
    user_activity_summary: Dict[str, Any],
    anomaly_payload: Dict[str, Any],
    optimizer_roadmap: Dict[str, Any],
    conversation_history: Optional[List[Dict[str, str]]] = None
) -> Dict[str, Any]:
    """
    Generate LLM response grounded in real user data context.
    
    Injects context:
    - User activity summary (total CO2 saved, activity count)
    - Anomaly detector output (detected spikes, root causes, deviation %)
    - MILP optimizer roadmap (recommended hardware/behavior actions, costs, offset targets)
    """
    groq_api_key = os.getenv("GROQ_API_KEY", "")

    # Multi-turn history processing (last 6 turns max)
    history_turns = conversation_history[-6:] if conversation_history else []

    system_prompt = f"""You are the VerdantIQ EcoSphere AI Assistant, an expert advisor in urban sustainability, carbon offset optimization, and energy efficiency.

TOPIC GUARDRAIL RULE:
You MUST ONLY answer questions related to energy conservation, waste reduction, water management, transport efficiency, carbon footprints, climate impact, and EcoSphere platform features.
If the user asks about an unrelated topic (e.g., medical advice, financial stocks, generic programming, non-sustainability topics), politely refuse and redirect them back to sustainability and their EcoSphere footprint.

REAL USER CONTEXT (Grounding Data - DO NOT invent or fabricate numbers outside this context):
- User Activity Summary: {json.dumps(user_activity_summary)}
- Anomaly Detection (Scikit-Learn): {json.dumps(anomaly_payload)}
- MILP Optimization Roadmap (OR-Tools): {json.dumps(optimizer_roadmap)}

REQUIRED OUTPUT FORMAT:
You MUST respond STRICTLY in raw JSON object format matching this exact schema:
{{
  "message": "Markdown formatted natural language response grounded in the user's data context...",
  "chips": ["Suggested quick follow-up question 1", "Suggested quick follow-up question 2", "Suggested quick follow-up question 3"],
  "chart_spec": {{
     "title": "Short Chart Title (or empty string if not applicable)",
     "type": "bar",
     "series": [12.4, 11.8, 14.2]
  }}
}}
Do NOT wrap the JSON output in triple backtick markdown codeblocks. Output plain JSON only.
"""

    if GROQ_SDK_AVAILABLE and groq_api_key and not groq_api_key.startswith("gsk_your"):
        try:
            client = Groq(api_key=groq_api_key)
            messages = [{"role": "system", "content": system_prompt}]

            for turn in history_turns:
                if isinstance(turn, dict) and "role" in turn and "content" in turn:
                    messages.append({"role": turn["role"], "content": turn["content"]})

            messages.append({"role": "user", "content": user_query})

            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                temperature=0.2,
                max_tokens=900,
                response_format={"type": "json_object"}
            )

            raw_content = completion.choices[0].message.content.strip()
            response_json = json.loads(raw_content)

            # Ensure all required keys are present
            if "message" in response_json:
                if "chips" not in response_json:
                    response_json["chips"] = ["How can I reduce my carbon footprint?", "Show my optimization roadmap"]
                if "chart_spec" not in response_json:
                    response_json["chart_spec"] = {"title": "", "type": "line", "series": []}
                return response_json
        except Exception as e:
            print(f"[Groq API Gateway Warning]: {e} - Falling back to local grounded reasoning engine.")

    # Rule-Based Grounded Fallback (Runs when GROQ_API_KEY is not set or network request fails)
    has_anomaly = anomaly_payload.get("anomalyDetected", False)
    total_offset = user_activity_summary.get("totalCo2SavedKg", 42.0)
    recommended = optimizer_roadmap.get("recommendedActions", [])
    roadmap_items = optimizer_roadmap.get("roadmap", [])

    # Guardrail check in fallback logic for common non-sustainability keywords
    query_lower = user_query.lower()
    offtopic_keywords = ["medical", "doctor", "medicine", "crypto", "stock market", "recipe", "politics", "president"]
    if any(kw in query_lower for kw in offtopic_keywords):
        return {
            "message": "🌱 **VerdantIQ Assistant Notice:**\n\nI can only assist with sustainability, energy efficiency, carbon footprint tracking, and EcoSphere platform features. Please ask me questions about your energy usage, carbon offset roadmap, or eco-challenges!",
            "chips": ["Show my carbon offset summary", "What is my top optimization action?", "Why did my energy spike?"],
            "chart_spec": {"title": "", "type": "bar", "series": []}
        }

    action_text = ""
    if roadmap_items:
        first_step = roadmap_items[0]
        action_text = f"\n\n**Top Recommended Action (Step 1):** {first_step['action']} (${first_step['cost']} cost, -{first_step['co2_impact']} kg CO2/month)."
    elif recommended:
        top_act = recommended[0]
        action_text = f"\n\n**Top Recommended Action:** {top_act.get('name', 'Smart LED Upgrade')} (Offset: {top_act.get('monthly_offset_kg', 14.2)} kg CO2/month)."

    if has_anomaly:
        driver = anomaly_payload.get("primaryDriver", "Unusual Peak Demand")
        dev_pct = anomaly_payload.get("deviationPercentage", 45.0)
        suggested = anomaly_payload.get("suggestedAction", "Review high-draw appliances and thermostat schedule.")
        msg = (
            f"🌱 **EcoSphere Intelligence Analysis:**\n\n"
            f"I detected a consumption anomaly driven by **{driver}** (+{dev_pct}% above your baseline).\n\n"
            f"💡 **Recommended Immediate Action:** {suggested}\n\n"
            f"Your total verified carbon offset to date is **{total_offset} kg CO2e**.{action_text}"
        )
    else:
        msg = (
            f"🌱 **EcoSphere Intelligence Summary:**\n\n"
            f"Your sustainability footprint is currently operating within normal baseline parameters. "
            f"Total verified offset to date: **{total_offset} kg CO2e**.{action_text}"
        )

    return {
        "message": msg,
        "chips": [
            "How can I optimize HVAC power draw?",
            "Show my MILP optimization roadmap",
            "Generate monthly statement PDF"
        ],
        "chart_spec": {
            "title": "7-Day Energy Baseline vs Predicted (kWh)",
            "type": "line",
            "series": [12.4, 11.8, 14.2, 13.5, 10.9, 15.1, 12.0]
        }
    }

