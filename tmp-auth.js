const request = require('supertest');
const server = require('./server');
const User = require('./models/Usersmodel');
const bcrypt = require('bcryptjs');

(async () => {
  const email = `tmp-auth-${Date.now()}@example.com`;
  const password = 'secret123';
  await User.create({ name: 'Tmp Auth', email, password: await bcrypt.hash(password, 10), isAdmin: false, isDoctor: false });

  const loginResponse = await request(server).post('/api/user/login').send({ email, password }).expect(200);
  console.log('login body', loginResponse.body);

  const response = await request(server)
    .get('/api/admin/get-all-doctors')
    .set('Authorization', `Bearer ${loginResponse.body.data}`)
    .expect(401);

  console.log('admin response body', response.body);
})();
