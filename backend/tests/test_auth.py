from fastapi.testclient import TestClient


def test_register_and_me(client: TestClient):
    mutation = {
        "query": "mutation Register($email:String!, $password:String!, $name:String) { register(email:$email, password:$password, name:$name) { user { id email name } } }",
        "variables": {"email": "demo@example.com", "password": "demo", "name": "Demo"},
    }

    response = client.post("/graphql", json=mutation)
    assert response.status_code == 200
    payload = response.json()
    assert payload["data"]["register"]["user"]["email"] == "demo@example.com"

    me_query = {"query": "query { me { id email } }"}
    me_response = client.post("/graphql", json=me_query, cookies=response.cookies)
    assert me_response.status_code == 200
    assert me_response.json()["data"]["me"]["email"] == "demo@example.com"


def test_login_sets_cookies(client: TestClient):
    register_payload = {
        "query": "mutation { register(email: \"user@example.com\", password: \"demo\") { user { id } } }",
    }
    client.post("/graphql", json=register_payload)

    login_payload = {
        "query": "mutation { login(email: \"user@example.com\", password: \"demo\") { user { id } } }",
    }
    response = client.post("/graphql", json=login_payload)
    assert response.status_code == 200
    set_cookie = response.headers.get("set-cookie")
    assert set_cookie is not None
