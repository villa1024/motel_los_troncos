let token

function authHeader() {
    const obj = JSON.parse(localStorage.getItem("authUser"))

    if (obj) {
        return { 'app-token': obj.token }
    } else {
        document.location.href = "/";
    }
}

const base_url = process.env.REACT_APP_API_URL || 'http://localhost:4000/'

export async function get(url, headers = {}) {
    return fetch(base_url + url, {
        method: 'GET',
        headers: { ...authHeader(), ...headers },
    }).then(res => res.json())
}

export async function post(url, data, headers = {}) {
    return fetch(base_url + url, {
        method: 'POST',
        headers: { ...authHeader(), ...headers },
        body: JSON.stringify(data)
    }).then(res => res.json())
}

export async function put(url, data, headers = {}) {
    return fetch(base_url + url, {
        method: 'PUT',
        headers: { ...authHeader(), ...headers },
        body: JSON.stringify(data)
    }).then(res => res.json())
}

export async function del(url, data, headers = {}) {
    return fetch(base_url + url, {
        method: 'DELETE',
        headers: { ...authHeader(), ...headers },
        body: JSON.stringify(data)
    }).then(res => res.json())
}
