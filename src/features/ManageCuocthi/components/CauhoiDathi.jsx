import React, { useEffect, useState } from "react";

import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Radio } from "@mui/material";

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
const CauhoiDathi = ({ question, index }) => {
  const [value, setValue] = useState(() => {
    return question.choice;
  });
  useEffect(() => {
    setValue(question.choice);
  }, [question]);

  return (
    <div className="mb-8">
      <h4 className="font-semibold text-black">
        <span className="text-red-600 font-bold">
          {question.question.answer === value ? (
            <span className="text-red-800">(Đúng)</span>
          ) : (
            <span className="text-blue-800">(Sai)</span>
          )}{" "}
          Câu {index}:{" "}
        </span>
        {question.question.question}
      </h4>
      <ul className="flex flex-col flex-wrap">
        {question.question.option_a !== "" && (
          <li className="flex items-start space-x-2">
            <Radio
              name={question._id}
              checked={
                value === "option_a" || question.question.answer === "option_a"
              }
              color={checkedColor(value, question.question.answer, "option_a")}
            />
            <span className="pt-2 text-black">
              <span className="font-bold">A.</span> {question.question.option_a}
            </span>
          </li>
        )}
        {question.question.option_b !== "" && (
          <li className="flex items-start space-x-2">
            <Radio
              name={question._id}
              checked={
                value === "option_b" || question.question.answer === "option_b"
              }
              color={checkedColor(value, question.question.answer, "option_b")}
            />
            <span className="pt-2 text-black">
              <span className="font-bold">B.</span> {question.question.option_b}
            </span>
          </li>
        )}
        {question.question.option_c !== "" && (
          <li className="flex items-start space-x-2">
            <Radio
              name={question._id}
              checked={
                value === "option_c" || question.question.answer === "option_c"
              }
              color={checkedColor(value, question.question.answer, "option_c")}
            />
            <span className="pt-2 text-black">
              <span className="font-bold">C.</span> {question.question.option_c}
            </span>
          </li>
        )}
        {question.question.option_d !== "" && (
          <li className="flex items-start space-x-2">
            <Radio
              name={question._id}
              checked={
                value === "option_d" || question.question.answer === "option_d"
              }
              color={checkedColor(value, question.question.answer, "option_d")}
            />
            <span className="pt-2 text-black">
              <span className="font-bold">D.</span> {question.question.option_d}
            </span>
          </li>
        )}
        {question.question.option_e !== ""  && (
          <li className="flex items-start space-x-2">
            <Radio
              name={question._id}
              checked={
                value === "option_d" || question.question.answer === "option_e"
              }
              color={checkedColor(value, question.question.answer, "option_e")}
            />
            <span className="pt-2 text-black">
              <span className="font-bold">E.</span> {question.question.option_e}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default CauhoiDathi;
