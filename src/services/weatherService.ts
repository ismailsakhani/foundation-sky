import type { AirportWeather } from "@/types/api";

export const weatherService = {
  getAirportWeather: async (airportCode: string): Promise<AirportWeather> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const code = airportCode.toUpperCase();
    
    // STRICT MOCK CONDITION: Only works for KEWR or EWR
    if (code !== "KEWR" && code !== "EWR") {
      throw new Error(`No weather data found for ${code}. (Mock only supports KEWR)`);
    }

    return {
      icao: "KEWR",
      name: "Newark Liberty Intl (Mocked Data)",
      nas: {
        hasDelays: true,
        groundDelay: "Average delay 45 mins due to weather.",
        groundStop: null,
        airspaceFlowProgram: null,
        notes: ["FCA EWR GROUND STOP: UPDATE EXPECTED 2000Z"],
      },
      metar: {
        zt: '<span class="published-color2">5 mins ago</span>',
        raw: `KEWR 241451Z 31015G25KT <span class="red_text_color">2SM</span> -SN <span class="pink_text_color">BKN004</span> <span class="red_text_color">OVC008</span> M02/M05 <span class="box_around_text">A2985</span> RMK AO2 SNB42 SLP108 P0002 T10221050`,
      },
      taf: {
        zt: "45 mins ago",
        raw: `TAF KEWR 241130Z 2412/2518 31015G25KT <span class="red_text_color">2SM</span> -SN <span class="pink_text_color">OVC004</span><br>    FM241500 32012G20KT 5SM -SN SCT015 <span class="yellow_highlight">OVC025</span><br>    FM241800 33010KT P6SM SCT030`,
      },
      datis: {
        zt: '<span class="published-color2">12 mins ago</span>',
        raw: `EWR <span class="box_around_text">ATIS INFO Z</span> 1451Z. 31015G25KT <span class="red_text_color">2SM</span> -SN <span class="pink_text_color">BKN004</span> M02/M05 <span class="box_around_text">A2985</span>. <span class="box_around_text">ILS RWY 22L APCH IN USE.</span> <span class="yellow_warning">LLWS REPORTED ON FINAL.</span> DEPARTING RY 22R. READBACK ALL RUNWAY HOLD SHORT INSTRUCTIONS. ...ADVS YOU HAVE INFO Z.`,
      },
    };
  },
};