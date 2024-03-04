import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useLocation, Form } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import { User } from "types";
import { all } from "axios";


const ProfilePage = ({ user }: { user: User }, props) => (
    <div className="profilepage container">
        <div className="profilepage username">{user.username}</div>
        <div className={user.status === "ONLINE" ? "profilepage statusOn" : "profilepage statusOff"}>{user.status}</div>
        <div className="profilepage birthday">Birthday: {user.birthday = user.birthday !== null ? user.birthday : "N/A"}</div>
        <div className="profilepage creationDate">created on: {user.creationDate}</div>
    </div>
)

ProfilePage.propTypes = {
    user: PropTypes.object,
};

const FormField = (props) => {
    return (
        <div className="login field">
            <label className="login label">{props.label}</label>
            <input
                className="login input"
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

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    let data = location.state.user;

    const [user, setUser] = useState<User>(data);
    const [allowEdit, setAllowEdit] = useState<Boolean>(false);
    const [isEditing, setIsEditing] = useState<Boolean>(false);
    const [birthday, setBirthday] = useState<String>(user.birthday);
    const [username, setUsername] = useState<String>(user.username);

    const doChange = async () => {
        try {
            const requestBody = JSON.stringify({ username, birthday });
            var token = localStorage.getItem("token");
            const response = await api.put("/users/" + user.id + "/" + token, requestBody);
            setIsEditing(false);
        } catch (error) {
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
                // setUser(response.data); //THIS CAUSES HAVOK
                setAllowEdit(response.data.id === user.id);
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
        if (isEditing) {
            return (
                <BaseContainer className="profile container"> PROFILE PAGE
                    <div className="profile edit container">
                        <FormField
                        label = "change username"
                        value = {username}
                        onChange = {(un: string) => setUsername(un)}/>
                        <FormField
                        label = "change birthday"
                        value = {birthday}
                        onChange = {(bd: string) => setBirthday(bd)}/>
                    </div>
                    
                    <Button width="20%" onClick={() => doChange()}>Save Changes</Button>
                    <Button width="20%" onClick={() => setIsEditing(false)}>Cancel</Button>
                </BaseContainer>);
        }
        else {
            return (
                <BaseContainer className="profile container"> PROFILE PAGE
                    <ProfilePage user={user} />
                    <Button width="20%" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </BaseContainer>);
        }

    }
    else {
        return (
            <BaseContainer className="profile container"> PROFILE PAGE
                <ProfilePage user={user} />
                <Button width="20%" onClick={() => alert("Editing not allowed!")}>Edit Profile</Button>
            </BaseContainer>);
    }
};

export default Profile;