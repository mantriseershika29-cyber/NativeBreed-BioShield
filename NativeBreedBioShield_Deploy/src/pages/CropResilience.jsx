
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Sprout,
  Plus,
  Search,
  Trash2,
  X,
  CloudRain,
  CalendarDays,
  MapPin,
  Activity,
  CheckCircle2,
  FlaskConical,
  Wheat,
} from "lucide-react";

const STORAGE_KEY = "nativebreed-bioshield-crop-trials-v1";

const crops = [
  "Rice",
  "Paddy",
  "Wheat",
  "Maize",
  "Groundnut",
  "Cotton",
  "Chilli",
  "Turmeric",
  "Sugarcane",
  "Millets",
  "Pulses",
  "Tomato",
  "Mango",
  "Banana",
  "Other",
];

const stresses = [
  "None observed",
  "Drought",
  "Heat stress",
  "Pest attack",
  "Crop disease",
  "Flooding",
  "Nutrient deficiency",
  "Soil salinity",
  "Other",
];

const soilTypes = [
  "Red soil",
  "Black soil",
  "Alluvial soil",
  "Sandy soil",
  "Clay soil",
  "Loamy soil",
  "Laterite soil",
  "Other",
];

const trialMethods = [
  "Standard practice comparison",
  "Improved farming practice",
  "Water management trial",
  "Soil health trial",
  "Pest management trial",
  "Organic farming trial",
  "Drought resilience trial",
  "Other",
];

const emptyForm = {
  farmerName: "",
  village: "",
  district: "",
  crop: "Rice",
  soilType: "Red soil",
  plantingDate: "",
  trialMethod: "Standard practice comparison",
  stress: "None observed",
  risk: "Low",
  observations: "",
  action: "",
};

const demoTrials = [
  {
    id: "TRIAL-001",
    farmerName: "Demo Farmer 1",
    village: "Demo Village A",
    district: "Visakhapatnam",
    crop: "Rice",
    soilType: "Red soil",
    plantingDate: "2026-09-10",
    trialMethod: "Standard practice comparison",
    stress: "None observed",
    risk: "Low",
    observations: "Sample crop observation.",
    action: "Continue regular monitoring.",
    createdAt: "Demo record",
  },
  {
    id: "TRIAL-002",
    farmerName: "Demo Farmer 2",
    village: "Demo Village B",
    district: "Vizianagaram",
    crop: "Groundnut",
    soilType: "Sandy soil",
    plantingDate: "2026-09-15",
    trialMethod: "Drought resilience trial",
    stress: "Drought",
    risk: "Medium",
    observations: "Sample observation of dry soil.",
    action: "Check soil moisture and irrigation needs.",
    createdAt: "Demo record",
  },
];

function loadTrials() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : demoTrials;
    }

    return demoTrials;
  } catch {
    return demoTrials;
  }
}

