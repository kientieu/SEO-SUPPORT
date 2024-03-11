import React, { useEffect, useState } from "react";
import { shortMonthNames, monthNames } from "../../../Constants/ReportConstant";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const KeywordsSortByDateChart = ({ fetchData }) => {
  const [data, setData] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [prevDisable, setPrevDisable] = useState(false);
  const [nextDisable, setNextDisable] = useState(true);

  useEffect(() => {
    if (!fetchData) return;

    // console.log(fetchData);

    const group = {};

    fetchData.forEach((item) => {
      const date = new Date(item.created_at);

      const year = date.getFullYear();
      const month = date.getMonth();
      if (!group[year]) {
        group[year] = [];
        for (let i = 0; i < 12; i++) {
          group[year].push({
            name: `${shortMonthNames[i]}`,
            Keywords: 0,
          });
        }
      }
      group[year][month].Keywords++;
    });
    setData(group);
    const keys = Object.keys(group);
    setCurrentYear(keys[keys.length - 1]);
  }, [fetchData]);

  const getIntroOfPage = (label) => {
    // console.log(label);
    const index = shortMonthNames.indexOf(label);

    return monthNames[index];
  };

  const getPreviousYear = () => {
    const keys = Object.keys(data);
    const index = keys.indexOf(currentYear.toString());

    if (index === 0) return;

    setCurrentYear(keys[index - 1]);
    if (index === 1) {
      setPrevDisable(true);
    }
    setNextDisable(false);
  };

  const getNextYear = () => {
    const keys = Object.keys(data);
    const index = keys.indexOf(currentYear.toString());

    if (index === keys.length - 1) return;

    setCurrentYear(keys[index + 1]);
    if (index === keys.length - 2) {
      setNextDisable(true);
    }
    setPrevDisable(false);
  };

  const CustomTooltip = ({ active, payload, label, fill }) => {
    // console.log(payload[0]);
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            padding: " 6px  10px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            margin: 0,
          }}
        >
          <p
            className="label"
            style={{ color: "#000", margin: "0" }}
          >{`${getIntroOfPage(label)}`}</p>

          <p
            className="label"
            style={{ color: `${payload[0].fill}`, margin: "0" }}
          >{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };
  return (
    <>
      {fetchData.length > 0 && (
        <div style={{ height: "400px" }}>
          <div
            className="chart__year"
            style={{
              height: "20%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <i
              className={`fas fa-chevron-left ${prevDisable ? "disabled" : ""}`}
              onClick={() => {
                getPreviousYear();
              }}
            ></i>
            <span>{currentYear}</span>
            <i
              className={`fas fa-chevron-right ${
                nextDisable ? "disabled" : ""
              }`}
              onClick={() => getNextYear()}
            ></i>
          </div>

          <ResponsiveContainer height="80%">
            <BarChart
              // width={500}
              // height={300}
              data={data[currentYear]}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
              cursor="pointer"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Keywords" name="Từ khoá" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {!fetchData.length && (
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          Không có data
        </h1>
      )}
    </>
  );
};

export default KeywordsSortByDateChart;
