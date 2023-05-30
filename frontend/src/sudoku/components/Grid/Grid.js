import React from "react";
import { Table, TableBody, TableRow } from "@mui/material";
import { Node } from "./../index.js";
// import "animate.css";

const Grid = ({ grid, handleCellClick }) => {
  return (
    <Table sx={{display: 'flex', flexDirection: 'column', p: '12px'}} >
        <TableBody sx={{backgroundColor: 'white', border: '2px solid #141c3a', borderCollapse: 'collapse', m: '0 auto'}}>
        {grid &&
          grid.map((row, rowIndex) => {
            return (
              <TableRow className="row" key={rowIndex} sx={{border: '1px solid #141c3a'}}>
                {row.map((cell, columnIndex) => {
                  return (
                    <Node
                      key={rowIndex + "-" + columnIndex}
                      cell={cell}
                      handleClickCallback={handleCellClick}
                    />
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
    </Table>
  );
};

export default Grid;
