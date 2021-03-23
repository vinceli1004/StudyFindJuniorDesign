import React, { useState, useEffect } from "react";
import { Button, Dropdown, Menu } from "antd";
import { ExportOutlined } from "@ant-design/icons";

const ExportButton = ({ graphImage, graph, dataType, info }) => {
  // ------------------------------------------------------------------
  // ----------------------------- state ------------------------------
  // ------------------------------------------------------------------

  const [menuOpen, setMenuOpen] = useState(false);

  // ------------------------------------------------------------------
  // --------------------------- life-cycle ---------------------------
  // ------------------------------------------------------------------

  // close the menu if user scrolls
  useEffect(() => {
    const listener = () => setMenuOpen(false);
    document
      .querySelectorAll(".ant-layout")[1]
      .addEventListener("scroll", listener);
    return () => window.removeEventListener("scroll", listener);
  }, []);

  // ------------------------------------------------------------------
  // ---------------------------- handlers ----------------------------
  // ------------------------------------------------------------------

  const saveImage = () => {
    const link = document.getElementById("saveLink");
    link.href = graphImage;
    link.download =
      graph === "map"
        ? "studyfind_mapChart.png"
        : `studyfind_${dataType}_${graph}Chart.png`;
    link.click();
  };

  const saveCSV = () => {
    const headers = [
      "briefTitle",
      "briefSummary",
      "condition",
      "keyword",
      "enrollmentCount",
      "locationCity",
      "locationCountry",
      "minimumAge",
      "maximumAge",
      "stdAge",
      "organization",
      "startDate",
      "endDate",
    ];
    const studies = info.studies.map((item) => {
      const {
        briefTitle,
        briefSummary,
        condition,
        keyword,
        enrollmentCount,
        locationCity,
        locationCountry,
        minimumAge,
        maximumAge,
        stdAge,
        organization,
        startDate,
        endDate,
      } = item;
      return [
        briefTitle,
        briefSummary,
        condition.join(", "),
        keyword.join(", "),
        enrollmentCount,
        locationCity,
        locationCountry,
        minimumAge,
        maximumAge,
        stdAge.join(", "),
        organization,
        startDate,
        endDate,
      ].map((item) => '"' + (item || "").replace(/"/g, '""') + '"');
    });
    const csvContent = [headers, ...studies]
      .map((item) => item.join(","))
      .join("\r\n");
    const link = document.getElementById("saveLink");
    link.href = URL.createObjectURL(
      new Blob([csvContent], { type: "text/csv" })
    );
    link.download = "studyfind_spreadsheet.csv";
    link.click();
  };

  // ------------------------------------------------------------------
  // ----------------------------- render -----------------------------
  // ------------------------------------------------------------------

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key="saveImage" onClick={saveImage}>
            Save as Image
          </Menu.Item>
          <Menu.Item key="saveCSV" onClick={saveCSV}>
            Save as CSV
          </Menu.Item>
          <a id="saveLink" href={graphImage}>
            Save Data
          </a>
        </Menu>
      }
      trigger={["click"]}
      visible={menuOpen}
      onVisibleChange={(status) => setMenuOpen(status)}
      overlayStyle={{
        boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.2)",
        width: "150px",
        position: "fixed",
      }}
      placement="topLeft"
    >
      <Button
        className="graphpage-button"
        type="primary"
        icon={<ExportOutlined />}
        disabled={graphImage === null}
      >
        Export
      </Button>
    </Dropdown>
  );
};

export default ExportButton;
