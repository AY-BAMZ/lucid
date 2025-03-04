import axios from "axios";

export const getAutoComplete = async ({}) => {
  const response = await axios.get(
    "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete"
  );
  return response;
};
