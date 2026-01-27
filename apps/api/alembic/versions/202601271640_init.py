"""initial schema"""

from alembic import op
import sqlalchemy as sa
from app.models import Priority, TaskStatus

# revision identifiers, used by Alembic.
revision = "202601271640"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "tasks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("priority", sa.Enum(Priority), nullable=False, server_default=Priority.Normal.value),
        sa.Column("tags", sa.JSON(), nullable=True),
        sa.Column("due_date", sa.Date(), nullable=True),
        sa.Column("status", sa.Enum(TaskStatus), nullable=False, server_default=TaskStatus.pending.value),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )

    op.create_table(
        "events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("start_time", sa.DateTime(), nullable=False),
        sa.Column("end_time", sa.DateTime(), nullable=False),
        sa.Column("location", sa.String(length=255), nullable=True),
        sa.Column("source", sa.String(length=50), nullable=True),
        sa.Column("is_event_day", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("is_off_day", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    op.create_table(
        "off_days",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("date", sa.Date(), nullable=False, unique=True),
        sa.Column("reason", sa.String(length=255), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("off_days")
    op.drop_table("events")
    op.drop_table("tasks")
