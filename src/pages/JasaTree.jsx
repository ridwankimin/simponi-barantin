import { Tree } from "react-arborist";
import { useState } from "react";
import {
  dataTarifLainHewan27,
  dataTarifLainTumbuhan27,
  dataTarifLainIkan27
} from "../data/data_tarif_lain";
// import { isEmpty } from "lodash";

const Node = ({ node, style, dragHandle }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
      style={{
        ...style,
        cursor: "pointer",
        color: isHover ? "#d2ab47" : "",
      }}
      ref={dragHandle}
      onClick={() => {
        !node?.isLeaf && node.toggle();
      }}
    >
      {node.isLeaf ? (
        <i className="ri-price-tag-3-line me-1"></i>
      ) : (
        <i style={{ cursor: "pointer" }} className="ri-folder-2-line me-1"></i>
      )}
      {node.data.name}
    </div>
  );
};
const JasaTree = ({
  onSelect,
  className = "",
  jenisPermohonan,
  jenisKarantina,
  setValue,
  volume,
  frekuensi,
}) => {
  let permohonan, karantina;
  switch (jenisPermohonan) {
    case "IM":
      permohonan = "Impor";
      break;
    case "EX":
      permohonan = "Ekspor";
      break;
    case "DM":
      permohonan = "Domestik Masuk";
      break;
    case "DK":
      permohonan = "Domestik Keluar";
      break;
    case "TR":
      permohonan = "Transit";
      break;

    case "RE":
      permohonan = "Reekspor";
      break;
    case "RI":
      permohonan = "Reimpor";
      break;
    default:
      permohonan = "Serah Terima";
  }
  switch (jenisKarantina) {
    case "H":
      karantina = dataTarifLainHewan27;
      break;
    case "T":
      karantina = dataTarifLainTumbuhan27;
      break;
    case "I":
      karantina = dataTarifLainIkan27;
      break;
  }

  return (
    <div className={className}>
      <Tree
        onSelect={(node) => {
          if (node[0]?.children == null) {
            onSelect(node[0]?.data);
            setValue("tarif_id", node[0]?.data?.id);
            // setValue("kode_tarif", node[0]?.data?.kd_tarif);
            setValue("kode_pp", "2024027");
            setValue("kode_akun", node[0]?.data?.kd_akun);
            setValue("kode_simponi", node[0]?.data?.kd_tarif);
            setValue("satuan_volume", node[0]?.data?.satuan);
            setValue("uraian", node[0]?.data?.name);
            setValue("tarif", node[0]?.data?.jml_tarif);
            setValue("total_tarif", parseFloat(node[0]?.data?.jml_tarif) * parseFloat(volume) * parseFloat(frekuensi));
          }
        }}
        searchTerm={permohonan}
        searchMatch={(node, term) => {
          const words = term?.split("%");
          return (
            node?.isLeaf
            // node?.data?.jenis_permohonan
              // ?.toLowerCase()
              // ?.includes(words[0]?.toLowerCase())
          );
        }}
        initialData={karantina}
        disableDrag
        disableDrop
        disableEdit
        disableMultiSelection
        openByDefault={false}
        width={"100%"}
        className="w-100"
        height={350}
        indent={24}
        rowHeight={37}
        overscanCount={1}
        paddingTop={10}
        paddingBottom={10}
        padding={10}
      >
        {Node}
      </Tree>
    </div>
  );
};
export default JasaTree;
