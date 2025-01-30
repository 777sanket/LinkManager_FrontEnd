// const URL = "http://localhost:3000/api";
const URL = "https://linkmanager-backend-60mk.onrender.com/api";

export const getUser = () => {
  return fetch(`${URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};

export const register = (data) => {
  return fetch(`${URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const login = (data) => {
  return fetch(`${URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const logout = () => {
  return fetch(`${URL}/user/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const editUser = (data) => {
  return fetch(`${URL}/user/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
};

export const deleteUser = () => {
  return fetch(`${URL}/user/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
