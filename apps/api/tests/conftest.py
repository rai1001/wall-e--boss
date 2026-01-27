import os
import sys
from pathlib import Path

# Ensure `app` package is importable during tests
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

# Set a temp database URL for sqlite in-memory defaults when not provided
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
