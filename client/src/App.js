import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { Message } from "semantic-ui-react";
import login from "./services/login";
import signup from "./services/signup";
import HomePage from "./components/HomePage";
import AddForm from "./components/AddForm";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import ContactPage from "./components/ContactPage";
import EditForm from "./components/EditForm";
import "./styles/App.css";

function App() {
	// state hooks
	const [user, setUser] = useState(null);
	// MOCK CONTACTS~!!!!!!!!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	const [contacts, setContacts] = useState([
		{
			name: "Larry Hobbs",
			number: "666-666-8888"
		},
		{
			name: "Larry HobbitSon",
			number: "666-666-6567"
		},
		{
			name: "Larry BraggardlyHurtleFart",
			number: "666-666-1117"
		},
		{
			name: "Harry Lobbs",
			number: "666-33-6667"
		},
		{
			name: "Harrison Ford",
			number: "366-666-6667"
		},
		{
			name: "Bingo friend #1 or #2 idr, I have alheimerz",
			number: "666-666-6647"
		},
		{
			name: "Bingo Speaker",
			number: "666-666-7653"
		}
	]);
	const [shownContacts, setShownContacts] = useState([]);
	const [search, setSearch] = useState("");
	const [error, setError] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(true);
	const [contact, setContact] = useState({});

	// checks if user has existing token in localStorage and signs user in if so
	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 1000);

		const loggedUserJSON = window.localStorage.getItem("contactAppUser");

		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
		}
	}, []);

	// sets shown contacts when search changes
	useEffect(() => {
		setShownContacts(
			contacts.filter((contact) =>
				contact.name.toUpperCase().includes(search.toUpperCase())
			)
		);
	}, [search]);

	// gets user response from given data and sets current user or sets error message
	const handleLogin = async (event) => {
		event.preventDefault();

		if (hasIncompleteInput(email, password)) {
			return;
		}

		try {
			const user = await login({ email, password });

			// saves new user to localStorage
			window.localStorage.setItem("contactAppUser", JSON.stringify(user));

			setUser(user);
			setEmail("");
			setPassword("");
		} catch (exception) {
			setError("Incorrect login credentials, please try again!");
			setTimeout(() => {
				setError("");
			}, 3000);
		}
	};

	// sends new user info to server and sets current user or sets error message
	const handleSignup = async (event) => {
		event.preventDefault();

		if (hasIncompleteInput(email, password)) {
			return;
		}

		// sends new user info to server and sets current user or sets error message
		try {
			const newUser = await signup({ email, password });

			// saves new user to localStorage
			window.localStorage.setItem("contactAppUser", JSON.stringify(newUser));

			setUser(newUser);
			setEmail("");
			setPassword("");
		} catch (exception) {
			setError("Could not sign you up, please try again.");
			setTimeout(() => {
				setError("");
			}, 3000);
		}
	};

	const handleLogout = () => {
		window.localStorage.removeItem("contactAppUser");
		setUser(null);
	};

	function hasIncompleteInput(email, password) {
		if (email === "" || password === "") {
			setError("Please enter a username and password");
			setTimeout(() => setError(""), 5000);
			return true;
		}

		return false;
	}

	// renders error message if there is an error message
	const renderError = error !== "" && <Message negative>{error}</Message>;

	return (
		<div className="App">
			{user !== null ? <p>{user.email} logged in!</p> : ""}

			{/* redirects user to login page if they are not signed in */}
			{/* {user === null ? <Redirect to="/" /> : ""} */}

			<Route exact path="/" render={() => <HomePage />} />
			<Route
				path="/login"
				render={(props) => (
					<LoginForm
						email={email}
						password={password}
						handleSubmit={handleLogin}
						setEmail={({ target }) => setEmail(target.value)}
						setPassword={({ target }) => setPassword(target.value)}
					>
						{renderError}
					</LoginForm>
				)}
			/>
			<Route
				path="/signup"
				render={(props) => (
					<SignUpForm
						email={email}
						password={password}
						handleSubmit={handleSignup}
						setEmail={({ target }) => setEmail(target.value)}
						setPassword={({ target }) => setPassword(target.value)}
					>
						{renderError}
					</SignUpForm>
				)}
			/>
			<Route
				exact
				path="/contacts"
				render={(props) => (
					<ContactPage
						search={search}
						setSearch={({ target }) => setSearch(target.value)}
						contacts={shownContacts}
						loading={loading}
					/>
				)}
			/>
			<Route exact path="/contacts/add" render={() => <AddForm />} />
			<Route
				exact
				path="/contacts/:id"
				render={(props) => <h1>This will show a specific contact</h1>}
			/>
			<Route
				exact
				path="/contacts/:id/edit"
				render={(props) => <EditForm />}
			/>
		</div>
	);
}

export default App;
