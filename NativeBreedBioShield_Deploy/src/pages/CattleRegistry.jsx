
import { useState } from "react";
import { ArrowLeft, Plus, Search, X, Trash2 } from "lucide-react";

const demoCattle = [
  {
    id: "NB-001",
    breed: "Gir",
    farmer: "Demo Farmer 1",
    age: "4",
    sex: "Female",
    village: "Demo Village A",
    health: "Healthy",
  },
  {
    id: "NB-002",
    breed: "Sahiwal",
    farmer: "Demo Farmer 2",
    age: "3",
    sex: "Female",
    village: "Demo Village B",
    health: "Needs follow-up",
  },
];

const emptyForm = {
  id: "",
  breed: "Gir",
  farmer: "",
  age: "",
  sex: "Female",
  village: "",
  health: "Healthy",
};

export default function CattleRegistry({ onBack }) {
  const [cattle, setCattle] = useState(demoCattle);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredCattle = cattle.filter((animal) =>
    [
      animal.id,
      animal.breed,
      animal.farmer,
      animal.village,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const duplicate = cattle.some(
      (animal) =>
        animal.id.toLowerCase() === form.id.trim().toLowerCase()
    );

    if (duplicate) {
      setError("This cattle ID already exists. Please use another ID.");
      return;
    }

    setCattle([
      ...cattle,
      {
        ...form,
        id: form.id.trim(),
        farmer: form.farmer.trim(),
        village: form.village.trim(),
      },
    ]);

    setForm(emptyForm);
    setError("");
    setShowForm(false);
  }

  function deleteCattle(id) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this cattle record?"
    );

    if (confirmed) {
      setCattle(cattle.filter((animal) => animal.id !== id));
    }
  }

  return (
    <div className="registry-page">
      <header className="registry-header">
        <button className="registry-back" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <p className="registry-eyebrow">NATIVEBREED BIOSHIELD</p>
        <h1>Cattle Registry</h1>
        <p className="registry-description">
          Register, view and manage indigenous cattle records.
        </p>
      </header>

      <section className="registry-summary">
        <div className="registry-summary-card">
          <span>Total cattle records</span>
          <strong>{cattle.length}</strong>
        </div>
        <div className="registry-summary-card">
          <span>Gir cattle</span>
          <strong>
            {cattle.filter((animal) => animal.breed === "Gir").length}
          </strong>
        </div>
        <div className="registry-summary-card">
          <span>Sahiwal cattle</span>
          <strong>
            {cattle.filter((animal) => animal.breed === "Sahiwal").length}
          </strong>
        </div>
      </section>

      <section className="registry-panel">
        <div className="registry-toolbar">
          <div>
            <h2>Registered cattle</h2>
            <p>Search existing records or register a new animal.</p>
          </div>

          <button
            className="registry-add-button"
            onClick={() => {
              setError("");
              setShowForm(!showForm);
            }}
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? "Close form" : "Add Cattle"}
          </button>
        </div>

        {showForm && (
          <form className="registry-form" onSubmit={handleSubmit}>
            <h3>New cattle registration</h3>

            <div className="registry-form-grid">
              <label>
                Cattle ID *
                <input
                  name="id"
                  value={form.id}
                  onChange={handleChange}
                  placeholder="Example: NB-003"
                  required
                />
              </label>

              <label>
                Breed *
                <select
                  name="breed"
                  value={form.breed}
                  onChange={handleChange}
                >
                  <option value="Gir">Gir</option>
                  <option value="Sahiwal">Sahiwal</option>
                  <option value="Tharparkar">Tharparkar</option>
                   <option value="Ongole">Ongole</option>
  <option value="Kankrej">Kankrej</option>
  <option value="Rathi">Rathi</option>
  <option value="Red Sindhi">Red Sindhi</option>
  <option value="Deoni">Deoni</option>
  <option value="Krishna Valley">Krishna Valley</option>
  <option value="Hariana">Hariana</option>
  <option value="Amrit Mahal">Amrit Mahal</option>
  <option value="Hallikar">Hallikar</option>
  <option value="Khillari">Khillari</option>
  <option value="Vechur">Vechur</option>
  <option value="Kangayam">Kangayam</option>
  <option value="Umblachery">Umblachery</option>
  <option value="Punganur">Punganur</option>
  <option value="Bargur">Bargur</option>
  <option value="Malnad Gidda">Malnad Gidda</option>
  <option value="Nimari">Nimari</option>
                  <option value="Other">Other / Not verified</option>
                </select>
              </label>

              <label>
                Farmer name *
                <input
                  name="farmer"
                  value={form.farmer}
                  onChange={handleChange}
                  placeholder="Enter farmer name"
                  required
                />
              </label>

              <label>
                Age (years) *
                <input
                  name="age"
                  type="number"
                  min="0"
                  max="50"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  required
                />
              </label>

              <label>
                Sex *
                <select
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </label>

              <label>
                Village / Location *
                <input
                  name="village"
                  value={form.village}
                  onChange={handleChange}
                  placeholder="Enter village"
                  required
                />
              </label>

              <label>
                Health status
                <select
                  name="health"
                  value={form.health}
                  onChange={handleChange}
                >
                  <option value="Healthy">Reported healthy</option>
                  <option value="Needs follow-up">Needs follow-up</option>
                  <option value="Unknown">Not assessed</option>
                </select>
              </label>
            </div>

            {error && <p className="registry-error">{error}</p>}

            <button className="registry-add-button" type="submit">
              <Plus size={18} />
              Save cattle record
            </button>
          </form>
        )}

        <div className="registry-search">
          <Search size={19} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by cattle ID, breed, farmer or village..."
          />
        </div>

        <div className="registry-table-wrapper">
          <table className="registry-table">
            <thead>
              <tr>
                <th>Cattle ID</th>
                <th>Breed</th>
                <th>Farmer</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Location</th>
                <th>Health status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCattle.map((animal) => (
                <tr key={animal.id}>
                  <td><strong>{animal.id}</strong></td>
                  <td>{animal.breed}</td>
                  <td>{animal.farmer}</td>
                  <td>{animal.age} years</td>
                  <td>{animal.sex}</td>
                  <td>{animal.village}</td>
                  <td>
                    <span className="registry-status">
                      {animal.health}
                    </span>
                  </td>
                  <td>
                    <button
                      className="registry-delete"
                      onClick={() => deleteCattle(animal.id)}
                      title="Remove record"
                      aria-label={`Remove ${animal.id}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCattle.length === 0 && (
                <tr>
                  <td colSpan="8" className="registry-empty">
                    No matching cattle records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="registry-note">
          Demo records are illustrative. Health status is recorded information,
          not a veterinary diagnosis. Records are currently temporary and are
          not saved to a database.
        </p>
      </section>
    </div>
  );
}
