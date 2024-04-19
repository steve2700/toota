import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

export const getAccessToken = () => {
	return localStorage.getItem('access_token');
};



export const getUser = async () => {
	const token = getAccessToken(); // Corrected variable declaration
	console.log(token);
	const config = { headers: { Authorization: `Bearer ${token}` } };

	try {
		const decodedToken = jwtDecode(token); // Decode the JWT token
		const user_id = decodedToken["user_id"];
		const response = await axios.get(`http://localhost:8000/api/user/profile/${user_id}/`, config);
		const userData = response.data 

		
		return userData
	} catch(err) {
		console.error(err);
	}
};
