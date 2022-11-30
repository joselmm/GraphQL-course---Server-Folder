const fetch = require("node-fetch");
const url = "https://zj9ks4-3000.csb.app";
async function getCollection(endpoint) {
  return await fetch(url + endpoint)
    .then((res) => res.json())
    .then((res) => res);
}

async function getById(endpoint, id) {
  return await fetch(`${url}${endpoint}/${id}`, {})
    .then((res) => res.json())
    .then((res) => res);
}

async function addToCollection(endpoint, body) {
  return await fetch(`${url}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((res) => res);
}

async function deleteById(endpoint, id) {
  return await fetch(`${url}${endpoint}/${id}`, {
    method: "DELETE",
  });
}

async function updateById(endpoint, id, body) {
  return await fetch(`${url}${endpoint}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

module.exports = {
  getCollection,
  getById,
  addToCollection,
  deleteById,
  updateById,
};
