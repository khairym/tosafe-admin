export const parseId = () => {
  const token = localStorage.getItem("orgAdmin")
    ? JSON.parse(localStorage.getItem("orgAdmin")).token
    : undefined;
  console.log(token);
  if (!token) return <p>You are not authorized </p>;
  const decodedToken = JSON.parse(atob(token.split(".")[1]));

  return decodedToken["https://hasura.io/jwt/claims"]["x-hasura-org-id"];
};

export const getDate = (isoDate) => {
  const locale = localStorage.getItem('lang') == 'ar'  ? 'ar-EG' : 'en-EG';
  let date = new Date(isoDate).toLocaleString(locale);
  return date;
};

export const buildCurrentUrlSearchWithThisParams = (
  key,
  value,
  querySearch
) => {
  let queryParams = new URLSearchParams(querySearch);
  if (queryParams.has(key)) {
    queryParams.set(key, value);
  } else {
    queryParams.append(key, value);
  }

  if (key !== "limit" && key !== "pg" && queryParams.has("pg"))
    queryParams.set("pg", 1);
  return `?${queryParams.toString()}`;
};

export const getQueryParam = (type, key, querySearch) => {
  let queryParams = new URLSearchParams(querySearch);

  if (type === "number") {
    if (parseInt(queryParams.get(key), 10) > 0) {
      return parseInt(queryParams.get(key));
    } else return undefined;
  } else if (type === "boolean") {
    return queryParams.get(key) ? queryParams.get(key) == "true" : undefined;
  } else return queryParams.get(key);
};

export const removeQueryParam = (key, querySearch) => {
  let queryParams = new URLSearchParams(querySearch);
  queryParams.delete(key);
  return `?${queryParams.toString()}`;
};
export const navigateToLocation = (currentLocation, navigateTo, history) => {
  debugger;
  if (currentLocation == navigateTo) return;
  history.push(navigateTo);
};

export const buildVariable = ({ querySearch, filtersKeys }) => {
  let page = getQueryParam("number", "pg", querySearch) || 1,
    limit = getQueryParam("number", "limit", querySearch) || 10;

  let filter = {};

  if (filtersKeys)
    for (const key in filtersKeys) {
      if (Object.hasOwnProperty.call(filtersKeys, key)) {
        const type = filtersKeys[key];
        const value = getQueryParam(type, key, querySearch);
        if (value || value === false) filter[key] = { _eq: value };
      }
    }

  console.log(filter);

  const offset = (page - 1) * limit;

  let vars = { offset: offset < 0 ? 0 : offset };

  if (filter) vars.filter = filter;

  vars.limit = limit;

  return vars;
};
