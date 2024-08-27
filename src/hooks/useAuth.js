import { useMutation, useQuery } from "@tanstack/react-query";
import useToaster from "./useToaster";
import axios from "axios";
import api from "../api/api";
import {decode as base64_decode, encode as base64_encode} from 'base-64';
import { isEmpty } from "lodash";
import Cookies from "js-cookie";

export const useLogin = () => {
  const toast = useToaster();
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (json) =>
      // toast(
        axios
          .post(import.meta.env.VITE_BASE_BE_BARANTIN + "/login", json)
          .then((response) => {
            // if(isEmpty(Cookies.get('satpel'))) {
              Cookies.set('satpel', response?.data?.data?.upt)
            // }
            localStorage.setItem("barantinToken", response?.data?.data?.accessToken);
            // localStorage.setItem("cred", btoa(JSON.stringify(json)));
            // localStorage.setItem("user", JSON.stringify(response?.data?.data));
            localStorage.setItem("user", base64_encode("YzJGc2RFbHVhVEl4TXc" + base64_encode(JSON.stringify(response?.data?.data)) + "bXJpZHdhblRhbmduYTIwMDlwdWphaWkwOTA5=="));
            return response.data;
          })
          .catch((error) => {
            return error.response?.data
          })
      //     ,
      //   "Login success",
      //   "Loading..."
      // ),
  });
};
export const useGetMe = () => {
  return useQuery({
    queryKey: ["get-detail-user"],
    queryFn: () => api.get("/auth/me").then((res) => res.data),
    keepPreviousData: true,
  });
};
export const useGetUser = () => {
  const sesi = localStorage.getItem("user")
  let user
  if(!isEmpty(sesi)) {
    const userDecode1 = base64_decode(sesi)
    const useDecode2 = userDecode1.replace("YzJGc2RFbHVhVEl4TXc", "").replace("bXJpZHdhblRhbmduYTIwMDlwdWphaWkwOTA5==","");
    user = JSON.parse(base64_decode(useDecode2))
  } else {
    user = false
  }
  // const user = JSON.parse(localStorage.getItem("user"))
  return user;
};
