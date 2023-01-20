import axios from "axios";

const Index = async (data, route, method) => {
  const s = localStorage.getItem("orgAdmin");
  const token = s
    ? JSON.parse(localStorage.getItem("orgAdmin")).token
    : undefined;
  return await axios({
    url: "https://trendsgcc.ew.r.appspot.com/api/" + route,
    method: method,
    data: data,
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });
};

export default Index;
