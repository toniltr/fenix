import { Controller, Get, Header } from '@nestjs/common';

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Fenix API',
    description:
      'Documentación OpenAPI para autenticación, historias y habitaciones.',
    version: '1.0.0',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      RegisterDto: {
        type: 'object',
        required: ['email', 'username', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          username: { type: 'string', minLength: 3 },
          password: {
            type: 'string',
            minLength: 6,
            description: 'Debe contener letras y números.',
          },
        },
      },
      LoginDto: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      CreateStoryDto: {
        type: 'object',
        required: ['name', 'slug'],
        properties: {
          name: { type: 'string', minLength: 3 },
          slug: { type: 'string', minLength: 3 },
          summary: { type: 'string' },
          visibility: {
            type: 'string',
            enum: ['PUBLIC', 'PRIVATE', 'UNLISTED'],
          },
        },
      },
      UpdateStoryDto: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 3 },
          slug: { type: 'string', minLength: 3 },
          summary: { type: 'string' },
          visibility: {
            type: 'string',
            enum: ['PUBLIC', 'PRIVATE', 'UNLISTED'],
          },
          status: {
            type: 'string',
            enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
          },
        },
      },
      CreateRoomDto: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 2 },
          slug: { type: 'string', minLength: 2 },
          description: { type: 'string' },
          orderIndex: { type: 'integer' },
        },
      },
      UpdateRoomDto: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2 },
          slug: { type: 'string', minLength: 2 },
          description: { type: 'string' },
          orderIndex: { type: 'integer' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth' },
    { name: 'Stories' },
    { name: 'Rooms' },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterDto' },
            },
          },
        },
        responses: {
          '201': { description: 'Usuario registrado' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginDto' },
            },
          },
        },
        responses: {
          '201': { description: 'JWT devuelto' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Obtener usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Usuario actual' },
          '401': { description: 'No autorizado' },
        },
      },
    },
    '/stories': {
      get: {
        tags: ['Stories'],
        summary: 'Listar historias',
        responses: {
          '200': { description: 'Lista de historias' },
        },
      },
      post: {
        tags: ['Stories'],
        summary: 'Crear historia',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateStoryDto' },
            },
          },
        },
        responses: {
          '201': { description: 'Historia creada' },
          '401': { description: 'No autorizado' },
        },
      },
    },
    '/stories/{id}': {
      get: {
        tags: ['Stories'],
        summary: 'Obtener historia por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Historia' },
          '404': { description: 'No encontrada' },
        },
      },
      patch: {
        tags: ['Stories'],
        summary: 'Actualizar historia',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateStoryDto' },
            },
          },
        },
        responses: {
          '200': { description: 'Historia actualizada' },
        },
      },
      delete: {
        tags: ['Stories'],
        summary: 'Borrar historia',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Historia eliminada' },
        },
      },
    },
    '/stories/{storyId}/rooms': {
      get: {
        tags: ['Rooms'],
        summary: 'Listar habitaciones por historia',
        parameters: [
          { name: 'storyId', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Habitaciones de la historia' },
        },
      },
      post: {
        tags: ['Rooms'],
        summary: 'Crear habitación en historia',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'storyId', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateRoomDto' },
            },
          },
        },
        responses: {
          '201': { description: 'Habitación creada' },
        },
      },
    },
    '/rooms/{id}': {
      get: {
        tags: ['Rooms'],
        summary: 'Obtener habitación por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Habitación' },
        },
      },
      patch: {
        tags: ['Rooms'],
        summary: 'Actualizar habitación',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateRoomDto' },
            },
          },
        },
        responses: {
          '200': { description: 'Habitación actualizada' },
        },
      },
      delete: {
        tags: ['Rooms'],
        summary: 'Borrar habitación',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Habitación eliminada' },
        },
      },
    },
  },
};

@Controller('api/docs')
export class DocsController {
  @Get()
  @Header('content-type', 'text/html; charset=utf-8')
  renderDocs() {
    return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fenix API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #fafafa; }
      .topbar { display: none; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/api/docs/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis],
      });
    </script>
  </body>
</html>`;
  }

  @Get('openapi.json')
  getOpenApiSpec() {
    return openApiSpec;
  }
}