export default function CropResilience({ onBack }) {
  const [trials, setTrials] = useState(loadTrials);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const filteredTrials = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return trials;

    return trials.filter((trial) =>
      [
        trial.id,
        trial.farmerName,
        trial.village,
        trial.district,
        trial.crop,
        trial.soilType,
        trial.stress,
        trial.risk,
        trial.trialMethod,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [trials, search]);

  const highRiskCount = trials.filter(
    (trial) => trial.risk === "High"
  ).length;

  const activeStressCount = trials.filter(
    (trial) => trial.stress !== "None observed"
  ).length;

  const cropCount = new Set(
    trials.map((trial) => trial.crop)
  ).size;

  function saveTrials(nextTrials) {
    setTrials(nextTrials);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextTrials)
      );
      return true;
    } catch {
      setNotice(
        "Records are available for this session, but browser storage is unavailable."
      );
      return false;
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openForm() {
    setForm(emptyForm);
    setError("");
    setNotice("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setShowForm(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (
      !form.farmerName.trim() ||
      !form.village.trim() ||
      !form.district.trim()
    ) {
      setError("Please fill in the farmer and location details.");
      return;
    }

    if (
      form.plantingDate &&
      form.plantingDate > new Date().toISOString().slice(0, 10)
    ) {
      setError("Planting date cannot be in the future.");
      return;
    }

    const newTrial = {
      ...form,
      farmerName: form.farmerName.trim(),
      village: form.village.trim(),
      district: form.district.trim(),
      id: `TRIAL-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toLocaleDateString("en-IN"),
    };

    saveTrials([newTrial, ...trials]);
    setForm(emptyForm);
    setShowForm(false);
    setNotice("Crop trial registered successfully.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteTrial(id) {
    const trial = trials.find((item) => item.id === id);

    if (!trial) return;

    if (
      !window.confirm(
        `Delete the crop trial for ${trial.crop} (${trial.id})?`
      )
    ) {
      return;
    }

    saveTrials(trials.filter((item) => item.id !== id));
    setNotice("Crop trial deleted.");
  }

  return (
    <div className="registry-page crop-resilience-page">
      <header className="registry-topbar">
        <button
          className="registry-back-button"
          type="button"
          onClick={
            showForm
              ? closeForm
              : onBack
          }
        >
          <ArrowLeft size={17} />
          {showForm ? "Back to crop trials" : "Back to dashboard"}
        </button>

        <div className="registry-brand">
          <div className="registry-brand-icon">
            <Sprout size={19} />
          </div>
          <div>
            <strong>NativeBreed BioShield</strong>
            <span></span>
          </div>
        </div>
      </header>

      {showForm ? (
        <main className="registry-content crop-form-page">
          <div className="registry-heading">
            <div>
              <p className="registry-eyebrow">CROP MONITORING</p>
              <h1>Register a crop trial</h1>
              <p className="registry-subtitle">
                Record crop details, farming practices and field observations.
              </p>
            </div>
          </div>

          <section className="registry-panel crop-form-panel">
            <div className="registry-panel-heading">
              <div>
                <h2>Trial information</h2>
                <p>Enter the details of the field trial.</p>
              </div>
              <span className="registry-summary-icon">
                <Wheat size={20} />
              </span>
            </div>

            <form
              className="registry-form"
              onSubmit={handleSubmit}
            >
              <label>
                Farmer name *
                <input
                  name="farmerName"
                  value={form.farmerName}
                  onChange={handleChange}
                  placeholder="Enter farmer name"
                  maxLength={80}
                  required
                />
              </label>

              <label>
                Village / town *
                <input
                  name="village"
                  value={form.village}
                  onChange={handleChange}
                  placeholder="Enter village or town"
                  maxLength={80}
                  required
                />
              </label>

              <label>
                District *
                <input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Enter district"
                  maxLength={80}
                  required
                />
              </label>

              <label>
                Crop type *
                <select
                  name="crop"
                  value={form.crop}
                  onChange={handleChange}
                  required
                >
                  {crops.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Soil type *
                <select
                  name="soilType"
                  value={form.soilType}
                  onChange={handleChange}
                  required
                >
                  {soilTypes.map((soil) => (
                    <option key={soil} value={soil}>
                      {soil}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Planting date
                <input
                  type="date"
                  name="plantingDate"
                  value={form.plantingDate}
                  onChange={handleChange}
                  max={new Date().toISOString().slice(0, 10)}
                />
              </label>

              <label className="registry-full-width">
                Trial method *
                <select
                  name="trialMethod"
                  value={form.trialMethod}
                  onChange={handleChange}
                  required
                >
                  {trialMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Crop stress observed *
                <select
                  name="stress"
                  value={form.stress}
                  onChange={handleChange}
                  required
                >
                  {stresses.map((stress) => (
                    <option key={stress} value={stress}>
                      {stress}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Risk level *
                <select
                  name="risk"
                  value={form.risk}
                  onChange={handleChange}
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>

              <label className="registry-full-width">
                Field observations
                <textarea
                  name="observations"
                  value={form.observations}
                  onChange={handleChange}
                  placeholder="Describe what you observed in the field..."
                  maxLength={1000}
                  rows={4}
                />
              </label>

              <label className="registry-full-width">
                Suggested follow-up action
                <textarea
                  name="action"
                  value={form.action}
                  onChange={handleChange}
                  placeholder="Record the next action or expert advice needed..."
                  maxLength={1000}
                  rows={3}
                />
              </label>

              {error && (
                <p
                  className="registry-error registry-full-width"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <div className="registry-form-actions registry-full-width">
                <button
                  className="registry-secondary-button"
                  type="button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  className="registry-primary-button"
                  type="submit"
                >
                  <Plus size={14} />
                  Save crop trial
                </button>
              </div>
            </form>
          </section>
        </main>
      ) : (
        <main className="registry-content">
          <div className="registry-heading">
            <div>
              <p className="registry-eyebrow">SUSTAINABLE AGRICULTURE</p>
              <h1>Crop Resilience</h1>
              <p className="registry-subtitle">
                Monitor crop trials, field stress and resilience practices.
              </p>
            </div>

            <button
              className="registry-primary-button"
              type="button"
              onClick={openForm}
            >
              <Plus size={14} />
              Register crop trial
            </button>
          </div>

          {notice && (
            <p className="registry-success" role="status">
              <CheckCircle2 size={16} />
              {notice}
            </p>
          )}

          <div className="registry-summary">
            <div className="registry-summary-card">
              <span className="registry-summary-icon">
                <FlaskConical size={20} />
              </span>
              <span>Total crop trials</span>
              <strong>{trials.length}</strong>
            </div>

            <div className="registry-summary-card">
              <span className="registry-summary-icon">
                <CloudRain size={20} />
              </span>
              <span>Stress observations</span>
              <strong>{activeStressCount}</strong>
            </div>

            <div className="registry-summary-card">
              <span className="registry-summary-icon">
                <Activity size={20} />
              </span>
              <span>High-risk trials</span>
              <strong>{highRiskCount}</strong>
            </div>

            <div className="registry-summary-card">
              <span className="registry-summary-icon">
                <Sprout size={20} />
              </span>
              <span>Crop types monitored</span>
              <strong>{cropCount}</strong>
            </div>
          </div>

          <section className="registry-panel">
            <div className="registry-panel-heading">
              <div>
                <h2>Crop trial records</h2>
                <p>
                  Search by trial ID, farmer, crop, location or stress.
                </p>
              </div>

              <label className="registry-search">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search trials..."
                  aria-label="Search crop trials"
                />
              </label>
            </div>

            <div className="registry-table-wrap">
              <table className="registry-table">
                <thead>
                  <tr>
                    <th>Trial ID</th>
                    <th>Farmer / Location</th>
                    <th>Crop</th>
                    <th>Soil</th>
                    <th>Stress</th>
                    <th>Risk</th>
                    <th>Planting date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTrials.length > 0 ? (
                    filteredTrials.map((trial) => (
                      <tr key={trial.id}>
                        <td><strong>{trial.id}</strong></td>
                        <td>
                          {trial.farmerName}
                          <br />
                          <span className="registry-muted">
                            <MapPin size={12} /> {trial.village}, {trial.district}
                          </span>
                        </td>
                        <td>{trial.crop}</td>
                        <td>{trial.soilType}</td>
                        <td>{trial.stress}</td>
                        <td>
                          <span
                            className={`crop-risk-badge ${trial.risk.toLowerCase()}`}
                          >
                            {trial.risk}
                          </span>
                        </td>
                        <td>
                          {trial.plantingDate || "Not provided"}
                        </td>
                        <td>
                          <button
                            className="registry-delete-button"
                            type="button"
                            onClick={() => deleteTrial(trial.id)}
                            aria-label={`Delete ${trial.id}`}
                            title="Delete trial"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="registry-empty" colSpan="8">
                        {search
                          ? "No crop trials match your search."
                          : "No crop trials yet. Register your first trial."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="registry-panel crop-guidance-panel">
            <div className="registry-panel-heading">
              <div>
                <h2>Field monitoring guide</h2>
                <p>Use observations to decide what needs attention.</p>
              </div>
              <CalendarDays size={20} />
            </div>

            <div className="crop-guidance-grid">
              <div>
                <span className="crop-risk-badge low">Low</span>
                <h3>Routine monitoring</h3>
                <p>Continue scheduled field checks and record changes.</p>
              </div>
              <div>
                <span className="crop-risk-badge medium">Medium</span>
                <h3>Investigate</h3>
                <p>Inspect the affected area and consult an agricultural expert.</p>
              </div>
              <div>
                <span className="crop-risk-badge high">High</span>
                <h3>Prompt assessment</h3>
                <p>Arrange timely expert assessment and document recommended actions.</p>
              </div>
            </div>
            <p className="registry-note">
              Risk levels are manually entered demo classifications, not
              AI predictions or verified agronomic diagnoses. This prototype
              stores records in this browser, not a secure shared database.
            </p>
          </section>
        </main>
      )}
    </div>
  );
}
