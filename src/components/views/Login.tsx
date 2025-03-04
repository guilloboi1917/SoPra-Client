import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        id = {props.id}
        type={props.type}
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  id: PropTypes.string,
};

const doSwitchPasswordVisibility = () => {
  let x = document.getElementById("password") as HTMLInputElement;
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

const Login = () => {
  //remove any token residual
  if (localStorage.getItem("token")) {
    localStorage.removeItem("token");
  }
  if (localStorage.getItem("id")) {
    localStorage.removeItem("id");
  }
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const authenticateResponse = await api.post("/users/authenticate/", requestBody);
      // Get the returned user and update a new object.
      const user = new User(authenticateResponse.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);

      //Store user data
      localStorage.setItem("id", user.id);

      //Now we also set the global authorization header
      api.defaults.headers.common["Authorization"] = localStorage.getItem("token");

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/game");
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };

  //Create switch functionality to switch to registration form
  const doSwitch = () => {
    try {
      navigate("/register");
    }
    catch (error) {
      alert(
        `Could not switch to registration form: \n${handleError(error)}`
      );
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            type="password"
            id = "password"
            onChange={(n) => setPassword(n)}
          />
          <div className="passwordvisibility">
            <input type="checkbox" name="show password" value="false" onClick={() => doSwitchPasswordVisibility()} />
            <label htmlFor="show password">Show Password</label>
          </div>
          {/*Create button to switch to registration form*/}
          <div className="login button-container">
            <Button
              width="100%"
              onClick={() => doSwitch()}
            >
              Switch to Registration
            </Button>
          </div>
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
