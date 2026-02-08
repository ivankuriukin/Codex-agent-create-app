"""create users table

Revision ID: 0001_create_users
Revises: 
Create Date: 2025-02-16 00:00:00

"""
from alembic import op
import sqlalchemy as sa

revision = "0001_create_users"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "User",
        sa.Column("id", sa.String(length=32), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=True),
        sa.Column("firstName", sa.String(length=255), nullable=True),
        sa.Column("lastName", sa.String(length=255), nullable=True),
        sa.Column("middleName", sa.String(length=255), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("photoUrl", sa.String(length=255), nullable=True),
        sa.Column("telegramId", sa.String(length=255), nullable=True),
        sa.Column("telegramUsername", sa.String(length=255), nullable=True),
        sa.Column("telegramPhotoUrl", sa.String(length=255), nullable=True),
        sa.Column("telegramAuthDate", sa.DateTime(timezone=True), nullable=True),
        sa.Column("birthDate", sa.DateTime(timezone=True), nullable=True),
        sa.Column("passwordHash", sa.String(length=255), nullable=False),
        sa.Column("refreshTokenHash", sa.String(length=255), nullable=True),
        sa.Column("createdAt", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updatedAt", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("telegramId"),
    )


def downgrade() -> None:
    op.drop_table("User")
