const surveySection = document.getElementById('encuesta');
const form = document.getElementById('efficiency-form');
const questionLabel = document.getElementById('question-label');
const questionHint = document.getElementById('question-hint');
const inputWrapper = document.getElementById('input-wrapper');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progressStep = document.getElementById('progress-step');
const successBox = document.getElementById('survey-success');
const ctaButton = document.getElementById('cta-button');

const questions = [
  {
    id: 'personal_hours',
    text: '¿Cuántas horas de tu tiempo personal dedicas a redactar planes de nutrición o notas a tus pacientes?',
    hint: 'Incluye noches y fines de semana fuera de consulta.',
    type: 'number',
    placeholder: 'Ej. 4 horas',
    min: 0,
    max: 40,
    step: 0.5,
  },
  {
    id: 'new_patients',
    text: '¿Cuántos pacientes nuevos podrías atender si automatizaras tus tareas administrativas?',
    hint: 'Piensa en el volumen adicional por mes.',
    type: 'number',
    placeholder: 'Ej. 6 pacientes',
    min: 0,
    max: 60,
    step: 1,
  },
  {
    id: 'draining_task',
    text: '¿Cuál es la tarea que más te drena la energía hoy?',
    hint: 'Describe solo una tarea o proceso.',
    type: 'text',
    placeholder: 'Ej. Documentar seguimientos en WhatsApp',
  },
  {
    id: 'privacy_scale',
    text: 'En escala 1-10, ¿qué tan invadida sientes tu privacidad por WhatsApp?',
    hint: '1 = Nada invadida · 10 = Totalmente invadida.',
    type: 'range',
    min: 1,
    max: 10,
    step: 1,
    unit: '/10',
  },
  {
    id: 'dropout_rate',
    text: '¿Qué porcentaje de tus pacientes crees que abandona el tratamiento por falta de herramientas?',
    hint: 'Estimación personal, en porcentaje.',
    type: 'range',
    min: 0,
    max: 100,
    step: 5,
    unit: '%',
  },
  {
    id: 'compare_difficulty',
    text: '¿Qué tan difícil es comparar el progreso de un paciente de hace 6 meses vs hoy?',
    hint: '1 = Muy fácil · 5 = Virtualmente imposible.',
    type: 'range',
    min: 1,
    max: 5,
    step: 1,
    unit: '/5',
  },
  {
    id: 'ai_usage',
    text: '¿Usarías una IA para transcribir sesiones o analizar fotos de platos?',
    hint: 'Selecciona la respuesta que mejor refleje tu postura actual.',
    type: 'options',
    options: [
      { value: 'si', label: 'Sí, la necesito ya.' },
      { value: 'talvez', label: 'Tal vez, quiero entender riesgos.' },
      { value: 'no', label: 'No, prefiero hacerlo manual.' },
    ],
  },
  {
    id: 'brand_app',
    text: '¿Cómo afectaría a tu marca que tus pacientes tuvieran su propia App con tus planes?',
    hint: 'Comparte el efecto que imaginas: fidelidad, posicionamiento, etc.',
    type: 'textarea',
    placeholder: 'Describe el impacto en tu reputación.',
  },
  {
    id: 'platform_pain',
    text: '¿Qué es lo que más odias de las plataformas actuales?',
    hint: 'Campo abierto. Sé tan específico como quieras.',
    type: 'textarea',
    placeholder: 'Latencia, costos elevados, soporte inexistente, apps genéricas...',
  },
  {
    id: 'investment',
    text: 'Si recuperaras 5 horas a la semana, ¿cuánto invertirías en una solución?',
    hint: 'Piensa en el valor mensual que tendría para tu práctica.',
    type: 'options',
    options: [
      { value: 'low', label: 'Hasta $49 USD/mes' },
      { value: 'mid', label: '$50 - $99 USD/mes' },
      { value: 'high', label: '$100+ USD/mes' },
    ],
  },
  {
    id: 'pioneer',
    text: '¿Quieres ser uno de los 5 “Fundadores Pioneros”?',
    hint: 'Acceso anticipado, acompañamiento 1:1 y tarifas preferenciales.',
    type: 'options',
    options: [
      { value: 'si', label: 'Sí, quiero aplicar.' },
      { value: 'talvez', label: 'Quiero más detalles.' },
      { value: 'no', label: 'No por ahora.' },
    ],
  },
  {
    id: 'ideal_feature',
    text: 'Si pudieras tener una función "mágica" en tu app ideal que aún no existe, ¿cuál sería?',
    hint: 'Cualquier funcionalidad para nutricionistas que te haría la vida más fácil.',
    type: 'textarea',
    placeholder: 'Ej. Un botón que arme automáticamente la lista de supermercado para el paciente...',
  },
  {
    id: 'contact',
    text: 'Déjanos tus datos para tu invitación exclusiva.',
    hint: 'Solo te contactaremos para compartir tu diagnóstico.',
    type: 'contact_form',
  },
];

