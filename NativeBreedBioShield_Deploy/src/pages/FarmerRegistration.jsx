
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  Trash2,
  ShieldCheck,
  MapPin,
  CheckCircle2,
} from "lucide-react";

const STORAGE_KEY = "nativebreed-bioshield-farmers-v1";

const emptyForm = {
  fullName: "",
  phone: "",
  village: "",
  district: "",
  state: "Andhra Pradesh",
  farmerType: "Livestock farmer",
  herdSize: "",
  preferredLanguage: "Telugu",
  consent: false,
};

const demoFarmers = [
  {
    id: "FAR-001",
    fullName: "Demo Farmer 1",
    phone: "9XXXXXXXX1",
    village: "Demo Village A",
    district: "Visakhapatnam",
    state: "Andhra Pradesh",
    farmerType: "Livestock farmer",
    herdSize: "12",
    preferredLanguage: "Telugu",
    consent: true,
    status: "Registered",
    createdAt: "Demo record",
  },
  {
    id: "FAR-002",
    fullName: "Demo Farmer 2",
    phone: "9XXXXXXXX2",
    village: "Demo Village B",
    district: "Vizianagaram",
    state: "Andhra Pradesh",
    farmerType: "Crop and livestock farmer",
    herdSize: "7",
    preferredLanguage: "Telugu",
    consent: true,
    status: "Registered",
    createdAt: "Demo record",
  },
];

function loadFarmers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : demoFarmers;
    }

    return demoFarmers;
  } catch {
    return demoFarmers;
  }
}

