async function initVelos() {
    //Initialisation de la carte (Nancy)
    const map = L.map("map").setView([48.6921, 6.1844], 13);
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map);
  
    //Chargement des données
    const infoResponse = await fetch(
      "https://api.cyclocity.fr/contracts/nancy/gbfs/station_information.json"
    );
    const statusResponse = await fetch(
      "https://api.cyclocity.fr/contracts/nancy/gbfs/station_status.json"
    );
  
    const infoData = await infoResponse.json();
    const statusData = await statusResponse.json();
  
    const stationsInfo = infoData.data.stations;
    const stationsStatus = statusData.data.stations;
  
    //Station_id → status
    const statusMap = {};
    stationsStatus.forEach(s => {
      statusMap[s.station_id] = s;
    });
  
    //Ajout des marqueurs
    stationsInfo.forEach(station => {
      const status = statusMap[station.station_id];
      if (!status) return;
  
      L.marker([station.lat, station.lon])
        .addTo(map)
        .bindPopup(
          `<strong>${station.name}</strong><br/>
           Vélos disponibles : ${status.num_bikes_available}<br/>
           Place disponible : ${status.num_docks_available}`
        );
    });
  }

  initVelos();
  