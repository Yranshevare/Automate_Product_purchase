from cryptography.fernet import Fernet
import json
import os 
import environ
import base64
import jwt

env = environ.Env()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# Retrieve the secret as a string and convert to bytes
secret_str = env('SECRET')


def encrypt_data(data):
    print(data)
    encoded_encrypted_data = jwt.encode(data, secret_str, algorithm='HS256')
    return encoded_encrypted_data






def decrypt_data(data):
    try:
        print(data)
        decoded_payload = jwt.decode(data, secret_str, algorithms=['HS256'])
        print("✅ Decoded Payload:", decoded_payload)  # Debugging
        return decoded_payload
    except jwt.ExpiredSignatureError:
        print("❌ Error: Token has expired")
    except jwt.InvalidTokenError as e:
        print("❌ Error: Invalid token",e)



