import { React, useEffect } from "react";
import Header from "./components/views/Header";
import AppRouter from "./components/routing/routers/AppRouter";
import { api, handleError } from "helpers/api";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 * Updated by Marco Leder
 */
const App = () => {

  const doLogout = async () => {
    await api.put(`/users/${localStorage.getItem("id")}/logout`);
    localStorage.clear();
    console.log("logged out");
  }

  useEffect(() => {
    const handleTabClose = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = true;
      doLogout();
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  return (
    <div>
      <Header height="100" />
      <AppRouter />
    </div>
  );
};

export default App;
