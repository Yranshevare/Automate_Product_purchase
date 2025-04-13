# 📩 RFQ Automation System
This project automates the **Request for Quotation (RFQ)** process using email automation. It streamlines communication between vendors and buyers, reducing manual effort and increasing efficiency.

 ### Features
- 🔄 Automated RFQ requests via email

- 📨 Email automation using Django SMTP with Gmail

- 📁 File storage using Cloudinary (e.g., attachments or product images)

- 🖥️ Frontend built with React

- 🐍 Backend built with Django (REST API)

- 🗃️ Data stored in MySQL database

### 🛠️ Tech Stack
| Layer | Technology| 
|----------|----------|
| Frontend    | React     |
| Backend    | Django (REST API)  |
| Database    | MySQL  |
| File Storage    | Cloudinary  |
| Email Service    | 	Django SMTP with Gmail  |

### 📧 Email Automation
- RFQ emails are sent using Django's built-in SMTP functionality.

- Gmail is used as the service provider (make sure to enable App Passwords for secure login).

- Emails can include file attachments from Cloudinary (e.g., product images or documents).

### ☁️ Cloudinary Integration
Files (images, PDFs, etc.) are uploaded to Cloudinary and their URLs are stored in the database, allowing quick access and sharing in emails.