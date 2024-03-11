import React, { useState, useEffect } from "react";
import {
  PieChart as Chart,
  Pie,
  Cell,
  // Sector,
  ResponsiveContainer,
  // Tooltip,
} from "recharts";

const PieChart = ({ fetchData }) => {
  const [data, setData] = useState([]);
  // const [activeIndex, setActiveIndex] = useState(0);
  // const COLORS = ["#009e0f", "#0088FE", "#7f7f7f", "#FF0000"];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={"middle"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    if (!fetchData) return;
    const group = {};

    fetchData.forEach((item) => {
      if (!group[item.status]) {
        group[item.status] = [item];
      } else {
        group[item.status].push(item);
      }
    });

    const result = [];

    for (let key in group) {
      result.push({
        name: key,
        value: group[key].length,
      });
    }

    setData(result);
  }, [fetchData]);

  // const onPieEnter = (_, index) => {
  //   setActiveIndex(index);
  // };

  const generateColor = (item) => {
    switch (item.name) {
      case "Đang thực hiện":
        return "#0088FE";
      case "Thành công":
        return "#56f000";
      case "Thất bại":
        return "#ff3838";
      case "Đã huỷ":
        return "#9ea7ad";
      default:
        break;
    }
  };

  return (
    <>
      {fetchData.length > 0 && (
        <div className="piechar-container">
          <ResponsiveContainer width="95%" height={300}>
            <Chart cursor="pointer">
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={generateColor(entry)} />
                ))}
              </Pie>
              {/* <Tooltip /> */}
            </Chart>
          </ResponsiveContainer>

          <hr></hr>
          <ul
            className="chart__description"
            style={{
              listStyle: "none",
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              padding: "0",
              // justifyItems: "center",
              // marginLeft: "30px",
              margin: "0 auto",
            }}
          >
            {data.map((item, index) => {
              return (
                <li
                  key={`cell-${index}`}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span
                    className="chart__description-color"
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: `${generateColor(item)}`,
                      display: "block",
                    }}
                  ></span>
                  <span className="chart__description-name">{item.name}</span>
                </li>
              );
            })}
          </ul>
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

export default PieChart;
