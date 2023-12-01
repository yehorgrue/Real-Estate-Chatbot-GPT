const axios = require("axios");

require("dotenv").config();

const rapidApi_api_key = process.env.RAPIDAPI_API_KEY;
const homesearch_api_url = process.env.HOMESEARCH_API_RUL;
const homesearch_host_url = process.env.HOMESEARCH_HOST_URL;

exports.run = async (params) => {
  const options = {
    method: "GET",
    url: homesearch_api_url,
    params: params,
    headers: {
      "X-RapidAPI-Key": rapidApi_api_key,
      "X-RapidAPI-Host": homesearch_host_url
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
