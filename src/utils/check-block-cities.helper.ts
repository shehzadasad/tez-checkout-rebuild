export const checkBlockCitiesHelper = (
  identityToken: string,
  cityName?: string | null
): boolean => {
  const blockCitiesArray = [
    "lahore",
    "gujrat",
    "gujranwala",
    "sialkot",
    "rawalpindi",
    "multan",
    "kasur",
    "islamabad",
    "rahim yar khan",
    "sheikhupura",
    "okara",
    "sahiwal",
    "faisalabad",
    "peshawar",
    "raiwind",
    "hyderabad",
    "jhelum",
    "sukkur",
  ];
  return (
    identityToken == "d3d3Lm11bHR5bmV0LmNvbS5waw==" &&
    !blockCitiesArray.includes(cityName ?  cityName.toLowerCase() : "")
  );
};
