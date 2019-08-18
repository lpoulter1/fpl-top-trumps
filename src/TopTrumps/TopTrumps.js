import React, { useEffect, useReducer } from "react";
import doFetch from "../doFetch";
import topTrumpsReducer, { initalState } from "./TopTrumpsReducer";
import TrumpCard from "./TrumpCard";

import "./TopTrumps.css";

export default function TopTrumps() {
  const [state, dispatch] = useReducer(topTrumpsReducer, initalState);
  const {
    nextUserTrump,
    nextAiTrump,
    results,
    loading,
    userDeck,
    aiDeck,
    gameOver,
    winner
  } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch(["LOADING_PLAYERS"]);

      const playerData = await doFetch(
        "https://us-central1-fpl-player-api.cloudfunctions.net/bootstrapStatic"
      );

      dispatch(["LOADED_PLAYERS", playerData.elements]);
    };

    fetchData();
  }, []);

  function getNextPlayer() {
    dispatch(["GET_NEXT_TRUMPS"]);
  }

  function handleStatClick(stat) {
    const aiStat = nextAiTrump[stat.name];
    // const winner = aiStat > stat.amount ? "ai" : "user";

    if (aiStat > stat.amount) {
      dispatch(["MOVE_CARD_TO_AI", nextUserTrump]);
    } else {
      dispatch(["MOVE_CARD_TO_USER", nextAiTrump]);
    }

    // dispatch([
    //   "RESULT",
    //   `${stat.name} \n Yours: ${stat.amount}, AI: ${aiStat}, ${winner} is the winner`
    // ]);
    dispatch(["GET_NEXT_TRUMPS"]);
  }

  if (loading) return <p>"LOADING"</p>;

  if (gameOver)
    return (
      <p>
        Game over {winner} wins!
        <button onClick={() => dispatch(["RESTART", initalState])}>
          {" "}
          Play again
        </button>
      </p>
    );

  console.log("state", state);

  if (!nextAiTrump) return null;

  return (
    <div className="top-trumps">
      <button onClick={() => dispatch(["RESTART"])}>Reset Game</button>
      Player Card cards left: {userDeck.length}
      <TrumpCard
        nextPlayer={nextUserTrump}
        getNextPlayer={getNextPlayer}
        handleStatClick={handleStatClick}
      />
      AI Card cards left: {aiDeck.length}
      <TrumpCard nextPlayer={nextAiTrump} getNextPlayer={getNextPlayer} />
      {results.slice(-1)}
    </div>
  );
}
