import React from "react";
import TrumpStat from "./TrumpStat";

export default function TrumpCard({
  getNextPlayer,
  nextPlayer,
  handleStatClick
}) {
  const { name, photoUrl, ...playerStats } = nextPlayer;

  return (
    <div className="trump-card">
      <div>Player Name: {name}</div>
      <img src={photoUrl} />
      {Object.keys(playerStats).map(key => {
        const stat = { name: key, amount: playerStats[key] };
        return (
          <TrumpStat
            key={key}
            stat={stat}
            onClick={() => handleStatClick(stat)}
          />
        );
      })}
      <button onClick={getNextPlayer}>Next Card</button>
    </div>
  );
}
