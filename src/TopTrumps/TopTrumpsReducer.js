export const initalState = {
  results: [],
  aiDeck: [],
  userDeck: [],
  allTrumps: [],
  error: null,
  loading: false,
  nextAiTrump: null,
  nextUserTrump: null,
  gameOver: false,
  winner: null
};

export default function topTrumpsReducer(state, [action, payload]) {
  switch (action) {
    case "LOADING_PLAYERS":
      return {
        ...state,
        error: null,
        loading: true
      };
    case "LOADED_PLAYERS":
      const { aiDeck, userDeck } = prepareTrumpDecks(payload);
      const { nextUserTrump, nextAiTrump } = getNextTrumps({
        aiDeck,
        userDeck
      });

      return {
        ...state,
        error: null,
        loading: false,
        aiDeck,
        nextUserTrump,
        nextAiTrump,
        allTrumps: payload, // but prepared use this to reset
        userDeck,
        metaStats: setMetaStats(payload)
      };
    case "GET_NEXT_TRUMPS": {
      const { nextUserTrump, nextAiTrump } = getNextTrumps(state);
      return {
        ...state,
        nextUserTrump,
        nextAiTrump
      };
    }
    case "MOVE_CARD_TO_AI": {
      const { aiDeck, userDeck } = state;

      if (userDeck.length === 1) {
        return { ...state, gameOver: true, winner: "AI" };
      }

      return {
        ...state,
        aiDeck: aiDeck.concat(payload),
        userDeck: userDeck.filter(trump => trump !== payload)
      };
    }
    case "MOVE_CARD_TO_USER": {
      const { aiDeck, userDeck } = state;
      if (aiDeck.length === 1) {
        return { ...state, gameOver: true, winner: "USER" };
      }
      return {
        ...state,
        aiDeck: aiDeck.filter(trump => trump !== payload),
        userDeck: userDeck.concat(payload)
      };
    }
    case "RESTART": {
      const { aiDeck, userDeck } = prepareTrumpDecks(state.allTrumps);
      const { nextUserTrump, nextAiTrump } = getNextTrumps({
        aiDeck,
        userDeck
      });
      return {
        ...initalState,
        allTrumps: state.allTrumps,
        nextUserTrump,
        nextAiTrump,
        aiDeck,
        userDeck
      };
    }
    case "RESULT": {
      return {
        ...state,
        results: state.results.concat(payload)
      };
    }
  }
}

function getNextTrumps({ aiDeck, userDeck }) {
  const nextAiTrump = aiDeck[Math.floor(Math.random() * aiDeck.length)];
  const nextUserTrump = userDeck[Math.floor(Math.random() * userDeck.length)];

  return { nextAiTrump, nextUserTrump };
}

function prepareTrumpDecks(players) {
  const preparedPlayerData = convertApiDate(players);
  const halfWayThough = Math.floor(preparedPlayerData.length / 2);
  const aiDeck = preparedPlayerData.slice(0, halfWayThough);
  const userDeck = preparedPlayerData.slice(
    halfWayThough,
    preparedPlayerData.length
  );
  return { aiDeck, userDeck };
}

function convertApiDate(players) {
  const fplImageUrl =
    "https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140";
  let filteredPlayers = players.filter(player => player.minutes > 0);
  filteredPlayers = shuffle(filteredPlayers);

  return filteredPlayers
    .slice(0, 30)
    .map(
      ({
        web_name,
        total_points,
        goals_scored,
        assists,
        minutes,
        id,
        code
      }) => ({
        name: web_name,
        photoUrl: `${fplImageUrl}/p${code}.png`,
        goals: goals_scored,
        assists,
        minutes,
        points: total_points
      })
    );
}

function setMetaStats(players) {
  const statKeys = ["total_points", "goals_scored", "assists", "minutes"];

  return {
    ...statKeys.reduce(
      (allStats, key) => ({
        ...allStats,
        [`highest_${key}`]: calculateHighestForKey(players, key)
      }),
      {}
    )
  };
}

function calculateHighestForKey(players, key) {
  return players.reduce((highest, player) => {
    return player[key] > highest ? player[key] : highest;
  }, 0);
}

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
function shuffle(arr) {
  let currentIndex = arr.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }

  return arr;
}
