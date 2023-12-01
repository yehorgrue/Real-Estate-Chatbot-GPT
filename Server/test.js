const axios = require("axios");

const run = async () => {
  // const options = {
  //   method: "GET",
  //   url: "https://zillow56.p.rapidapi.com/search",
  //   params: {
  //     location: "houston, tx"
  //   },
  //   headers: {
  //     "X-RapidAPI-Key": "a245204456mshbda3b27c7d77b8dp19fb50jsn1dd2eeeef5a0",
  //     "X-RapidAPI-Host": "zillow56.p.rapidapi.com"
  //   }
  // };

  // try {
  //   const response = await axios.request(options);
  //   console.log(response.data);
  // } catch (error) {
  //   console.error(error);
  // }

  const options = {
    method: "GET",
    url: "https://zillow-zestimate.p.rapidapi.com/get-property",
    params: { zpid: "27767775" },
    headers: {
      "X-RapidAPI-Key": "a245204456mshbda3b27c7d77b8dp19fb50jsn1dd2eeeef5a0",
      "X-RapidAPI-Host": "zillow-zestimate.p.rapidapi.com"
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

run();
