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


const ProfilePage = ({ user }: { user: User }) => (
    <div className="profilepage container">
        <div className="profilepage username">{user.username}</div>
        <div className={user.status === "ONLINE" ? "profilepage statusOn" : "profilepage statusOff"}>{user.status}</div>
        {user.birthday && <div className="profilepage birthday">Birthday: {user.birthday}</div>}
        <div className="profilepage creationDate">created on: {user.creationDate}</div>
    </div>
)

ProfilePage.propTypes = {
    user: PropTypes.object,
};

//SET classnames for appropriate scss
const FormField = (props) => {
    return (
        <div className="profile field">
            <label className="profile label">{props.label}</label>
            <input
                className="profile input"
                placeholder={props.placeholder !== null ? props.placeholder : "enter here.."}
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                type={props.type}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.type,
};

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    let data = location.state.user;

    const [user, setUser] = useState<User>(data);
    const [allowEdit, setAllowEdit] = useState<Boolean>(false);
    const [isEditing, setIsEditing] = useState<Boolean>(false);
    const [birthday, setBirthday] = useState<Date>(user.birthday);
    const [username, setUsername] = useState<Date>(user.username);

    console.log(user);

    const doChange = async () => {
        try {
            const requestBody = JSON.stringify({ username, birthday });
            const response = await api.put(`/users/${user.id}`, requestBody);
            const userResponse = await api.get(`/users/${user.id}`);
            setUser(userResponse.data);
            setIsEditing(false);
            alert("User Updated!")
        } catch (error) {
            alert(
                `Something went wrong: \n${handleError(error)}`
            );
        }
    }

    async function getUser() {
        try {
            const response = await api.get(`/users/${user.id}`);
            setAllowEdit(response.data.id === user.id);
        }
        catch (error) {
            alert(`
            ${handleError(error)}
            `);
        }
    }
    getUser();

    if (allowEdit) {
        if (isEditing) {
            return (
                <BaseContainer className="profile container"> PROFILE PAGE
                    <div className="profilepage container">
                        <FormField
                            label="change username"
                            value={username}
                            onChange={(un: string) => setUsername(un)} />
                        <FormField
                            label="change birthday"
                            placeholder={new Date(0)}
                            type="date"
                            value={birthday}
                            onChange={(bd: Date) => setBirthday(bd)} />
                    </div>
                    <Button className="profile editbutton" width="20%" onClick={() => doChange()}>Save Changes</Button>
                    <Button width="20%" onClick={() => setIsEditing(false)}>Cancel</Button>
                </BaseContainer>);
        }
        else {
            return (
                <BaseContainer className="profile container"> PROFILE PAGE
                    <ProfilePage user={user} />
                    <Button width="20%" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    <Button width="20%" onClick={() => navigate("/game")}>Back</Button>
                </BaseContainer>);
        }

    }
    else {
        return (
            <BaseContainer className="profile container"> PROFILE PAGE
                <ProfilePage user={user} />
                <Button width="20%" onClick={() => alert("Editing not allowed!")}>Edit Profile</Button>
                <Button width="20%" onClick={() => navigate("/game")}>Back</Button>
            </BaseContainer>);
    }
};

export default Profile;