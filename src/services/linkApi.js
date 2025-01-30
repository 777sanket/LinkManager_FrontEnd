// const URL = "http://localhost:3000/api";
const URL = "https://linkmanager-backend-60mk.onrender.com/api";

export const createLink = (data) => {
  return fetch(`${URL}/links/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
};

// export const getLinks = () => {
//   return fetch(`${URL}/links`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `${localStorage.getItem("token")}`,
//     },
//   });
// };

export const getLinks = ({
  page = 1,
  limit = 10,
  sortBy = "dateCreated",
  order = "desc",
  statusSort,
  search = "",
} = {}) => {
  const params = new URLSearchParams({
    page,
    limit,
    sortBy,
    order,
    ...(statusSort && { statusSort }), // Only include statusSort if it is provided
    ...(search && { search }), // Only include search if it is provided
  });

  return fetch(`${URL}/links?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};

export const editLink = (id, data) => {
  return fetch(`${URL}/links/edit/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
};

export const deleteLink = (id) => {
  const URL = "http://localhost:3000/api";
  return fetch(`${URL}/links/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
