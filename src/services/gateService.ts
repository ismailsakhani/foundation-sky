export const gateService = {
  getGateInfo: async (gateId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const id = gateId.toUpperCase();

    // STRICT MOCK CONDITION: Only works for C101
    if (!id.includes("C101")) {
      throw new Error(`Gate ${id} not found. (Mock only supports C101)`);
    }

    return {
      gate: "C101",
      terminal: "Terminal C",
      airport: "KEWR",
      currentFlight: {
        flightNumber: "UA4433",
        destination: "KORD",
        status: "boarding",
        aircraftType: "B739",
        scheduledDeparture: "14:00 EDT",
        estimatedDeparture: "14:45 EDT",
      },
      upcomingFlights: [
        {
          flightNumber: "UA1455",
          destination: "KMCO",
          status: "scheduled",
          aircraftType: "A320",
          scheduledDeparture: "16:30 EDT",
        },
        {
          flightNumber: "UA492",
          destination: "KSFO",
          status: "scheduled",
          aircraftType: "B752",
          scheduledDeparture: "19:00 EDT",
        },
      ],
    };
  },
};