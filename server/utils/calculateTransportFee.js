export const calculateTransportFee = ({
  farmer,
  wholesaler,
  transport,
}) => {
  const BASE_FEE = 500;

  let fee = BASE_FEE;

  // Farmer → Transport (pickup matters most)
  if (transport.district === farmer.district) {
    fee += 0;
  } else if (transport.division === farmer.division) {
    fee += 300;
  } else {
    fee += 700;
  }

  // Farmer → Wholesaler (delivery, smaller weight)
  if (wholesaler.district === farmer.district) {
    fee += 0;
  } else if (wholesaler.division === farmer.division) {
    fee += 150;
  } else {
    fee += 300;
  }

  return fee;
};