export default function FarmerRegistration({ onBack }) {
  const [farmers, setFarmers] = useState(loadFarmers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const filteredFarmers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return farmers;

    return farmers.filter((farmer) =>
      [
        farmer.id,
        farmer.fullName,
        farmer.phone,
        farmer.village,
        farmer.district,
        farmer.state,
        farmer.farmerType,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [farmers, search]);

  function saveFarmers(nextFarmers) {
    setFarmers(nextFarmers);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextFarmers)
      );
      return true;
    } catch {
      setNotice(
        "Records are available for this session, but browser storage was unavailable."
      );
      return false;
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
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

    if (!form.fullName.trim()) {
      setError("Please enter the farmer's full name.");
      return;
    }

    const digits = form.phone.replace(/\D/g, "");

    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!form.village.trim() || !form.district.trim()) {
      setError("Please enter the village and district.");
      return;
    }

    if (!form.consent) {
      setError(
        "Please record the farmer's consent before saving."
      );
      return;
    }

    const newFarmer = {
      ...form,
      fullName: form.fullName.trim(),
      phone: digits,
      village: form.village.trim(),
      district: form.district.trim(),
      herdSize: form.herdSize,
      id: `FAR-${Date.now().toString().slice(-8)}`,
      status: "Registered",
      createdAt: new Date().toLocaleDateString("en-IN"),
    };

    const nextFarmers = [newFarmer, ...farmers];

    saveFarmers(nextFarmers);
    setForm(emptyForm);
    setShowForm(false);
    setNotice("Farmer registration saved on this device.");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteFarmer(id) {
    const farmer = farmers.find((item) => item.id === id);

    if (!farmer) return;

    const confirmed = window.confirm(
      `Delete the record for ${farmer.fullName}?`
    );

    if (!confirmed) return;

    const nextFarmers = farmers.filter(
      (item) => item.id !== id
    );

    saveFarmers(nextFarmers);
    setNotice("Farmer record deleted.");
  }

  return (
    <div className="registry-page">
      <header className="registry-topbar">
        <button
          className="registry-back-button"
          onClick={showForm ? closeForm : onBack}
          type="button"
        >
          <ArrowLeft size={13} />
          {showForm ? "Back to farmers" : "Back to dashboard"}
        </button>

        <div className="registry-brand">
          <div className="registry-brand-icon">
            <Users size={19} />
          </div>

          <div>
            <strong>NativeBreed BioShield</strong>
            <span>
              {showForm ? "" : ""}
            </span>
          </div>
        </div>
      </header>

      {showForm ? (
        <main className="registry-content farmer-form-page">
          <div className="registry-heading">
            <div>
              <p className="registry-eyebrow">FARMER NETWORK</p>
              <h1>Register a farmer</h1>
              <p className="registry-subtitle">
                Enter the farmer's details and record their consent.
              </p>
            </div>
          </div>

          <section className="registry-panel farmer-form-panel">
            <div className="registry-panel-heading">
              <div>
                <h2>Farmer details</h2>
                <p>Fields marked * are required.</p>
              </div>
            </div>

            <form
              className="registry-form"
              onSubmit={handleSubmit}
            >
              <label>
                Full name *
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  maxLength={80}
                  autoComplete="name"
                  placeholder="Enter farmer's name"
                />
              </label>

              <label>
                Phone number *
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  inputMode="numeric"
                  maxLength={15}
                  autoComplete="tel"
                  placeholder="10-digit phone number"
                />
              </label>

              <label>
                Village / town *
                <input
                  name="village"
                  value={form.village}
                  onChange={handleChange}
                  required
                  maxLength={80}
                  placeholder="Village or town"
                />
              </label>

              <label>
                District *
                <input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  required
                  maxLength={80}
                  placeholder="Enter district"
                />
              </label>

              <label>
                State *
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                >
                  <option>Andhra Pradesh</option>
                  <option>Telangana</option>
                  <option>Karnataka</option>
                  <option>Tamil Nadu</option>
                  <option>Kerala</option>
                  <option>Maharashtra</option>
                  <option>Odisha</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Farmer type *
                <select
                  name="farmerType"
                  value={form.farmerType}
                  onChange={handleChange}
                  required
                >
                  <option>Livestock farmer</option>
                  <option>Crop farmer</option>
                  <option>Crop and livestock farmer</option>
                  <option>Dairy cooperative member</option>
                  <option>Breeder</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Approx. cattle herd size
                <input
                  name="herdSize"
                  type="number"
                  min="0"
                  max="100000"
                  value={form.herdSize}
                  onChange={handleChange}
                  placeholder="e.g. 8"
                />
              </label>

              <label>
                Preferred language
                <select
                  name="preferredLanguage"
                  value={form.preferredLanguage}
                  onChange={handleChange}
                >
                  <option>Telugu</option>
                  <option>Hindi</option>
                  <option>English</option>
                  <option>Tamil</option>
                  <option>Kannada</option>
                  <option>Malayalam</option>
                  <option>Odia</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="registry-full-width registry-consent">
                <input
                  name="consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={handleChange}
                />

                <span>
                  I confirm the farmer has agreed to provide these
                  details for this project demo. *
                </span>
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
                  <Plus size={13} />
                  Save registration
                </button>
              </div>
            </form>
          </section>
        </main>
      ) : (
        <main className="registry-content">
          <div className="registry-heading">
            <div>
              <p className="registry-eyebrow">FARMER NETWORK</p>
              <h1>Farmer Registration</h1>
              <p className="registry-subtitle">
                Register farmers with clear consent and keep their
                contact and location details organized.
              </p>
            </div>

            <button
              className="registry-primary-button"
              onClick={openForm}
              type="button"
            >
              <Plus size={13} />
              Register farmer
            </button>
          </div>

          <div className="registry-summary">
            <div className="registry-summary-card">
              <span className="registry-summary-icon">
                <Users size={20} />
              </span>
              <span>Total farmer records</span>
              <strong>{farmers.length}</strong>
            </div>

            <div className="registry-summary-card">
              <span className="registry-summary-icon">
                <ShieldCheck size={20} />
              </span>
              <span>Consent recorded</span>
              <strong>
                {farmers.filter((farmer) => farmer.consent).length}
              </strong>
            </div>

            <div className="registry-summary-card">
              <span className="registry-summary-icon">
                <MapPin size={20} />
              </span>
              <span>Districts represented</span>
              <strong>
                {
                  new Set(
                    farmers
                      .map((farmer) =>
                        (farmer.district || "").trim().toLowerCase()
                      )
                      .filter(Boolean)
                  ).size
                }
              </strong>
            </div>
          </div>

          {notice && (
            <p className="registry-success" role="status">
              <CheckCircle2 size={16} />
              {notice}
            </p>
          )}

          <section className="registry-panel">
            <div className="registry-panel-heading">
              <div>
                <h2>Registered farmers</h2>
                <p>
                  Search by name, registration ID, phone, village,
                  or district.
                </p>
              </div>

              <label className="registry-search">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search farmers..."
                  aria-label="Search farmers"
                />
              </label>
            </div>

            <div className="registry-table-wrap">
              <table className="registry-table">
                <thead>
                  <tr>
                    <th>Farmer ID</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Village / District</th>
                    <th>Farmer type</th>
                    <th>Herd size</th>
                    <th>Consent</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFarmers.length > 0 ? (
                    filteredFarmers.map((farmer) => (
                      <tr key={farmer.id}>
                        <td><strong>{farmer.id}</strong></td>
                        <td>{farmer.fullName}</td>
                        <td>{farmer.phone}</td>
                        <td>
                          {farmer.village}
                          <br />
                          <span className="registry-muted">
                            {farmer.district}, {farmer.state}
                          </span>
                        </td>
                        <td>{farmer.farmerType}</td>
                        <td>{farmer.herdSize || "—"}</td>
                        <td>
                          <span className="registry-health healthy">
                            Recorded
                          </span>
                        </td>
                        <td>
                          <button
                            className="registry-delete-button"
                            type="button"
                            onClick={() => deleteFarmer(farmer.id)}
                            aria-label={`Delete ${farmer.fullName}`}
                            title="Delete farmer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="registry-empty" colSpan="8">
                        {search.trim()
                          ? "No farmer records match your search."
                          : "No farmer records yet. Select Register farmer to add one."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="registry-note">
              Privacy note: collect only information needed for this
              prototype and obtain informed consent. This demo stores
              records in this browser on this device; it does not send
              them to a secure server.
            </p>
          </section>
        </main>
      )}
    </div>
  );
}
