import { useContext, useEffect, useRef, useState } from 'react';
import './adminSavePatientMenu.scss';
import CloseIcon from './icons/closeIcon.png';
import AuthContext from '../../../auth/authContext';
import { Navigate } from 'react-router-dom';
import { type } from '@testing-library/user-event/dist/type';
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';

const AdminSavePatientMenu = ({ closeSavePatientMenuHandle, patientsData, setPatientsData }) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [dataLoading, setDataLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fields = {
        demografic_data: { type: 'enum', options: ['Да', 'Нет'], translation: 'Демографические данные', data_type: 'str', default: 'Да', columns: ['Номер #', 'Имя', 'Фамилия', 'Отчество', 'ИИН', 'Возраст', 'Пол', 'Этническая принадлежность', 'Регион', 'Рост (в сантиметрах)', 'Вес (в килограммах)', 'Уровень образования', 'Семейное положение', 'С чем связана работа', 'Водит ли транспортное средство', 'Был ли участником ДТП за последний год?'] },
        doctor_data: { type: 'enum', options: ['Да', 'Нет'], translation: 'Лечащий врач', data_type: 'str', default: 'Да', columns: ['ФИО Врача', 'Квалификация'] },
        medical_data: { type: 'enum', options: ['Да', 'Нет'], translation: 'Медицинские данные (Этиология)', data_type: 'str', default: 'Да', columns: ['Цирроз печени в исходе', 'Известная продолжительность болезни печени (в годах)'] },
        lab_data: { type: 'enum', options: ['Да', 'Нет'], translation: 'Лабораторные исследования', data_type: 'str', default: 'Да', columns: ['Кол-во тромбоцитов в крови', 'Уровень гемоглобина в крови', 'АЛТ (абсолютное значение)', 'Единица измерения АЛТ', 'АCТ (абсолютное значение)', 'Единица измерения АСТ', 'Билирубин (МКМОЛЬ/Л)', 'Креатинин (МКМОЛЬ/Л)', 'МНО', 'Альбумин', 'Na+', 'K+', 'Результат экспресс теста (аммиак крови)'] },
        disease_data: { type: 'enum', options: ['Да', 'Нет'], translation: 'Стадия заболевания / Фиброз / Шкалы', data_type: 'str', default: 'Да', columns: ['Результат непрямой эластографии печени, стадия фиброза (kPa)', 'Результат непрямой эластографии селезенки (kPa)', 'Наличие ВРВ', "Красные знаки ВРВ", 'Наличие асцита', 'Тест связывания чисел А (в секундах)', 'Наличие ошибок', 'Тест связывания чисел B (в секундах)', 'Наличие ошибок ', 'Тест чисел и символов (количество верно заполненных ячеек)', 'Наличие ошибок  ', 'Серийный тест точек (в секундах)', 'Наличие ошибок   ', 'Тест линий (в секундах)', 'Наличие ошибок    ', 'Тип энцефалопатии', 'Степень энцефалопатии', 'Течение энцефалопатии', 'Наличие провоцирующих факторов'] },
        history_data: { type: 'enum', options: ['Да', 'Нет'], translation: 'Анамнез пациента', data_type: 'str', default: 'Да', columns: ['Сопутствующие заболевания', 'Был/а ли ПЛАНОВО госпитализирован/а с заболеваниями печени за последний год?', 'Количество плановых госпитализаций', 'Был/а ли ПЛАНОВО госпитализирован/а БЕЗ заболеваний печени за последний год?', 'Количество плановых госпитализаций', 'Был/а ли ЭКСТРЕННО госпитализирован/а с заболеваниями печени за последний год?', 'Количество экстренных госпитализаций', 'Был/а ли ЭКСТРЕННО госпитализирован/а БЕЗ заболеваний печени за последний год?', 'Количество экстренных госпитализаций', 'Получал/а ли травмы за последний год?', 'Наличие гепатоцеллюлярной карциномы', 'Переносил/а ли инфекционные заболевания за последний год?', 'Дегидратация', 'Портосистемное шунтирование', 'Приверженность к лечению по ЦП', 'Список принимаемых ЛС по ПЭ'] },
        factors_data: { type: 'enum', options: ['Да', 'Нет'], translation: 'Провоцирующие факторы', data_type: 'str', default: 'Да', columns: ['ЖКК за последний год', 'Переносил/а ли инфекционные заболевания за последний год? ', 'Характер стула', 'Дегидратация ', 'Портосистемное шунтирование ', 'Тромбоз', 'ЛС', 'Почечная недостаточность', 'Вредные привычки'] },
        devotion_data: { type: 'enum', options: ['Да', 'Нет'], translation: 'Приверженность', data_type: 'str', default: 'Да', columns: ['Приверженность к лечению по ЦП ', 'Список принимаемых ЛС по ПЭ ', 'Лекарственные препараты, принимаемые на момент осмотра'] },
        life_quality_data: {
            type: 'enum', options: ['Да', 'Нет'], translation: 'Качество жизни', data_type: 'str', default: 'Да',
            columns: {
                'Общее': ['Как вы бы оценили состояние вашего здоровья?', 'Как бы вы оценили свое здоровье сейчас по сравнению с тем, что было год назад?'],
                'Ограничивает ли Вас состояние Вашего здоровья в настоящее время в выполнении перечисленных ниже физических нагрузок?': ['Тяжелые физические нагрузки, такие как бег, поднятие тяжестей, занятие силовыми видами спорта', 'Умеренные физические нагрузки, такие как передвинуть стол, поработать с пылесосом, собирать грибы или ягоды', 'Поднять или нести сумку с продуктами', 'Подняться пешком по лестнице на несколько пролетов', 'Подняться пешком по лестнице на один пролет', 'Наклониться, встать на колени, присесть на корточки', 'Пройти расстояние более одного километра', 'Пройти расстояние в несколько кварталов', 'Пройти расстояние в один квартал', 'Самостоятельно вымыться, одеться'],
                'Бывало ли за последние 4 недели, что Ваше физическое состояние вызывало затруднения в Вашей работе или другой обычной повседневной деятельности, вследствие чего': ['Пришлось сократить количество времени, затрачиваемого на работу или другие дела', 'Выполнили меньше, чем хотели', 'Вы были ограничены в выполнении какого-либо определенного вида работы или другой деятельности', 'Были трудности при выполнении своей работы или других дел (например, они потребовали дополнительных усилий)'],
                'Бывало ли за последние 4 недели, что Ваше эмоциональное состояние вызывало затруднения в Вашей работе или другой обычной повседневной деятельности, вследствие чего': ['Пришлось сократить количество времени, затрачиваемого на работу или другие дела ', 'Выполнили меньше, чем хотели ', 'Выполняли свою работу или другие дела не так аккуратно, как обычно ', 'Насколько Ваше физическое или эмоциональное состояние в течении последних 4 недель мешало Вам проводить время с семьей, друзьями, соседями или в коллективе?', 'Насколько сильную физическую боль Вы испытывали за последние 4 недели?', 'В какой степени боль в течении последних 4 недель мешала Вам заниматься Вашей нормальной работой, включая работу вне дома и по дому?',],
                'Следующие вопросы касаются того, как Вы себя чувствовали и каким было Ваше настроение в течение последних 4 недель. Пожалуйста, на каждый вопрос дайте один ответ, который наиболее соответствует Вашим ощущениям. Как часто в течении последних 4 недель': ['Вы чувствовали себя бодрым(ой)?', 'Вы сильно нервничали?', 'Вы чувствовали себя таким(ой) подавленным(ой), что ничто не могло Вас взбодрить?', 'Вы чувствовали себя спокойным(ой) и умиротворенным(ой)?', 'Вы чувствовали себя полным(ой) сил и энергии?', 'Вы чувствовали себя упавшим(ей) духом и печальным(ой)?', 'Вы чувствовали себя измученным(ой)?', 'Вы чувствовали себя счастливым(ой)?', 'Вы чувствовали себя уставшим(ей)?',],
                'Физическое и эмоциональное состояние': ['Как часто в последние 4 недели Ваше физическое или эмоциональное состояние мешало Вам активно общаться с людьми? Например, навещать родственников, друзей и т.п.'],
                'Насколько ВЕРНЫМ или НЕВЕРНЫМ представляется по отношению к Вам каждое из ниже перечисленных утверждений?': ['Мне кажется, что я более склонен к болезням, чем другие', 'Мое здоровье не хуже, чем у большинства моих знакомых', 'Я ожидаю, что мое здоровье ухудшится', 'У меня отличное здоровье'],
            }
        },
        stroop_data: { type: 'enum', options: ['Да', 'Нет'], translation: 'Тест Струпа', data_type: 'str', default: 'Да', columns: [] },
        dst_data: { type: 'enum', options: ['Да', 'Нет'], translation: 'Тест чисел и символов', data_type: 'str', default: 'Да', columns: [] },
        connection_data: { type: 'enum', options: ['Да', 'Нет'], translation: 'Тест связи чисел', data_type: 'str', default: 'Да', columns: [] },
    }


    const translation = {
        doctor: "ФИО Врача",
        doctor_qualification: "Квалификация",
        // Демографические данные
        first_name: 'Имя',
        last_name: 'Фамилия',
        middle_name: 'Отчество',
        IIN: 'ИИН',
        gender: 'Пол',
        age: 'Возраст',
        ethnicity: 'Этническая принадлежность',
        region: 'Регион',
        height: 'Рост (в сантиметрах)',
        weight: 'Вес (в килограммах)',
        education: 'Уровень образования',
        marital_status: 'Семейное положение',
        job_description: 'С чем связана работа',
        driving_status: 'Водит ли транспортное средство',
        was_involved_in_car_accidents: 'Был ли участником ДТП за последний год?',

        // Медицинские данные (Этиология)
        cirrhosis: 'Цирроз печени в исходе',
        duration_of_illness: 'Известная продолжительность болезни печени (в годах)',

        // Лабораторные исследования
        platelet_count: 'Кол-во тромбоцитов в крови',
        hemoglobin_level: 'Уровень гемоглобина в крови',
        ALT: 'АЛТ (абсолютное значение)',
        ATL_unit: 'Единица измерения АЛТ',
        AAT: 'АCТ (абсолютное значение)',
        AAT_unit: 'Единица измерения АСТ',
        bilirubin: 'Билирубин (МКМОЛЬ/Л)',
        creatinine: 'Креатинин (МКМОЛЬ/Л)',
        INA: 'МНО',
        albumin: 'Альбумин',
        sodium_blood_level: 'Na+',
        potassium_ion: 'K+',
        blood_ammonia: 'Результат экспресс теста (аммиак крови)',

        // Стадия заболевания / Фиброз / Шкалы
        indirect_elastography_of_liver: 'Результат непрямой эластографии печени, стадия фиброза (kPa)',
        indirect_elastography_of_spleen: 'Результат непрямой эластографии селезенки (kPa)',
        EVV: 'Наличие ВРВ',
        red_flags_EVV: "Красные знаки ВРВ",
        presence_of_ascites: 'Наличие асцита',
        connection_test_a: 'Тест связывания чисел А (в секундах)',
        connection_test_a_wrong: 'Наличие ошибок',
        connection_test_b: 'Тест связывания чисел B (в секундах)',
        connection_test_b_wrong: 'Наличие ошибок ',
        symbol_test: 'Тест чисел и символов (количество верно заполненных ячеек)',
        symbol_test_wrong: 'Наличие ошибок  ',
        serial_test: 'Серийный тест точек (в секундах)',
        serial_test_wrong: 'Наличие ошибок   ',
        line_test: 'Тест линий (в секундах)',
        line_test_number_of_border_touches: 'Количество касаний границы',
        line_test_number_of_beyond_border: 'Количество выходов за границы',
        psychometric_index_PE: 'Психометрический индекс ПЭ',

        type_of_encephalopathy: 'Тип энцефалопатии',
        degree_of_encephalopathy: 'Степень энцефалопатии',
        process_of_encephalopathy: 'Течение энцефалопатии',
        presence_of_precipitating_factors: 'Наличие провоцирующих факторов',

        // Анамнез пациента
        comorbidities: 'Сопутствующие заболевания',
        was_planned_hospitalized_with_liver_diseases: 'Был/а ли ПЛАНОВО госпитализирован/а с заболеваниями печени за последний год?',
        number_of_planned_hospitalizations_with_liver_diseases: 'Количество плановых госпитализаций',
        was_planned_hospitalized_without_liver_diseases: 'Был/а ли ПЛАНОВО госпитализирован/а БЕЗ заболеваний печени за последний год?',
        number_of_planned_hospitalizations_without_liver_diseases: 'Количество плановых госпитализаций',
        was_emergency_hospitalized_with_liver_diseases: 'Был/а ли ЭКСТРЕННО госпитализирован/а с заболеваниями печени за последний год?',
        number_of_emergency_hospitalizations_with_liver_diseases: 'Количество экстренных госпитализаций',
        was_emergency_hospitalized_without_liver_diseases: 'Был/а ли ЭКСТРЕННО госпитализирован/а БЕЗ заболеваний печени за последний год?',
        number_of_emergency_hospitalizations_without_liver_diseases: 'Количество экстренных госпитализаций',
        was_injured: 'Получал/а ли травмы за последний год?',
        hepatocellular_carcinoma: 'Наличие гепатоцеллюлярной карциномы',
        previous_infectious_diseases: 'Переносил/а ли инфекционные заболевания за последний год?',
        dehydration: 'Дегидратация',
        portosystemic_bypass_surgery: 'Портосистемное шунтирование',
        CP: 'Приверженность к лечению по ЦП',
        accepted_PE_medications: 'Список принимаемых ЛС по ПЭ',

        // Провоцирующие факторы
        GIB: 'ЖКК за последний год',
        previous_infectious_diseases_duplicate: 'Переносил/а ли инфекционные заболевания за последний год? ',
        stool_character: 'Характер стула',
        dehydration_duplicate: 'Дегидратация ',
        portosystemic_bypass_surgery_duplicate: 'Портосистемное шунтирование ',
        thrombosis: 'Тромбоз',
        medicines: 'ЛС',
        renal_impairment: 'Почечная недостаточность',
        bad_habits: 'Вредные привычки',

        // Приверженность
        CP_duplicate: 'Приверженность к лечению по ЦП ',
        accepted_PE_medications_duplicate: 'Список принимаемых ЛС по ПЭ ',
        accepted_medications_at_the_time_of_inspection: 'Лекарственные препараты, принимаемые на момент осмотра',

        // Качество жизни
        health_condition: 'Как вы бы оценили состояние вашего здоровья?',
        last_year_health_condition: 'Как бы вы оценили свое здоровье сейчас по сравнению с тем, что было год назад?',
        physical_activity_a: 'Тяжелые физические нагрузки, такие как бег, поднятие тяжестей, занятие силовыми видами спорта',
        physical_activity_b: 'Умеренные физические нагрузки, такие как передвинуть стол, поработать с пылесосом, собирать грибы или ягоды',
        physical_activity_c: 'Поднять или нести сумку с продуктами',
        physical_activity_d: 'Подняться пешком по лестнице на несколько пролетов',
        physical_activity_e: 'Подняться пешком по лестнице на один пролет',
        physical_activity_f: 'Наклониться, встать на колени, присесть на корточки',
        physical_activity_g: 'Пройти расстояние более одного километра',
        physical_activity_h: 'Пройти расстояние в несколько кварталов',
        physical_activity_j: 'Пройти расстояние в один квартал',
        physical_activity_k: 'Самостоятельно вымыться, одеться',
        physical_work_a: 'Пришлось сократить количество времени, затрачиваемого на работу или другие дела',
        physical_work_b: 'Выполнили меньше, чем хотели',
        physical_work_c: 'Вы были ограничены в выполнении какого-либо определенного вида работы или другой деятельности',
        physical_work_d: 'Были трудности при выполнении своей работы или других дел (например, они потребовали дополнительных усилий)',
        emotial_state_a: 'Пришлось сократить количество времени, затрачиваемого на работу или другие дела ',
        emotial_state_b: 'Выполнили меньше, чем хотели ',
        emotial_state_c: 'Выполняли свою работу или другие дела не так аккуратно, как обычно ',
        family_time: 'Насколько Ваше физическое или эмоциональное состояние в течении последних 4 недель мешало Вам проводить время с семьей, друзьями, соседями или в коллективе?',
        pain: 'Насколько сильную физическую боль Вы испытывали за последние 4 недели?',
        pain_effect: 'В какой степени боль в течении последних 4 недель мешала Вам заниматься Вашей нормальной работой, включая работу вне дома и по дому?',
        mood_a: 'Вы чувствовали себя бодрым(ой)?',
        mood_b: 'Вы сильно нервничали?',
        mood_c: 'Вы чувствовали себя таким(ой) подавленным(ой), что ничто не могло Вас взбодрить?',
        mood_d: 'Вы чувствовали себя спокойным(ой) и умиротворенным(ой)?',
        mood_e: 'Вы чувствовали себя полным(ой) сил и энергии?',
        mood_f: 'Вы чувствовали себя упавшим(ей) духом и печальным(ой)?',
        mood_g: 'Вы чувствовали себя измученным(ой)?',
        mood_h: 'Вы чувствовали себя счастливым(ой)?',
        mood_k: 'Вы чувствовали себя уставшим(ей)?',
        communication: 'Как часто в последние 4 недели Ваше физическое или эмоциональное состояние мешало Вам активно общаться с людьми? Например, навещать родственников, друзей и т.п.',
        health_condition_a: 'Мне кажется, что я более склонен к болезням, чем другие',
        health_condition_b: 'Мое здоровье не хуже, чем у большинства моих знакомых',
        health_condition_c: 'Я ожидаю, что мое здоровье ухудшится',
        health_condition_d: 'У меня отличное здоровье',
        ALT_unit: 'АЛТ Единица',

        // Тест
        id: 'Номер #',
        name: 'Название теста',
        correct: 'Правильные ответы',
        date: 'Дата',
        patient_id: 'Номер пациента',
        time: 'Время затраченное на тест',
        wrong: 'Ошибки',
    }

    const renameKeys = (obj, newKeys) => {
        const keyValues = Object.keys(obj).map(key => {
            const newKey = newKeys[key] || key;
            return { [newKey]: obj[key] };
        });
        return Object.assign({}, ...keyValues);
    }

    const exportExcel = (data, fileName) => {
        const columns = []
        const merges = []
        const blocks = []
        const subBlocks = []

        Object.keys(formData).forEach((key) => {
            if (formData[key] === 'Да' && key != 'stroop_data' && key != 'dst_data' && key != 'connection_data') {
                const start = columns.length;
                blocks.push(fields[key].translation)

                if (key === 'life_quality_data') {
                    Object.keys(fields[key].columns).forEach((subblock) => {
                        const startSubBlock = columns.length;
                        subBlocks.push(subblock)
                        subBlocks.push(...Array(fields[key].columns[subblock].length - 1).fill(null))
                        columns.push(...fields[key].columns[subblock]);
                        merges.push({ s: { c: startSubBlock, r: 1 }, e: { c: columns.length - 1, r: 1 } })
                    })
                    blocks.push(...Array(Object.values(fields[key].columns).length - 1).fill(null))
                    merges.push({ s: { c: start, r: 0 }, e: { c: columns.length - 1, r: 0 } })
                    return;
                }

                subBlocks.push(...Array(fields[key].columns.length).fill(null))
                columns.push(...fields[key].columns);
                blocks.push(...Array(fields[key].columns.length - 1).fill(null))
                merges.push({ s: { c: start, r: 0 }, e: { c: columns.length - 1, r: 1 } })
            }
        });

        const patients = utils.aoa_to_sheet([blocks, subBlocks]);
        const workbook = utils.book_new();

        data.patients.forEach((patient, index) => {
            patient['doctor_qualification'] = patient.doctor.qualification;
            patient['doctor'] = `${patient.doctor.last_name} ${patient.doctor.first_name} ${patient.doctor.middle_name}`;

            patient['previous_infectious_diseases'] = patient.previous_infectious_diseases.join(', ')
            patient['medicines'] = patient.medicines.join(', ')
            patient['bad_habits'] = patient.bad_habits.join(', ')
            patient['thrombosis'] = patient.thrombosis.join(', ')
            patient['cirrhosis'] = patient.cirrhosis.join(', ')

            patient['previous_infectious_diseases_duplicate'] = patient.previous_infectious_diseases;
            patient['dehydration_duplicate'] = patient.dehydration;
            patient['portosystemic_bypass_surgery_duplicate'] = patient.portosystemic_bypass_surgery;
            patient['CP_duplicate'] = patient.CP;
            patient['accepted_PE_medications_duplicate'] = patient.accepted_PE_medications;

            patient = renameKeys(patient, translation)

            patient = columns.reduce((acc, column) => {
                acc[column] = patient[column];
                return acc;
            }, {});
            utils.sheet_add_json(patients, [patient], { skipHeader: index === 0 ? false : true, header: columns, origin: -1 });

        }, data.patients);

        const tests = utils.aoa_to_sheet([['Анкетные данные', , , , , , , , , 'Тестовые данные']]);
        const testColumns = ['Имя', 'Фамилия', 'Отчество', 'ИИН', 'Возраст', 'Пол', 'Этническая принадлежность', 'Регион', 'Номер #', 'Название теста', 'Правильные ответы', 'Дата', 'Номер пациента', 'Время затраченное на тест', 'Ошибки']

        data.tests.forEach((test, index) => {
            test['first_name'] = test.patient['first_name']
            test['last_name'] = test.patient['last_name']
            test['middle_name'] = test.patient['middle_name']
            test['IIN'] = test.patient['IIN']
            test['gender'] = test.patient['gender']
            test['age'] = test.patient['age']
            test['ethnicity'] = test.patient['ethnicity']
            test['region'] = test.patient['region']
            test = renameKeys(test, translation)
            test = testColumns.reduce((acc, column) => {
                acc[column] = test[column];
                return acc;
            }, {});
            utils.sheet_add_json(tests, [test], { skipHeader: index === 0 ? false : true, header: testColumns, origin: -1 });
        }, data.tests);

        tests['!merges'] = [{ s: { c: 0, r: 0 }, e: { c: 7, r: 0 } }, { s: { c: 8, r: 0 }, e: { c: 13, r: 0 } }]
        patients['!merges'] = merges;

        utils.book_append_sheet(workbook, patients, 'АНКЕТА');
        utils.book_append_sheet(workbook, tests, 'ТЕСТ');

        const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, fileName);
    }

    const [formData, setFormData] = useState(() => {
        const initialData = {};

        Object.keys(fields).forEach((fieldKey) => {
            const field = fields[fieldKey];
            if (field.default) {
                initialData[fieldKey] = field.type === 'multiple' ? [field.default] : field.default;
            } else {
                switch (field.data_type) {
                    case 'float':
                        initialData[fieldKey] = field.required ? '' : 0.00;
                        break;
                    case 'str':
                        initialData[fieldKey] = field.type === 'multiple' ? [] : '';
                        break;
                    case 'int':
                        initialData[fieldKey] = field.required ? '' : 0;
                        break;
                    default:
                        initialData[fieldKey] = '';
                }
            }
        });

        return initialData;
    });

    useEffect(() => {
        if (redirectTo) {
            setRedirectTo(null);
        }
    }, [redirectTo, setRedirectTo]);

    const handleInputChange = (fieldName, event) => {
        const field = fields[fieldName]

        if (event.target.value !== "" && field.required) {
            event.target.classList.remove('not-selected');
        }

        if (event.target.value === "" && field.required) {
            event.target.classList.add('not-selected');
        }

        setFormData(prevFormData => {
            let updatedValue = event.target.value;

            if (updatedValue === '' && !field.required) {
                switch (field.data_type) {
                    case 'int':
                        updatedValue = 0;
                        break;
                    case 'float':
                        updatedValue = 0.00;
                        break;
                    default:
                        updatedValue = '';
                }
            }

            if (field.type === 'enum_expandable' && (updatedValue === 'Нет данных' || updatedValue === 'Нет')) {
                const expandableOptionKey = Object.values(field.options.find(option => typeof option === 'object'))[0];
                prevFormData[expandableOptionKey] = 0;
            }

            const updatedFormData = { ...prevFormData, [fieldName]: updatedValue };
            return updatedFormData;
        });
    };

    useEffect(() => {
        console.log("FORM DATA: " + JSON.stringify(formData));
    }, [formData]);

    const handleCheckboxChange = (fieldName, option, event) => {

        setFormData(prevFormData => {
            let updatedValue = prevFormData[fieldName] ? [...prevFormData[fieldName]] : [];
            if (event.target.checked) {
                updatedValue.push(option);
            } else {
                updatedValue = updatedValue.filter(item => item !== option);
            }
            const updatedFormData = { ...prevFormData, [fieldName]: updatedValue };
            return updatedFormData;
        });
    };

    const areAllFieldsValid = (patientToAddFinalData, fields) => {
        const traverseFields = (data, fieldPath) => {
            for (let key in data) {
                console.log("CHECKING... " + key + " | VALUE: " + data[key])
                if (Array.isArray(data[key])) {
                    const fieldTranslation = fields[key]?.translation || key;

                    if (fields[key]?.required && data[key].length === 0) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' является обязательным и должно быть заполнено.`);
                    }
                } else if (typeof data[key] === 'object' && data[key] !== null) {
                    console.log("IT SEEMS LIKE IT'S OBJECT, OBVIOUSLY...")
                    traverseFields(data[key], fieldPath ? `${fieldPath}.${key}` : key);
                } else {
                    const fieldTranslation = fields[key]?.translation || key;

                    if (fields[key]?.required && (data[key] === undefined || data[key] === null || data[key] === '' || (Array.isArray(data[key]) && data[key].length === 0))) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' является обязательным и должно быть заполнено.`);
                    }
                    if (fields[key]?.data_type === 'int' && !Number.isInteger(Number(data[key]))) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' должно быть целым числом.`);
                    }
                    if (fields[key]?.data_type === 'float' && isNaN(Number(data[key]))) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' должно быть числом с точкой.`);
                    }
                    if (fields[key]?.type === 'multiple' && data[key].length === 0) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' должно быть выбрано хотя бы одно значение.`);
                    }
                }
            }
        };

        try {
            traverseFields(patientToAddFinalData, '');
        } catch (error) {
            console.error(error.message);
            console.log("ERROR FIELD: " + error.message.split(' ')[1])
            return error.message;
        }
    };

    const requestTableFromDB = async () => {
        const handleLogout = () => {
            setIsAuthenticated(false);
            setRedirectTo('/login');
            localStorage.removeItem('currentUserData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        };

        const currentUserData = localStorage.getItem('currentUserData');
        let accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        setDataLoading(true);

        if (!currentUserData) {
            handleLogout();
            return;
        }

        if (!accessToken) {
            if (refreshToken) {
                await refresh();
                accessToken = localStorage.getItem('accessToken');
            } else {
                handleLogout();
                return;
            }
        }

        const errorFieldMessage = areAllFieldsValid(formData, fields);
        if (errorFieldMessage) {
            setErrorMessage(errorFieldMessage);
            return;
        }

        const properties = {
            ...formData,
        };

        try {
            let response = await fetch(`http://hepatest.kz/api/v1/patients/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify({
                    ...properties
                })
            });

            if (!response.ok && response.status === 401) {
                try {
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                    response = await fetch(`http://hepatest.kz/api/v1/patients/download`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        },
                        body: JSON.stringify({
                            ...properties
                        })
                    });

                    const data = await response.json();

                    exportExcel(data, 'patients.xlsx');

                    closeSavePatientMenuHandle();
                    setDataLoading(false);

                } catch (error) {
                    handleLogout();
                }
            } else {
                console.log("\n\n\n\n\nRESPONSE STATUS: " + response.status)
                switch (response.status) {
                    case 422:
                        setErrorMessage('Ошибка при скачивание таблицы. Проверьте все поля.');
                        break;
                    case 409:
                        setErrorMessage('Пациенты не найдены базе данных.');
                        break;
                    case 500:
                        setErrorMessage('Возникла какая-то ошибка. Попробуйте позже.');
                        break;
                    default:
                        closeSavePatientMenuHandle();

                        const data = await response.json();

                        exportExcel(data, 'patients.xlsx');

                        closeSavePatientMenuHandle();
                        setDataLoading(false);
                }
            }
        } catch (error) {
            console.log(error)
            console.log("An error ocured while trying to fetch the patient data.")
        }
    };


    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    return (
        <div className="adminSavePatientMenuBox">
            <div className='adminSavePatientMenuHeaderBox'>
                <img src={CloseIcon} className='closeAdminSavePatientMenuButton' alt='' onClick={closeSavePatientMenuHandle} />
            </div>
            <div className='patientDataInputsList'>
                {Object.keys(fields).map((fieldKey) => {
                    const field = fields[fieldKey];
                    const not_to_display_fields = ['is_on_controlled', 'number_of_planned_hospitalizations_with_liver_diseases', 'number_of_planned_hospitalizations_without_liver_diseases', 'number_of_emergency_hospitalizations_with_liver_diseases', 'number_of_emergency_hospitalizations_without_liver_diseases']
                    if (not_to_display_fields.includes(fieldKey)) {
                        return null;
                    }
                    if (field.type === 'enum' || field.type === 'enum_expandable') {
                        return (
                            <div className='patientDataInputsWrapper' key={fieldKey}>
                                <label className='patientDataLabel'>{field.translation || fieldKey}</label>
                                <select className={`patientDataSelect ${!field.required ? '' : 'not-selected'}`} onChange={(event) => handleInputChange(fieldKey, event)}>
                                    {field.default
                                        ? <option value={field.default}>{field.default}</option>
                                        : <option value="">Выберите опцию...</option>
                                    }
                                    {field.options.map(option => {
                                        if (typeof option === 'object') {
                                            return Object.keys(option).map(key => (
                                                <option key={key} value={key}>{key}</option>
                                            ));
                                        } else if (option !== field.default) {
                                            return <option key={option} value={option}>{option}</option>
                                        }
                                    })}
                                </select>
                                {field.type === 'enum_expandable' && field.options.map(option => {
                                    if (typeof option === 'object' && Object.keys(option).includes(formData[fieldKey])) {
                                        return (
                                            <div className='patientDataInputsWrapper' key={fieldKey}>
                                                <label className='patientDataLabel' style={{ marginTop: '20px' }}>
                                                    {fields[Object.values(option)[0]].translation || fieldKey}
                                                </label>
                                                <input className={`patientDataInput`} onChange={(event) => handleInputChange(Object.values(option)[0], event)} />
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        );
                    } else if (field.type === 'input') {
                        return (
                            <div className='patientDataInputsWrapper' key={fieldKey}>
                                <label className='patientDataLabel'>{field.translation || fieldKey}</label>
                                <input className={`patientDataInput ${!field.required ? '' : 'not-selected'}`} onChange={(event) => handleInputChange(fieldKey, event)} />
                            </div>
                        );
                    } else if (field.type === 'label') {
                        return (
                            <div className='patientDataInputsWrapper' key={fieldKey}>
                                <label className='patientDataLabel'>{field.translation || fieldKey}</label>
                            </div>
                        );
                    } else if (field.type === 'multiple') {
                        const otherOptionsSelected = formData[fieldKey].some(option => option !== 'Нет' && option !== 'Нет данных');
                        const noDataOptionsSelected = formData[fieldKey].includes('Нет') || formData[fieldKey].includes('Нет данных');
                        const anyOptionSelected = formData[fieldKey].length > 0;

                        return (
                            <div className='patientDataInputsWrapper' key={fieldKey}>
                                <label className='patientDataLabel'>{field.translation || fieldKey}</label>
                                <div className={`patientDataCheckBoxesWrapper ${field.required && !anyOptionSelected ? 'not-selected' : ''}`}>
                                    {field.options.map((option, index) => (
                                        <div key={index}>
                                            <input
                                                type='checkbox'
                                                id={`${fieldKey}_${index}`}
                                                name={fieldKey}
                                                value={option}
                                                checked={formData[fieldKey].includes(option)}
                                                onChange={event => handleCheckboxChange(fieldKey, option, event)}
                                                disabled={(otherOptionsSelected && (option === 'Нет' || option === 'Нет данных')) || (noDataOptionsSelected && option !== 'Нет' && option !== 'Нет данных')}
                                            />
                                            <label htmlFor={`${fieldKey}_${index}`}>{option}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            <button className='savePatientButton' style={dataLoading ? { color: 'gray', borderColor: 'gray' } : null} disabled={dataLoading} onClick={() => requestTableFromDB()}>СКАЧАТЬ ТАБЛИЦУ</button>
            <p className='errorMessage'>{errorMessage}</p>
        </div>
    );
}



export default AdminSavePatientMenu;


