import { useEffect, useMemo, useState } from "react";
import { Card, Col, Form, Modal, Nav, PopoverBody, Row, Tab, Tabs } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";
import CertificateDetailModal from "./CertificateDetailModal";
import useDisclosure from "../../hooks/useDisclosure";
import ReactDatePicker from "react-datepicker";
import {
  useGetSertifikatPelepas,
  useGetSertifikatPelepasDetail,
} from "../../hooks/usePelepasan";
import {
  useDeleteKuitansi,
  useGetKuitansiListByPtk,
} from "../../hooks/useKuitansi";
import { getKarantinaLabel } from "../../data/constant";
import { Button, UncontrolledPopover } from "reactstrap";
import useDebounce from "../../hooks/useDebounce";
import { useGetUser } from "../../hooks/useAuth";
import DataTable from "react-data-table-component";
import Loader from "../../components/Loader";
import { isEmpty } from "lodash";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const Certificate = () => {
  //state
  const { onClose, onOpen, isOpen } = useDisclosure();
  const currentDate = new Date();
  const [endDate, setEndDate] = useState(
    currentDate.toISOString().split("T")[0]
  );
  currentDate.setDate(currentDate.getDate() - 7);
  // currentDate.set(currentDate.getMonth() - 1);
  const [startDate, setStartDate] = useState(
    currentDate.toISOString().split("T")[0]
  );
  
  const [selectedMenu, setSelectedMenu] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [popOverState, setPopOverState] = useState(false);
  let [idKuitansiDelete, setIdKuitansiDelete] = useState("");
  let [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState({});
  const [search] = useState("DOK");
  const searchDebounce = useDebounce(search, 1000);
  const user = useGetUser();
  const handleSelectMenu = (menu) => {
    if (selectedMenu == menu) {
      setSelectedMenu("");
    } else {
      setSelectedMenu(menu);
    }
  };
  console.log(Cookies.get('satpel'))
  let[textFilter, setTextFilter] = useState("")

  //params api ptk
  const params = {
    dFrom: startDate,
    dTo: endDate,
    search: searchDebounce,
    jenis_permohonan: selectedType,
    jenis_karantina: selectedMenu,
    jenis_dokumen: "PTK",
    upt_id: user?.upt || "",
    kode_satpel: Cookies.get('satpel') || "",
    pengguna_jasa_id: "",
  };

  //persiapan
  //upt => satpel
  //upt = 10
  //kode satpel = 1024
  const { data: response, isLoading } = useGetSertifikatPelepas({ params });
  const { mutateAsync: deleteKuitansi } = useDeleteKuitansi();
  const { data: detailCertificate, isLoading: isDetailCertificateLoading } =
    useGetSertifikatPelepasDetail(selectedCertificate?.id);
  const { data: { ptk_komoditi: commodityList = [] } = {} } =
    detailCertificate ?? {};
  const { data: detailKuitansi, isLoading: isDetailKuitansiLoading, refetch } =
    useGetKuitansiListByPtk(selectedCertificate?.id);
  const { data: { data: kuitansiList = [] } = [] } = detailKuitansi ?? {};

  const { data: listData = [] } = response ?? {};
  // let [filteredListData, setFilteredListData] = useState(listData);
  // setFilteredListData(listData)
  const navigate = useNavigate();

  const token = localStorage.getItem("barantinToken");

  // useEffect(() => {

  //data table
  const [page, setPage] = useState(1);
  const countPerPage = 10;
  const columns = [
    {
      name: "No AJU",
      cell: (row) => row?.no_aju ?? "-",
    },
    {
      name: "Jenis Karantina",
      cell: (row) => getKarantinaLabel(row?.jenis_karantina) ?? "-",
      width: "150px"
    },
    {
      name: "No Dokumen",
      cell: (row) => row?.no_dok_permohonan ?? "-",
    },
    {
      name: "Tanggal Permohonan",
      cell: (row) => row?.tgl_dok_permohonan ?? "-",
    },
    {
      name: "Status Bayar",
      cell: (row) => row?.status_bayar?.toUpperCase() ?? "-",
      conditionalCellStyles: [
        {
          when: (row) => row.status_bayar.toUpperCase() == "BELUM",
          classNames: ["ff-numerals badge text-danger text-center"],
        },
        {
          when: (row) => row.status_bayar != "BELUM",
          classNames: ["ff-numerals badge text-success text-center"],
        },
      ],
    },
    {
      name: "Pemohon",
      cell: (row) => (
        <span className="ff-numerals">{row?.nama_pemohon + " (" + row?.stat_pemohon?.replace("PPJK", "Dikuasakan") + ")" || "-"}</span>
      ),
    },
    {
      name: "Pengirim",
      cell: (row) => (
        <span className="ff-numerals">{row?.nama_pengirim ?? "-"}</span>
      ),
    },
    {
      name: "Penerima",
      cell: (row) => (
        <span className="ff-numerals">{row?.nama_penerima ?? "-"}</span>
      ),
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="d-flex justify-content-around">
          <Button
            type="button"
            color="info"
            size="sm"
            className="m-1"
            onClick={() => {
              setSelectedCertificate(row);
              onOpen();
            }}
          >
            <i
              className="ri-eye-line"
            />
          </Button>
        </div>
      ),
     
    },
  ];
  const columnDetailKuitansi = [
    {
      name: "No",
      cell: (_, index) => <span className="ff-numerals">{index + 1}</span>,
      width: "80px"
    },
    {
      name: "Nomor Kuitansi",
      cell: (row) => (
        <span className="ff-numerals">{row?.nomor ?? "-"}</span>
      ),
      width: "250px"
    },
    {
      name: "Tanggal",
      cell: (row) => (
        <span className="ff-numerals">{row?.tanggal ?? "-"}</span>
      ),
    },
    {
      name: "Nomor Seri",
      cell: (row) => (
        <span className="ff-numerals">{row?.nomor_seri ?? "-"}</span>
      ),
    },
    {
      name: "Total",
      cell: (row) => (
        <span className="ff-numerals">{row?.total_pnbp?.toLocaleString() ?? "-"}</span>
      ),
    },
    {
      name: "Status",
      cell: (row) => (
        <span className="ff-numerals">{row?.status_bill ?? "-"}</span>
      ),
    },
    {
      name: "Kode Bill",
      cell: (row) => (
        <span className="ff-numerals">{row?.kode_bill ?? "-"}</span>
      ),
    },
    {
      name: "NTPN",
      cell: (row) => (
        <span className="ff-numerals">{row?.ntpn ?? "-"}</span>
      ),
    },
    {
      name: "Tanggal Setor",
      cell: (row) => (
        <span className="ff-numerals">{row?.date_setor ?? "-"}</span>
      ),
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="d-flex justify-content-around">
          <Button
            type="button"
            color="warning"
            size="sm"
            className="m-1"
            onClick={() => {
              navigate(`/kuitansi/${selectedCertificate?.jenis_karantina}_${row.id}/edit`);
            }}
          >
            <i
              style={{ cursor: "pointer" }}
              className="ri-edit-line "
            />
          </Button>
          <Button
            type="button"
            color="danger"
            size="sm"
            className="m-1"
            onClick={() => setConfirmDelete(!confirmDelete) & setIdKuitansiDelete(row)}
          >
            <i
              style={{ cursor: "pointer" }}
              className="ri-delete-bin-line"
            />
          </Button>
        </div>
      ),
    },
  ];
  const columnDetail = [
    {
      name: "No",
      cell: (_, index) => <span className="ff-numerals">{index + 1}</span>,
      width: "80px"
    },
    {
      name: "Klasifikasi",
      cell: (row) => (
        <span className="ff-numerals">{row?.klasifikasi ?? "-"}</span>
      ),
    },
    {
      name: "Komoditas",
      cell: (row) => (
        <span className="ff-numerals">{row?.nama_komoditas ?? "-"}</span>
      ),
    },
    {
      name: "Netto",
      cell: (row) => (
        <span className="ff-numerals">{row?.volume_netto.toLocaleString() ?? "-"}</span>
      ),
    },
    {
      name: "Satuan",
      cell: (row) => (
        <span className="ff-numerals">{row?.sat_netto ?? "-"}</span>
      ),
    },
    {
      name: "Bruto",
      cell: (row) => (
        <span className="ff-numerals">{row?.volume_bruto?.toLocaleString() ?? "-"}</span>
      ),
    },
    {
      name: "Satuan",
      cell: (row) => (
        <span className="ff-numerals">{row?.sat_bruto ?? "-"}</span>
      ),
    },
    {
      name: "Volume Lain",
      cell: (row) => (
        <span className="ff-numerals">{row?.volume_lain.toLocaleString() ?? "-"}</span>
      ),
    },
    {
      name: "Satuan",
      cell: (row) => (
        <span className="ff-numerals">{row?.sat_lain ?? "-"}</span>
      ),
    },
  ];

  const filterData = () => {
    if (textFilter != "") {
      textFilter = textFilter?.toLowerCase()?.replace("dikuasakan", "ppjk")
      if (listData?.length > 0) {
        const balikan = listData.filter(
          item =>
            (item.no_aju && item.no_aju.toLowerCase().includes(textFilter.toLowerCase())) |
            (item.stat_pemohon && item.stat_pemohon.toLowerCase().includes(textFilter.toLowerCase())) |
            (item.jenis_karantina && item.jenis_karantina.toLowerCase().includes(textFilter.toLowerCase())) |
            (item.no_dok_permohonan && item.no_dok_permohonan.toLowerCase().includes(textFilter.toLowerCase())) |
            (item.tgl_dok_permohonan && item.tgl_dok_permohonan.toLowerCase().includes(textFilter.toLowerCase())) |
            (item.status_bayar && item.status_bayar.toLowerCase().includes(textFilter.toLowerCase())) |
            (item.nama_penerima && item.nama_penerima.toLowerCase().includes(textFilter.toLowerCase())) |
            (item.nama_pemohon && item.nama_pemohon.toLowerCase().includes(textFilter.toLowerCase())) |
            (item.nama_pengirim && item.nama_pengirim.toLowerCase().includes(textFilter.toLowerCase()))
        );
        return balikan
      } else {
        return listData
      }
      // setFilteredListData(balikan)
    } else {
      return listData
      // setFilteredListData(listData)
    }
  }

  const deleteItem = async (id) => {
    setConfirmDelete(!confirmDelete)
    const data = {
      id: id
    }
    const response = await deleteKuitansi(data);
    if (response?.status) {
      refetch();
    }
  };

  const subHeaderComponentMemoSsm = useMemo(() => {
    return (
      <div className='col-sm-2'>
        <Form.Control
          type="text"
          id="searchListData"
          placeholder="Search..."
          onChange={e => setTextFilter(e.target.value)}
        />
        {/* <input
          id="search"
          type="text"
          className='form-control form-control-sm'
          placeholder="Search.."
          aria-label="Search Input"
          // value={filterText}
          onChange={e => filterData(e.target.value)}
        /> */}
      </div>
    );
  }, []);

  // const conditionalRowStyles = {
  //   header: {
  //     style: {
  //       minHeight: '56px',
  //     },
  //   }, 
  //   headRow: {
  //     style: {
  //       borderTopStyle: 'solid',
  //       borderTopWidth: '1px',
  //       borderRightColor: 'grey',
  //       // borderTopColor: defaultThemes.default.divider.default,
  //     },
  //   },
  //   headCells: {
  //     style: {
  //       '&:not(:last-of-type)': {
  //         borderRightStyle: 'solid',
  //         borderRightWidth: '1px',
  //         borderRightColor: 'grey',
  //         // borderRightColor: defaultThemes.default.divider.default,
  //       },
  //     },
  //   },
  //   cells: {
  //     style: {
  //       '&:not(:last-of-type)': {
  //         borderRightStyle: 'solid',
  //         borderRightWidth: '1px',
  //         borderRightColor: 'grey',
  //       },
  //     },
  //   },
  // }
  const conditionalRowStyles =
    [{
      // when: row => row.calories < 300,
    when: row => row.no_aju == selectedCertificate?.no_aju,
      style: {
        backgroundColor: '#6e9edd',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    }]

  // ];

  useEffect(() => {
    if (isEmpty(token)) {
      toast.error("Mohon login terlebih dahulu.")
      navigate("/login");
    }

    if (listData?.length > 0) {
      setSelectedCertificate(listData[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <>
      <SEO title="Sertifikat" />
      <div className="d-md-flex align-items-center justify-content-between mb-4 pt-5">
        <div>
          <ol className="breadcrumb fs-sm mb-1">
            <li className="breadcrumb-item">
              <Link href="#">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Table Permohonan
            </li>
          </ol>
          <h4 className="main-title mb-0">Data Permohonan</h4>
        </div>
      </div>
      <Row className="g-3">
        <Col xs="12">
          <Card className="card-two">
            <Card.Header className="d-flex justify-content-between">
              <Card.Title as="h6">Tanggal Permohonan </Card.Title>
              <div className="d-flex" style={{ columnGap: "2px" }}>
                <ReactDatePicker
                  className="form-control"
                  selected={startDate}
                  closeOnScroll={true}
                  isClearable
                  placeholderText="Tanggal start"
                  onChange={(e) => setStartDate(e)}
                />
                <ReactDatePicker
                  className="form-control"
                  closeOnScroll={true}
                  isClearable
                  selected={endDate}
                  onChange={(e) => setEndDate(e)}
                  placeholderText="Tanggal akhir"
                />
                {/* <Form.Label htmlFor="jenisKarantina">Jenis Karantina</Form.Label> */}
                <Form.Select defaultValue="" className="form-control form-control-sm w-50" name="jenisKarantina" id="jenisKarantina" onChange={(e) => handleSelectMenu(e.target.value)}>
                  <option value="">--Semua--</option>
                  <option value="H" >Hewan</option>
                  <option value="I" >Ikan</option>
                  <option value="T" >Tumbuhan</option>
                </Form.Select>
                {/* <Button
                  color="primary"
                  outline={selectedMenu !== "H"}
                  onClick={() => handleSelectMenu("H")}
                  active={selectedMenu === "H"}
                >
                  Hewan
                </Button>
                <Button
                  color="primary"
                  outline={selectedMenu !== "T"}
                  onClick={() => handleSelectMenu("T")}
                  active={selectedMenu === "T"}
                >
                  Tumbuhan
                </Button>
                <Button
                  color="primary"
                  outline={selectedMenu !== "I"}
                  onClick={() => handleSelectMenu("I")}
                  active={selectedMenu === "I"}
                >
                  Ikan
                </Button> */}
                <Button
                  id="PopoverFocus"
                  type="button"
                  onClick={() => setPopOverState(!popOverState)}
                  onBlur={() => setPopOverState(false)}
                >
                  <i className="ri-equalizer-line" />
                </Button>
                <UncontrolledPopover
                  target="PopoverFocus"
                  trigger="focus"
                  isOpen={popOverState}
                  placement="left"
                >
                  <PopoverBody>
                    <Row>
                      <Col md={6}>
                        <Button
                          color={selectedType == "IM" ? "primary" : "white"}
                          className="btn w-100"
                          onClick={() => setSelectedType("IM")}
                        >
                          IMPOR
                        </Button>
                      </Col>
                      <Col md={6}>
                        <Button
                          color={selectedType == "EX" ? "primary" : "white"}
                          className="btn w-100"
                          onClick={() => setSelectedType("EX")}
                        >
                          EKSPOR
                        </Button>
                      </Col>
                      <Col md={6} className="mt-2">
                        <Button
                          color={selectedType == "DM" ? "primary" : "white"}
                          className="btn w-100"
                          onClick={() => setSelectedType("DM")}
                        >
                          DOMESTIK MASUK
                        </Button>
                      </Col>
                      <Col md={6} className="mt-2">
                        <Button
                          color={selectedType == "DK" ? "primary" : "white"}
                          className="btn w-100"
                          onClick={() => setSelectedType("DK")}
                        >
                          DOMESTIK KELUAR
                        </Button>
                      </Col>
                    </Row>
                  </PopoverBody>
                </UncontrolledPopover>
              </div>
            </Card.Header>
            <Card.Body>
              <DataTable
                pointerOnHover
                progressComponent={<Loader />}
                progressPending={isLoading}
                onRowClicked={(row) => {
                  setSelectedCertificate(row);
                }}
                onRowDoubleClicked={(row) => {
                  setSelectedCertificate(row);
                  onOpen();
                }}
                columns={columns}
                data={filterData()}
                dense
                highlightOnHover
                conditionalRowStyles={conditionalRowStyles}
                // paginationServer
                // paginationTotalRows={listData?.length}
                // paginationPerPage={countPerPage}
                // paginationComponentOptions={{
                //   noRowsPerPage: true,
                //   rangeSeparatorText: "dari",
                // }}
                // onChangePage={(page) => {
                //   setPage(page);
                // }}
                pagination
                subHeader
                subHeaderComponent={subHeaderComponentMemoSsm}
              />
            </Card.Body>
          </Card>
          <hr />
          <Card>
            <Card.Header>
              <Card.Title as="h6">Nomor Dokumen: {selectedCertificate?.no_dok_permohonan}</Card.Title>
            </Card.Header>
            <Card.Body>
              <Tabs
                defaultActiveKey="home"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="home" title="Data Kuitansi">
                  <Button
                    style={{ display: (selectedCertificate?.id ? "block" : "none")}}
                    type="button"
                    color="secondary"
                    className="me-1 my-2"
                    onClick={() => {
                      navigate(`/kuitansi/${selectedCertificate?.jenis_karantina}_${selectedCertificate?.id}/create`);
                    }}
                  >
                    <i
                      // style={{ cursor: "pointer" }}
                      className="ri-file-add-line me-2"
                    />
                    Buat Kuitansi Baru
                  </Button>
                  <DataTable
                    columns={columnDetailKuitansi}
                    data={kuitansiList}
                    highlightOnHover
                    pagination
                    progressComponent={<Loader />}
                    progressPending={isDetailKuitansiLoading}
                  />

                </Tab>
                <Tab eventKey="profile" title="Data Media Pembawa">
                  <DataTable
                    columns={columnDetail}
                    data={commodityList}
                    highlightOnHover
                    progressComponent={<Loader />}
                    progressPending={isDetailCertificateLoading}
                  />
                  <small style={{ display: (selectedCertificate?.id ? "none" : "block")}}>*Mohon pilih permohonan diatas</small>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
          <hr />
        </Col>
      </Row>
      <CertificateDetailModal
        ptk={selectedCertificate}
        show={isOpen}
        handleClose={onClose}
      />
      <Modal show={confirmDelete} onHide={() => setConfirmDelete(!confirmDelete)} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pb-0">Kuitainsi nomor: <strong>{`${idKuitansiDelete?.nomor} akan dihapus.`}</strong> <p>Yakin ?</p></Modal.Body>
        <Modal.Footer>
          <Button color="secondary" onClick={() =>setConfirmDelete(!confirmDelete)}>
            Batal
          </Button>
          <Button color="danger" onClick={() => deleteItem(idKuitansiDelete?.id)}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Certificate;
