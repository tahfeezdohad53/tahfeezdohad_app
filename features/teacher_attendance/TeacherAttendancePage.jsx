"use client";

import toast from "react-hot-toast";

function isInsideDiameter(userLat, userLon, centerLat, centerLon) {
  const R = 6371000; // Earth radius in meters

  const toRad = (deg) => (deg * Math.PI) / 180;

  const φ1 = toRad(userLat);
  const φ2 = toRad(centerLat);

  const Δφ = toRad(centerLat - userLat);
  const Δλ = toRad(centerLon - userLon);

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return distance <= 10; // 5m radius = 10m diameter
}

async function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(handleCheckIn, () =>
    toast.error("failed to get location!"),
  );
}

function handleCheckIn(location) {
  const lat = location.coords.latitude;
  const lng = location.coords.longitude;

  const isAtLocation = isInsideDiameter(lat, lng, 22.832626, 74.2558637);
  if (isAtLocation) checkIn();
  else toast.error("not at location");
}

function TeacherAttendancePage() {
  return (
    <div className="p-5">
      <button onClick={getCurrentLocation} className="bg-(--primary) text-white p-2 rounded-md text-xs">check in</button>
    </div>
  );
}

export default TeacherAttendancePage;
