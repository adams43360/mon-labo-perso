"""Harness DeepEval — mêmes dataset/prompt/paramètres que le harness maison.

    cd harnesses/deepeval
    python -m venv .venv && source .venv/bin/activate
    pip install -r requirements.txt
    PROVIDER=anthropic deepeval test run test_classification.py   # ou PROVIDER=openai

Le scoring est un exact-match (métrique custom), identique aux deux autres harness.
"""

import json
import os
import re
from pathlib import Path

import pytest
from deepeval import assert_test
from deepeval.metrics import BaseMetric
from deepeval.test_case import LLMTestCase

ROOT = Path(__file__).resolve().parents[2]
CATEGORIES = ["candidature", "relance", "desistement", "demande_info", "remerciement", "hors_sujet"]
CALL_PARAMS = {"temperature": 0, "max_tokens": 10}  # figés — cf. ARCHITECTURE.md

DATASET = json.loads((ROOT / "data" / "dataset.json").read_text(encoding="utf-8"))
SYSTEM = (ROOT / "prompts" / "system.md").read_text(encoding="utf-8").strip()
PROVIDER = os.environ.get("PROVIDER", "anthropic")


def classify(message: str) -> str:
    """Appelle le LLM (même prompt, mêmes paramètres que les autres harness)."""
    if PROVIDER == "anthropic":
        import anthropic

        client = anthropic.Anthropic()
        res = client.messages.create(
            model=os.environ.get("MODEL", "claude-haiku-4-5-20251001"),
            system=SYSTEM,
            max_tokens=CALL_PARAMS["max_tokens"],
            temperature=CALL_PARAMS["temperature"],
            messages=[{"role": "user", "content": message}],
        )
        return res.content[0].text
    if PROVIDER == "openai":
        from openai import OpenAI

        client = OpenAI()
        res = client.chat.completions.create(
            model=os.environ.get("MODEL", "gpt-4o-mini"),
            max_tokens=CALL_PARAMS["max_tokens"],
            temperature=CALL_PARAMS["temperature"],
            messages=[
                {"role": "system", "content": SYSTEM},
                {"role": "user", "content": message},
            ],
        )
        return res.choices[0].message.content or ""
    raise ValueError(f"PROVIDER invalide : {PROVIDER}")


def normalize(raw: str) -> str | None:
    """Normalisation identique à src/scorer.ts."""
    cleaned = re.sub(r"[\"'`«».,;:!]", "", raw.strip().lower())
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    if cleaned in CATEGORIES:
        return cleaned
    found = [c for c in CATEGORIES if c in cleaned]
    return found[0] if len(found) == 1 else None


class ExactCategoryMatch(BaseMetric):
    """Métrique custom : la catégorie normalisée doit être exactement l'attendu."""

    def __init__(self):
        self.threshold = 1.0

    def measure(self, test_case: LLMTestCase) -> float:
        predicted = normalize(test_case.actual_output or "")
        self.score = 1.0 if predicted == test_case.expected_output else 0.0
        self.success = self.score >= self.threshold
        self.reason = f"prédit={predicted!r}, attendu={test_case.expected_output!r}"
        return self.score

    async def a_measure(self, test_case: LLMTestCase) -> float:
        return self.measure(test_case)

    def is_successful(self) -> bool:
        return self.success

    @property
    def __name__(self):
        return "ExactCategoryMatch"


@pytest.mark.parametrize("case", DATASET["cases"], ids=lambda c: f"cas-{c['id']}-{c['difficulte']}")
def test_classification(case):
    test_case = LLMTestCase(
        input=case["message"],
        actual_output=classify(case["message"]),
        expected_output=case["expected"],
    )
    assert_test(test_case, [ExactCategoryMatch()])
