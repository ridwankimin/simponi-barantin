import { useMemo, useState } from "react";
import { Card, Col, Row, Nav, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";
import { useDeleteKuitansi, useGetKuitansiList } from "../../hooks/useKuitansi";
import LaporPNBPModal from "../LaporPNBPModal";
import useDisclosure from "../../hooks/useDisclosure";
import ReactDatePicker from "react-datepicker";
import { toRupiah } from "to-rupiah";
import DataTable from "react-data-table-component";
const PermohonanBilling = () => {
  const navigate = useNavigate();
  //state
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedMenu, setSelectedMenu] = useState("");
  const [selectedRow, setSelectedRow] = useState(false);
  let [filterText, setFilterText] = useState("");
  let [filteredListData, setFilteredListData] = useState([]);
  const { mutateAsync: deleteKuitansi } = useDeleteKuitansi();
  const handleSelectMenu = (menu) => {
    setSelectedMenu(menu);
  };
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1);
  const [startDate, setStartDate] = useState(
    currentDate.toISOString().split("T")[0]
  );
  currentDate.setMonth(currentDate.getMonth() + 1);
  const [finishDate, setFinishDate] = useState(
    currentDate.toISOString().split("T")[0]
  );
  const [page, setPage] = useState(1);

  //get data
  const params = {
    // page: page,
    // size: 10,
    dFrom: startDate,
    dTo: finishDate,
    jenis_karantina: selectedMenu,
    upt_id: "1000"
  };
  const { data: response, refetch } = useGetKuitansiList({ params });
  const { data: listData, total = 0 } = response ?? {};
  //table
  const deleteItem = async (id) => {
    const response = await deleteKuitansi(id);
    if (response.success) {
      refetch();
    }
  };
  const countPerPage = 10;
  const columns = [
    // {
    //   name: "Aksi",
    //   cell: (row) => (
    //     <div className="d-flex justify-content-around">
    //       <i
    //         style={{ cursor: "pointer" }}
    //         className="ri-edit-line "
    //         onClick={() => {
    //           navigate(`/kuitansi/${row.id}/edit`);
    //         }}
    //       />
    //       <i
    //         onClick={() => deleteItem(row?.id)}
    //         style={{ cursor: "pointer" }}
    //         className="ri-delete-bin-line"
    //       />
    //     </div>
    //   ),
    // },
    {
      name: "Nomor Kuitansi",
      cell: (row) => <span className="ff-numerals">{row?.nomor ?? "-"}</span>,
    },
    {
      name: "Jenis Pembayaran",
      cell: (row) => (
        <span className="ff-numerals">{row?.tipe_bayar ?? "-"}</span>
      ),
    },
    {
      name: "No Seri",
      cell: (row) => (
        <span className="ff-numerals">{row?.nomor_seri ?? "-"}</span>
      ),
    },
    {
      name: "Tanggal Kuitansi",
      cell: (row) => <span className="ff-numerals">{row?.tanggal ?? "-"}</span>,
    },
    {
      name: "Total PNBP",
      cell: (row) => (
        <span className="ff-numerals float-end">{row?.total_pnbp ? toRupiah(parseInt(row?.total_pnbp)) : "-"}</span>
      ),
    },
    {
      name: "Status Pembayaran",
      cell: (row) => (
        <span className="ff-numerals">{row?.status_bill ?? "-"}</span>
      ),
    },
    {
      name: "Nama Wajib bayar",
      cell: (row) => (
        <span className="ff-numerals">{row?.nama_wajib_bayar ?? "-"}</span>
      ),
    },
  ];

  const filterData = (text) => {
    setFilterText(text)
    if (text != "") {
      const balikin = listData.filter(
        item =>
          (item.nomor && item.nomor.toLowerCase().includes(text.toLowerCase())) |
          (item.tipe_bayar && item.tipe_bayar.toLowerCase().includes(text.toLowerCase())) |
          (item.nomor_seri && item.nomor_seri.toLowerCase().includes(text.toLowerCase())) |
          (item.tanggal && item.tanggal.toLowerCase().includes(text.toLowerCase())) |
          (item.total_pnbp && item.total_pnbp.toLowerCase().includes(text.toLowerCase())) |
          (item.status_bill && item.status_bill.toLowerCase().includes(text.toLowerCase())) |
          (item.nama_wajib_bayar && item.nama_wajib_bayar.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredListData(balikin)
    } else {
      setFilteredListData([])
    }
  }

  const subHeaderComponentMemoSsm = useMemo(() => {
    return (
      <div className='col-sm-2'>
        <Form.Control
          type="text"
          size="sm"
          id="searchListData"
          placeholder="Search..."
          onChange={e => filterData(e.target.value)}
        />
      </div>
    );
  }, []);

  return (
    <>
      <SEO title="Kuitansi" />
      <div className="d-md-flex align-items-center justify-content-between mb-4 pt-5">
        <div>
          <ol className="breadcrumb fs-sm mb-1">
            <li className="breadcrumb-item">
              <Link href="#">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Permohonan Kode Billing
            </li>
          </ol>
          <h4 className="main-title mb-0">Data Permohonan Kode Billing</h4>
        </div>
        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0"></div>
      </div>
      <Row className="g-3">
        <Col xs="12">
          <Card className="card-one">
            <Card.Header className="d-flex justify-content-between">
              <div className="d-flex" style={{ columnGap: "2px" }}>
                <ReactDatePicker
                  className="form-control"
                  selected={startDate}
                  closeOnScroll={true}
                  // isClearable
                  placeholderText="Dari Tanggal"
                  onChange={(e) => setStartDate(e)}
                />
                <ReactDatePicker
                  className="form-control"
                  selected={finishDate}
                  closeOnScroll={true}
                  // isClearable
                  placeholderText="Sampai Tanggal"
                  onChange={(e) => setFinishDate(e)}
                />
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
                <Form.Select className="form-control form-control-sm w-30" name="jenisKarantina" id="jenisKarantina" onChange={(e) => handleSelectMenu(e.target.value)}>
                  <option value="" selected={selectedMenu == "" ? true : false}>--Semua--</option>
                  <option value="H" selected={selectedMenu == "H" ? true : false}>Hewan</option>
                  <option value="I" selected={selectedMenu == "I" ? true : false}>Ikan</option>
                  <option value="T" selected={selectedMenu == "T" ? true : false}>Tumbuhan</option>
                </Form.Select>
              </div>
            </Card.Header>
            <Card.Body>
              <DataTable
                title="Data Kuitansi"
                selectableRows
                onSelectedRowsChange={({ selectedRows }) =>
                  setSelectedRow(selectedRows)
                }
                dense
                columns={columns}
                data={filteredListData.length > 0 || filterText != "" ? filteredListData : listData}
                highlightOnHover
                pagination
                subHeader
                subHeaderComponent={subHeaderComponentMemoSsm}
                // paginationServer
                // paginationTotalRows={total}
                // paginationPerPage={countPerPage}
                // paginationComponentOptions={{
                //   noRowsPerPage: true,
                //   rangeSeparatorText: "dari",
                // }}
                // onChangePage={(page) => {
                //   setPage(page);
                // }}
              />
              <Nav className="nav-icon nav-icon-sm ms-auto">
                <Nav.Link href="">
                  <Button
                    className="text-align-center btn-"
                    onClick={() => {
                      onOpen();
                    }}
                  >
                    <i
                      style={{ cursor: "pointer" }}
                      className="ri-file-add-line "
                    ></i>
                    Ajukan Billing
                  </Button>
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <LaporPNBPModal isOpen={isOpen} onClose={onClose} data={selectedRow} />
    </>
  );
};
export default PermohonanBilling;
