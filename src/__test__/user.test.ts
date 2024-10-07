/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import supertest from 'supertest'
import { app } from '..'

describe('User', () => {
    let userToken: any

    afterAll(async () => {
        await supertest(app)
            .delete('/api/v1/user/delete')
            .send({
                email: 'test@123'
            })
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200)
    })
    it('user sign in', async () => {
        const testUser = {
            username: 'test',
            email: 'test@123',
            bio: 'test user',
            role: 'user',
            password: '123456789'
        }
        const response = await supertest(app)
            .post('/api/v1/user/signup')
            .send(testUser)
        const { success, token } = response.body
        expect(success).toBe(true)
        expect(response.status).toBe(201)
        userToken = token
    })
})
