"""empty message

Revision ID: d23150fab74e
Revises: eecd1a60e2d5
Create Date: 2024-08-04 13:23:30.992744

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd23150fab74e'
down_revision = 'eecd1a60e2d5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('patients', sa.Column('line_test_number_of_border_touches', sa.Numeric(precision=5, scale=2), nullable=False))
    op.add_column('patients', sa.Column('line_test_number_of_beyond_border', sa.Numeric(precision=5, scale=2), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('patients', 'line_test_number_of_beyond_border')
    op.drop_column('patients', 'line_test_number_of_border_touches')
    # ### end Alembic commands ###