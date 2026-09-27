#!/usr/bin/env python3
"""Check requirements/v1.0/requirements.json against the files it indexes.

Run from the repository root:

    python3 tools/requirements/verify.py

Two things are checked, and nothing else:

1. The recorded SHA-256 of the canonical HTML and of schema.json match the files
   in the repository. If either file changes, the index must be reviewed.
2. The text of every entry occurs in the canonical HTML, after tags are removed
   and white space is collapsed. An entry that paraphrases instead of quoting
   fails.

It does not judge the classification of any entry. Standard library only.
"""

from __future__ import annotations

import hashlib
import html
import json
import re
import sys
from pathlib import Path

INDEX = Path("requirements/v1.0/requirements.json")


def normalise(text: str) -> str:
    text = html.unescape(re.sub(r"<[^>]+>", " ", text))
    text = text.replace("“", '"').replace("”", '"').replace("’", "'")
    text = re.sub(r"\s+", " ", text)
    # Removing inline tags leaves a space before punctuation ("<code>x</code>,").
    text = re.sub(r" ([,.;:)])", r"\1", text)
    return re.sub(r"\( ", "(", text).strip()


def main() -> int:
    index = json.loads(INDEX.read_text(encoding="utf-8"))
    problems = []

    source = index["source"]
    for path_key, hash_key in (("canonical_text", "canonical_text_sha256"), ("schema", "schema_sha256")):
        actual = hashlib.sha256(Path(source[path_key]).read_bytes()).hexdigest()
        if actual != source[hash_key]:
            problems.append(f"{source[path_key]}: sha256 is {actual}, index records {source[hash_key]}")

    canonical = normalise(Path(source["canonical_text"]).read_text(encoding="utf-8"))
    seen = set()
    for entry in index["requirements"]:
        if entry["id"] in seen:
            problems.append(f"{entry['id']}: duplicate id")
        seen.add(entry["id"])
        if normalise(entry["text"]) not in canonical:
            problems.append(f"{entry['id']}: text not found verbatim in the canonical HTML")

    for problem in problems:
        print(problem)
    print(f"{INDEX}: {len(index['requirements'])} entries, {len(problems)} problem(s)")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
