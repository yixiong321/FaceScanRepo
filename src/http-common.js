import axios from "axios";

const token = window.localStorage.getItem("access")

export default axios.create({
    baseURL: 'https://cz3002.kado.sg/api',
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    }
})