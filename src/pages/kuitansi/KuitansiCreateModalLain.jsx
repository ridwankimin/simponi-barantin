import { Button, Col, Modal, Row } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import JasaTree from "../JasaTree";
const validation = () => {
  return Yup.object().shape({
    ptk_komoditas_id: Yup.string(),
    tarif_id: Yup.string().required("Field harus diisi"),
    uraian: Yup.string().required("Field harus diisi"),
    volume: Yup.number().required("Field harus diisi"),
    frekuensi: Yup.number().required("Field harus diisi"),
    satuan_volume_id: Yup.number().required("Field harus diisi"),
    total_tarif: Yup.number().required("Field harus diisi"),
    // kode_simponi: Yup.string().required("Field harus diisi"),
    kode_simponi: Yup.string().required("Field harus diisi"),
    is_jasa_fisik: Yup.boolean().required("Field harus diisi"),
    tarif: Yup.number().required("Field harus diisi"),
  });
};

const KuitansiCreateModalLain = ({
  show,
  handleClose,
  append,
  jenisPermohonan,
  jenisKarantina,
  setValue,
  total,
}) => {
  const [selected, setSelected] = useState({});
  let satuans = useMemo(() => selected?.satuan?.split(" ") ?? [], [selected]);
  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
    setValue: setValueLain,
  } = useForm({
    resolver: yupResolver(validation()),
    defaultValues: {
      ptk_komoditas_id: "JASALAIN",
      tarif_id: "",
      uraian: "",
      volume: 0,
      frekuensi: 0,
      satuan_volume_id: 0,
      total_tarif: 0,
      // kode_simponi: "",
      is_jasa_fisik: false,
      tarif: 0,
    },
  });
  const [frekuensi, volume, tarif] = watch(["frekuensi", "volume", "tarif"]);

  const onSubmit = (values) => {
    append(values);
    setValue("total_tarif", values.total_tarif + total);
    handleClose();
  };
  useEffect(() => {
    if (!satuans[3]) {
      setValueLain("frekuensi", 1);
      setValueLain("total_tarif", 1 * parseFloat(tarif) * parseFloat(volume));
    }
  }, [satuans, setValueLain]);
  return (
    <Modal className="modal-lg" show={show} onHide={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("is_jasa_fisik")}
          value={false}
          className="d-none"
        />
        <input
          {...register("ptk_komoditas_id")}
          value={selected?.id}
          className="d-none"
        />
        <Modal.Header closeButton>
          <Modal.Title>Tambah Jasa Lain</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={12}>
              <label>Pilih tarif</label>
              <JasaTree
                jenisKarantina={jenisKarantina}
                jenisPermohonan={jenisPermohonan}
                onSelect={setSelected}
                className="border rounded p-2"
                setValue={setValueLain}
                volume={volume}
                frekuensi={frekuensi}
              />
            </Col>
            <Col sm={12} md={4} className="d-flex flex-column">
              <label>Kode Tarif (id)</label>
              <input disabled className="form-control"
              {...register("tarif_id")}
              // value={selected?.id} 
              />
            </Col>
            <Col sm={12} md={4} className="d-flex flex-column">
              <label>Tarif</label>
              <input
                {...register("tarif")}
                // value={selected?.tarif}
                disabled
                className="form-control"
              />
            </Col>
            <Col sm={12} md={4} className="d-flex flex-column">
              <label>Satuan</label>
              <input
                className="form-control"
                disabled
                {...register("satuan_volume")}
              />
            </Col>

            <Col sm={12} className="d-none">
              <input
                disabled
                className="form-control"
                {...register("kode_simponi")}
              />
            </Col>
            <Col sm={4} className="d-none">
              <input
                disabled
                className="form-control"
                {...register("uraian")}
              />
            </Col>
            <Col sm={8} md={4} className="d-flex flex-column">
              <label>Volume</label>
              <input
                {...register("volume")}
                className="form-control"
                placeholder="Volume"
                onChange={(e) => {
                  setValueLain("volume", e.target.value);
                  setValueLain(
                    "total_tarif",
                    parseFloat(e.target.value) * parseFloat(frekuensi) * parseFloat(tarif)
                  );
                }}
              />
            </Col>
            <Col sm={4} md={2}>
              <label></label>
              <input
                disabled
                className="form-control"
                placeholder="Volume"
                value={satuans[1] ?? ""}
              />
            </Col>
            {satuans[3] && (
              <>
                <Col sm={8} md={4} className="d-flex flex-column">
                  <label>Frekuensi</label>
                  <input
                    {...register("frekuensi")}
                    className="form-control"
                    type="number"
                    onChange={(e) => {
                      setValueLain("frekuensi", e.target.value);
                      setValueLain(
                        "total_tarif",
                        parseFloat(e.target.value) * parseFloat(tarif) * parseFloat(volume)
                      );
                    }}
                  />
                </Col>
                <Col sm={4} md={2}>
                  <label></label>
                  <input
                    disabled
                    className="form-control"
                    placeholder="Frekuensi"
                    value={satuans[3]}
                  />
                </Col>
              </>
            )}
            <Col sm={12} md={4}>
              <label htmlFor="total_tarif">Total Tarif</label>
              <input
                disabled
                readOnly
                className="form-control"
                {...register("total_tarif")}
                type="number"
                id="total_tarif"
              />
            </Col>
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
export default KuitansiCreateModalLain;
