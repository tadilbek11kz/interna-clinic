import { useContext, useEffect, useState } from 'react';
import './adminPatientDataEditor.scss';
import CloseIcon from './icons/closeIcon.png';
import AuthContext from '../../../auth/authContext';
import { Navigate } from 'react-router-dom';
import encephalopathyTable from './img/encephalopathyTable.png';

const AdminPatientDataEditor = ({ closePatientDataEditorHandle, patientId, patientsData, setPatientsData, searchPatientsResults, setSearchPatientsResults }) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [dataLoading, setDataLoading] = useState(true);
    const [patientData, setPatientData] = useState({});
    const [doctorsData, setDoctorsData] = useState([]);
    const [updatedPatientData, setUpdatedPatientData] = useState(patientData);
    const [newPassword, setNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fields = {
        // NOT REQUIRED
        is_on_controlled: { type: 'enum', options: ['Да', 'Нет', 'Нет данных'], translation: 'Будет ли на контроле', required: false, data_type: 'str', default: 'Нет данных' },

        // REQUIRED
        doctor_id: { type: 'enum', options: [], translation: 'Выберите врача', required: true, data_type: 'int' },
        first_name: { type: 'input', translation: 'Имя', required: true, data_type: 'str' },
        last_name: { type: 'input', translation: 'Фамилия', required: true, data_type: 'str' },
        middle_name: { type: 'input', translation: 'Отчество', required: true, data_type: 'str' },
        IIN: { type: 'input', translation: 'ИИН', required: true, data_type: 'str' },
        password: { type: 'input', translation: 'Пароль', required: true, data_type: 'str' },
        age: { type: 'input', translation: 'Возраст', required: true, data_type: 'int' },
        gender: { type: 'enum', options: ['Мужской', 'Женский'], translation: 'Пол', required: true, data_type: 'str' },
        ethnicity: { type: 'enum', options: ['Азиат', 'Европеец'], translation: 'Этническая принадлежность', required: true, data_type: 'str' },
        region: {
            type: 'enum', options: ['Город Астана', 'Город Алматы', 'Город Шымкент', 'Абайская область', 'Акмолинская область', 'Актюбинская область', 'Алматинская область', 'Атырауская область', 'Восточно-Казахстанская область', 'Жамбылская область', 'Область Жетісу', 'Западно-Казахстанская область', 'Карагандинская область', 'Костанайская область', 'Кызылординская область', 'Мангистауская область', 'Павлодарская область', 'Северо-Казахстанская область', 'Туркестанская область', 'Область Ұлытау',
            ], translation: 'Регион', required: true, data_type: 'str'
        },
        height: { type: 'input', translation: 'Рост (в сантиметрах)', required: true, data_type: 'int' },
        weight: { type: 'input', translation: 'Вес (в килограммах)', required: true, data_type: 'int' },
        // BMI: {type: 'input', translation: 'Индекс массы тела'}
        education: { type: 'enum', options: ['Не оконченное среднее', 'Среднее', 'Высшее'], translation: 'Уровень образования', required: true, data_type: 'str' },
        marital_status: {
            type: 'enum', options: ['Не замужем/не женат ', 'Замужем/Женат', 'Разведен/вдова/вдовец'], translation: 'Семейное положение', required: true,
            data_type: 'str'
        },
        job_description: {
            type: 'enum', options: ['С точными механизмами', 'Офисная', 'С активной физ. нагрузкой', 'Не работаю', 'Другое'],
            translation: 'С чем связана работа', required: true,
            data_type: 'str'
        },
        driving_status: { type: 'enum', options: ['Да', 'Нет'], translation: 'Водит ли транспортное средство', required: true, data_type: 'str' },
        was_involved_in_car_accidents: { type: 'enum', options: ['Да', 'Нет'], translation: 'Был ли участником ДТП за последний год?', required: true, data_type: 'str' },
        cirrhosis: {
            type: 'multiple', options: ['ХГС', 'ХГВ', 'ХГД', 'НАЖБП/МАЖБП', 'Алкогольный стеатогепатит', 'Аутоиммунный гепатит', 'ПБХ', 'ПСХ', 'ПБХ + АИГ',
                'ПСХ + АИГ', 'БВК', 'Гемохроматоз', 'Другое', 'Нет цирроза печени'],
            translation: 'Цирроз печени в исходе', required: true,
            data_type: 'str'
        },
        duration_of_illness: { type: 'input', translation: 'Известная продолжительность болезни печени (в годах)', required: true, data_type: 'int' },

        // NOT REQUIRED
        platelet_count: { type: 'input', translation: 'Кол-во тромбоцитов в крови', required: false, data_type: 'float', default: 0.00 },
        hemoglobin_level: { type: 'input', translation: 'Уровень гемоглобина в крови', required: false, data_type: 'float', default: 0.00 },
        ALT: { type: 'input', translation: 'АЛТ (абсолютное значение)', required: false, data_type: 'float', default: 0.00 },
        ATL_unit: { type: 'enum', options: ['ЕД/Л', 'МККАТ/Л'], translation: 'Единица измерения АЛТ', required: false, data_type: 'str', default: 'ЕД/Л' },
        AAT: { type: 'input', translation: 'АCТ (абсолютное значение)', required: false, data_type: 'float', default: 0.00 },
        AAT_unit: { type: 'enum', options: ['ЕД/Л', 'МККАТ/Л'], translation: 'Единица измерения АСТ', required: false, data_type: 'str', default: 'ЕД/Л' },
        bilirubin: { type: 'input', translation: 'Билирубин (МКМОЛЬ/Л)', required: false, data_type: 'float', default: 0.00 },
        creatinine: { type: 'input', translation: 'Креатинин (МКМОЛЬ/Л)', required: false, data_type: 'float', default: 0.00 },
        INA: { type: 'input', translation: 'МНО', required: false, data_type: 'float', default: 0.00 },
        albumin: { type: 'input', translation: 'Альбумин', required: false, data_type: 'float', default: 0.00 },
        sodium_blood_level: { type: 'input', translation: 'Na+', required: false, data_type: 'float', default: 0.00 },
        potassium_ion: { type: 'input', translation: 'K+', required: false, data_type: 'float', default: 0.00 },

        // REQUIRED
        blood_ammonia: { type: 'input', translation: 'Результат экспресс теста (аммиак крови)', required: true, data_type: 'float' },

        // NOT REQUIRED
        indirect_elastography_of_liver: { type: 'input', translation: 'Результат непрямой эластографии печени, стадия фиброза (kPa)', required: false, data_type: 'float', default: 0.00 },
        indirect_elastography_of_spleen: { type: 'input', translation: 'Результат непрямой эластографии селезенки (kPa)', required: false, data_type: 'float', default: 0.00 },
        EVV: {
            type: 'enum', options: ['1 степень', '2 степень', '3 степень', '4 степень', 'Нет', 'Нет данных'], translation: 'Наличие ВРВ', required: false,
            data_type: 'str',
            default: 'Нет данных'
        },
        red_flags_EVV: { type: 'enum', options: ['Да', 'Нет', 'Нет данных'], translation: "Красные знаки ВРВ", required: false, data_type: 'str', default: 'Нет данных' },
        presence_of_ascites: {
            type: 'enum', options: ['Контролируемый', 'Рефракетерный', 'Нет', 'Нет данных'], translation: 'Наличие асцита', required: false, data_type: 'str',
            default: 'Нет данных'
        },

        // REQUIRED
        connection_test_a: { type: 'input', translation: 'Тест связывания чисел А (в секундах)', required: true, data_type: 'float', default: 0.00 },
        connection_test_a_wrong: { type: 'enum', option: ['Да', 'Нет'], translation: "Наличие ошибок", required: true, data_type: 'str' },

        connection_test_b: { type: 'input', translation: 'Тест связывания чисел Б (в секундах)', required: true, data_type: 'float', default: 0.00 },
        connection_test_b_wrong: { type: 'enum', option: ['Да', 'Нет'], translation: "Наличие ошибок", required: true, data_type: 'str' },

        symbol_test: { type: 'input', translation: 'Тест чисел и символов (количество верно заполненных ячеек)', required: true, data_type: 'float', default: 0.00 },
        symbol_test_wrong: { type: 'enum', option: ['Да', 'Нет'], translation: "Наличие ошибок", required: true, data_type: 'str' },

        serial_test: { type: 'input', translation: 'Серийный тест точек (в секундах)', required: true, data_type: 'float', default: 0.00 },
        serial_test_wrong: { type: 'enum', option: ['Да', 'Нет'], translation: "Наличие ошибок", required: true, data_type: 'str' },

        line_test: { type: 'input', translation: 'Тест линий (в секундах)', required: true, data_type: 'float', default: 0.00 },

        line_test_number_of_border_touches: { type: 'input', translation: 'Количество касаний границы', required: true, data_type: 'float', default: 0.00 },
        line_test_number_of_beyond_border: { type: 'input', translation: 'Количество выходов за границы', required: true, data_type: 'float', default: 0.00 },
        psychometric_index_PE: { type: 'input', translation: 'Психометрический индекс ПЭ', required: true, data_type: 'float', default: 0.00 },

        type_of_encephalopathy: {
            type: 'enum', options: ['А (acute: ПЭ, ассоциированная с острой печеночной недостаточностью)',
                'B (bypass: ПЭ, ассоциированная с портосистемным шунтированием)', 'C (cirrhosis: ПЭ, ассоциированная с ЦП)', 'Нет энцефалопатии'],
            translation: 'Тип энцефалопатии', required: true, data_type: 'str'
        },
        degree_of_encephalopathy_image: { type: 'image', src: encephalopathyTable },
        degree_of_encephalopathy: {
            type: 'enum', options: ['Скрытая ISHEN – Минимальная WHC', 'Скрытая ISHEN - 1 WHC', 'Явная ISHEN 2', 'Явная ISHEN 3 WHC', 'Явная ISHEN 4 WHC', 'Нет энцефалопатии'],
            translation: 'Степень энцефалопатии', required: true, data_type: 'str'
        },

        // NOT REQUIRED
        process_of_encephalopathy: {
            type: 'enum', options: ['Эпизодическая', 'Рецидивирующая', 'Персистирующая', 'Нет данных'], translation: 'Течение энцефалопатии',
            required: false, data_type: 'str', default: 'Нет данных'
        },
        presence_of_precipitating_factors: {
            type: 'enum', options: ['Спровоцированная', 'Неспровоцированная', 'Нет данных'], translation: 'Наличие провоцирующих факторов',
            required: false, data_type: 'str', default: 'Нет данных'
        },
        comorbidities: {
            type: 'multiple', options: ['ВИЧ -инфекция', 'Сахарный диабет/гликемия натощак', 'Избыточный вес / ожирение', 'Ишемическая болезнь сердца', 'АГ',
                'Хроническая болезнь почек',
                'Хроническое обструктивное болезнь легких', 'Другое',
                'Нет данных'], translation: 'Сопутствующие заболевания',
            required: false, data_type: 'str', default: 'Нет данных'
        },
        was_planned_hospitalized_with_liver_diseases: {
            type: 'enum_expandable', options: [{ 'Да': 'number_of_planned_hospitalizations_with_liver_diseases' }, 'Нет', 'Нет данных'],
            translation: 'Был/а ли ПЛАНОВО госпитализирован/а с заболеваниями печени за последний год?',
            required: false, data_type: 'str', default: 'Нет данных'
        },
        number_of_planned_hospitalizations_with_liver_diseases: {
            type: 'input', translation: 'Количество плановых госпитализаций c заболеваниями печени', required: false,
            data_type: 'int', default: 0
        },
        was_planned_hospitalized_without_liver_diseases: {
            type: 'enum_expandable', options: [{ 'Да': 'number_of_planned_hospitalizations_without_liver_diseases' }, 'Нет', 'Нет данных'],
            translation: 'Был/а ли ПЛАНОВО госпитализирован/а БЕЗ заболеваний печени за последний год?',
            required: false, data_type: 'str', default: 'Нет данных'
        },
        number_of_planned_hospitalizations_without_liver_diseases: {
            type: 'input', translation: 'Количество плановых госпитализаций БЕЗ заболеваний печени', required: false,
            data_type: 'int', default: 0
        },
        was_emergency_hospitalized_with_liver_diseases: {
            type: 'enum_expandable', options: [{ 'Да': 'number_of_emergency_hospitalizations_with_liver_diseases' }, 'Нет', 'Нет данных'],
            translation: 'Был/а ли ЭКСТРЕННО госпитализирован/а с заболеваниями печени за последний год?',
            required: false, data_type: 'str', default: 'Нет данных'
        },
        number_of_emergency_hospitalizations_with_liver_diseases: {
            type: 'input', translation: 'Количество экстренных госпитализаций с заболеваниями печени', required: false,
            data_type: 'int', default: 0
        },
        was_emergency_hospitalized_without_liver_diseases: {
            type: 'enum_expandable', options: [{ 'Да': 'number_of_emergency_hospitalizations_without_liver_diseases' }, 'Нет', 'Нет данных'],
            translation: 'Был/а ли ЭКСТРЕННО госпитализирован/а БЕЗ заболеваний печени за последний год?',
            required: false, data_type: 'str', default: 'Нет данных'
        },
        number_of_emergency_hospitalizations_without_liver_diseases: {
            type: 'input', translation: 'Количество экстренных госпитализаций БЕЗ заболеваний печени', required: false,
            data_type: 'int', default: 0
        },

        was_injured: { type: 'enum', options: ['Да', 'Нет'], translation: 'Получал/а ли травмы за последний год?', required: false, data_type: 'str', default: 'Нет' },

        // REQUIRED
        GIB: { type: 'enum', options: ['Да', 'Нет'], translation: 'ЖКК за последний год', required: true, data_type: 'str' },
        previous_infectious_diseases: {
            type: 'multiple', options: ['Инфекция органов дыхания', 'Инфекция органов пищеварения', 'Инфекция мочеполовой системы', 'Другое', 'Нет'],
            translation: 'Переносил/а ли инфекционные заболевания за последний год?',
            required: true, data_type: 'str'
        },
        stool_character: { type: 'enum', options: ['Регулярный (1 раз в 1-2 дня)', 'Запор', 'Диарея'], translation: 'Характер стула', required: true, data_type: 'str' },
        dehydration: {
            type: 'enum', options: ['Назначение диуретиков в неконтролируемых дозировках', 'Парацентез в больших объемах', 'Нет', 'Нет данных'], translation: 'Дегидратация',
            required: true, data_type: 'str'
        },
        portosystemic_bypass_surgery: {
            type: 'enum', options: ['Шунтирующие операции', 'Cпонтанные шунты (Гастроэзофагеальные)', 'Cпонтанные шунты (Забрюшинные)',
                'Cпонтанные шунты (Анастомозы между левой ветвью воротной вены и сосудами передней брюшной стенки)',
                'Cпонтанные шунты (Между прямокишечным сплетением и нижней полой веной)', 'Нет данных'],
            translation: 'Портосистемное шунтирование', required: true, data_type: 'str'
        },
        thrombosis: { type: 'multiple', options: ['Тромбоз воротной вены', 'Тромбоз печеночных вен', 'Нет'], translation: 'Тромбоз', required: true, data_type: 'str' },
        medicines: { type: 'multiple', options: ['Прием бензодиазепин', 'Прием опиодов', 'ИПП', 'Нет'], translation: 'ЛС', required: true, data_type: 'str' },
        renal_impairment: { type: 'enum', options: ['Да', 'Нет'], translation: 'Почечная недостаточность', required: true, data_type: 'str' },
        bad_habits: { type: 'multiple', options: ['Табакокурение', 'Злоупотребление алкоголем', 'Нет'], translation: 'Вредные привычки', required: true, data_type: 'str' },
        CP: { type: 'enum', options: ['Имелась', 'Отсутствовала'], translation: 'Приверженность к лечению по ЦП', required: true, data_type: 'str' },
        accepted_PE_medications: {
            type: 'enum',
            options: [
                'Лактулоза',
                'Рифаксимин',
                'L-орнитин L-аспартат',
                'Ничего из вышеперечисленного',
            ],
            translation: 'Список принимаемых ЛС по ПЭ',
            required: true,
            data_type: 'str',
        },
        accepted_medications_at_the_time_of_inspection: { type: 'input', translation: 'Лекарственные препараты, принимаемые на момент осмотра', required: true, data_type: 'str' },

        // REQUIRED
        health_condition: { type: 'enum', options: ['Отличное', 'Очень хорошее', 'Хорошее', 'Посредственное', 'Плохое'], translation: 'Как вы бы оценили состояние вашего здоровья?', required: true, data_type: 'str' },
        last_year_health_condition: { type: 'enum', options: ['Значительно лучше, чем год назад', 'Несколько лучше, чем год назад', 'Примерно так же, как год назад', 'Несколько хуже, чем год назад', 'Гораздо хуже, чем год назад'], translation: 'Как бы вы оценили свое здоровье сейчас по сравнению с тем, что было год назад?', required: true, data_type: 'str' },
        physical_activity_label: { type: 'label', translation: 'Ограничивает ли Вас состояние Вашего здоровья в настоящее время в выполнении перечисленных ниже физических нагрузок?' },

        physical_activity_a: { type: 'enum', options: ['Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает'], translation: 'Тяжелые физические нагрузки, такие как бег, поднятие тяжестей, занятие силовыми видами спорта', required: true, data_type: 'str' },
        physical_activity_b: { type: 'enum', options: ['Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает'], translation: 'Умеренные физические нагрузки, такие как передвинуть стол, поработать с пылесосом, собирать грибы или ягоды', required: true, data_type: 'str' },
        physical_activity_c: { type: 'enum', options: ['Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает'], translation: 'Поднять или нести сумку с продуктами', required: true, data_type: 'str' },
        physical_activity_d: { type: 'enum', options: ['Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает'], translation: 'Подняться пешком по лестнице на несколько пролетов', required: true, data_type: 'str' },
        physical_activity_e: { type: 'enum', options: ['Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает'], translation: 'Подняться пешком по лестнице на один пролет', required: true, data_type: 'str' },
        physical_activity_f: { type: 'enum', options: ['Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает'], translation: 'Наклониться, встать на колени, присесть на корточки', required: true, data_type: 'str' },
        physical_activity_g: { type: 'enum', options: ['Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает'], translation: 'Пройти расстояние более одного километра', required: true, data_type: 'str' },
        physical_activity_h: { type: 'enum', options: ['Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает'], translation: 'Пройти расстояние в несколько кварталов', required: true, data_type: 'str' },
        physical_activity_j: { type: 'enum', options: ['Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает'], translation: 'Пройти расстояние в один квартал', required: true, data_type: 'str' },
        physical_activity_k: { type: 'enum', options: ['Да, значительно ограничивает', 'Да, немного ограничивает', 'Нет, совсем не ограничивает'], translation: 'Самостоятельно вымыться, одеться', required: true, data_type: 'str' },

        physical_work_label: { type: 'label', translation: 'Бывало ли за последние 4 недели, что Ваше физическое состояние вызывало затруднения в Вашей работе или другой обычной повседневной деятельности, вследствие чего' },

        physical_work_a: { type: 'enum', options: ['Да', 'Нет'], translation: 'Пришлось сократить количество времени, затрачиваемого на работу или другие дела', required: true, data_type: 'str' },
        physical_work_b: { type: 'enum', options: ['Да', 'Нет'], translation: 'Выполнили меньше, чем хотели', required: true, data_type: 'str' },
        physical_work_c: { type: 'enum', options: ['Да', 'Нет'], translation: 'Вы были ограничены в выполнении какого-либо определенного вида работы или другой деятельности', required: true, data_type: 'str' },
        physical_work_d: { type: 'enum', options: ['Да', 'Нет'], translation: 'Были трудности при выполнении своей работы или других дел (например, они потребовали дополнительных усилий)', required: true, data_type: 'str' },

        emotial_state_label: { type: 'label', translation: 'Бывало ли за последние 4 недели, что Ваше эмоциональное состояние вызывало затруднения в Вашей работе или другой обычной повседневной деятельности, вследствие чего' },

        emotial_state_a: { type: 'enum', options: ['Да', 'Нет'], translation: 'Пришлось сократить количество времени, затрачиваемого на работу или другие дела', required: true, data_type: 'str' },
        emotial_state_b: { type: 'enum', options: ['Да', 'Нет'], translation: 'Выполнили меньше, чем хотели', required: true, data_type: 'str' },
        emotial_state_c: { type: 'enum', options: ['Да', 'Нет'], translation: 'Выполняли свою работу или другие дела не так аккуратно, как обычно', required: true, data_type: 'str' },

        family_time: { type: 'enum', options: ['Совсем не мешало', 'Немного', 'Умеренно', 'Сильно', 'Очень сильно'], translation: 'Насколько Ваше физическое или эмоциональное состояние в течении последних 4 недель мешало Вам проводить время с семьей, друзьями, соседями или в коллективе?', required: true, data_type: 'str' },

        pain: { type: 'enum', options: ['Совсем не испытывал(а)', 'Очень слабую', 'Слабую', 'Умеренную', 'Сильную', 'Очень сильную'], translation: 'Насколько сильную физическую боль Вы испытывали за последние 4 недели?', required: true, data_type: 'str' },

        pain_effect: { type: 'enum', options: ['Совсем не мешала', 'Немного', 'Умеренно', 'Сильно', 'Очень сильно'], translation: 'В какой степени боль в течении последних 4 недель мешала Вам заниматься Вашей нормальной работой, включая работу вне дома и по дому?', required: true, data_type: 'str' },

        mood_label: { type: 'label', translation: 'Следующие вопросы касаются того, как Вы себя чувствовали и каким было Ваше настроение в течение последних 4 недель. Пожалуйста, на каждый вопрос дайте один ответ, который наиболее соответствует Вашим ощущениям. Как часто в течении последних 4 недель' },
        mood_a: { type: 'enum', options: ['Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу'], translation: 'Вы чувствовали себя бодрым(ой)?', required: true, data_type: 'str' },
        mood_b: { type: 'enum', options: ['Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу'], translation: 'Вы сильно нервничали?', required: true, data_type: 'str' },
        mood_c: { type: 'enum', options: ['Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу'], translation: 'Вы чувствовали себя таким(ой) подавленным(ой), что ничто не могло Вас взбодрить?', required: true, data_type: 'str' },
        mood_d: { type: 'enum', options: ['Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу'], translation: 'Вы чувствовали себя спокойным(ой) и умиротворенным(ой)?', required: true, data_type: 'str' },
        mood_e: { type: 'enum', options: ['Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу'], translation: 'Вы чувствовали себя полным(ой) сил и энергии?', required: true, data_type: 'str' },
        mood_f: { type: 'enum', options: ['Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу'], translation: 'Вы чувствовали себя упавшим(ей) духом и печальным(ой)?', required: true, data_type: 'str' },
        mood_g: { type: 'enum', options: ['Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу'], translation: 'Вы чувствовали себя измученным(ой)?', required: true, data_type: 'str' },
        mood_h: { type: 'enum', options: ['Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу'], translation: 'Вы чувствовали себя счастливым(ой)?', required: true, data_type: 'str' },
        mood_k: { type: 'enum', options: ['Все время', 'Большую часть времени', 'Часто', 'Иногда', 'Редко', 'Ни разу'], translation: 'Вы чувствовали себя уставшим(ей)?', required: true, data_type: 'str' },

        communication: { type: 'enum', options: ['Все время', 'Большую часть времени', 'Иногда', 'Редко', 'Ни разу'], translation: 'Как часто в последние 4 недели Ваше физическое или эмоциональное состояние мешало Вам активно общаться с людьми? Например, навещать родственников, друзей и т.п.', required: true, data_type: 'str' },

        health_condition_label: { type: 'label', translation: 'Насколько ВЕРНЫМ или НЕВЕРНЫМ представляется по отношению к Вам каждое из ниже перечисленных утверждений?' },

        health_condition_a: { type: 'enum', options: ['Определенно верно', 'В основном верно', 'Не знаю', 'В основном не верно', 'Определенно не верно'], translation: 'Мне кажется, что я более склонен к болезням, чем другие', required: true, data_type: 'str' },
        health_condition_b: { type: 'enum', options: ['Определенно верно', 'В основном верно', 'Не знаю', 'В основном не верно', 'Определенно не верно'], translation: 'Мое здоровье не хуже, чем у большинства моих знакомых', required: true, data_type: 'str' },
        health_condition_c: { type: 'enum', options: ['Определенно верно', 'В основном верно', 'Не знаю', 'В основном не верно', 'Определенно не верно'], translation: 'Я ожидаю, что мое здоровье ухудшится', required: true, data_type: 'str' },
        health_condition_d: { type: 'enum', options: ['Определенно верно', 'В основном верно', 'Не знаю', 'В основном не верно', 'Определенно не верно'], translation: 'У меня отличное здоровье', required: true, data_type: 'str' },
    }

    useEffect(() => {
        if (redirectTo) {
            setRedirectTo(null);
        }
    }, [redirectTo, setRedirectTo]);

    useEffect(() => {
        const handleLogout = () => {
            setIsAuthenticated(false);
            setRedirectTo('/login');
            localStorage.removeItem('currentUserData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        };

        const fetchPatientData = async () => {
            const currentUserData = localStorage.getItem('currentUserData');
            let accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

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

            try {
                let response = await fetch(`http://hepatest.kz/api/v1/patients/${patientId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessToken
                    }
                });

                if (!response.ok && response.status === 401) {
                    try {
                        await refresh();
                        accessToken = localStorage.getItem('accessToken');
                        response = await fetch(`http://hepatest.kz/api/v1/patients/${patientId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                        const patientData = await response.json();
                        setPatientData(patientData);
                        setDataLoading(false);
                    } catch (error) {
                        handleLogout();
                    }
                } else {
                    const patientData = await response.json();
                    setPatientData(patientData);
                    setDataLoading(false);
                }
            } catch (error) {
                console.log("An error ocured while trying to fetch the patient data.")
            }
        }

        fetchPatientData();

        const fetchDoctorsData = async () => {
            const currentUserData = localStorage.getItem('currentUserData');
            let accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            const handleLogout = () => {
                setIsAuthenticated(false);
                setRedirectTo('/login');
                localStorage.removeItem('currentUserData');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            };

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

            try {
                let response = await fetch(`http://hepatest.kz/api/v1/doctors_without_pagination`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessToken
                    }
                });

                if (!response.ok && response.status === 401) {
                    try {
                        await refresh();
                        accessToken = localStorage.getItem('accessToken');
                        response = await fetch(`http://hepatest.kz/api/v1/doctors_without_pagination`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                        const doctorsData = await response.json();
                        setDoctorsData(doctorsData);
                        setDataLoading(false);
                    } catch (error) {
                        handleLogout();
                    }
                } else {
                    const doctorsData = await response.json();
                    setDoctorsData(doctorsData);
                    setDataLoading(false);
                }
            } catch (error) {
                console.log("An error ocured while trying to fetch the doctors data.")
            }
        };

        fetchDoctorsData();
    }, [patientId, refresh, setIsAuthenticated, setRedirectTo])

    const handleInputChange = (fieldName, event) => {
        const field = fields[fieldName];
        let updatedValue = event.target.value;

        setPatientData(prevPatientData => {
            let updatedPatientData = { ...prevPatientData };

            if (updatedValue === '') {
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
                updatedPatientData[expandableOptionKey] = 0;
            }

            if (fieldName === 'password') {
                setNewPassword(updatedValue)
                updatedPatientData['password'] = updatedValue;
            } else {
                updatedPatientData[fieldName] = updatedValue;
            }

            return updatedPatientData;
        });
    };

    useEffect(() => {
        console.log("PATIENT DATA: " + JSON.stringify(patientData));
    }, [patientData]);

    const handleCheckboxChange = (fieldName, option, event) => {
        setPatientData(prevPatientData => {
            let updatedValue = prevPatientData[fieldName] ? [...prevPatientData[fieldName]] : [];

            if (event.target.checked) {
                updatedValue.push(option);
            } else {
                updatedValue = updatedValue.filter(item => item !== option);
            }

            const updatedPatientData = { ...prevPatientData, [fieldName]: updatedValue };
            return updatedPatientData;
        });
    };

    const areAllFieldsValid = (patientToAddFinalData, fields) => {
        const traverseFields = (data, fieldPath) => {
            for (let key in data) {
                console.log("CHECKING... " + key + " | VALUE: " + data[key])
                if (Array.isArray(data[key])) {
                    const fieldTranslation = fields[key]?.translation || key;

                    if (data[key].length === 0) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' является обязательным и должно быть заполнено.`);
                    }
                } else if (typeof data[key] === 'object' && data[key] !== null) {
                    console.log("IT SEEMS LIKE IT'S OBJECT, OBVIOUSLY...")
                    traverseFields(data[key], fieldPath ? `${fieldPath}.${key}` : key);
                } else {
                    const fieldTranslation = fields[key]?.translation || key;

                    if (key === 'IIN') {
                        if (!/^\d{12}$/.test(data[key])) {
                            console.log("OOOPS ERROR HERE")
                            throw new Error(`Поле '${fieldTranslation}' должно содержать ровно 12 цифр.`);
                        }
                    }
                    if ((key === 'first_name' || key === 'last_name' || key === 'middle_name') && data[key] === '') {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' не может быть пустым.`);
                    }
                    if ((key === 'first_name' || key === 'last_name' || key === 'middle_name') && /\d/.test(data[key])) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' не должно содержать цифр.`);
                    }
                    if (fields[key]?.data_type === 'int' && !Number.isInteger(Number(data[key]))) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' должно быть целым числом.`);
                    }
                    if (fields[key]?.data_type === 'float' && isNaN(Number(data[key]))) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' должно быть числом с точкой.`);
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

    const savePatientData = async () => {
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

        if (!newPassword) {
            updatedPatientData['password'] = '';
        }

        console.log("FINAL PATIENT DATA: " + JSON.stringify({ ...patientData, ...updatedPatientData }));
        const errorFieldMessage = areAllFieldsValid({ ...patientData, ...updatedPatientData }, fields);
        if (errorFieldMessage) {
            setErrorMessage(errorFieldMessage);
            return;
        }

        if (updatedPatientData.weight && updatedPatientData.height) {
            const weight = updatedPatientData.weight;
            const height = updatedPatientData.height / 100;
            const BMI = weight / (height * height);
            updatedPatientData.BMI = BMI;
        } else {
            const weight = patientData.weight;
            const height = patientData.height / 100;
            const BMI = weight / (height * height);
            updatedPatientData.BMI = BMI;
        }

        try {
            let response = await fetch(`http://hepatest.kz/api/v1/patients/${patientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify({
                    ...patientData,
                    ...updatedPatientData
                })
            });

            if (!response.ok && response.status === 401) {
                try {
                    console.log("GOT AN ERROR. REFRESHING.")
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                    response = await fetch(`http://hepatest.kz/api/v1/patients/${patientId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        },
                        body: JSON.stringify({
                            ...patientData,
                            ...updatedPatientData
                        })
                    });

                    const updatedPatientDataRecieved = await response.json();
                    const updatedDoctorsPatientsData = patientsData.map(patient => {
                        if (patient.id === updatedPatientDataRecieved.id) {
                            return updatedPatientDataRecieved;
                        }
                        return patient;
                    });

                    let updatedSearchPatientsResults = null;
                    if (searchPatientsResults) {
                        updatedSearchPatientsResults = searchPatientsResults.map(patient => {
                            if (patient.id === updatedPatientDataRecieved.id) {
                                return updatedPatientDataRecieved;
                            }
                            return patient;
                        });
                    }

                    setPatientsData(updatedDoctorsPatientsData);
                    setSearchPatientsResults(updatedSearchPatientsResults);
                    setPatientData(updatedPatientDataRecieved);
                    closePatientDataEditorHandle();
                } catch (error) {
                    const error_text = JSON.stringify(error);
                    console.log("SOMETHING WENT WRONG HERE 1: " + error_text)
                    handleLogout();
                }
            } else {
                const updatedPatientDataRecieved = await response.json();
                const updatedDoctorsPatientsData = patientsData.map(patient => {
                    if (patient.id === updatedPatientDataRecieved.id) {
                        return updatedPatientDataRecieved;
                    }
                    return patient;
                });

                let updatedSearchPatientsResults = null;
                if (searchPatientsResults) {
                    updatedSearchPatientsResults = searchPatientsResults.map(patient => {
                        if (patient.id === updatedPatientDataRecieved.id) {
                            return updatedPatientDataRecieved;
                        }
                        return patient;
                    });
                }

                setPatientsData(updatedDoctorsPatientsData);
                setSearchPatientsResults(updatedSearchPatientsResults);
                setPatientData(updatedPatientDataRecieved);
                closePatientDataEditorHandle();
            }
        } catch (error) {
            const error_text = JSON.stringify(error);
            console.log("SOMETHING WENT WRONG HERE 2: " + error_text)
            console.log("An error occurred while trying to update the patient data.")
        }
    };

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    if (dataLoading) {
        return (
            <div className="patientDataEditorBox" style={{ display: "block" }}>
                <div className='patientDataEditorHeaderBox'>
                    <img src={CloseIcon} className='closePatientDataEditorButton' alt='' />
                </div>
                <div className='dataEditorLoader'></div>
            </div>
        );
    }

    return (
        <div className="patientDataEditorBox">
            <div className='patientDataEditorHeaderBox'>
                <img src={CloseIcon} className='closePatientDataEditorButton' alt='' onClick={closePatientDataEditorHandle} />
            </div>
            {patientData && (
                <div className='patientDataInputsList'>
                    <div className='patientDataInputsWrapper' key='password'>
                        <label className='patientDataLabel'>Пароль</label>
                        <input
                            className='patientDataInput'
                            type='password'
                            placeholder='Введите новый пароль (необязательно)'
                            value={newPassword}
                            onChange={(event) => handleInputChange('password', event)}
                        />
                    </div>
                    {Object.entries(patientData).map(([fieldKey, value]) => {
                        const field = fields[fieldKey];
                        // These fields will be displayed only with need from 'enum_exapndable' selects. Now they're ignored and won't be displayed.
                        const not_to_display_fields = ['is_on_controlled', 'number_of_planned_hospitalizations_with_liver_diseases', 'number_of_planned_hospitalizations_without_liver_diseases', 'number_of_emergency_hospitalizations_with_liver_diseases', 'number_of_emergency_hospitalizations_without_liver_diseases']
                        if (not_to_display_fields.includes(fieldKey)) {
                            return null;
                        }
                        if (field) {
                            if (field.type === 'enum' || field.type === 'enum_expandable') {
                                return (
                                    <div className='patientDataInputsWrapper' key={fieldKey}>
                                        <label className='patientDataLabel'>{field.translation || fieldKey}</label>
                                        <select className='patientDataSelect' onChange={(event) => handleInputChange(fieldKey, event)} defaultValue={value}>
                                            {fieldKey === 'doctor_id' ? doctorsData.map((doctor) => (
                                                <option key={doctor.id} value={doctor.id}>
                                                    {`${doctor.last_name} ${doctor.first_name} ${doctor.middle_name}`}
                                                </option>
                                            )) : field.options.map(option => {
                                                if (typeof option === 'object') {
                                                    return Object.keys(option).map(key => (
                                                        <option key={key} value={key}>{key}</option>
                                                    ));
                                                } else {
                                                    return <option key={option} value={option}>{option}</option>
                                                }
                                            })}
                                        </select>
                                        {field.type === 'enum_expandable' && field.options.map(option => {
                                            if (typeof option === 'object' && Object.keys(option).includes(patientData[fieldKey])) {
                                                const inputKey = Object.values(option)[0]; // Получаем ключ для текущего input
                                                return (
                                                    <div className='patientDataInputsWrapper' key={inputKey}>
                                                        <label className='patientDataLabel' style={{ marginTop: '20px' }}>
                                                            {fields[inputKey].translation || inputKey}
                                                        </label>
                                                        <input
                                                            className='patientDataInput'
                                                            placeholder={patientData[inputKey] || '0'}
                                                            onChange={(event) => handleInputChange(inputKey, event)} // Используем inputKey вместо жестко заданного ключа
                                                        />
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
                                        <input className='patientDataInput' placeholder={value} onChange={(event) => handleInputChange(fieldKey, event)} />
                                    </div>
                                );
                            } else if (field.type === 'label') {
                                return (
                                    <div className='patientDataInputsWrapper' key={fieldKey}>
                                        <label className='patientDataLabel'>{field.translation || fieldKey}</label>
                                    </div>
                                );
                            } else if (field.type === 'image') {
                                return (
                                    <div className='patientDataInputsWrapper' key={fieldKey}>
                                        <img style={{ width: '100%' }} src={field.src} alt='' />
                                    </div>
                                );
                            } else if (field.type === 'multiple') {
                                const otherOptionsSelected = patientData[fieldKey].some(option => option !== 'Нет' && option !== 'Нет данных');
                                const noDataOptionsSelected = patientData[fieldKey].includes('Нет') || patientData[fieldKey].includes('Нет данных');
                                const anyOptionSelected = patientData[fieldKey].length > 0;

                                return (
                                    <div className='patientDataInputsWrapper' key={fieldKey}>
                                        <label className='patientDataLabel'>{field.translation || fieldKey}</label>
                                        <div className={`patientDataCheckBoxesWrapper ${anyOptionSelected ? '' : 'not-selected'}`}>
                                            {field.options.map((option, index) => (
                                                <div key={index}>
                                                    <input
                                                        type='checkbox'
                                                        id={`${fieldKey}_${index}`}
                                                        name={fieldKey}
                                                        value={option}
                                                        checked={patientData[fieldKey].includes(option)}
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
                        }
                    })}
                </div>
            )}
            <button className='patientDataSaveButton' onClick={() => savePatientData()}>СОХРАНИТЬ</button>
            <p className='errorMessage'>{errorMessage}</p>
        </div>
    );
}

export default AdminPatientDataEditor;
