reimport request from 'supertest';
import { app } from '../index';
import { AppDataSource } from '../database.config';
import { Order } from '../models/Order';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('Order Routes', () => {
  test('GET /orders - should return all orders', async () => {
    const response = await request(app).get('/orders');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /orders - should create a new order', async () => {
    const newOrder = {
      userId: 'test-user',
      total: 100,
      status: 'pending'
    };
    
    const response = await request(app)
      .post('/orders')
      .send(newOrder);
      
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.userId).toBe(newOrder.userId);
  });
});