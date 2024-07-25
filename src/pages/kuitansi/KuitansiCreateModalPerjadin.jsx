import { Button, Col, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { dataPerjadin27 } from "../../data/data_tarif_perjadin";
const validation = () => {
  return Yup.object().shape({
    no_pemohon: Yup.string().required("Field tidak boleh kosong"),
    no_sppd: Yup.string().required("Field tidak boleh kosong"),
    keterangan: Yup.string(),
  });
};
const KuitansiCreateModalPerjadin = ({ show, handleClose, append }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validation()),
    defaultValues: {
      no_pemohon: "",
      no_sppd: "",
      keterangan: "",
      // kode_simponi: dataPerjadin.kode_simponi,
      kode_pp: "2024027",
      kode_akun: dataPerjadin27.kd_akun,
      kode_tarif: dataPerjadin27.kd_tarif,
      satuan_volume: dataPerjadin27.satuan,
      tarif: dataPerjadin27.jml_tarif,
      tarif_id: dataPerjadin27.id,
      volume: 1,
    },
  });
  const onSubmit = (values) => {
    append({
      no_pemohon: values?.no_pemohon,
      no_sppd: values?.no_sppd,
      keterangan: values?.keterangan,
      // kode_simponi: dataPerjadin27.kode_simponi,
      kode_pp: "2024027",
      kode_akun: dataPerjadin27.kd_akun,
      kode_tarif: dataPerjadin27.kd_tarif,
      satuan_volume: dataPerjadin27.satuan,
      tarif: dataPerjadin27.jml_tarif,
      tarif_id: dataPerjadin27.id,
      volume: 1,
    });

    handleClose();
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Jasa Perjadin</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mx-2">
          <Col>
            <div className="form-group">
              <label>No Pemohon</label>
              <input
                className="form-control"
                type="text"
                {...register("no_pemohon")}
              />
            </div>
            <div>
              <label>No SPPD</label>
              <input
                className="form-control"
                type="text"
                {...register("no_sppd")}
              />
            </div>
            <div>
              <label>Keterangan</label>
              <textarea
                className="form-control"
                type="text"
                {...register("keterangan")}
              />
            </div>
          </Col>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
export default KuitansiCreateModalPerjadin;
