// ...existing code...
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'data.sqlite');

if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '');
const db = new Database(DB_FILE, { verbose: console.log });

// Run migrations
const initSqlPath = path.join(__dirname, 'migrations', 'init.sql');
if (fs.existsSync(initSqlPath)) {
  const sql = fs.readFileSync(initSqlPath, 'utf8');
  db.exec(sql);
} else {
  console.warn('migrations/init.sql not found.');
}

// util: parse boolean ints and JSON arrays
function normalizePet(row) {
  if (!row) return row;
  const mapBool = ['necessidades','em_par','multiplos','urgente','vacinado','castrado','primary_img'];
  mapBool.forEach(k => { if (k in row) row[k] = row[k] ? true : false; });
  if (row.caracteristicas) {
    try { row.caracteristicas = JSON.parse(row.caracteristicas); } catch(e){ row.caracteristicas = []; }
  } else row.caracteristicas = [];
  return row;
}

/* PETS */
app.get('/api/animals', (req, res) => {
  const q = (req.query.q || '').trim();
  let rows;
  if (q) {
    const like = `%${q}%`;
    rows = db.prepare(`SELECT * FROM pets WHERE
      nome LIKE @like OR tipo LIKE @like OR localizacao LIKE @like OR categoria LIKE @like
      ORDER BY datetime(created_at) DESC`).all({ like });
  } else {
    rows = db.prepare('SELECT * FROM pets ORDER BY datetime(created_at) DESC').all();
  }
  res.json(rows.map(normalizePet));
});

app.get('/api/animals/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM pets WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(normalizePet(row));
});

app.post('/api/animals', (req, res) => {
  const p = req.body || {};
  const caracteristicas = Array.isArray(p.caracteristicas) ? JSON.stringify(p.caracteristicas) : JSON.stringify([]);
  const stmt = db.prepare(`INSERT INTO pets
    (nome,categoria,tipo,idade,genero,tamanho,localizacao,imagem,descricao,caracteristicas,
     necessidades,em_par,multiplos,urgente,vacinado,castrado,created_at)
    VALUES (@nome,@categoria,@tipo,@idade,@genero,@tamanho,@localizacao,@imagem,@descricao,@caracteristicas,
      @necessidades,@em_par,@multiplos,@urgente,@vacinado,@castrado,datetime('now'))`);
  const info = stmt.run({
    nome: p.nome || '',
    categoria: p.categoria || '',
    tipo: p.tipo || '',
    idade: p.idade || '',
    genero: p.genero || '',
    tamanho: p.tamanho || 'todos',
    localizacao: p.local || p.localizacao || '',
    imagem: p.imagem || '',
    descricao: p.descricao || '',
    caracteristicas,
    necessidades: p.necessidades ? 1 : 0,
    em_par: p.emPar ? 1 : 0,
    multiplos: p.multiplos ? 1 : 0,
    urgente: p.urgente ? 1 : 0,
    vacinado: p.vacinado ? 1 : 0,
    castrado: p.castrado ? 1 : 0
  });
  const newPet = db.prepare('SELECT * FROM pets WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(normalizePet(newPet));
});

app.put('/api/animals/:id', (req, res) => {
  const p = req.body || {};
  const caracteristicas = Array.isArray(p.caracteristicas) ? JSON.stringify(p.caracteristicas) : JSON.stringify([]);
  const stmt = db.prepare(`UPDATE pets SET
    nome=@nome,categoria=@categoria,tipo=@tipo,idade=@idade,genero=@genero,tamanho=@tamanho,
    localizacao=@localizacao,imagem=@imagem,descricao=@descricao,caracteristicas=@caracteristicas,
    necessidades=@necessidades,em_par=@em_par,multiplos=@multiplos,urgente=@urgente,
    vacinado=@vacinado,castrado=@castrado,updated_at=datetime('now')
    WHERE id=@id`);
  stmt.run({
    id: req.params.id,
    nome: p.nome || '',
    categoria: p.categoria || '',
    tipo: p.tipo || '',
    idade: p.idade || '',
    genero: p.genero || '',
    tamanho: p.tamanho || 'todos',
    localizacao: p.local || p.localizacao || '',
    imagem: p.imagem || '',
    descricao: p.descricao || '',
    caracteristicas,
    necessidades: p.necessidades ? 1 : 0,
    em_par: p.emPar ? 1 : 0,
    multiplos: p.multiplos ? 1 : 0,
    urgente: p.urgente ? 1 : 0,
    vacinado: p.vacinado ? 1 : 0,
    castrado: p.castrado ? 1 : 0
  });
  const updated = db.prepare('SELECT * FROM pets WHERE id = ?').get(req.params.id);
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(normalizePet(updated));
});

app.delete('/api/animals/:id', (req, res) => {
  db.prepare('DELETE FROM pets WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

/* IMAGES */
app.get('/api/animals/:id/images', (req, res) => {
  const rows = db.prepare('SELECT * FROM images WHERE pet_id = ?').all(req.params.id);
  res.json(rows);
});
app.post('/api/animals/:id/images', (req, res) => {
  const url = req.body.url;
  if (!url) return res.status(400).json({ error: 'url required' });
  const info = db.prepare('INSERT INTO images (pet_id,url,primary_img) VALUES (?,?,?)').run(req.params.id, url, req.body.primary ? 1 : 0);
  res.status(201).json({ id: info.lastInsertRowid, url });
});

/* USERS */
app.get('/api/users', (req, res) => {
  const rows = db.prepare('SELECT id,username,email,role,created_at FROM users').all();
  res.json(rows);
});
app.post('/api/users', (req, res) => {
  const { username, email, password_hash, role } = req.body;
  const info = db.prepare('INSERT INTO users (username,email,password_hash,role,created_at) VALUES (?,?,?,?,datetime("now"))').run(username, email, password_hash || null, role || 'user');
  const u = db.prepare('SELECT id,username,email,role,created_at FROM users WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(u);
});

/* ADOPTIONS */
app.post('/api/adoptions', (req, res) => {
  const p = req.body || {};
  const info = db.prepare('INSERT INTO adoptions (pet_id,user_id,nome_interessado,email,telefone,status,notas,created_at) VALUES (?,?,?,?,?,?,?,datetime("now"))')
    .run(p.pet_id || null, p.user_id || null, p.nome_interessado || '', p.email || '', p.telefone || '', p.status || 'pending', p.notas || '');
  const a = db.prepare('SELECT * FROM adoptions WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(a);
});
app.get('/api/adoptions', (req, res) => {
  const rows = db.prepare('SELECT * FROM adoptions ORDER BY datetime(created_at) DESC').all();
  res.json(rows);
});

/* MESSAGES */
app.post('/api/messages', (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;
  const info = db.prepare('INSERT INTO messages (nome,email,assunto,mensagem,created_at) VALUES (?,?,?,?,datetime("now"))').run(nome || '', email || '', assunto || '', mensagem || '');
  const m = db.prepare('SELECT * FROM messages WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(m);
});
app.get('/api/messages', (req, res) => {
  const rows = db.prepare('SELECT * FROM messages ORDER BY datetime(created_at) DESC').all();
  res.json(rows);
});

/* Serve static frontend (adjust folder name if needed) */
app.use('/', express.static(path.join(__dirname))); // serve a pasta atual

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SQLite server running on http://localhost:${PORT}`));
// ...existing code...