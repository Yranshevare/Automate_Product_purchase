import {SignJWT,jwtVerify} from 'jose';

const secret_str = import.meta.env.VITE_ROUTING_SECRETE
const secret = new TextEncoder().encode(secret_str);


export async function encryptData(data){
    return new SignJWT(data)
        .setProtectedHeader({ alg: 'HS256' }) // Optional: header specifying algorithm
        .sign(secret);
}
export async function decryptData(data){
    try {
        const { payload } = await jwtVerify(data, secret);
        return payload;
    } catch (error) {
        console.error('Invalid token', error);
        throw error;
    }
}






