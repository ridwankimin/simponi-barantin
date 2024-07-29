import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Nav,
  Row,
  Table,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useDisclosure from "../../hooks/useDisclosure";
import { Label } from "reactstrap";
import ReactDatePicker from "react-datepicker";
import dayjs from "dayjs";
import SEO from "../../components/SEO";
import { useGetSertifikatPelepasDetail, useGetSertifikatPelepasanPtk } from "../../hooks/usePelepasan";
import ReactSelect from "react-select";
import { useCallback, useEffect, useState } from "react";
import { formOptionsKH, formOptionsKI, formOptionsKT, getReactSelectValue } from "../../data/constant";
import {
  useAddKuitansi,
} from "../../hooks/useKuitansi";
import {
  useReqBilling,
} from "../../hooks/useReqBill";
import KuitansiCreateModalFisik from "./KuitansiCreateModalFisik";
import KuitansiCreateModalLain from "./KuitansiCreateModalLain";
import KuitansiCreateModalPerjadin from "./KuitansiCreateModalPerjadin";
import { convertToWords, toRupiah } from "to-rupiah";
import { kuitansiCreateValidation } from "../../validations/kuitansiCreate";
import InputWrapper from "../../components/InputWrapper";
import { useGetUser } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const KuitansiCreate = () => {
  //state
  let [selectedDate, setSelectedDate] = useState("");
  let [selectedPaymentDate, setSelectedPaymentDate] = useState("");
  let [dataBilling, setDataBilling] = useState(false);
  let [isPerjadin, setIsPerjadin] = useState(false);
  const user = useGetUser();
  const { onClose, onOpen, isOpen } = useDisclosure();
  const {
    onClose: onClose2,
    onOpen: onOpen2,
    isOpen: isOpen2,
  } = useDisclosure();
  const {
    onClose: onClose3,
    onOpen: onOpen3,
    isOpen: isOpen3,
  } = useDisclosure();
  //navigate, param, end point, useform
  const navigate = useNavigate();
  const { idData } = useParams();
  const id = idData?.split("_")[1]
  const jenisKarantina = idData?.split("_")[0]
  const { data: response, isSuccess, refetch } = useGetSertifikatPelepasDetail(id);
  const { data: { ptk = {}, ptk_komoditi = [] } = {} } = response ?? {};
  const { mutateAsync, isPending } = useAddKuitansi();
  const { mutateAsync: billing, isPending: isPendingBill } = useReqBilling();
  // const { data: increment } = useGetKuitansiIncrement(id);
  let [formOptionsData, setformOptionsData] = useState([]);
  // let [dataDokumenCantolan, setDataDokumenCantolan] = useState({
  //   nomor: "",
  //   tanggal: ""
  // });
  console.log(ptk)
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(kuitansiCreateValidation()),
    defaultValues: {
      created_at: "",
      id: "",
      user_id: user?.uid ?? "",
      tgl_aju: "",
      nomor_ptk: "",
      ptk_id: "",
      upt_id: "",
      kode_satpel: "",
      nomor: "",
      tanggal: "",
      nomor_seri: "",
      nama_wajib_bayar: "",
      jenis_identitas: "",
      identitas_id: "",
      mp: "",
      jumlah_mp: "",
      sesuai_dok: "",
      nomor_dokumen: "",
      tgl_dokumen: "",
      status_bayar: "",
      is_perjadin: false,
      total_perjadin: 0,
      jasa_fisik: [],
      jasa_lain: [],
      perjadin_detil: [],
      total_tarif: 0,
      jenis_karantina: "",
    },
  });
  // console.log(errors);;
  const {
    fields: fisikFields,
    append: fisikAppend,
    remove: fisikRemove,
  } = useFieldArray({ name: "jasa_fisik", control: control });

  const {
    fields: lainFields,
    append: lainAppend,
    remove: lainRemove,
  } = useFieldArray({ name: "jasa_lain", control: control });
  const {
    fields: perjadinFields,
    append: perjadinAppend,
    remove: perjadinRemove,
  } = useFieldArray({ name: "perjadin_detil", control: control });

  const renderTableContentFisik = () => {
    return fisikFields.map((item, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          {/* <td>
            <input disabled type="text" value={item.kode_tarif} />
          </td> */}
          <td>
            <input disabled type="text" value={item?.kode_simponi} />
          </td>
          <td>
            <input disabled type="text" value={item?.uraian} />
          </td>
          <td>
            <input disabled type="text" value={item?.tarif} />
          </td>
          <td>
            <span
              className="btn btn-danger btn-sm"
              onClick={() => {
                setValue("total_tarif", total - item?.total_tarif);
                fisikRemove(index);
              }}
            >
              <i className="ri-delete-bin-line"></i>
            </span>
          </td>
        </tr>
      );
    });
  };
  const renderTableContentLain = () => {
    return lainFields.map((item, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>
          <input disabled type="text" value={item?.kode_simponi} />
        </td>
        {/* <td>
          <input disabled type="text" value={item.kode_simponi} />
        </td> */}
        <td>
          <input disabled type="text" value={item?.uraian} />
        </td>
        <td>
          <input disabled type="text" value={item?.tarif} />
        </td>
        <td>
          <span
            className="btn btn-danger btn-sm"
            onClick={() => {
              setValue("total_tarif", total - item?.total_tarif);
              lainRemove(index);
            }}
          >
            <i className="ri-delete-bin-line"></i>
          </span>
        </td>
      </tr>
    ));
  };
  const renderTableContentPerjadin = () => {
    return perjadinFields.map((item, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>
          <input disabled type="text" value={item?.no_pemohon} />
        </td>
        <td>
          <input disabled type="text" value={item?.no_sppd} />
        </td>
        <td>
          <input disabled type="text" value={item?.keterangan} />
        </td>
        <td>
          <span
            className="btn btn-danger btn-sm"
            onClick={() => perjadinRemove(index)}
          >
            <i className="ri-delete-bin-line"></i>
          </span>
        </td>
      </tr>
    ));
  };

  const createBilling = async (idKuitansi) => {
    const dataJson = {
      id: [idKuitansi],
      kode_upt: watch()?.upt_id?.slice(0,2),
      user: user?.uid,
      // kode_upt: user?.upt?.slice(0,2),
      // kode_upt: user?.upt?.slice(0, 2),
      jenis_karantina: ptk?.jenis_karantina
    }
    console.log("values bill")
    console.log(dataJson)
    const toastId = toast.loading('Loading...');
    const response = await billing(dataJson);

    if(response?.status) {
      toast.dismiss(toastId);
      toast.success(response?.message || "Berhasil buat billing")
      setDataBilling(response?.data)
    } else {
      toast.dismiss(toastId);
      let pesan = ""
      if (typeof response?.message == "string") {
        pesan = response?.message
      } else {
        pesan = response?.message?.code ? (response?.message?.code + " - " + response?.message?.message) : "Gagal buat billing"
      }
      toast.error(pesan || "Gagal buat billing", {
        style: {
          border: '1px solid black'
        }
      })
      // toast.error(response?.message || (response?.message?.code + " - " + response?.message?.message) || "Gagal buat billing", "Loading...")
    }
    console.log("response bill")
    console.log(response)
  }

  const onSubmit = async (values) => {
    const json = {
      ...values,
      total_pnbp: values.total_tarif + values.total_perjadin,
    };
    const response = await mutateAsync(json);
    // console.log("values")
    console.log("response")
    console.log(response)
    if (response?.status) {
      toast.success(response?.message)
      // navigate("/");
      setValue("id", response?.data?.id);
      setValue("nomor", response?.data?.nomor);
      setValue("created_at", response?.data?.created_at);
    } else {
      toast.error(response?.message)
    }
  }

  const { data: responseDokKarantina, isSuccess: isSuccessDokKarantina, isError } = useGetSertifikatPelepasanPtk(id, jenisKarantina);
  
  const getDokKarantina = (idDok) => {
    if(idDok == 1) {
      toast.success("data ditemukan")
      setValue("nomor_dokumen", ptk?.no_dok_permohonan)
      setValue("tgl_dokumen", ptk?.tgl_dok_permohonan)
    } else {
      if (!isSuccessDokKarantina) {
        toast.error("Terjadi error saat tarik data!")
        setValue("nomor_dokumen", "")
        setValue("tgl_dokumen", "")
      }
      if (responseDokKarantina?.response?.status) {
        toast.error(responseDokKarantina?.response?.statusText)
        setValue("nomor_dokumen", "")
        setValue("tgl_dokumen", "")
      }
      if (responseDokKarantina?.status == 200) {
        if (responseDokKarantina?.data?.dokumen_karantina_id == idDok) {
          toast.success("data ditemukan")
          setValue("nomor_dokumen", responseDokKarantina?.data?.nomor)
          setValue("tgl_dokumen", responseDokKarantina?.data?.tanggal)
        } else {
          const dataDok = formOptionsData.filter(item => item.value == responseDokKarantina?.data.dokumen_karantina_id)
          toast.error(`Ditemukan dokumen ${dataDok[0]?.label}` )
          setValue("nomor_dokumen", "")
          setValue("tgl_dokumen", "")
        }
      }
    }
  }

  const [idKuitansi, mp, jumlahMp, total = 0, total_perjadin = 0, tipe_bayar] = watch([
    "id",
    "mp",
    "jumlah_mp",
    "total_tarif",
    "total_perjadin",
    "tipe_bayar"
  ]);
  
  const setValuePtk = useCallback(() => {
    setValue("ptk_id", ptk?.id);
    setValue("tgl_aju", ptk?.tgl_aju);
    setValue("nomor_ptk", ptk?.no_dok_permohonan);
    setValue("status_bayar", "SUDAH");
    setValue("jenis_karantina", ptk?.jenis_karantina);
    setValue("mp", ((ptk?.jenis_permohonan == "IM" || ptk?.jenis_permohonan == "DM" ? "Pemasukan " : (ptk?.jenis_permohonan == "EX" || ptk?.jenis_permohonan == "DK" ? "Pengeluaran " : "")) + ptk?.jenis_media_pembawa) || "");
    setValue("upt_id", ptk?.upt_id?.toString());
    setValue("kode_satpel", ptk?.kode_satpel?.toString());
    setValue(
      "nama_wajib_bayar",
      (ptk?.jenis_permohonan == "IM" || ptk?.jenis_permohonan == "DM" ? ptk?.nama_penerima : ptk?.nama_pengirim)
    );
    setValue(
      "jenis_identitas",
      (ptk?.jenis_permohonan == "IM" || ptk?.jenis_permohonan == "DM"
        ? ptk?.jenis_identitas_penerima
        : ptk?.jenis_identitas_pengirim)
    );
    setValue(
      "identitas_id",
      (ptk?.jenis_permohonan == "IM" || ptk?.jenis_permohonan == "DM"
        ? ptk?.nomor_identitas_penerima
        : ptk?.nomor_identitas_pengirim)
    );
  }, [ptk, setValue])

  useEffect(() => {
    if (isSuccess) {
      if (ptk?.jenis_karantina == "H") {
        setformOptionsData(formOptionsKH)
      } else if (ptk?.jenis_karantina == "I") {
        setformOptionsData(formOptionsKI)
      } else if (ptk?.jenis_karantina == "T") {
        setformOptionsData(formOptionsKT)
      }
    }
      setValuePtk()
  }, [setValuePtk])

  return (
    <>
      <SEO title="Buat Kuitansi" />
      <div className="d-md-flex align-items-center justify-content-between mb-1 mt-2 pt-4">
        <div>
          <ol className="breadcrumb fs-sm mb-0">
            <li className="breadcrumb-item">
              <Link href="#">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Kuitansi
            </li>
          </ol>
        </div>
        <div className="d-flex align-items-center gap-2 mt-1 mt-md-0"></div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" name="created_at" {...register("created_at")} />
        <input type="hidden" name="id" {...register("id")} />
        <input type="hidden" name="user_id" {...register("user_id")} />
        <input type="hidden" name="nomor_ptk" {...register("nomor_ptk")} />
        <input type="hidden" name="tgl_aju" {...register("tgl_aju")} />
        <Card className="card-one">
          <Row className="mb-2">
            {/* <Col md={12} sm={12}>
              <CardHeader>
                <Card.Title as="h4">History Kuitansi</Card.Title>
              </CardHeader>
              <CardBody>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>@fat</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td colSpan={2}>Larry the Bird</td>
                      <td>@twitter</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Col> */}
          </Row>
          <Row className="mb-2">
            <Col md={6} sm={12}>
              <CardHeader>
                <Card.Title as="h4">Data Kuitansi</Card.Title>
              </CardHeader>
              <CardBody className="">
                <Row md={6}>
                  <Col md={6}>
                    <Form.Label htmlFor="no_permohonan">No Permohonan</Form.Label>
                    <input
                      className="form-control"
                      disabled
                      type="text"
                      id="no_permohonan"
                      placeholder="No Permohonan"
                      value={ptk?.no_dok_permohonan || ""}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label htmlFor="no_kuitansi">No Kuitansi</Form.Label>
                    <input
                      disabled
                      className="form-control"
                      type="text"
                      id="no_kuitansi"
                      placeholder="No Kuitansi"
                      {...register("nomor")}
                      // value={
                      //   ptk?.no_dok_permohonan?.replace("K.1.1", "KWI") +
                      //   `/${increment}`
                      // }
                    />
                  </Col>
                  <Col md={6} className="mb-1">
                    <InputWrapper
                      error={!!errors?.nomor_seri}
                      message={errors?.nomor_seri?.message}
                    >
                      <Form.Label htmlFor="serial_number">No Seri</Form.Label>
                      <input
                        className="form-control"
                        type="text"
                        id="serial_number"
                        placeholder="No Seri"
                        {...register("nomor_seri")}
                      />
                    </InputWrapper>
                  </Col>
                  <Col md={6} className="mb-1">
                    <InputWrapper
                      error={!!errors?.tanggal}
                      message={errors?.tanggal?.message}
                    >
                      <Form.Label htmlFor="tanggal">
                        Tanggal Kuitansi
                      </Form.Label>
                      <Controller
                        name="tanggal"
                        control={control}
                        render={({ field: { onChange } }) => (
                          <ReactDatePicker
                            selected={selectedPaymentDate}
                            peekNextMonth={true}
                            showMonthDropdown={true}
                            showYearDropdown={true}
                            dropdownMode="select"
                            className="form-control"
                            wrapperClassName="w-100"
                            calendarClassName="shadow-lg"
                            dateFormat={"dd-MMMM-yyyy"}
                            showPopperArrow={false}
                            onChange={(e) => {
                              onChange(dayjs(e).format("YYYY-MM-DD"));
                              setSelectedPaymentDate(e);
                            }}
                          />
                        )}
                      />
                    </InputWrapper>
                  </Col>
                  <Col md={12} className="mb-1">
                    <Form.Label className="fw-bold" htmlFor="bayar-awal">
                      Jenis Pembayaran
                    </Form.Label>
                    <InputWrapper
                      error={!!errors?.tipe_bayar}
                      message={errors?.tipe_bayar?.message}
                    >
                      <FormGroup className="d-flex">
                        <FormGroup className="me-2">
                          <input
                            {...register("tipe_bayar")}
                            value="AWAL"
                            type="radio"
                            id="bayar-awal"
                            className="form-check-input me-1"
                          />
                          <Label htmlFor="bayar-awal" className="me-2">Pembayaran Awal</Label>
                        </FormGroup>
                        <FormGroup>
                          <input
                            className="form-check-input me-1"
                            {...register("tipe_bayar")}
                            value="AKHIR"
                            type="radio"
                            id="bayar-akhir"
                          />
                          <Label htmlFor="bayar-akhir">Pembayaran Akhir</Label>
                        </FormGroup>
                      </FormGroup>
                    </InputWrapper>
                  </Col>
                  <Col md={12} className="mb-1 mt-2">
                    <Form.Label htmlFor="payment_date">
                      Pengirim/Terima dari
                    </Form.Label>
                    <Row>
                      <Col md={6}>
                        <InputWrapper
                          error={!!errors?.nama_wajib_bayar}
                          message={errors?.nama_wajib_bayar?.message}
                        >
                          <input
                            className="form-control mb-1"
                            disabled
                            type="text"
                            id="sender"
                            name="sender"
                            placeholder="Pengirim"
                            {...register("nama_wajib_bayar")}
                          />
                        </InputWrapper>
                      </Col>
                      <Col md={6}>
                        <input
                          className="form-control"
                          disabled
                          type="text"
                          id="sender_address"
                          name="sender_address"
                          placeholder="Alamat Pengirim"
                          value={ptk?.alamat_pengirim || "-"}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6} className="mb-1">
                    <InputWrapper
                      error={!!errors?.jenis_identitas}
                      message={errors?.jenis_identitas?.message}
                    >
                      <Form.Label htmlFor="no_document">Jenis Identitas</Form.Label>
                      <input
                        className="form-control"
                        disabled
                        type="text"
                        id="no_document"
                        placeholder="No Dokumen"
                        {...register("jenis_identitas")}
                      />
                    </InputWrapper>
                  </Col>
                  <Col md={6} className="mb-1">
                    <InputWrapper
                      error={!!errors?.identitas_id}
                      message={errors?.identitas_id?.message}
                    >
                      <Form.Label htmlFor="identitas_id">No Identitas</Form.Label>
                      <input
                        className="form-control"
                        disabled
                        type="text"
                        id="identitas_id"
                        placeholder="No ID"
                        {...register("identitas_id")}
                      />
                    </InputWrapper>
                  </Col>
                  <Col md={6} className="mb-1">
                    <Form.Label htmlFor="no_document">Nominal</Form.Label>
                    <input
                      className="form-control mb-1"
                      disabled
                      value={toRupiah(
                        parseInt(total) + parseInt(total_perjadin)
                      )}
                      type="text"
                      id="nominal"
                      placeholder="Nominal"
                    />
                  </Col>
                  <Col md={6} className="mb-1">
                    <InputWrapper
                      error={!!errors?.status_bayar}
                      message={errors?.status_bayar?.message}
                    >
                      <Form.Label htmlFor="payment_type">Lunas</Form.Label>
                      <FormGroup className="d-flex">
                        <FormGroup className="me-2">
                          <input
                            {...register("status_bayar")}
                            value="SUDAH"
                            type="radio"
                            id="field-sudah"
                            className="form-check-input me-1"
                          />
                          <Label htmlFor="field-sudah" className="me-2">Sudah</Label>
                        </FormGroup>
                        <FormGroup>
                          <input
                            className="form-check-input me-1"
                            {...register("status_bayar")}
                            value="BELUM"
                            type="radio"
                            id="field-belum"
                          />
                          <Label htmlFor="field-belum">Belum</Label>
                        </FormGroup>
                      </FormGroup>
                    </InputWrapper>
                  </Col>
                  <Col md={12}>
                    <input
                      disabled
                      className="form-control"
                      value={convertToWords(
                        parseInt(total) + parseInt(total_perjadin)
                      ) || 0}
                      type="text"
                      id="nominal"
                      placeholder="Nominal"
                    />
                  </Col>
                  <Col md={12} className="mb-1">
                    <InputWrapper
                      error={!!errors?.mp}
                      message={errors?.mp?.message}
                    >
                      <Form.Label htmlFor="no_document">
                        untuk biaya karantina atas:{" "}
                      </Form.Label>
                      <input
                        {...register("mp")}
                        className="form-control"
                        type="text"
                        id="nominal"
                      />
                    </InputWrapper>
                  </Col>
                  <Col md={12} className="mb-1">
                    <InputWrapper
                      error={!!errors?.jumlah_mp}
                      message={errors?.jumlah_mp?.message}
                    >
                      <Form.Label htmlFor="no_document">Sejumlah</Form.Label>
                      <input
                        {...register("jumlah_mp")}
                        className="form-control"
                        type="text"
                        id="nominal"
                      />
                    </InputWrapper>
                  </Col>
                  <Col md={4} className="mb-1">
                    <InputWrapper
                      error={!!errors?.nomor_dokumen}
                      message={errors?.nomor_dokumen?.message}
                    >
                      <Form.Label htmlFor="no_document">
                        Sesuai Formulir
                      </Form.Label>
                      <Controller
                        name="sesuai_dok"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <ReactSelect
                            menuPosition="fixed"
                            {...field}
                            options={formOptionsData}
                            onChange={(e) => {
                              if (e.value) {
                                onChange(e.value);
                                // setValue("nomor_dokumen", e.value);
                                getDokKarantina(e.value)
                              }
                            }}
                            value={getReactSelectValue(formOptionsData, value) || ""}
                          />
                        )}
                      />
                    </InputWrapper>
                  </Col>
                  <Col md={4} className="mb-1">
                    <Form.Label htmlFor="no_document">No</Form.Label>
                    <input
                      disabled
                      className="form-control mb-1"
                      type="text"
                      id="nomor_dokumen"
                      {...register("nomor_dokumen")}
                    />
                  </Col>
                  <Col md={4} className="mb-1">
                    <InputWrapper
                      error={!!errors?.tgl_dokumen}
                      message={errors?.tgl_dokumen?.message}
                    >
                      <Form.Label htmlFor="tgl_dokumen">Tanggal</Form.Label>
                      <Controller
                        name="tgl_dokumen"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <ReactDatePicker
                            selected={value ?? selectedDate}
                            peekNextMonth={true}
                            showMonthDropdown={true}
                            showYearDropdown={true}
                            dropdownMode="select"
                            className="form-control"
                            wrapperClassName="w-100"
                            calendarClassName="shadow-lg"
                            dateFormat={"dd-MMMM-yyyy"}
                            showPopperArrow={false}
                            onChange={(e) => {
                              onChange(dayjs(e).format("YYYY-MM-DD"));
                              setSelectedDate(e);
                            }}
                          />
                        )}
                      />
                    </InputWrapper>
                  </Col>
                </Row>
              </CardBody>
            </Col>
            <Col md={6} sm={12}>
              <CardHeader>
                <Card.Title as="h4">Jasa {ptk?.jenis_karantina == "I" ? "Tindakan Karantina" : "Pemeriksaan Fisik"} </Card.Title>
                <Nav className="nav-icon nav-icon-md ms-auto">
                  <Nav.Link
                    onClick={() => onOpen()}
                    className="btn btn-primary  "
                  >
                    <i
                      className="ri-add-circle-line"
                      style={{ fontSize: "18px" }}
                    ></i>
                    <span className="ms-1 me-2">Jasa Fisik</span>
                  </Nav.Link>
                </Nav>
              </CardHeader>
              <Card className="mx-2 mt-2 ">
                <Table
                  style={{ minHeight: 100 }}
                  className="table-agent mb-0"
                  responsive
                >
                  <thead>
                    <tr>
                      <th>No</th>
                      {/* <th style={{ minWidth: 50 }}>Kode</th> */}
                      <th>Kode Tarif</th>
                      <th>Uraian</th>
                      <th>Tarif</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>{renderTableContentFisik()}</tbody>
                </Table>
              </Card>
              <div style={{ display: (tipe_bayar == "AKHIR" ? "block" : "none")}}>
                <CardHeader>
                  <Card.Title as="h4">Jasa Karantina Lainnya</Card.Title>
                  <Nav className="nav-icon nav-icon-md ms-auto">
                    <Nav.Link
                      onClick={() => onOpen2()}
                      className="btn btn-primary p-2 "
                    >
                      <i
                        className="ri-add-circle-line"
                        style={{ fontSize: "18px" }}
                      ></i>
                      <span className="ms-1 me-2">Jasa Lain</span>
                    </Nav.Link>
                  </Nav>
                </CardHeader>
                <Card className="mx-2 mt-2">
                  <Table
                    style={{ minHeight: 100 }}
                    className="table-agent mb-0"
                    responsive
                  >
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Kode Tarif</th>
                        {/* <th>Kode Simponi</th> */}
                        <th>Uraian</th>
                        <th>Tarif</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>{renderTableContentLain()}</tbody>
                  </Table>
                </Card>
                <Col md={12} className="mx-2 mt-2 d-flex gap-2">
                  <InputWrapper
                    error={!!errors?.is_perjadin}
                    message={errors?.is_perjadin?.message}
                  >
                    <input
                      {...register("is_perjadin")}
                      className="form-check-input"
                      type="checkbox"
                      onChange={() => {
                        setIsPerjadin(!isPerjadin);
                      }}
                      value={isPerjadin || ""}
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Perjalanan Dinas
                    </label>
                  </InputWrapper>
                </Col>
              </div>
              {/* perjadin */}
              {isPerjadin && (
                <>
                  <CardHeader>
                    <Card.Title as="h4">Biaya Perjalanan Dinas</Card.Title>
                    <Nav className="nav-icon nav-icon-md ms-auto">
                      <Nav.Link
                        onClick={() => onOpen3()}
                        className="btn btn-primary p-2 "
                      >
                        <i
                          className="ri-add-circle-line"
                          style={{ fontSize: "18px" }}
                        ></i>
                        <span className="ms-1 me-2">Perjalanan Dinas</span>
                      </Nav.Link>
                    </Nav>
                  </CardHeader>
                  <Card className="mx-2 mt-2">
                    <Table
                      className="table-agent mb-0"
                      style={{ minHeight: 100 }}
                      responsive
                    >
                      <thead>
                        <tr>
                          <th>No</th>
                          <th style={{ width: "50px" }}>No Pemohon</th>
                          <th>No SPDD</th>
                          <th>Keterangan</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>{renderTableContentPerjadin()}</tbody>
                    </Table>
                    <CardBody>
                      <div className="d-flex">
                        <InputWrapper
                          error={!!errors?.total_perjadin}
                          message={errors?.total_perjadin?.message}
                        >
                          <Form.Label htmlFor="no_document">
                            Total Perjadin
                          </Form.Label>
                          <Controller
                            name="total_perjadin"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <input
                                onChange={(e) => {
                                  onChange(e);
                                }}
                                className="mb-1 form-control"
                                type="number"
                                id="total_perjadin"
                                placeholder="total_perjadin"
                                value={value || 0}
                                min={0}
                              />
                            )}
                          />
                        </InputWrapper>
                      </div>
                    </CardBody>
                  </Card>
                </>
              )}
              {dataBilling ?
                <Card className="mx-2 mt-4 mb-2 border-danger w-80">
                  <Table
                    className="mb-0 no-border p-0 table-cyan"
                    responsive
                    variant="info"
                  >
                    <tbody>
                      <tr className="text-black-50 p-0">
                        <td>Kode Billing</td>
                        <td>:</td>
                        <td><b className="me-3">{dataBilling?.data[1] || ""}</b> <Button href={import.meta.env.VITE_BASE_API + "/print_pdf/billing/" + idKuitansi} target="_blank" variant="dark" size="sm"><i className="ri-printer-line text-white me-2"></i>Cetak Billing</Button></td>
                      </tr>
                      <tr className="text-black-50 p-0">
                        <td>Tanggal Billing / Expired</td>
                        <td>:</td>
                        <td><b>{(dataBilling?.data[2] || "") + " / " + (dataBilling?.data[3] || "")}</b></td>
                      </tr>
                    </tbody>
                  </Table>
                </Card>
                : ""}
            </Col>
          </Row>
          <Row className="d-flex justify-content-end mx-2 mb-4">
            <Col
              className="d-flex justify-content-end"
              style={{ columnGap: "4px" }}
            >
              <Button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                <i className="ri-arrow-left-line me-2"></i>Kembali
              </Button>
              <Button
                className="btn btn-primary"
                type="submit"
                disabled={isPending || idKuitansi ? true : false}
              >
                <i className="ri-save-2-fill me-2"></i>{isPending ? "Loading.." : "Simpan"}
              </Button>
              <Button href={import.meta.env.VITE_BASE_API + "/print_pdf/kuitansi/" + idKuitansi} target="_blank" style={{ display: (idKuitansi ? "block" : "none") }} type="button" className="btn btn-dark">
                <i className="ri-printer-line text-white me-2"></i>Cetak Kuitansi
              </Button>
              <Button
                type="button"
                className="btn"
                disabled={isPendingBill ? true : false}
                style={{ backgroundColor: "#07db43", borderColor: "#07db43", display: (idKuitansi ? "block" : "none") }}
                onClick={() => createBilling(idKuitansi)}
              >
                <i className="ri-send-plane-line me-2"></i>{isPendingBill ? "Loading.." : "Ajukan Billing"}
              </Button>
            </Col>
          </Row>
        </Card>
      </form>
      <KuitansiCreateModalFisik
        show={isOpen}
        handleClose={onClose}
        append={fisikAppend}
        ptkFisik={ptk_komoditi}
        jenisPermohonan={ptk?.jenis_permohonan}
        jenisKarantina={ptk?.jenis_karantina}
        setValue={setValue}
        total={total}
        mp={mp}
        jumlahMp={jumlahMp}
      />
      <KuitansiCreateModalLain
        show={isOpen2}
        handleClose={onClose2}
        append={lainAppend}
        jenisPermohonan={ptk?.jenis_permohonan}
        jenisKarantina={ptk?.jenis_karantina}
        setValue={setValue}
        total={total}
      />
      <KuitansiCreateModalPerjadin
        show={isOpen3}
        handleClose={onClose3}
        append={perjadinAppend}
      />
    </>
  );
};
export default KuitansiCreate;
