const { expect } = require('chai');
const bcrypt = require('bcryptjs');
const request = require('supertest');
const server = require('../server');
const User = require('../models/Usersmodel');
const Doctor = require('../models/Doctorsmodel');

describe('Route endpoints', function () {
  let authToken;
  let adminToken;
  let testUser;
  let adminUser;

  before(async function () {
    await User.deleteMany({ email: { $regex: /^route-test-/ } });
    await Doctor.deleteMany({ firstName: 'RouteTest' });

    const hashedPassword = await bcrypt.hash('secret123', 10);

    testUser = await User.create({
      name: 'Route Test User',
      email: `route-test-${Date.now()}@example.com`,
      password: hashedPassword,
      isAdmin: false,
      isDoctor: false,
    });

    adminUser = await User.create({
      name: 'Route Admin User',
      email: `route-admin-${Date.now()}@example.com`,
      password: hashedPassword,
      isAdmin: true,
      isDoctor: false,
    });

    const userLoginResponse = await request(server)
      .post('/api/user/login')
      .send({ email: testUser.email, password: 'secret123' })
      .expect(200);

    const adminLoginResponse = await request(server)
      .post('/api/user/login')
      .send({ email: adminUser.email, password: 'secret123' })
      .expect(200);

    authToken = userLoginResponse.body.data;
    adminToken = adminLoginResponse.body.data;
  });

  after(async function () {
    await User.deleteMany({ email: { $regex: /^route-test-/ } });
    await Doctor.deleteMany({ firstName: 'RouteTest' });
  });

  it('should register a new user', async function () {
    const uniqueEmail = `route-register-${Date.now()}@example.com`;

    const response = await request(server)
      .post('/api/user/register')
      .send({
        name: 'Route Register User',
        email: uniqueEmail,
        password: 'secret123',
      })
      .expect(200);

    expect(response.body.success).to.equal(true);
    expect(response.body.message).to.equal('User created successfully');

    const createdUser = await User.findOne({ email: uniqueEmail });
    expect(createdUser).to.exist;
  });

  it('should login an existing user', async function () {
    const response = await request(server)
      .post('/api/user/login')
      .send({ email: testUser.email, password: 'secret123' })
      .expect(200);

    expect(response.body.success).to.equal(true);
    expect(response.body.message).to.equal('Login successful');
    expect(response.body.data).to.be.a('string');
  });

  it('should deny a non-admin user access to admin routes', async function () {
    const response = await request(server)
      .get('/api/admin/get-all-doctors')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(403);

    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.equal('Access denied');
  });

  it('should fetch all doctors for an authenticated admin', async function () {
    const response = await request(server)
      .get('/api/admin/get-all-doctors')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.success).to.equal(true);
    expect(response.body.message).to.equal('Doctors fetched successfully');
    expect(response.body.data).to.be.an('array');
  });

  it('should approve a doctor account and update the related user', async function () {
    const doctor = await Doctor.create({
      userId: testUser._id.toString(),
      firstName: 'RouteTest',
      lastName: 'Doctor',
      phoneNumber: '08012345678',
      website: 'https://example.com',
      address: 'Lagos',
      specialization: 'Cardiology',
      experience: '5 years',
      feePerCunsultation: 100,
      timings: ['09:00-17:00'],
      status: 'pending',
    });

    const response = await request(server)
      .post('/api/admin/change-doctor-account-status')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ doctorId: doctor._id.toString(), status: 'approved' })
      .expect(200);

    expect(response.body.success).to.equal(true);
    expect(response.body.message).to.equal('Doctor status updated successfully');

    const updatedDoctor = await Doctor.findById(doctor._id);
    const updatedUser = await User.findById(testUser._id);

    expect(updatedDoctor.status).to.equal('approved');
    expect(updatedUser.isDoctor).to.equal(true);
    expect(updatedUser.unseenNotifications).to.have.lengthOf(1);
  });
});
