const _host = `${process.env.NEXT_PUBLIC_API_SERVER}`;

export const GoogleClientId = `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`;

let headers = {
  "Content-Type": "application/json",
};

const _get = async (url) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      referrerPolicy: "no-referrer",
      headers,
    });
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

const _post = async (url, data) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      referrerPolicy: "no-referrer",
      headers,
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

const _put = async (url, data) => {
  try {
    const res = await fetch(url, {
      method: "PUT",
      referrerPolicy: "no-referrer",
      headers,
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const setHeaderAuthorization = (token) => {
  if (token) {
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }
};

export const getClans = async () => {
  const url = `${_host}/clan`;
  return _get(url);
};

export const getClan = async (id) => {
  const url = `${_host}/clan/${id}`;
  return _get(url);
};

export const getMembers = async (clanId) => {
  const url = `${_host}/clan/${clanId}/member`;
  return _get(url);
};

export const getGames = async (clanId) => {
  const url = `${_host}/clan/${clanId}/game`;
  return _get(url);
};

export const getGame = async (clanId, gameId) => {
  const url = `${_host}/clan/${clanId}/game/${gameId}`;
  return _get(url);
};

export const addMember = async (clanId, data) => {
  const url = `${_host}/clan/${clanId}/member`;
  return _post(url, data);
};

export const createGame = async (clanId, data) => {
  const url = `${_host}/clan/${clanId}/game`;
  return _post(url, data);
};

export const getPlayers = async (clanId, gameId) => {
  const url = `${_host}/clan/${clanId}/game/${gameId}/player`;
  return _get(url);
};

export const addPlayer = async (clanId, gameId, data) => {
  const url = `${_host}/clan/${clanId}/game/${gameId}/player`;
  return _post(url, data);
};

export const gameAction = async (clanId, gameId, data) => {
  const url = `${_host}/clan/${clanId}/game/${gameId}/action`;
  return _put(url, data);
};

export const getLogs = async (clanId, gameId) => {
  const url = `${_host}/clan/${clanId}/game/${gameId}/log`;
  return _get(url);
};

export const loginWithGoogle = async (credential) => {
  const url = `${_host}/auth/google/login`;
  return _post(url, { credential });
};

export const getMe = async () => {
  const url = `${_host}/user/me`;
  return _get(url);
};
