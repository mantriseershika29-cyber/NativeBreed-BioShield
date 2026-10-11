
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./IndiaExplorer.css";

const locations = [
  {
    id: "andhra",
    state: "Andhra Pradesh",
    place: "Ongole",
    position: [15.5057, 80.0499],
    breeds: ["Ongole", "Punganur", "Motu"],
    crops: ["Rice", "Chilli", "Cotton", "Groundnut"],
    note: "Known for the Ongole cattle breed.",
    description: "Explore cattle breeds and crops associated with Andhra Pradesh."
  },
  {
    id: "gujarat",
    state: "Gujarat",
    place: "Junagadh",
    position: [21.5222, 70.4579],
    breeds: ["Gir", "Kankrej", "Nari", "Dagri"],
    crops: ["Cotton", "Groundnut", "Wheat", "Pearl millet"],
    note: "Gir cattle are associated with Gujarat.",
    description: "Explore livestock and important agricultural crops in Gujarat."
  },
  {
    id: "punjab",
    state: "Punjab",
    place: "Ludhiana",
    position: [30.9010, 75.8573],
    breeds: ["Sahiwal"],
    crops: ["Wheat", "Rice", "Maize", "Cotton"],
    note: "Sahiwal cattle are associated with Punjab and Rajasthan.",
    description: "Explore livestock and crops associated with Punjab."
  },
  {
    id: "rajasthan",
    state: "Rajasthan",
    place: "Jodhpur",
    position: [26.2389, 73.0243],
    breeds: ["Tharparkar", "Rathi", "Nagori", "Kankrej"],
    crops: ["Pearl millet", "Mustard", "Wheat", "Pulses"],
    note: "Several native cattle breeds are associated with Rajasthan.",
    description: "Explore livestock and crops suited to different parts of Rajasthan."
  },
  {
    id: "haryana",
    state: "Haryana",
    place: "Hisar",
    position: [29.1492, 75.7217],
    breeds: ["Hariana", "Belahi"],
    crops: ["Wheat", "Rice", "Mustard", "Cotton"],
    note: "Hariana cattle are associated with Haryana and nearby states.",
    description: "Explore Haryana's livestock and agricultural crops."
  },
  {
    id: "karnataka",
    state: "Karnataka",
    place: "Mysuru",
    position: [12.2958, 76.6394],
    breeds: ["Amritmahal", "Hallikar", "Malnad Gidda", "Koppal"],
    crops: ["Ragi", "Rice", "Coffee", "Sugarcane"],
    note: "Karnataka has several registered native cattle breeds.",
    description: "Explore Karnataka's cattle diversity and major crops."
  },
  {
    id: "tamilnadu",
    state: "Tamil Nadu",
    place: "Madurai",
    position: [9.9252, 78.1198],
    breeds: ["Kangayam", "Bargur", "Umblachery", "Pulikulam"],
    crops: ["Rice", "Sugarcane", "Cotton", "Millets"],
    note: "Kangayam and Pulikulam are associated with Tamil Nadu.",
    description: "Explore native cattle breeds and crop-growing regions."
  },
  {
    id: "kerala",
    state: "Kerala",
    place: "Kochi",
    position: [9.9312, 76.2673],
    breeds: ["Vechur", "Periyar"],
    crops: ["Coconut", "Rubber", "Rice", "Pepper"],
    note: "Vechur and Periyar cattle are associated with Kerala.",
    description: "Explore livestock and crops in Kerala."
  },
  {
    id: "odisha",
    state: "Odisha",
    place: "Bhubaneswar",
    position: [20.2961, 85.8245],
    breeds: ["Ghumusari", "Binjharpuri", "Khariar", "Motu"],
    crops: ["Rice", "Pulses", "Groundnut", "Millets"],
    note: "Odisha has multiple registered indigenous cattle breeds.",
    description: "Explore native cattle breeds and crops in Odisha."
  },
  {
    id: "madhya",
    state: "Madhya Pradesh",
    place: "Bhopal",
    position: [23.2599, 77.4126],
    breeds: ["Malvi", "Nimari", "Gaolao", "Mahakaushali"],
    crops: ["Soybean", "Wheat", "Pulses", "Maize"],
    note: "Several cattle breeds have home tracts in Madhya Pradesh.",
    description: "Explore livestock and crops across Madhya Pradesh."
  },
  {
    id: "uttar",
    state: "Uttar Pradesh",
    place: "Lucknow",
    position: [26.8467, 80.9462],
    breeds: ["Kherigarh", "Kenkatha", "Ponwar", "Gangatiri"],
    crops: ["Wheat", "Rice", "Sugarcane", "Potato"],
    note: "Multiple native cattle breeds are associated with Uttar Pradesh.",
    description: "Explore cattle breeds and crops in Uttar Pradesh."
  },
  {
    id: "bihar",
    state: "Bihar",
    place: "Patna",
    position: [25.5941, 85.1376],
    breeds: ["Bachaur", "Purnea", "Gangatiri"],
    crops: ["Rice", "Wheat", "Maize", "Pulses"],
    note: "Bachaur and Purnea cattle are associated with Bihar.",
    description: "Explore livestock and major crops in Bihar."
  },
  {
    id: "assam",
    state: "Assam",
    place: "Guwahati",
    position: [26.1445, 91.7362],
    breeds: ["Lakhimi", "Thutho"],
    crops: ["Rice", "Tea", "Mustard", "Jute"],
    note: "Lakhimi cattle are associated with Assam.",
    description: "Explore livestock and crops in Assam."
  },
  {
    id: "maharashtra",
    state: "Maharashtra",
    place: "Pune",
    position: [18.5204, 73.8567],
    breeds: ["Deoni", "Khillar", "Red Kandhari", "Dangi"],
    crops: ["Cotton", "Sugarcane", "Soybean", "Jowar"],
    note: "Maharashtra has several registered indigenous cattle breeds.",
    description: "Explore native cattle breeds and major crops in Maharashtra."
  },
  {
    id: "uttarakhand",
    state: "Uttarakhand",
    place: "Dehradun",
    position: [30.3165, 78.0322],
    breeds: ["Badri"],
    crops: ["Rice", "Wheat", "Millets", "Pulses"],
    note: "Badri cattle are associated with Uttarakhand.",
    description: "Explore livestock and crops in Uttarakhand."
  },
  {
    id: "jharkhand",
    state: "Jharkhand",
    place: "Ranchi",
    position: [23.3441, 85.3096],
    breeds: ["Medini"],
    crops: ["Rice", "Maize", "Pulses", "Oilseeds"],
    note: "Medini cattle are associated with Jharkhand.",
    description: "Explore livestock and crops in Jharkhand."
  }
];