let currentStep = 0;
const answers = {};

const scrollToSurvey = () => {
  surveySection.scrollIntoView({ behavior: 'smooth' });
};

ctaButton?.addEventListener('click', scrollToSurvey);

const renderStep = () => {
  const question = questions[currentStep];
  if (!question) return;

  questionLabel.textContent = question.text;
  questionHint.textContent = question.hint || '';
  questionHint.classList.remove('error');
  inputWrapper.innerHTML = '';

  const inputElement = createInput(question, answers[question.id]);
  inputWrapper.appendChild(inputElement);

  const progress = ((currentStep + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressStep.textContent = `${currentStep + 1} / ${questions.length}`;

  prevBtn.disabled = currentStep === 0;
  nextBtn.textContent =
    currentStep === questions.length - 1 ? 'Enviar Respuestas' : 'Siguiente';
};

const createInput = (question, storedValue) => {
  switch (question.type) {
    case 'number':
      return createNumberInput(question, storedValue);
    case 'text':
      return createTextInput(question, storedValue);
    case 'textarea':
      return createTextarea(question, storedValue);
    case 'range':
      return createRange(question, storedValue);
    case 'options':
      return createOptions(question, storedValue);
    case 'contact_form':
      return createContactForm(question, storedValue);
    default:
      return createTextInput(question, storedValue);
  }
};

const createNumberInput = (question, storedValue) => {
  const input = document.createElement('input');
  input.type = 'number';
  input.id = question.id;
  input.placeholder = question.placeholder || '';
  if (typeof question.min === 'number') input.min = question.min;
  if (typeof question.max === 'number') input.max = question.max;
  if (typeof question.step === 'number') input.step = question.step;
  input.value = storedValue ?? '';
  return input;
};

const createTextInput = (question, storedValue) => {
  const input = document.createElement('input');
  input.type = 'text';
  input.id = question.id;
  input.placeholder = question.placeholder || '';
  input.value = storedValue ?? '';
  return input;
};

const createTextarea = (question, storedValue) => {
  const textarea = document.createElement('textarea');
  textarea.id = question.id;
  textarea.placeholder = question.placeholder || '';
  textarea.value = storedValue ?? '';
  return textarea;
};

const createRange = (question, storedValue) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'range-wrapper';
  const valueBadge = document.createElement('div');
  valueBadge.className = 'range__value';
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = question.min;
  slider.max = question.max;
  slider.step = question.step || 1;
  slider.value = storedValue ?? question.defaultValue ?? question.min;
  slider.id = question.id;

  const updateBadge = () => {
    valueBadge.textContent = `${slider.value}${question.unit || ''}`;
  };

  slider.addEventListener('input', updateBadge);
  updateBadge();

  wrapper.appendChild(valueBadge);
  wrapper.appendChild(slider);
  return wrapper;
};

const createOptions = (question, storedValue) => {
  const grid = document.createElement('div');
  grid.className = 'option-grid';

  question.options?.forEach((option, index) => {
    const label = document.createElement('label');
    label.className = 'option-pill';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = question.id;
    input.value = option.value;
    if (storedValue === option.value) input.checked = true;
    if (index === 0 && storedValue === undefined) input.checked = false;

    const span = document.createElement('span');
    span.textContent = option.label;

    label.appendChild(input);
    label.appendChild(span);
    grid.appendChild(label);
  });

  return grid;
};

const createContactForm = (question, storedValue) => {
  const container = document.createElement('div');
  container.className = 'contact-form-wrapper';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '15px';

  const createField = (id, placeholder, type = 'text') => {
    const input = document.createElement('input');
    input.type = type;
    input.id = `${question.id}_${id}`;
    input.placeholder = placeholder;
    if (storedValue && storedValue[id]) {
      input.value = storedValue[id];
    }
    return input;
  };

  container.appendChild(createField('name', 'Nombre y Apellido'));
  container.appendChild(createField('email', 'Correo electrónico', 'email'));
  container.appendChild(createField('whatsapp', 'WhatsApp', 'tel'));

  return container;
};

const getCurrentValue = () => {
  const question = questions[currentStep];
  if (!question) return '';

  switch (question.type) {
    case 'number':
    case 'text':
      return inputWrapper.querySelector(`#${question.id}`)?.value.trim();
    case 'textarea':
      return inputWrapper.querySelector('textarea')?.value.trim();
    case 'range':
      return inputWrapper.querySelector('input[type="range"]')?.value;
    case 'options':
      const checked = inputWrapper.querySelector('input[type="radio"]:checked');
      return checked ? checked.value : '';
    case 'contact_form':
      return {
        name: inputWrapper.querySelector(`#${question.id}_name`)?.value.trim(),
        email: inputWrapper.querySelector(`#${question.id}_email`)?.value.trim(),
        whatsapp: inputWrapper.querySelector(`#${question.id}_whatsapp`)?.value.trim(),
      };
    default:
      return '';
  }
};

const requireValue = (value) => {
  let isValid = false;
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    isValid = !!(value.name && value.email && value.whatsapp);
  } else {
    isValid = value !== undefined && value !== null && value !== '';
  }

  questionHint.classList.toggle('error', !isValid);
  if (!isValid) {
    questionHint.textContent = 'Por favor completa todos los campos para avanzar.';
  } else {
    questionHint.textContent = questions[currentStep].hint || '';
  }
  return isValid;
};

