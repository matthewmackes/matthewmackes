async function fetchJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Request failed');
  }
  return response.json();
}

function applyProfile(profile) {
  const nameEl = document.querySelector('[data-profile-name]');
  const headlineEl = document.querySelector('[data-profile-headline]');
  const summaryEl = document.querySelector('[data-profile-summary]');
  const focusEl = document.querySelector('[data-profile-focus]');
  const nowEl = document.querySelector('[data-profile-now]');
  const missionEl = document.querySelector('[data-profile-mission]');
  const skillsEl = document.querySelector('[data-profile-skills]');
  const mentionsEl = document.querySelector('[data-profile-mentions]');
  const roadmapEl = document.querySelector('[data-profile-roadmap]');
  const contactEl = document.querySelector('[data-profile-contact]');

  if (nameEl && profile.name) nameEl.textContent = profile.name;
  if (headlineEl && profile.headline) headlineEl.textContent = profile.headline;
  if (summaryEl && profile.summary) summaryEl.textContent = profile.summary;
  if (nowEl && profile.now) nowEl.textContent = profile.now;
  if (missionEl && profile.mission) missionEl.textContent = profile.mission;
  if (contactEl && profile.contact) contactEl.textContent = profile.contact;

  if (focusEl && Array.isArray(profile.focus)) {
    focusEl.innerHTML = profile.focus.map((item) => `<span class="badge">${item}</span>`).join('');
  }

  if (skillsEl && Array.isArray(profile.skills)) {
    skillsEl.innerHTML = profile.skills.map((item) => `<span class="keyword-chip">${item}</span>`).join('');
  }

  if (mentionsEl && Array.isArray(profile.mentions)) {
    mentionsEl.innerHTML = profile.mentions.map((item) => `<li>${item}</li>`).join('');
  }

  if (roadmapEl && Array.isArray(profile.roadmap)) {
    roadmapEl.innerHTML = profile.roadmap.map((item) => `<li>${item}</li>`).join('');
  }
}

function applyGithubStats(stats) {
  const starsEl = document.querySelector('[data-stars]');
  const forksEl = document.querySelector('[data-forks]');
  const issuesEl = document.querySelector('[data-issues]');
  const updatedEl = document.querySelector('[data-updated]');

  if (starsEl) starsEl.textContent = stats.stargazers_count ?? '—';
  if (forksEl) forksEl.textContent = stats.forks_count ?? '—';
  if (issuesEl) issuesEl.textContent = stats.open_issues_count ?? '—';
  if (updatedEl && stats.updated_at) {
    updatedEl.textContent = new Date(stats.updated_at).toLocaleDateString('en-US');
  }
}

async function loadProfile() {
  try {
    const profile = await fetchJson('data/profile.json');
    applyProfile(profile);
  } catch (error) {
    // keep defaults
  }
}

async function loadGithubStats() {
  try {
    const stats = await fetchJson('data/github_stats.json');
    applyGithubStats(stats);
  } catch (error) {
    try {
      const response = await fetch('https://api.github.com/repos/matthewmackes/map2-audio');
      const stats = await response.json();
      applyGithubStats(stats);
    } catch (fallbackError) {
      // ignore
    }
  }
}

loadProfile();
loadGithubStats();
