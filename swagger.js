const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Doctor Appointment API',
    version: '1.0.0',
    description: 'Swagger documentation for the Doctor Appointment REST API',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'Health', description: 'Health check endpoints' },
    { name: 'Users', description: 'User authentication and profile endpoints' },
    { name: 'Admin', description: 'Admin management endpoints' },
    { name: 'Doctors', description: 'Doctor profile and appointment endpoints' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          password: { type: 'string', example: '123456' },
          isAdmin: { type: 'boolean', example: false },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'john@example.com' },
          password: { type: 'string', example: '123456' },
        },
      },
      DoctorApplicationInput: {
        type: 'object',
        required: ['userId', 'firstName', 'lastName', 'phoneNumber', 'website', 'address', 'specialization', 'experience', 'feePerCunsultation', 'timings'],
        properties: {
          userId: { type: 'string', example: '64f1a2b3c4d5e6f7890abcde' },
          firstName: { type: 'string', example: 'Doctor' },
          lastName: { type: 'string', example: 'One' },
          phoneNumber: { type: 'string', example: '08012345678' },
          website: { type: 'string', example: 'https://doctor1.com' },
          address: { type: 'string', example: 'Lagos, Nigeria' },
          specialization: { type: 'string', example: 'Cardiology' },
          experience: { type: 'string', example: '5 years' },
          feePerCunsultation: { type: 'number', example: 100 },
          timings: { type: 'array', items: { type: 'string' }, example: ['09:00-17:00'] },
        },
      },
      DoctorStatusInput: {
        type: 'object',
        required: ['doctorId', 'status'],
        properties: {
          doctorId: { type: 'string', example: '64f1a2b3c4d5e6f7890abcde' },
          status: { type: 'string', example: 'approved' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Server is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/user/register': {
      post: {
        tags: ['Users'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterInput' },
            },
          },
        },
        responses: {
          200: { description: 'User created successfully' },
          500: { description: 'Server error' },
        },
      },
    },
    '/api/user/login': {
      post: {
        tags: ['Users'],
        summary: 'Login a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          500: { description: 'Server error' },
        },
      },
    },
    '/api/user/apply-doctor-account': {
      post: {
        tags: ['Users'],
        summary: 'Apply for a doctor account',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DoctorApplicationInput' },
            },
          },
        },
        responses: {
          200: { description: 'Doctor account applied successfully' },
          401: { description: 'Unauthorized' },
          500: { description: 'Server error' },
        },
      },
    },
    '/api/admin/get-all-doctors': {
      get: {
        tags: ['Admin'],
        summary: 'Get all doctors',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Doctors fetched successfully' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/admin/get-all-users': {
      get: {
        tags: ['Admin'],
        summary: 'Get all users',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Users fetched successfully' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/admin/change-doctor-account-status': {
      post: {
        tags: ['Admin'],
        summary: 'Approve or reject a doctor account',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DoctorStatusInput' },
            },
          },
        },
        responses: {
          200: { description: 'Doctor status updated successfully' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/doctor/get-doctor-info-by-user-id': {
      post: {
        tags: ['Doctors'],
        summary: 'Get doctor info by authenticated user ID',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Doctor info fetched successfully' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/doctor/change-appointment-status': {
      post: {
        tags: ['Doctors'],
        summary: 'Update appointment status',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Appointment status updated successfully' },
          401: { description: 'Unauthorized' },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
