from cryptography.fernet import Fernet
import json
import os 
import environ
import base64

env = environ.Env()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# Retrieve the secret as a string and convert to bytes
secret_str = env('SECRET')
secret = secret_str.encode('utf-8')  # Convert the string to bytes

chipher = Fernet(secret)
   
def encrypt_data(username,email):
    data = {
        "username": username,
        "email": email
    }

    
    data_str = json.dumps(data)
  
    encrypted_data = chipher.encrypt(data_str.encode())  # Encode string to bytes before encryption
    encoded_encrypted_data = base64.urlsafe_b64encode(encrypted_data).decode('utf-8')  # Convert to string
    
    return encoded_encrypted_data

def decrypt_data(data):
    # First decode the base64-encoded encrypted data
    decoded_encrypted_data = base64.urlsafe_b64decode(data)
    
    # Decrypt the data using the Fernet cipher
    decrypted_data = chipher.decrypt(decoded_encrypted_data).decode()
    
    # Convert the decrypted string (likely JSON) back into a dictionary
    decrypted_json = json.loads(decrypted_data)
    
    return decrypted_json  # Return the decrypted data as a dictionary



