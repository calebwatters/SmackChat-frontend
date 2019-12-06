const token = localStorage.getItem("jwt");

export function fetchJson(url, { method, headers, body } = {}) {
  return fetchResponse(url, {
    method,
    headers: {
      ...headers,
      Accept: "application/json",
      Authorization: "Bearer " + token
    },
    body
  }).then(response => (response.status === 204 ? null : response.json()));
}

export function fetchResponse(url, { method, headers, body } = {}) {
  const request = new window.Request(url, {
    body: body,
    headers: headers || {},
    method: method || "GET"
  });
  if (body != null) {
    request.headers.set("Content-Type", "application/json");
  }
  request.headers.append("X-Requested-With", "XMLHttpRequest");

  return Promise.resolve(window.fetch(request)).then(response => response);
}
