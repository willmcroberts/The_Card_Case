import React, { useState } from "react";
import Card from "./Card";
import "./CardData.css";

const API_URL = "https://randomuser.me/api/?results=20&seed=example";

const CardData = () => {
    const [users, setUsers] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [foundUsers, setFoundUsers] = useState([]);
    const [message, setMessage] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            console.log(data);

            if (data.results && data.results.length > 0) {
                setUsers(data.results);
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    };

    const searchUser = async () => {
        const term = searchTerm.trim().toLowerCase();

        if (term === "") {
            setFoundUsers([]);
            setMessage("Please type a name to search for.");
            return;
        }

        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            const matches = data.results.filter((user) => {
                const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
                return fullName.includes(term);
            });

            setFoundUsers(matches);

            if (matches.length === 0) {
                setMessage(`No user found named "${searchTerm}".`);
            } else {
                setMessage("");
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="users">
            <h1>Users</h1>

            {/* Button to fetch the 20 cards */}
            <button onClick={fetchUsers}>Get Users</button>

            {/* Search box and second button */}
            <div className="search">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={searchUser}>Search</button>
            </div>

            {/* Search result, or a "not found" message */}
            {message && <p className="message">{message}</p>}

            {foundUsers.length > 0 && (
                <div>
                    <h2>Search Result</h2>
                    <div className="user-list">
                        {foundUsers.map((user) => (
                            <Card key={user.login.uuid} user={user} />
                        ))}
                    </div>
                </div>
            )}

            {/* All 20 cards */}
            {users.length > 0 && (
                <div>
                    <h2>All Users ({users.length})</h2>
                    <div className="user-list">
                        {users.map((user) => (
                            <Card key={user.login.uuid} user={user} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardData;
