import { Button, Col, Modal, Row } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";

import * as Yup from "yup";
import QuarantineTree from "../QuarantineTree";
import ReactSelect from "react-select";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputWrapper from "../../components/InputWrapper";
import { Label } from "reactstrap";
// import { InputWrapper } from "../components/InputWrapper";

const KuitansiCreateModalFisik = ({
  show,
  handleClose,
  append,
  ptkFisik = [],
  jenisPermohonan,
  jenisKarantina,
  setValue,
  total,
  mp,
  jumlahMp,
}) => {
  const options = ptkFisik?.map((item) => ({
    value: item?.id,
    label: item?.nama_komoditas,
    volume_lain: item?.volume_lain,
    data: item,
  }));

  const fisikValidation = () => {
    return Yup.object().shape({
      ptk_komoditas_id: (jenisKarantina == "I" ? false : Yup.string().required("Field harus diisi")),
      tarif_id: Yup.string().required("Field harus diisi"),
      uraian: Yup.string().required("Field harus diisi"),
      volume: Yup.number().required("Field harus diisi"),
      frekuensi: Yup.number().required("Field harus diisi"),
      satuan_volume: Yup.string().required("Field harus diisi"),
      total_tarif: Yup.number().required("Field harus diisi"),
      kode_simponi: Yup.string().required("Pilih tarif kd"),
      // kode_tarif: Yup.string().required("Pilih tarif"),
      is_jasa_fisik: Yup.boolean().required("Field harus diisi"),
      tarif: Yup.number().required("Field harus diisi"),
      kode_pp: Yup.string().required("Pilih tarif pp"),
      kode_akun: Yup.string().required("Pilih tarif akun"),
    });
  };

  const [selectedPtk, setSelectedPtk] = useState({});
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    setValue: setValueFisik,
    watch,
  } = useForm({
    resolver: yupResolver(fisikValidation()),
    defaultValues: {
      ptk_komoditas_id: "",
      tarif_id: "",
      uraian: "",
      volume: 1,
      frekuensi: 1,
      satuan_volume: "",
      total_tarif: 0,
      kode_simponi: "",
      is_jasa_fisik: true,
      tarif: 0,
      // kode_tarif: "",
      kode_pp: "2024027",
      kode_akun: "",
    },
  });
  let [volume, tarif] = watch(["volume", "total_tarif"]);

  const konversiTarif = (satTarif, satPtk, volume) => {
    let volbalikan
    if (satTarif == 'per ton') {
      if (satPtk == 1356) {
        volbalikan = parseFloat(volume) / 1000
      } else if (satPtk == 1008) {
        volbalikan = parseFloat(volume) / 1000000
      } else {
        volbalikan = parseFloat(volume)
      }
    } else if (satTarif == 'per kilogram') {
      if (satPtk == '2046') {
        volbalikan = parseFloat(volume) * 1000
      } else if (satPtk == '1008') {
        volbalikan = parseFloat(volume) / 1000
      } else {
        volbalikan = parseFloat(volume)
      }
    } else if (satTarif == 'per gram') {
      if (satPtk == '2046') {
        volbalikan = parseFloat(volume) * 1000000
      } else if (satPtk == '1356') {
        volbalikan = parseFloat(volume) * 1000
      } else {
        volbalikan = parseFloat(volume)
      }
    } else {
      volbalikan = volume
    }
    return parseFloat(volbalikan)
  }

  const onSubmit = (values) => {
    append(values);
    setValue("total_tarif", values.total_tarif + total);
    // setValue("mp", mp + " " + values.uraian);
    setValue("jumlah_mp", jumlahMp + " " + values.volume + " " + values.uraian + ";");
    handleClose();
  };
  return (
    <Modal className="modal-lg" show={show} onHide={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input className="d-none" {...register("frekuensi", { value: 1 })} />
        <input
          className="d-none"
          {...register("is_jasa_fisik", { value: true })}
        />
        <Modal.Header closeButton>
          <Modal.Title>Tambah Jasa {jenisKarantina == "I" ? "Tindakan Karantina" : "Fisik"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={12} className="mb-1" style={{display: (jenisKarantina == "I" ? "none" : "block")}}>
              <InputWrapper
                error={!!errors?.ptk_komoditas_id}
                message={errors?.ptk_komoditas_id?.message}
              >
                <Controller
                  name="ptk_komoditas_id"
                  control={control}
                  render={({ field: { onChange, ...field } }) => (
                    <ReactSelect
                      menuPosition="fixed"
                      {...field}
                      options={options}
                      onChange={(e) => {
                        if (e.value) {
                          onChange(e.value);
                          setSelectedPtk(e);
                          setValueFisik("ptk_komoditas_id", e.value);
                          setValueFisik("volume", konversiTarif((watch('satuan_volume') || ""), e.satuan_lain_id, e.volume_lain));
                          setValueFisik("volumePtk", e.volume_lain);
                          setValueFisik("satuanPtk", e.data.sat_lain);
                          setValueFisik("total_tarif", jenisKarantina == "I" ? tarif : parseFloat(e.volume_lain) * parseFloat(tarif));
                        }
                      }}
                      value={selectedPtk}
                    />
                  )}
                />
              </InputWrapper>
            </Col>
            <Col sm={12} className="mb-1">
              <label>Pilih tarif</label>
              <InputWrapper
                error={!!errors?.kode_simponi}
                message={errors?.kode_simponi?.message}
              >
                <QuarantineTree
                  jenisKarantina={jenisKarantina}
                  jenisPermohonan={jenisPermohonan}
                  className="border rounded p-2"
                  setValue={setValueFisik}
                  volume={volume}
                  konversiTarif={konversiTarif}
                  selectedPtk={selectedPtk}
                />
                {console.log('tarif')}
                {console.log(watch('tarif'))}
                {console.log('volume')}
                {console.log(watch('volume'))}
                {console.log('total_tarif')}
                {console.log(watch('total_tarif'))}
              </InputWrapper>
            </Col>
            <Col sm={12} md={12} className="mb-1 row">
              <Col sm={3} md={3}>
                <Label>Volume PTK Online</Label>
                <input
                  disabled
                  readOnly
                  className="form-control"
                  {...register("volumePtk")}
                />
              </Col>
              <Col sm={3} md={3}>
                <Label>Satuan PTK Online</Label>
                <input
                  disabled
                  readOnly
                  className="form-control"
                  {...register("satuanPtk")}
                />
              </Col>
            </Col>
            <hr />
            <Col sm={12} md={3} className="mb-1">
              <Label>Kode Tarif (id)</Label>
              <input
                disabled
                readOnly
                className="form-control"
                {...register("tarif_id")}
              />
            </Col>
            <Col sm={12} md={3} className="mb-1">
              <Label>Tarif</Label>
              <input disabled className="form-control" {...register("tarif")} />
            </Col>
            <Col sm={12} md={3} className="mb-1">
              <Label>Satuan</Label>
              <input
                disabled
                className="form-control"
                {...register("satuan_volume")}
              />
            </Col>
            <Col sm={12} md={3} className="mb-1" style={{ display: (jenisKarantina == "I" ? "none" : "block")}}>
              <Label>Volume</Label>
              <input
                className="form-control"
                {...register("volume")}
              />
            </Col>
            <Col sm={12} md={3} className="d-none">
              <input className="form-control" {...register("kode_simponi")} />
            </Col>
            <Col sm={12} md={3} className="d-none">
              <input className="form-control" {...register("uraian")} />
            </Col>
            <small className="text-danger">*Konversi volume hanya berdasarkan satuan TON, Kilogram, dan Gram</small>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
export default KuitansiCreateModalFisik;
