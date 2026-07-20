"""
Prompt templates for all AI features.

Each function returns a fully formatted prompt string ready to send
to the LLM. Keeping prompts here (instead of inline in ai_service.py)
makes them easy to tune independently of application logic.
"""


def chat_prompt(message: str) -> str:
    return (
        "You are StudentHub AI, a friendly and knowledgeable study tutor. "
        "Explain concepts clearly, use simple language, and give examples "
        "where helpful. Keep answers focused and well-structured.\n\n"
        f"Student question: {message}\n\n"
        "Your response:"
    )


def summary_prompt(notes: str) -> str:
    return (
        "You are an expert academic note-summarizer. Given the raw notes "
        "below, produce a JSON object with EXACTLY these keys:\n"
        '- "summary": a concise paragraph summarizing the notes\n'
        '- "key_points": an array of the most important points as short strings\n'
        '- "keywords": an array of important keywords/terms\n'
        '- "revision_notes": a short, exam-focused revision text\n\n'
        "Return ONLY valid JSON, no markdown formatting, no extra commentary.\n\n"
        f"Notes:\n{notes}\n"
    )


def quiz_prompt(topic: str, difficulty: str) -> str:
    return (
        f"You are an expert exam question setter. Create EXACTLY 10 multiple "
        f"choice questions on the topic '{topic}' at '{difficulty}' difficulty.\n\n"
        "Return ONLY a valid JSON object with this exact structure:\n"
        "{\n"
        '  "questions": [\n'
        "    {\n"
        '      "question": "string",\n'
        '      "options": ["string", "string", "string", "string"],\n'
        '      "answer": "string (must exactly match one of the options)",\n'
        '      "explanation": "string explaining why the answer is correct"\n'
        "    }\n"
        "  ]\n"
        "}\n\n"
        "Rules:\n"
        "- Exactly 10 questions.\n"
        "- Exactly 4 options per question.\n"
        "- The answer field must exactly match one option's text.\n"
        "- No markdown, no commentary, JSON only."
    )


def planner_prompt(subject: str, exam_date: str, hours_per_day: int) -> str:
    return f"""
Create a concise study plan.

Subject: {subject}
Exam Date: {exam_date}
Hours Per Day: {hours_per_day}

Return ONLY valid JSON in this format:

{{
  "daily_plan":[
    {{
      "date":"YYYY-MM-DD",
      "topics":["topic1","topic2"],
      "tasks":"Brief study task"
    }}
  ]
}}

Limit the response to a maximum of 7 study days.
Keep tasks short.
Do not include explanations.
Do not include markdown.
Return JSON only.
"""


def assignment_prompt(topic: str, word_limit: int) -> str:
    return (
        f"You are an academic writing assistant. Write a well-structured "
        f"assignment on the topic '{topic}' with an approximate word limit "
        f"of {word_limit} words.\n\n"
        "Structure it with a clear introduction, body sections with headings, "
        "and a conclusion. Write in formal academic tone.\n\n"
        "Return ONLY a valid JSON object with this exact structure:\n"
        "{\n"
        '  "assignment": "the full assignment text as a single string, '
        'using \\n for line breaks"\n'
        "}\n\n"
        "No markdown code fences, no commentary outside the JSON."
    )


def flashcards_prompt(topic: str) -> str:
    return (
        f"You are an expert educational content creator. Create a set of "
        f"10 flashcards on the topic '{topic}', covering key definitions, "
        "concepts, and facts a student should memorize.\n\n"
        "Return ONLY a valid JSON object with this exact structure:\n"
        "{\n"
        '  "flashcards": [\n'
        "    {\n"
        '      "question": "string",\n'
        '      "answer": "string"\n'
        "    }\n"
        "  ]\n"
        "}\n\n"
        "Rules:\n"
        "- Exactly 10 flashcards.\n"
        "- Questions should be short and specific.\n"
        "- Answers should be concise but complete.\n"
        "- No markdown, no commentary, JSON only."
    )
