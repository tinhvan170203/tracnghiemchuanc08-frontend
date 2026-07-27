import React, { useEffect, useState } from "react";

import { Radio } from "@mui/material";
import { API_SERVER } from "../../../api/apiServer";
const Cauhoi = ({ question, index, onHandleChangeChoice, isReplay }) => {
  const [value, setValue] = useState(() => {
    return question.choice;
  });

  const handleChange = (event) => {
    setValue(event.target.value);
    onHandleChangeChoice(question._id, event.target.value);
  };

  return (
    <div className="mb-1">
      <h4 className="font-semibold text-black text-sm md:text-[16px]">
        <span className="font-bold">Câu {index}: </span>{" "}
        {question.question}
      </h4>
      <div>
        {question.image && question.image !== "" && (
          <div className="flex justify-center items-center my-4">
            <img src={`${API_SERVER}c08/uploads/${question.image}`} alt="image" className="w-full md:w-[400px]"/>
            </div>
        )}
      </div>
      <ul className="flex flex-col flex-wrap md:flex-row">
        {question.options.map((obj,index) => (
          <li key={index} className="flex items-start md:basis-full">
            <Radio
              name={question._id}
              onChange={handleChange}
              checked={value === Object.keys(obj)[0]}
              value={Object.keys(obj)[0]}
            />
            <span className="text-sm md:text-[16px] pt-[10px]">
              {obj[Object.keys(obj)[0]]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cauhoi;
