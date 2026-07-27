import React, { useEffect, useState } from "react";

const checkedColor = (value, answer, option) => {
    // TH check đúng thì value === answer === option color primary
    if ((value === answer) === option) {
        return "primary";
    }

    //TH value ===  option nhưng answer k bằng option
    if (value === option && answer !== option) {
        return "primary";
    }

    //TH answer === option nhưng value k bằng option
    if (value !== option && answer === option) {
        return "error";
    }
};

import { Radio } from "@mui/material";
import { API_SERVER } from "../api/apiServer";
const CauhoiPreview = ({ question, index }) => {
    const [value, setValue] = useState(() => {
        return question.choice;
    });
    useEffect(() => {
        setValue(question.choice);
    }, [question]);


    return (
        <div className="mb-1">
            <h4 className="font-semibold text-black text-sm md:text-[16px]">
                <span className="font-bold"> <span className={question.answer !== question.choice ? "text-red-600" : ""}>Câu {index}: {" "}
                    {question.question}</span></span>
            </h4>
                <div>
        {question.image && question.image !== "" && (
          <div className="flex justify-center items-center my-4">
            <img src={`${API_SERVER}c08/uploads/${question.image}`} alt="image" className="w-full md:w-[400px]"/>
            </div>
        )}
      </div>
            <ul className="flex flex-col flex-wrap md:flex-row">
                {question.options.map((obj, index) => (
                    <li key={index} className="flex items-start md:basis-1/2">
                        <Radio
                            name={question._id}
                            checked={
                                value === Object.keys(obj)[0] || question.answer === Object.keys(obj)[0]
                            }
                            color={checkedColor(value, question.answer, Object.keys(obj)[0])}
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

export default CauhoiPreview;
