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
    # print(data)
    encoded_encrypted_data = jwt.encode(data, secret_str, algorithm='HS256')
    return encoded_encrypted_data






def decrypt_data(data):
    try:
        # print(data)
        decoded_payload = jwt.decode(data, secret_str, algorithms=['HS256'])
        # print("✅ Decoded Payload:", decoded_payload)  # Debugging
        return decoded_payload
    except jwt.ExpiredSignatureError:
        print("❌ Error: Token has expired")
    except jwt.InvalidTokenError as e:
        print("❌ Error: Invalid token",e)



secret = secret_str.encode('utf-8')  # Convert the string to bytes

chipher = Fernet(secret)

def encode_id(data):
    data_str = json.dumps(data)
    encrypted_data = chipher.encrypt(data_str.encode())  # Encode string to bytes before encryption
    encoded_encrypted_data = base64.urlsafe_b64encode(encrypted_data).decode('utf-8')  # Convert to string
    return encoded_encrypted_data

def decode_id(data):
    decoded_encrypted_data = base64.urlsafe_b64decode(data)
    # print(decoded_encrypted_data)
    decrypted_data = chipher.decrypt(decoded_encrypted_data).decode()
   
    decrypted_json = json.loads(decrypted_data)
    
    return decrypted_json 




