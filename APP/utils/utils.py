from cryptography.fernet import Fernet
import json


# secret = Fernet.generate_key()
secret = b'3qt4bNzP4sfhYhWbt87s8IMaX5Slc0BOCZTrwj7MFck='
chipher = Fernet(secret)
import base64




   
def encrypt_data(username,email):
    # print(username,email)
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
    
    # Print the decrypted data (which is the original JSON string)
    return decrypted_data


