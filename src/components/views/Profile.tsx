import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useLocation } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import { User } from "types";
import { all } from "axios";

const Player = ({ user }: { user: User }) => (
    <div className="player container">
        <div className="player username">{user.username}</div>
        {/* <div className="player name">{user.password}</div> */}
        {user.birthday && <div className="player birthday">birthday: {user.birthday}</div>}
        <div className="player id">id: {user.id}</div>
    </div>
);

Player.propTypes = {
    user: PropTypes.object,
};

//To edit --> get local storage token and compare to profile token.
//If exists then enable editing

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    let data = location.state.user;

    const [user, setUser] = useState(data);
    const [allowEdit, setAllowEdit] = useState(false);
    const [birthday, setBirthday] = useState(user.birthday);

    const doChange = async() => {
        try {
            setBirthday("testBirthday");
            console.log(birthday);
            const requestBody = JSON.stringify({birthday});
            //change this so we have to use token to update
            const response = await api.post("/users/"+ user.id, requestBody);
        }catch (error) {
            alert(
              `Something went wrong: \n${handleError(error)}`
            );
          }
    }

    useEffect(() => {
        async function getUser() {
            try {
                var token = localStorage.getItem("token");

                const response = await api.get("/users/" + user.id + "/" + token);
                setAllowEdit(response.data.id === user.id);
                console.log(allowEdit);
            }
            catch (error) {
                alert(`
            ${handleError(error)}
            `);
            }
        }
        getUser();
    },);

    if (allowEdit) {
        return (
            <BaseContainer className="profile container">
                <Player user={user} />
                <Button width="20%" onClick = {() => doChange()}>Edit Profile</Button>
            </BaseContainer>);
    }
    else {
        return (
            <BaseContainer className="profile container">
                <Player user={user} />
                <Button width="20%" onClick = {() => alert("Editing not allowed!")}>Edit Profile</Button>
            </BaseContainer>);
    }
};

export default Profile;