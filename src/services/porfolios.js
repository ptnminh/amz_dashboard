import axios from "axios";
import { isEmpty } from "lodash";
import { hostAPI } from "../constant";
export const portfolioServices = {
  syncPortfolio: async ({ store, prefix }) => {
    try {
      const response = await axios.post(`${hostAPI}/api/portfolios/sync`, {
        store,
        prefix,
      });
      const { data: result } = response;
      return isEmpty(result?.data) ? false : result?.data;
    } catch (error) {
      console.log("Error at syncPortfolio:", error);
      return false;
    }
  },
};
