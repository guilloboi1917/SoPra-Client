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
    <div className="register field">
      <label className="register label">{props.label}</label>
      <input
        className="register input"
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
};

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, name });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);

      alert(
        `${username} successfully registrated! Navigating to login page...`
      )

      setTimeout(() => {
        navigate("/login")
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
            label="Name"
            value={name}
            onChange={(n) => setName(n)}
          />
          {/*Create button to switch to registration form*/}
          <div className="switch login-register">
            <Button
              width="100%"
              onClick={() => doSwitch()}
            >
              Switch
            </Button>
          </div>
          <div className="register button-container">
            <Button
              disabled={!username || !name}
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