const goNext = () => {
  const value = getCurrentValue();
  if (!requireValue(value)) return;

  answers[questions[currentStep].id] = value;

  if (currentStep < questions.length - 1) {
    currentStep += 1;
    renderStep();
  } else {
    finalizeSurvey();
  }
};

const goPrev = () => {
  if (currentStep === 0) return;
  currentStep -= 1;
  renderStep();
};

const WEBHOOK_URL = 'https://n8n.miwebsiteonline.com/webhook/auditoria';

const finalizeSurvey = async () => {
  nextBtn.textContent = 'Enviando...';
  nextBtn.disabled = true;

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answers),
    });

    if (!response.ok) throw new Error('Error de red al enviar');

    form.setAttribute('hidden', 'true');
    successBox.hidden = false;
    console.log('Datos enviados exitosamente:', answers);
  } catch (error) {
    console.error('Error enviando a n8n:', error);
    alert('Hubo un problema enviando tus respuestas. Por favor, inténtalo de nuevo.');
    nextBtn.textContent = 'Enviar Respuestas';
    nextBtn.disabled = false;
  }
};

prevBtn?.addEventListener('click', goPrev);
nextBtn?.addEventListener('click', goNext);

form?.addEventListener('submit', (event) => {
  event.preventDefault();
});

renderStep();
