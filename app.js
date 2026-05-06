  (function(){
  const root = document.getElementById('app');

  function navigate(path) {
  history.pushState(null, '', path);
  router();
  }

  window.addEventListener('popstate', router);

  // Роуты клиента
  const routes = {
  '/': renderHome,
  '/create': renderCreate
  };

  async function fetchUsers() {
  const res = await fetch('/api/users');
  const data = await res.json();
  return data.users || [];
  }

  async function renderHome() {
  const users = await fetchUsers();
  root.innerHTML =  <h1>Пользователи</h1> <table> <thead><tr><th>ID</th><th>Name</th><th>Email</th></tr></thead> <tbody>${users.map(u => <tr><td>${u.id}</td><td>${u.name}</td><td>${u.email}</td></tr>).join('')}</tbody> </table> ;
  }

  function renderCreate() {
  root.innerHTML =  <h1>Создать пользователя</h1> <form id="user-form"> <label>Имя: <input name="name" required /></label> <label>Email: <input name="email" type="email" required /></label> <button type="submit">Создать</button> </form> <p><a href="/" data-link>К списку</a></p> ;

  document.getElementById('user-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = {
  name: fd.get('name'),
  email: fd.get('email')
  };
  const res = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
  });
  if (res.ok) {
  navigate('/');
  } else {
  const err = await res.json();
  alert('Ошибка: ' + (err.error || 'неизвестная'));
  }
  });
  }

  // Локальный обработчик ссылок SPA
  document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-link]');
  if (a) {
  e.preventDefault();
  navigate(a.getAttribute('href'));
  }
  });

  function router() {
  const path = window.location.pathname;
  if (routes[path]) routespath;
  else routes'/';
  }

  router();
  })();

