import * as Yup from "yup";
export const kuitansiCreateValidation = (isEdit = false) => {
  return Yup.object().shape({
    id: isEdit
      ? Yup.string().required("Field tidak boleh kosong")
      : Yup.string(),
    ptk_id: Yup.string().required("Field harus diisi"),
    upt_id: Yup.string().required("Field harus diisi"),
    // nomor: Yup.string().required("Field harus diisi"),
    tanggal: Yup.string().required("Field harus diisi"),
    nomor_seri: Yup.string().required("Field harus diisi"),
    nama_wajib_bayar: Yup.string().required("Field harus diisi"),
    jenis_identitas: Yup.string().required("Field harus diisi"),
    identitas_id: Yup.string().required("Field harus diisi"),
    tipe_bayar: Yup.string().required("Pilih salah satu"),
    mp: Yup.string(),
    jumlah_mp: Yup.string(),
    sesuai_dok: Yup.string().required("Field harus diisi"),
    nomor_dokumen: Yup.string().required("Field harus diisi"),
    tgl_dokumen: Yup.string().required("Field harus diisi"),
    status_bayar: Yup.string().required("Pilih salah satu"),
    jenis_karantina: Yup.string().required("Field harus diisi"),
    is_perjadin: Yup.boolean().required("Field harus diisi"),
    total_tarif: Yup.number().required("Field harus diisi"),
    total_perjadin: Yup.number(),
    // jasa_fisik: Yup.array().min(1)
    // jasa_fisik: Yup.array()
    //   .of(
    //     Yup.object({
    //       // ptk_komoditas_id: Yup.string().required("Field harus diisi"),
    //       tarif_id: Yup.string().required("Field harus diisi"),
    //       uraian: Yup.string().required("Field harus diisi"),
    //       volume: Yup.number().required("Field harus diisi"),
    //       frekuensi: Yup.number().required("Field harus diisi"),
    //       satuan_volume: Yup.string().required("Field harus diisi"),
    //       total_tarif: Yup.number().required("Field harus diisi"),
    //       // kode_simponi: Yup.string().required("Field harus diisi"),
    //       kode_simponi: Yup.string().required("Field harus diisi"),
    //       is_jasa_fisik: Yup.boolean().required("Field harus diisi"),
    //       kode_pp: Yup.string().required("Pilih tarif"),
    //       kode_akun: Yup.string().required("Pilih tarif"),
    //     })
    //   )
    //   .required("Jasa fisik tidak boleh kosong"),
    // jasa_lain: Yup.array().of(
    //   Yup.object({
    //     ptk_komoditas_id: Yup.string(),
    //     tarif_id: Yup.string().required("Field harus diisi"),
    //     uraian: Yup.string().required("Field harus diisi"),
    //     volume: Yup.number().required("Field harus diisi"),
    //     frekuensi: Yup.number().required("Field harus diisi"),
    //     satuan_volume: Yup.string().required("Field harus diisi"),
    //     total_tarif: Yup.number().required("Field harus diisi"),
    //     // kode_simponi: Yup.string().required("Field harus diisi"),
    //     kode_simponi: Yup.string().required("Field harus diisi"),
    //     is_jasa_fisik: Yup.boolean().required("Field harus diisi"),
    //     kode_pp: Yup.string().required("Pilih tarif"),
    //     kode_akun: Yup.string().required("Pilih tarif"),
    //   })
    // ).required("Jasa lain tidak boleh kosong"),
    // perjadin_detil: Yup.array().of(
    //   Yup.object({
    //     tarif_id: Yup.string().required("Field harus diisi"),
    //     // kode_simponi: Yup.string().required("Field harus diisi"),
    //     no_sppd: Yup.string().required("Field harus diisi"),
    //     keterangan: Yup.string().required("Field harus diisi"),
    //     no_pemohon: Yup.string().required("Field harus diisi"),
    //     kode_pp: Yup.string().required("Field harus diisi"),
    //     kode_akun: Yup.string().required("Field harus diisi"),
    //     kode_tarif: Yup.string().required("Field harus diisi"),
    //     satuan_volume: Yup.string().required("Field harus diisi"),
    //     tarif: Yup.number().required("Field harus diisi"),
    //     volume: Yup.number().required("Field harus diisi"),
    //   })
    // ),
  });
};
