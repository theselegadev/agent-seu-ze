import jwt from 'jsonwebtoken';

export class Jwt{
    static generateToken(payload: object, secret: string): string {
        return jwt.sign(payload, secret, { expiresIn: '60d' });
    }
    static verifyToken(token: string, secret: string): object | null {
        try {
            return jwt.verify(token, secret) as object;
        } catch (err) {
            console.error("Token verification failed", err);
            return null;
        } 
    }
}