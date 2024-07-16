"""empty message

Revision ID: eecd1a60e2d5
Revises: 
Create Date: 2024-04-22 22:17:23.119449

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'eecd1a60e2d5'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('admins',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('first_name', sa.String(length=256), nullable=False),
                    sa.Column('last_name', sa.String(length=256), nullable=False),
                    sa.Column('middle_name', sa.String(length=256), nullable=False),
                    sa.Column('username', sa.String(length=256), nullable=False),
                    sa.Column('hashed_password', sa.String(length=1024), nullable=False),
                    sa.PrimaryKeyConstraint('id'),
                    sa.UniqueConstraint('username')
                    )
    op.create_index(op.f('ix_admins_id'), 'admins', ['id'], unique=False)
    op.create_table('doctors',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('first_name', sa.String(length=256), nullable=False),
                    sa.Column('last_name', sa.String(length=256), nullable=False),
                    sa.Column('middle_name', sa.String(length=256), nullable=False),
                    sa.Column('IIN', sa.String(length=12), nullable=False),
                    sa.Column('hashed_password', sa.String(length=1024), nullable=False),
                    sa.Column('gender', sa.Enum('Мужской', 'Женский', name='genderEnum'), nullable=False),
                    sa.Column('age', sa.Integer(), nullable=False),
                    sa.Column('qualification', sa.Enum('Гастроэнтеролог', name='doctorQualificationEnum'), nullable=False),
                    sa.PrimaryKeyConstraint('id'),
                    sa.UniqueConstraint('IIN')
                    )
    op.create_index(op.f('ix_doctors_id'), 'doctors', ['id'], unique=False)
    op.create_table('patients',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('first_name', sa.String(length=256), nullable=False),
                    sa.Column('last_name', sa.String(length=256), nullable=False),
                    sa.Column('middle_name', sa.String(length=256), nullable=False),
                    sa.Column('IIN', sa.String(length=12), nullable=False),
                    sa.Column('hashed_password', sa.String(length=1024), nullable=False),
                    sa.Column('gender', sa.Enum('Мужской', 'Женский', name='genderEnum'), nullable=False),
                    sa.Column('is_on_controlled', sa.Enum('Да', 'Нет', 'Нет данных', name='is_on_controlledEnum'), nullable=False),
                    sa.Column('age', sa.Integer(), nullable=False),
                    sa.Column('ethnicity', sa.Enum('Азиат', 'Европеец', name='ethnicityEnum'), nullable=False),
                    sa.Column('region', sa.String(length=256), nullable=False),
                    sa.Column('height', sa.Integer(), nullable=False),
                    sa.Column('weight', sa.Integer(), nullable=False),
                    sa.Column('BMI', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('education', sa.Enum('Не оконченное среднее', 'Среднее', 'Высшее', name='educationEnum'), nullable=False),
                    sa.Column('marital_status', sa.Enum('Не замужем/не женат', 'Замужем/Женат', 'Разведен/вдова/вдовец', name='marital_statusEnum'), nullable=False),
                    sa.Column('job_description', sa.Enum('С точными механизмами', 'Офисная', 'Не работаю', 'С активной физ. нагрузкой', 'Другое', name='job_descriptionEnum'), nullable=False),
                    sa.Column('driving_status', sa.Enum('Да', 'Нет', name='driving_statusEnum'), nullable=False),
                    sa.Column('was_involved_in_car_accidents', sa.Enum('Да', 'Нет', name='was_involved_in_car_accidentsEnum'), nullable=False),
                    sa.Column('cirrhosis', sa.ARRAY(sa.String()), nullable=False),
                    sa.Column('duration_of_illness', sa.Integer(), nullable=False),
                    sa.Column('platelet_count', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('hemoglobin_level', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('ALT', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('ALT_unit', sa.Enum('ЕД/Л', 'МККАТ/Л', name='ALT_unitEnum'), nullable=False),
                    sa.Column('AAT', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('AAT_unit', sa.Enum('ЕД/Л', 'МККАТ/Л', name='AAT_unit'), nullable=False),
                    sa.Column('bilirubin', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('creatinine', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('INA', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('albumin', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('sodium_blood_level', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('potassium_ion', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('blood_ammonia', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('indirect_elastography_of_liver', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('indirect_elastography_of_spleen', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('EVV', sa.Enum('1 степень', '2 степень', '3 степень', '4 степень', 'Нет', 'Нет данных', name='EVVEnum'), nullable=False),
                    sa.Column('red_flags_EVV', sa.Enum('Да', 'Нет', 'Нет данных', name='red_flags_EVVEnum'), nullable=False),
                    sa.Column('presence_of_ascites', sa.Enum('Нет', 'Контролируемый', 'Рефракетерный', 'Нет данных', name='presence_of_ascitesEnum'), nullable=False),
                    sa.Column('connection_test_a', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('connection_test_b', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('symbol_test', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('serial_test', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('line_test', sa.Numeric(precision=5, scale=2), nullable=False),
                    sa.Column('connection_test_a_wrong', sa.Enum('Да', 'Нет', name='has_mistakeEnum'), nullable=False),
                    sa.Column('connection_test_b_wrong', sa.Enum('Да', 'Нет', name='has_mistakeEnum'), nullable=False),
                    sa.Column('symbol_test_wrong', sa.Enum('Да', 'Нет', name='has_mistakeEnum'), nullable=False),
                    sa.Column('serial_test_wrong', sa.Enum('Да', 'Нет', name='has_mistakeEnum'), nullable=False),
                    sa.Column('line_test_wrong', sa.Enum('Да', 'Нет', name='has_mistakeEnum'), nullable=False),
                    sa.Column('type_of_encephalopathy', sa.String(length=256), nullable=False),
                    sa.Column('degree_of_encephalopathy', sa.String(length=256), nullable=False),
                    sa.Column('process_of_encephalopathy', sa.Enum('Эпизодическая', 'Рецидивирующая', 'Персистирующая', 'Нет данных', name='progress_of_encephalopathyEnum'), nullable=False),
                    sa.Column('presence_of_precipitating_factors', sa.Enum('Спровоцированная', 'Неспровоцированная', 'Нет данных', name='presence_of_precipitating_factorsEnum'), nullable=False),
                    sa.Column('comorbidities', sa.ARRAY(sa.String()), nullable=False),
                    sa.Column('hepatocellular_carcinoma', sa.Enum('Да', 'Нет', 'Нет данных', name='hepatocellular_carcinomaEnum'), nullable=False),
                    sa.Column('was_planned_hospitalized_with_liver_diseases', sa.Enum('Да', 'Нет', 'Нет данных', name='was_planned_hospitalized_with_liver_diseasesEnum'), nullable=True),
                    sa.Column('number_of_planned_hospitalizations_with_liver_diseases', sa.Integer(), nullable=False),
                    sa.Column('was_planned_hospitalized_without_liver_diseases', sa.Enum('Да', 'Нет', 'Нет данных', name='was_planned_hospitalized_without_liver_diseasesEnum'), nullable=True),
                    sa.Column('number_of_planned_hospitalizations_without_liver_diseases', sa.Integer(), nullable=False),
                    sa.Column('was_emergency_hospitalized_with_liver_diseases', sa.Enum('Да', 'Нет', 'Нет данных', name='was_emergency_hospitalized_with_liver_diseasesEnum'), nullable=False),
                    sa.Column('number_of_emergency_hospitalizations_with_liver_diseases', sa.Integer(), nullable=False),
                    sa.Column('was_emergency_hospitalized_without_liver_diseases', sa.Enum('Да', 'Нет', 'Нет данных', name='was_emergency_hospitalized_with_liver_diseasesEnum'), nullable=False),
                    sa.Column('number_of_emergency_hospitalizations_without_liver_diseases', sa.Integer(), nullable=False),
                    sa.Column('was_injured', sa.Enum('Да', 'Нет', name='was_injuredEnum'), nullable=False),
                    sa.Column('GIB', sa.Enum('Да', 'Нет', name='GIBEnum'), nullable=False),
                    sa.Column('previous_infectious_diseases', sa.ARRAY(sa.String()), nullable=False),
                    sa.Column('stool_character', sa.Enum('Регулярный (1 раз в 1-2 дня)', 'Запор', 'Диарея', name='stool_characterEnum'), nullable=False),
                    sa.Column('dehydration', sa.String(length=256), nullable=False),
                    sa.Column('portosystemic_bypass_surgery', sa.String(length=256), nullable=False),
                    sa.Column('thrombosis', sa.ARRAY(sa.String()), nullable=False),
                    sa.Column('medicines', sa.ARRAY(sa.String()), nullable=False),
                    sa.Column('renal_impairment', sa.Enum('Да', 'Нет', name='renal_impairmentEnum'), nullable=False),
                    sa.Column('bad_habits', sa.ARRAY(sa.String()), nullable=False),
                    sa.Column('CP', sa.Enum('Имелась', 'Отсутствовала', name='CPUEnum'), nullable=False),
                    sa.Column('accepted_PE_medications', sa.String(length=256), nullable=False),
                    sa.Column('accepted_medications_at_the_time_of_inspection', sa.String(length=256), nullable=False),
                    sa.Column('doctor_id', sa.Integer(), nullable=False),
                    sa.Column('health_condition', sa.Enum('Отличное', 'Очень хорошее', 'Хорошее', 'Посредственное', 'Плохое', name="health_conditionEnum"), nullable=False),
                    sa.Column('last_year_health_condition', sa.Enum('Значительно лучше, чем год назад', 'Несколько лучше, чем год назад', 'Примерно так же, как год назад',
                                                                    'Несколько хуже, чем год назад', 'Гораздо хуже, чем год назад', name="last_year_health_conditionEnum"), nullable=False),
                    sa.Column('physical_activity_a', sa.Enum('Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает', name="physical_activityEnum"), nullable=False),
                    sa.Column('physical_activity_b', sa.Enum('Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает', name="physical_activityEnum"), nullable=False),
                    sa.Column('physical_activity_c', sa.Enum('Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает', name="physical_activityEnum"), nullable=False),
                    sa.Column('physical_activity_d', sa.Enum('Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает', name="physical_activityEnum"), nullable=False),
                    sa.Column('physical_activity_e', sa.Enum('Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает', name="physical_activityEnum"), nullable=False),
                    sa.Column('physical_activity_f', sa.Enum('Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает', name="physical_activityEnum"), nullable=False),
                    sa.Column('physical_activity_g', sa.Enum('Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает', name="physical_activityEnum"), nullable=False),
                    sa.Column('physical_activity_h', sa.Enum('Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает', name="physical_activityEnum"), nullable=False),
                    sa.Column('physical_activity_j', sa.Enum('Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает', name="physical_activityEnum"), nullable=False),
                    sa.Column('physical_activity_k', sa.Enum('Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает', name="physical_activityEnum"), nullable=False),
                    sa.Column('physical_work_a', sa.Enum('Да', 'Нет', name="physical_workEnum"), nullable=False),
                    sa.Column('physical_work_b', sa.Enum('Да', 'Нет', name="physical_workEnum"), nullable=False),
                    sa.Column('physical_work_c', sa.Enum('Да', 'Нет', name="physical_workEnum"), nullable=False),
                    sa.Column('physical_work_d', sa.Enum('Да', 'Нет', name="physical_workEnum"), nullable=False),
                    sa.Column('emotial_state_a', sa.Enum('Да', 'Нет', name="emotial_stateEnum"), nullable=False),
                    sa.Column('emotial_state_b', sa.Enum('Да', 'Нет', name="emotial_stateEnum"), nullable=False),
                    sa.Column('emotial_state_c', sa.Enum('Да', 'Нет', name="emotial_stateEnum"), nullable=False),
                    sa.Column('family_time', sa.Enum('Совсем не мешало', 'Немного', 'Умеренно', 'Сильно', 'Очень сильно', name="family_timeEnum"), nullable=False),
                    sa.Column('pain', sa.Enum('Совсем не испытывал(а)', 'Очень слабую', 'Слабую', 'Умеренную', 'Сильную', 'Очень сильную', name="painEnum"), nullable=False),
                    sa.Column('pain_effect', sa.Enum('Совсем не мешала', 'Немного', 'Умеренно', 'Сильно', 'Очень сильно', name="pain_effectEnum"), nullable=False),
                    sa.Column('mood_a', sa.Enum('Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу', name="moodEnum"), nullable=False),
                    sa.Column('mood_b', sa.Enum('Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу', name="moodEnum"), nullable=False),
                    sa.Column('mood_c', sa.Enum('Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу', name="moodEnum"), nullable=False),
                    sa.Column('mood_d', sa.Enum('Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу', name="moodEnum"), nullable=False),
                    sa.Column('mood_e', sa.Enum('Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу', name="moodEnum"), nullable=False),
                    sa.Column('mood_f', sa.Enum('Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу', name="moodEnum"), nullable=False),
                    sa.Column('mood_g', sa.Enum('Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу', name="moodEnum"), nullable=False),
                    sa.Column('mood_h', sa.Enum('Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу', name="moodEnum"), nullable=False),
                    sa.Column('mood_k', sa.Enum('Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу', name="moodEnum"), nullable=False),
                    sa.Column('communication', sa.Enum('Все время', 'Большую часть времени', 'Иногда', 'Редко', 'Ни разу', name="communicationEnum"), nullable=False),
                    sa.Column('health_condition_a', sa.Enum('Определенно верно', 'В основном верно', 'Не знаю', 'В основном не верно', 'Определенно не верно', name="health_condition_stateEnum"), nullable=False),
                    sa.Column('health_condition_b', sa.Enum('Определенно верно', 'В основном верно', 'Не знаю', 'В основном не верно', 'Определенно не верно', name="health_condition_stateEnum"), nullable=False),
                    sa.Column('health_condition_c', sa.Enum('Определенно верно', 'В основном верно', 'Не знаю', 'В основном не верно', 'Определенно не верно', name="health_condition_stateEnum"), nullable=False),
                    sa.Column('health_condition_d', sa.Enum('Определенно верно', 'В основном верно', 'Не знаю', 'В основном не верно', 'Определенно не верно', name="health_condition_stateEnum"), nullable=False),
                    sa.ForeignKeyConstraint(['doctor_id'], ['doctors.id'], ),
                    sa.PrimaryKeyConstraint('id'),
                    sa.UniqueConstraint('IIN')
                    )
    op.create_index(op.f('ix_patients_id'), 'patients', ['id'], unique=False)
    op.create_table('patient_tests',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('patient_id', sa.Integer(), nullable=False),
                    sa.Column('date', sa.DateTime(), nullable=False),
                    sa.Column('name', sa.String(length=256), nullable=False),
                    sa.Column('time', sa.Float(), nullable=False),
                    sa.Column('correct', sa.Integer(), nullable=False),
                    sa.Column('wrong', sa.Integer(), nullable=False),
                    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_patient_tests_id'), 'patient_tests', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_patients_id'), table_name='patients')
    op.drop_table('patients')
    op.drop_index(op.f('ix_patient_tests_id'), table_name='patient_tests')
    op.drop_table('patient_tests')
    op.drop_index(op.f('ix_doctors_id'), table_name='doctors')
    op.drop_table('doctors')
    op.drop_index(op.f('ix_admins_id'), table_name='admins')
    op.drop_table('admins')
    # ### end Alembic commands ###
