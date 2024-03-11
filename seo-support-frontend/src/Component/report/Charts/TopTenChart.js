import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  // LabelList,
} from "recharts";

export const TopTenChart = ({ fetchData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!fetchData) return;

    const group = [];

    fetchData.forEach((item) => {
      const newItem = { count: item.count, name: item.keyword.name };
      group.push(newItem);
    });
    // console.log(group);
    setData(group);
  }, [fetchData]);

  const tickFormatter = (value, index) => {
    const limit = 5; // put your maximum character
    if (!value) return;
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };

  const customizedLabel = (props) => {
    const { x, y, width, height, name } = props;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    context.font = getComputedStyle(document.body).font;

    const textWidth = context.measureText(name).width;
    const fitText = Math.floor((width * name.length) / textWidth);

    // console.log(fitText);

    let displayValue = name;

    if (textWidth > width) {
      displayValue = displayValue.substring(0, fitText - 4) + "...";
    }

    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        // fill={"#0088FE"}
        fill={"#fff"}
        textAnchor="middle"
        dominantBaseline="central"
        width={width}
      >
        {displayValue}
      </text>
    );
  };

  return (
    <>
      {fetchData.length > 0 && (
        <ResponsiveContainer height={600} width="100%">
          <BarChart
            // width={500}
            // height={300}
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
            cursor="pointer"
            layout="vertical"
            barGap={0}
            barCategoryGap={10}
            isAnimationActiveBoolean={false}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis type="number" />
            <YAxis
              dataKey="name"
              type="category"
              tickFormatter={tickFormatter}
              width={100}
              tickLine={false}
              hide={true}
            />

            <Tooltip />
            <Legend />
            <CartesianGrid
              horizontal={false}
              stroke="#a0a0a0"
              strokeWidth={0.5}
            />
            <Bar
              dataKey="count"
              name="Bài viết"
              fill="#0088FE"
              // label={{
              //   position: "inside",
              //   fill: "#fff",
              //   value: "name",
              // }}
              label={customizedLabel}
            ></Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
      {!fetchData.length && (
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            height: "80px",
            margin: "0",
          }}
        >
          Không có data
        </h1>
      )}
    </>
  );
};
