import requests
d = requests.get('http://localhost:4040/api/tunnels').json()
for t in d['tunnels']:
    if t['proto'] == 'https':
        url = t['public_url'] + '/webhook/whatsapp'
        print(url)
        with open('WEBHOOK_URL.txt', 'w') as f:
            f.write(url)
        print("\nSaved to WEBHOOK_URL.txt")
