const axios = require("axios");

require("dotenv").config();

const rapidApi_api_key = process.env.RAPIDAPI_API_KEY;
const estate_contact_api_url = process.env.ESTATE_CONTACT_API_URL;
const estate_host_url = process.env.ESTATE_HOST_URL;

exports.run = async (zpid) => {
  const host_url = estate_host_url;
  const options = {
    method: "GET",
    url: estate_contact_api_url,
    params: { zpid: zpid },
    headers: {
      "X-RapidAPI-Key": rapidApi_api_key,
      "X-RapidAPI-Host": host_url
    }
  };

  try {
    const response = await axios.request(options);
    if (response.status === 200) {
      return response.data;
    } else {
      return "error";
    }
  } catch (error) {
    throw error;
  }
};