function FocusMap({ location }) {
  const map = useMap();

  if (location) {
    map.flyTo(location.position, 7, { duration: 0.8 });
  }

  return null;
}

export default function IndiaExplorer() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const filteredLocations = locations.filter((location) =>
    `${location.state} ${location.place}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function chooseLocation(location) {
    setSelected(location);
  }

  return (
    <div className="india-explorer">
      <header className="explorer-header">
        <div>
          <p className="explorer-eyebrow">NATIVEBREED BIOSHIELD</p>
          <h1>India Breed & Crop Explorer</h1>
          <p>
            Explore native cattle breeds and major crops by region.
            Select a marker on the map to learn more.
          </p>
        </div>
        <div className="explorer-count">
          <strong>{locations.length}</strong>
          <span>exploration points</span>
        </div>
      </header>

      <div className="explorer-search">
        <label htmlFor="location-search">Find a state or location</label>
        <input
          id="location-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Try Andhra Pradesh or Gujarat..."
        />
      </div>

      <div className="explorer-layout">
        <section className="map-card">
          <div className="map-card-heading">
            <h2>Explore India</h2>
            <span>Click a green marker</span>
          </div>

          <div className="india-map">
            <MapContainer
              center={[22.8, 79.0]}
              zoom={4.5}
              minZoom={3.5}
              maxZoom={12}
              scrollWheelZoom={true}
              className="leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <FocusMap location={selected} />

              {filteredLocations.map((location) => (
                <CircleMarker
                  key={location.id}
                  center={location.position}
                  radius={selected?.id === location.id ? 10 : 7}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 2,
                    fillColor:
                      selected?.id === location.id
                        ? "#e8a33e"
                        : "#237548",
                    fillOpacity: 0.95
                  }}
                  eventHandlers={{
                    click: () => chooseLocation(location)
                  }}
                >
                  <Popup>
                    <strong>{location.place}</strong>
                    <br />
                    {location.state}
                    <br />
                    <button
                      type="button"
                      onClick={() => chooseLocation(location)}
                    >
                      View breeds and crops
                    </button>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          <p className="map-note">
            Markers represent example exploration locations, not exact
            boundaries or the full distribution of each breed.
          </p>
        </section>

        <aside className="location-panel">
          {!selected ? (
            <div className="empty-location">
              <span className="empty-location-icon">📍</span>
              <h2>Select a location</h2>
              <p>
                Click any map marker or choose a location below to view
                its cattle breeds and crops.
              </p>

              <div className="location-list">
                {filteredLocations.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    className="location-option"
                    onClick={() => chooseLocation(location)}
                  >
                    <span>{location.place}</span>
                    <small>{location.state}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="location-details">
              <span className="detail-label">SELECTED REGION</span>
              <h2>{selected.state}</h2>
              <p className="detail-place">{selected.place} exploration point</p>
              <p className="detail-description">{selected.description}</p>

              <section className="detail-section">
                <h3>🐄 Native cattle breeds</h3>
                <p className="detail-help">
                  Breeds associated with this state or its wider home tract.
                </p>
                <div className="detail-tags">
                  {selected.breeds.map((breed) => (
                    <span key={breed} className="detail-tag" >
                      {breed}
                    </span>
                  ))}
                </div>
              </section>

              <section className="detail-section">
                <h3>🌾 Major crops</h3>
                <p className="detail-help">
                  Examples of crops grown in the region.
                </p>
                <div className="detail-tags crop-tags">
                  {selected.crops.map((crop) => (
                    <span key={crop} className="detail-tag">
                      {crop}
                    </span>
                  ))}
                </div>
              </section>

              <div className="region-note">
                <strong>Did you know?</strong>
                <p>{selected.note}</p>
              </div>

              <button
                className="change-location-button"
                type="button"
                onClick={() => setSelected(null)}
              >
                Choose another location
              </button>
            </div>
          )}
        </aside>
      </div>

      <footer className="explorer-footer">
        Breed references: ICAR–NBAGR. Crop lists are introductory examples
        and should be checked against current state and district agriculture
        data before being used for farm decisions.
      </footer>
    </div>
  );
}
