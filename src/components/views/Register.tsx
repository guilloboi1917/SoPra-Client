import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

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

const Register = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users", requestBody);

      const authenticateResponse = await api.post("/users/authenticate/", requestBody);

      // Get the returned user and update a new object.
      const user = new User(authenticateResponse.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);
      //Store user data
      localStorage.setItem("id", user.id);
      //Now we also set the global authorization header
      api.defaults.headers.common["Authorization"] = localStorage.getItem("token");

      alert(
        `${username} successfully registrated! Navigating to login page...`
      )

      setTimeout(() => {
        navigate("/game")
      }, 1000);

      //Navigate to login page
    } catch (error) {
      alert(
        `Something went wrong during the registration: \n${handleError(error)}`
      );

    }
  };

  //Create switch functionality to switch to registration form
  const doSwitch = () => {
    try {
      navigate("/login");
    }
    catch (error) {
      alert(
        `Could not switch to login form: \n${handleError(error)}`
      );
    }
  };

  return (
    <BaseContainer>
      <div className="register container">
        <div className="register form">
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
          <div className="password visibility">
            <input type="checkbox" name="show password" value="false" onClick={() => doSwitchPasswordVisibility()} />
            <label htmlFor="show password">Show Password</label>
          </div>
          {/*Create button to switch to registration form*/}
          <div className="register button-container">
            <Button
              width="100%"
              onClick={() => doSwitch()}
            >
              Switch to Login
            </Button>
          </div>
          <div className="register button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doRegister()}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Register;