module.exports = function hostelCard(hostel) {
  return `
    <div>
      <h3>${hostel.name}</h3>
      <p>Location: ${hostel.location}</p>
      <p>Rooms: ${hostel.rooms}</p>
      <p>Price/Month: $${hostel.pricePerMonth}</p>
      <a href="/hostel/${hostel._id}">View Details</a>
    </div>
    <hr/>
  `;
};
