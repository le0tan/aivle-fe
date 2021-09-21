import Cookie from "js-cookie";

export const cleanAuthStorage = () => {
  Cookie.remove("loggedIn");
  sessionStorage.removeItem("user_id");
  sessionStorage.removeItem("token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("token");
}
