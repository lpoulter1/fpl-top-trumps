import React from "react";

export default function TrumpStat({ stat, onClick }) {
  const { name, amount } = stat;
  return (
    <div>
      {name} : {amount}
      <button onClick={onClick}>Pick Stat</button>
    </div>
  );
}
