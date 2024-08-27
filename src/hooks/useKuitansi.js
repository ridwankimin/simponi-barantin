import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../api/api";
import { isEmpty } from "lodash";
import useToaster from "./useToaster";

export const useAddKuitansi = () => {
  // const toast = useToaster();
  return useMutation({
    mutationKey: ["kuitansi"],
    mutationFn: async (json) =>
    json.id ?
    // toast(
        api.put("/kuitansi", json)
        .then((response) => {
          return response.data
        })
        .catch((err) => {
          return err.response.data
        })
        // "Berhasil edit kuitansi",
        // "Loading..."
      // )
       :
       api.post("/kuitansi", json)
        .then((response) => {
          console.log(response)
          return response.data
        })
        .catch((err) => {
          console.log(err)
          return err.response?.data
        })
    // toast(
    //     api.post("/kuitansi", json).then((response) => response.data).catch((err) => err),
    //     "Berhasil simpan kuitansi",
    //     "Loading..."
    //   )
  });
};
export const useGetKuitansiDetil = (id) => {
  return useQuery({
    queryKey: ["detil-kuitansi", id],
    queryFn: () => api.get(`/kuitansi?id=${id}`).then((res) => res.data).catch((err) => err),
    enabled: !isEmpty(id),
    keepPreviousData: false,
  });
};
// export const useGetKuitansiIncrement = (id) => {
//   return useQuery({
//     queryKey: ["kuitansi-increment", id],
//     queryFn: () =>
//       api.get(`/kuitansi/increment/${id}`).then((res) => res.data.data.count),
//     enabled: !isEmpty(id),
//     keepPreviousData: true,
//   });
// };
export const useUpdateKuitansi = (id) => {
  const toast = useToaster();
  return useMutation({
    mutationKey: ["update-kuitansi"],
    mutationFn: (json) =>
      toast(
        api.put(`/kuitansi/${id}`, json).then((response) => response.data).catch((err) => err),
        "Sukses update kuitansi",
        "Loading..."
      ),
  });
};
export const useDeleteKuitansi = () => {
  const toast = useToaster();
  return useMutation({
    mutationKey: ["delete-kuitansi"],
    mutationFn: (json) =>
      toast(
        api.delete("/kuitansi", {data:json, headers:{'Content-Type': 'application/x-www-form-urlencoded'}}).then((res) => res.data).catch((err) => err),
        "Sukses delete kuitansi",
        "Loading..."
      ),
  });
};
export const useGetKuitansiList = ({ params }) => {
  return useQuery({
    queryKey: ["list-kuitansi", Object.values(params)],
    queryFn: () =>
      api.post("/kuitansi/list", params).then((res) => res.data).catch((err) => console.log(err)),
    enabled: !isEmpty(params),
    keepPreviousData: false,
  });
};
export const useGetKuitansiListByPtk = (id) => {
  return useQuery({
    queryKey: ["detail-kuitansi-list", id],
    queryFn: () => api.get(`/kuitansi/list?ptk_id=${id}`).then((res) => res).catch((err) => console.log(err)),
    enabled: !isEmpty(id),
    keepPreviousData: false,
  });
};

export const useUpdateNPWP = () => {
  return useMutation({
    mutationKey: ["npwpBendahara"],
    mutationFn: (json) =>
        api.post("/satker/npwpUpdate", json)
        .then((response) => {
          console.log('response')
          console.log(response)
          return response.data
        })
        .catch((err) => {
          console.log('err')
          console.log(err)
          return (err.response?.data || "Gagal update NPWP")
        })
  });
};

export const useGetNPWP = (upt) => {
  return useQuery({
    queryKey: ["getNpwpBendahara", upt],
    queryFn: () => api.get(`/satker?upt=${upt}`).then((res) => res.data).catch((err) => console.log(err)),
    enabled: !!upt,
    keepPreviousData: false,
  });
  // return useMutation({
  //   mutationKey: ["getNpwpBendahara"],
  //   mutationFn: (json) =>
  //       api.get("/satker?upt=" + json)
  //       .then((response) => {
  //         return response.data
  //       })
  //       .catch((err) => {
  //         return (err.response?.data || "Data NPWP kosong")
  //       })
  // });
};
