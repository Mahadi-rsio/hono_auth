import { jwtVerify, createRemoteJWKSet } from 'jose';

const JWKS = createRemoteJWKSet(new URL('http://localhost:8787/api/auth/jwks'));

async function validateToken(token: string) {
    const { payload } = await jwtVerify(token, JWKS, {
        issuer: 'http://localhost:8787', // Auth server
        audience: 'http://localhost:8787'
    });
    console.log(payload);

}



validateToken('eyJhbGciOiJFZERTQSIsImtpZCI6IjE3MTUzNTgwLTgzMDYtNDg4Mi1hZjJkLWFjZjk4OGViMWZjNyJ9.eyJpYXQiOjE3NzA3MzczNDQsIm5hbWUiOiJNYWhhZGkiLCJlbWFpbCI6ImxpeG9AZ21haWwuY29tIiwiZW1haWxWZXJpZmllZCI6ZmFsc2UsImltYWdlIjoiIiwiY3JlYXRlZEF0IjoiMjAyNi0wMi0xMFQxMzo0NDozNi44MDdaIiwidXBkYXRlZEF0IjoiMjAyNi0wMi0xMFQxMzo0NDozNi44MDdaIiwiaWQiOiJZWlZwc0UxdUZiSUwxakRTTjl6N2w0M1FnYWI0ZXFXUSIsInN1YiI6IllaVnBzRTF1RmJJTDFqRFNOOXo3bDQzUWdhYjRlcVdRIiwiZXhwIjoxNzcxMzQyMTQ0LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0Ojg3ODciLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0Ojg3ODcifQ._09F2oHK71Yfkal_whpcrsN4_WAZAurfmnckSgEGjiMaB8M4lEIdzaAszHLx2XMUiKqhNnJGPHY0ujUJCfXjAg')



