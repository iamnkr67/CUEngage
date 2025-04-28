import axios from "axios";

const fetchData = async () => {
  const token = localStorage.getItem("authToken");

  if (token) {
    try {
      const response = await axios.get(
        "https://cuengage.onrender.com/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching protected data:", error);
    }
  }
};

export default fetchData;
