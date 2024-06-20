import axios from "axios";
import { hostAPI } from "../constant";
import { isEmpty } from "lodash";

export const campaignServices = {
  createCamps: async (data) => {
    try {
      const response = await axios.post(`${hostAPI}/api/campaigns/v2/create`, {
        data,
      });
      const { data: result } = response;
      return isEmpty(result?.data) ? false : result?.data;
    } catch (error) {
      console.log("Error at syncPortfolio:", error);
      return false;
    }
  },
};
