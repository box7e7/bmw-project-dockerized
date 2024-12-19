import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os

# Set up the SMTP server and login credentials
smtp_server = "smtp.gmail.com"
smtp_port = 587  # Use 465 for SSL
email_address = "mehdi2neggazi@gmail.com"
password = "iiggynwdlkcaiibm"

# Get the current working directory
current_directory = os.getcwd()

# Path to the directory you want to scan
folder_path = f'{current_directory}/scripts/tmp'  # Replace with your folder path

# List to hold file names
file_names = []

# Loop through each file in the directory
for file in os.listdir(folder_path):
    full_path = os.path.join(folder_path, file)
    if os.path.isfile(full_path):
        file_names.append(file)

# Print file names found
print({"file_names":file_names})

# Create a multipart message
msg = MIMEMultipart()
msg['From'] = email_address
msg['To'] = ", ".join(["mehdi1neggazi@gmail.com", "f.fekair@hotmail.com"])  # List of recipients
msg['Subject'] = f'{len(file_names)} invoices'

# Email body
body = f"Attached {len(file_names)} PDF invoices."
msg.attach(MIMEText(body, 'plain'))

# Attach each file to the email
for file_name in file_names:
    with open(f'{folder_path}/{file_name}', "rb") as attachment:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f"attachment; filename= {file_name}")
        msg.attach(part)

# Start the server and send the email
try:
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(email_address, password)
    text = msg.as_string()
    server.sendmail(email_address, msg['To'].split(", "), text)  # Send to each recipient
    server.quit()
    print({"status":"Email sent successfully!"})
except Exception as e:
    print({"error":str(e)})
