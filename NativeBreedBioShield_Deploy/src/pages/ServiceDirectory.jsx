import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Stethoscope,
  Sprout,
  HeartPulse,
  MapPin,
  Phone,
  Plus,
  X,
} from "lucide-react";

import "../index.css";

const initialServices = [
  {
    id: 1,
    name: "Veterinary Care",
    provider: "Local Veterinary Centre",
    category: "Veterinary",
    location: "Visakhapatnam",
    phone: "",
    description:
      "Animal health consultations and cattle health support.",
  },
  {
    id: 2,
    name: "Breeding Assistance",
    provider: "Livestock Extension Service",
    category: "Breeding",
    location: "Andhra Pradesh",
    phone: "",
    description:
      "Guidance on cattle breeding and herd improvement.",
  },
  {
    id: 3,
    name: "Crop Advisory",
    provider: "Agricultural Advisory Centre",
    category: "Agriculture",
    location: "Andhra Pradesh",
    phone: "",
    description:
      "Crop management and environmental stress guidance.",
  },
];

const emptyForm = {
  name: "",
  provider: "",
  category: "Veterinary",
  location: "",
  phone: "",
  description: "",
};

export default function ServiceDirectory({ onBack = () => {} }) {
  const [services, setServices] = useState(initialServices);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const filteredServices = services.filter((service) => {
    const searchText = [
      service.name,
      service.provider,
      service.location,
      service.description,
      service.category,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchText.includes(
      search.trim().toLowerCase()
    );

    const matchesCategory =
      category === "All" || service.category === category;

    return matchesSearch && matchesCategory;
  });

  function updateForm(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newService = {
      ...form,
      id: Date.now(),
    };

    setServices((previous) => [newService, ...previous]);
    setForm({ ...emptyForm });
    setSearch("");
    setCategory("All");
    setShowForm(false);
  }

  function closeForm() {
    setShowForm(false);
  }

  return (
    <div className="registry-page">
      <header className="registry-topbar">
        <button
          type="button"
          className="registry-back-button"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div className="registry-topbar-title">
          <Stethoscope size={20} />
          <span>Service Directory</span>
        </div>
      </header>

      <main className="registry-content">
        <div className="registry-heading-row">
          <div>
            <h1>Service Directory</h1>
            <p>
              Discover veterinary, breeding, and agricultural
              support services.
            </p>
          </div>

          <button
            type="button"
            className="registry-primary-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} />
            <span>Add Service</span>
          </button>
        </div>

        <div className="registry-stats">
          <div className="registry-stat-card">
            <Stethoscope size={22} />
            <p>Total Services</p>
            <h2>{services.length}</h2>
          </div>

          <div className="registry-stat-card">
            <HeartPulse size={22} />
            <p>Veterinary</p>
            <h2>
              {
                services.filter(
                  (service) => service.category === "Veterinary"
                ).length
              }
            </h2>
          </div>

          <div className="registry-stat-card">
            <Sprout size={22} />
            <p>Agriculture</p>
            <h2>
              {
                services.filter(
                  (service) => service.category === "Agriculture"
                ).length
              }
            </h2>
          </div>
        </div>

        <section>
          <div className="registry-section-heading">
            <div>
              <h2>Available Services</h2>
              <p>
                Search and filter registered service providers.
              </p>
            </div>
          </div>

          <div className="service-filters">
            <div className="service-search">
              <Search size={18} />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services or locations..."
                aria-label="Search services"
              />
            </div>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter services by category"
            >
              <option value="All">All categories</option>
              <option value="Veterinary">Veterinary</option>
              <option value="Breeding">Breeding</option>
              <option value="Agriculture">Agriculture</option>
            </select>
          </div>

          <div className="service-grid">
            {filteredServices.map((service) => (
              <article className="service-card" key={service.id}>
                <div className="service-card-icon">
                  {service.category === "Agriculture" ? (
                    <Sprout size={22} />
                  ) : service.category === "Breeding" ? (
                    <HeartPulse size={22} />
                  ) : (
                    <Stethoscope size={22} />
                  )}
                </div>

                <span className="service-category">
                  {service.category}
                </span>

                <h3>{service.name}</h3>

                <p className="service-provider">
                  {service.provider}
                </p>

                <p className="service-description">
                  {service.description}
                </p>

                <div className="service-detail">
                  <MapPin size={15} />
                  <span>{service.location}</span>
                </div>

                {service.phone && (
                  <div className="service-detail">
                    <Phone size={15} />
                    <a href={`tel:${service.phone}`}>
                      {service.phone}
                    </a>
                  </div>
                )}
              </article>
            ))}

            {filteredServices.length === 0 && (
              <div className="service-empty">
                <Search size={28} />
                <h3>No services found</h3>
                <p>
                  Try another search or choose a different category.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {showForm && (
        <div
          className="registry-modal-overlay"
          onClick={closeForm}
        >
          <div
            className="registry-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="registry-modal-header">
              <div>
                <h2>Add a Service</h2>
                <p>Enter the service provider details.</p>
              </div>

              <button
                type="button"
                className="registry-close-button"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="service-name">Service Name</label>
              <input
                id="service-name"
                type="text"
                required
                value={form.name}
                onChange={(event) =>
                  updateForm("name", event.target.value)
                }
                placeholder="e.g. Cattle Health Check"
              />

              <label htmlFor="service-provider">
                Provider Name
              </label>
              <input
                id="service-provider"
                type="text"
                required
                value={form.provider}
                onChange={(event) =>
                  updateForm("provider", event.target.value)
                }
                placeholder="Enter provider or organization"
              />

              <label htmlFor="service-category">Category</label>
              <select
                id="service-category"
                value={form.category}
                onChange={(event) =>
                  updateForm("category", event.target.value)
                }
              >
                <option value="Veterinary">Veterinary</option>
                <option value="Breeding">Breeding</option>
                <option value="Agriculture">Agriculture</option>
              </select>

              <label htmlFor="service-location">Location</label>
              <input
                id="service-location"
                type="text"
                required
                value={form.location}
                onChange={(event) =>
                  updateForm("location", event.target.value)
                }
                placeholder="Enter service location"
              />

              <label htmlFor="service-phone">
                Phone Number (optional)
              </label>
              <input
                id="service-phone"
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  updateForm("phone", event.target.value)
                }
                placeholder="Enter contact number"
              />

              <label htmlFor="service-description">
                Description
              </label>
              <textarea
                id="service-description"
                required
                value={form.description}
                onChange={(event) =>
                  updateForm("description", event.target.value)
                }
                placeholder="Describe the service"
                rows={3}
              />

              <div className="registry-modal-actions">
                <button
                  type="button"
                  className="registry-back-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="registry-primary-button"
                >
                  <Plus size={16} />
                  <span>Save Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}