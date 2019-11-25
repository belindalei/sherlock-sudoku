import React from "react";
import { Button, Popup } from "semantic-ui-react";

const InstructionPopup = () => (
  <Popup
    content="The rules of the game are simple: each of the nine blocks has to contain all the numbers 1-9 within its squares. Each number can only appear once in a row,column or box. The difficulty lies in that each vertical nine-square column, or horizontal nine-square line across, within the larger square, must also contain the numbers 1-9, without repetition or omission."
    on="click"
    basic
    trigger={
      <Button className="ui inverted primary button" content="Instructions" />
    }
  />
);

export default InstructionPopup;
