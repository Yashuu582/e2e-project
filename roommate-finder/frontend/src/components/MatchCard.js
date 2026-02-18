module.exports = function matchCard(roommate) {
  return `
    <div>
      <h3>${roommate.name}, ${roommate.age}</h3>
      <p>Gender: ${roommate.gender}</p>
      <p>Preferences: ${roommate.preferences || "None"}</p>
      <p>Email: ${roommate.email}</p>
    </div>
    <hr/>
  `;
};
