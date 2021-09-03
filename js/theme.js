function initTheme() {
  const themeToggle = document.getElementById('theme');

  themeToggle.addEventListener('change', evt => {
    const isDark = evt.target.checked;
    setTheme(isDark);
    localStorage.setItem('isDarkTheme', isDark);
  });

  const isDark = localStorage.getItem('isDarkTheme');
  setTheme(isDark);
  themeToggle.checked = isDark;

  function setTheme(isDark) {
    document.body.classList.remove('light-theme');
    document.body.classList.remove('dark-theme');

    document.body.classList.add(isDark ? 'dark-theme' : 'light-theme');
  }
}

initTheme();
