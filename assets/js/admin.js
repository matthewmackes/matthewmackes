const storageKey = 'postSubjects';

const defaults = [
  {
    name: 'Performance Issues',
    description: 'Performance degradation, latency problems, or optimization opportunities',
    keywords: ['slow', 'performance', 'latency', 'timeout', 'bottleneck', 'optimization']
  },
  {
    name: 'Bug Fixes',
    description: 'Critical and non-critical bug fixes',
    keywords: ['bug', 'fix', 'crash', 'error', 'broken', 'issue']
  },
  {
    name: 'Security Updates',
    description: 'Security vulnerabilities and fixes',
    keywords: ['security', 'vulnerability', 'cve', 'exploit', 'auth', 'encryption']
  },
  {
    name: 'Feature Updates',
    description: 'New features and enhancements',
    keywords: ['feature', 'add', 'implement', 'new', 'enhancement', 'support']
  }
];

const form = document.querySelector('[data-form]');
const listEl = document.querySelector('[data-subject-list]');
const importInput = document.querySelector('[data-import-input]');

function getSubjects() {
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : [];
}

function setSubjects(subjects) {
  localStorage.setItem(storageKey, JSON.stringify(subjects));
  renderSubjects();
}

function renderSubjects() {
  const subjects = getSubjects();
  if (!listEl) return;

  if (!subjects.length) {
    listEl.innerHTML = '<p class="weather-meta">No subjects yet. Add one to get started.</p>';
    return;
  }

  listEl.innerHTML = subjects
    .map(
      (subject, index) => `
        <div class="subject-card">
          <div>
            <h4>${subject.name}</h4>
            <p>${subject.description}</p>
            <div class="keyword-row">
              ${subject.keywords.map((keyword) => `<span class="keyword-chip">${keyword}</span>`).join('')}
            </div>
          </div>
          <button class="button secondary" data-remove="${index}">Remove</button>
        </div>
      `
    )
    .join('');

  listEl.querySelectorAll('[data-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.remove);
      const updated = getSubjects().filter((_, i) => i !== index);
      setSubjects(updated);
    });
  });
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('name').trim();
  const description = formData.get('description').trim();
  const keywords = formData
    .get('keywords')
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  const subjects = getSubjects();
  subjects.push({ name, description, keywords });
  setSubjects(subjects);
  form.reset();
});

const actions = {
  seed() {
    setSubjects(defaults);
  },
  clear() {
    setSubjects([]);
  },
  export() {
    const blob = new Blob([JSON.stringify(getSubjects(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'post_subjects.json';
    link.click();
    URL.revokeObjectURL(url);
  },
  import() {
    try {
      const parsed = JSON.parse(importInput.value);
      if (!Array.isArray(parsed)) {
        alert('JSON must be an array of subjects.');
        return;
      }
      setSubjects(parsed);
      importInput.value = '';
    } catch (error) {
      alert('Invalid JSON. Please check and try again.');
    }
  }
};

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    actions[action]?.();
  });
});

renderSubjects();
