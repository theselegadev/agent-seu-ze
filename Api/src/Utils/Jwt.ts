import jwt from 'jsonwebtoken';

export class Jwt{
    static generateToken(payload: {name: string,idBarber: number}, secret: string): string {
        return jwt.sign(payload, secret, { expiresIn: '60d' });
    }
    static verifyToken(token: string, secret: string): {name: string, idBarber: number} | null {
        try {
            return jwt.verify(token, secret) as {name: string, idBarber: number};
        } catch (err) {
            console.error("Token verification failed", err);
            return null;
        } 
    }
}