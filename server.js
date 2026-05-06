  const path = require('path');
  const Fastify = require('fastify');
  const fastifyStatic = require('@fastify/static');
  const sqlite3 = require('sqlite3');
  const { open } = require('sqlite');

(async () => {
// Инициализация Fastify
const fastify = Fastify({ logger: true });

// Инициализация SQLite
const db = await open({
filename: './db.sqlite',
driver: sqlite3.Database
});
await db.exec( CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE ); );

// Подавать статику (SPA)
fastify.register(fastifyStatic, {
root: path.join(__dirname),
prefix: '/',          // обслуживаем файлы из корня (index.html и app.js)
decorateReply: false
});

// API: список пользователей
fastify.get('/api/users', async () => {
const users = await db.all('SELECT id, name, email FROM users ORDER BY id');
return { users };
});

// API: создание пользователя
fastify.post('/api/users', async (req, reply) => {
const { name, email } = req.body  {};
if (!name  !email) {
reply.code(400).send({ error: 'name and email are required' });
return;
}
try {
const res = await db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
const user = { id: res.lastID, name, email };
reply.code(201).send(user);
} catch (err) {
reply.code(500).send({ error: err.message });
}
});

// SPA fallback: вернуть index.html для любых не-API путей
fastify.setNotFoundHandler((req, reply) => {
if (req.url.startsWith('/api')) {
reply.code(404).send({ error: 'Not found' });
} else {
reply.sendFile('index.html');
}
});

// Запуск сервера
await fastify.listen({ port: 3000, host: '0.0.0.0' });
})().catch(err => {
console.error(err);
process.exit(1);
});
