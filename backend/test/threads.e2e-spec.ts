/**
 * Integration tests for threads (with login)
 *
 * beforeAll (once for the whole file)
 *   ↓ start the real app with the real database
 *   ↓ register and log in a test user → access token
 *   ↓ get a category id
 *
 * Tests run in order and build on each other:
 *   health → create without token (401) → create (201) → empty title (400)
 *   → read (200) → unknown id (404) → delete (204)
 *
 * afterAll
 *   ↓ delete the test user from the database
 *   ↓ close the app
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { describe, beforeAll, afterAll, expect, it } from 'vitest';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { User } from '../src/users/entities/user.entity.js';

describe('Threads (integration)', () => {
  let app: INestApplication;
  let accessToken: string;
  let categoryId: string;
  let createdThreadId: string;

  // A new email for every run, so the test never collides with an existing account
  const testUserEmail = `integration.test.${Date.now()}@example.com`;
  const testUserPassword = 'a-long-integration-test-password';

  beforeAll(async () => {
    // Start the real app (all modules, guards, real database)
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    configureApp(app);
    await app.init();

    // Register and log in a test user to get a token
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Integration Test',
      email: testUserEmail,
      password: testUserPassword,
      professionalField: 'teacher',
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUserEmail, password: testUserPassword });
    accessToken = loginResponse.body.accessToken;

    // Every new thread needs a category, so take the first one from the seeded list
    const categoriesResponse = await request(app.getHttpServer()).get(
      '/categories',
    );
    categoryId = categoriesResponse.body[0].id;
  });

  afterAll(async () => {
    // Clean up: remove the test user (its threads were already deleted in the last test)
    const dataSource = app.get(DataSource);
    await dataSource.getRepository(User).delete({ email: testUserEmail });

    await app.close();
  });

  it('GET /health returns status ok', async () => {
    const healthResponse = await request(app.getHttpServer()).get('/health');

    expect(healthResponse.status).toBe(200);
    expect(healthResponse.body).toEqual({ status: 'ok' });
  });

  it('POST /threads without a token returns 401', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/threads')
      .send({
        title: 'No token',
        content: 'Should fail.',
        categoryId: categoryId,
      });

    expect(createResponse.status).toBe(401);
  });

  it('POST /threads creates a thread', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/threads')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Integration test thread',
        content: 'Created by the integration test.',
        categoryId: categoryId,
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.id).toBeDefined();

    createdThreadId = createResponse.body.id;
  });

  it('POST /threads rejects an empty title', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/threads')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: '', content: 'Empty title.', categoryId: categoryId });

    expect(createResponse.status).toBe(400);
  });

  it('GET /threads/:id returns the created thread', async () => {
    const readResponse = await request(app.getHttpServer()).get(
      `/threads/${createdThreadId}`,
    );

    expect(readResponse.status).toBe(200);
    expect(readResponse.body.title).toBe('Integration test thread');
  });

  it('GET /threads/:id returns 404 for an unknown id', async () => {
    const readResponse = await request(app.getHttpServer()).get(
      '/threads/00000000-0000-4000-8000-000000000000',
    );

    expect(readResponse.status).toBe(404);
  });

  it('DELETE /threads/:id deletes the thread', async () => {
    const deleteResponse = await request(app.getHttpServer())
      .delete(`/threads/${createdThreadId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(deleteResponse.status).toBe(204);
  });
});
