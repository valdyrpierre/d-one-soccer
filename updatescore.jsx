import React, { useState } from 'react';

const teams = ["soley leve", "g city", "unstoppable"];

function UpdateScore() {
  const [scores, setScores] = useState([0, 0, 0]);

  const handleScoreChange = (index, value) => {
    const newScores = [...scores];
    newScores[index] = Math.max(0, Number(value)); // Prevent negative scores
    setScores(newScores);
  };

  return (
    <div>
      <h2>Update Scores</h2>
      {teams.map((team, idx) => (
        <div key={team}>
          <label>
            {team}: 
            <input
              type="number"
              min="0"
              value={scores[idx]}
              onChange={e => handleScoreChange(idx, e.target.value)}
            />
          </label>
        </div>
      ))}
    </div>
  );
}

export default UpdateScore;
