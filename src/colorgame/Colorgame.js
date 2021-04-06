import React, { useState } from "react";
import "./Colorgame.css";

function Colorgame() {
  const [color, setColor] = useState("aqua");
  const [showColor, setShowColor] = useState("");
  //new rgb values randomly generated
  const [redValue, setRedValue] = useState(0);
  const [greenValue, setGreenValue] = useState(0);
  const [blueValue, setBlueValue] = useState(0);
  //colors that are set by the user
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const square = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `${color}`,
    borderRadius: "20px",
    height: "400px",
    width: "400px",
    marginTop: "2em",
  };

  const newcolorHandler = () => {
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);
    setRedValue(r);
    setGreenValue(g);
    setBlueValue(b);
    setShowColor(`Red: ${r}, Green: ${g}, Blue: ${b}`);
    return setColor(`rgb(${r},${g},${b})`);
  };
  /*   console.log(redValue + " " + greenValue + " " + blueValue); */
  const checkAnswerHandler = () => {
    let differenceRed, differenceGreen, differenceBlue, totalDiffernece;
    differenceRed = Math.abs(red - redValue);
    differenceBlue = Math.abs(blue - blueValue);
    differenceGreen = Math.abs(green - greenValue);
    totalDiffernece = differenceRed + differenceBlue + differenceGreen;
    setScore(Math.ceil(((765 - totalDiffernece) / 765) * 100));
    console.log(differenceRed + " " + differenceGreen + " " + differenceBlue);
  };

  return (
    <div className="colorgame">
      <div style={square}></div>
      <div className="colorgame_sliders">
        <div className="color_slider_name">
          {" "}
          <input
            type="range"
            min="0"
            max="255"
            onChange={(e) => setRed(e.target.value)}
            id="red"
          />
          <span className="span_colorvalues">{red}</span>
        </div>
        <div className="color_slider_name">
          <input
            type="range"
            min="0"
            max="255"
            id="green"
            onChange={(e) => setGreen(e.target.value)}
          />{" "}
          <span className="span_colorvalues">{green}</span>
        </div>
        <div className="color_slider_name">
          <input
            type="range"
            min="0"
            max="255"
            id="blue"
            onChange={(e) => setBlue(e.target.value)}
          />
          <span className="span_colorvalues">{blue}</span>
        </div>
      </div>
      <div className="colorgame_buttons">
        <button onClick={checkAnswerHandler} className="colorgame-btn">
          Check Answer
        </button>
        {score + " %"}
        <button onClick={newcolorHandler} className="colorgame-btn">
          Generate Random Color
        </button>
        <button
          className="colorgame-btn"
          onClick={() => {
            setShowAnswer(!showAnswer);
          }}
        >
          Show Answer
        </button>
        {showAnswer ? showColor : null}
      </div>
    </div>
  );
}

export default Colorgame;
