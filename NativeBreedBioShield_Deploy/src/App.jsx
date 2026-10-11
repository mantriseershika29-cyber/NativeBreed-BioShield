
import { useState } from "react";
import {
  Sprout,
  LayoutDashboard,
  Beef,
  FlaskConical,
  Users,
  Stethoscope,
  Search,
  Bell,
  Menu,
  Plus,
  ArrowUpRight,
  Leaf,
  HeartPulse,
  CloudRain,
  ChevronRight,
  X,
  Languages,
} from "lucide-react";

import CattleRegistry from "./pages/CattleRegistry";
import { useLanguage } from "./context/LanguageContext";
import FarmerChatbot from "./components/FarmerChatbot";
import CropResilience from "./pages/CropResilience";
import FarmerRegistration from "./pages/FarmerRegistration";
import ServiceDirectory from "./pages/ServiceDirectory";
import "./index.css";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { name: "Cattle Registry", icon: Beef, key: "cattleRegistry" },
  { name: "Crop Resilience", icon: FlaskConical, key: "cropResilience" },
  { name: "Farmers", icon: Users, key: "farmers" },
  { name: "Service Directory", icon: Stethoscope, key: "serviceDirectory" },
];

const breedData = [
  { name: "Gir", region: "Gujarat", count: 42, color: "peach" },
  { name: "Sahiwal", region: "Punjab & Haryana", count: 36, color: "mint" },
  { name: "Tharparkar", region: "Rajasthan", count: 28, color: "lavender" },
  { name: "Ongole", region: "Andhra Pradesh", count: 0, color: "peach" },
  { name: "Kankrej", region: "Gujarat & Rajasthan", count: 0, color: "mint" },
  { name: "Rathi", region: "Rajasthan", count: 0, color: "lavender" },
  { name: "Red Sindhi", region: "Sindh region", count: 0, color: "peach" },
  { name: "Deoni", region: "Maharashtra & Telangana", count: 0, color: "mint" },
  { name: "Krishna Valley", region: "Maharashtra & Karnataka", count: 0, color: "lavender" },
  { name: "Hariana", region: "Haryana & northern India", count: 0, color: "peach" },
  { name: "Amrit Mahal", region: "Karnataka", count: 0, color: "mint" },
  { name: "Hallikar", region: "Karnataka", count: 0, color: "lavender" },
  { name: "Khillari", region: "Maharashtra & Karnataka", count: 0, color: "peach" },
  { name: "Vechur", region: "Kerala", count: 0, color: "mint" },
  { name: "Kangayam", region: "Tamil Nadu", count: 0, color: "lavender" },
  { name: "Umblachery", region: "Tamil Nadu", count: 0, color: "peach" },
  { name: "Punganur", region: "Andhra Pradesh", count: 0, color: "mint" },
  { name: "Bargur", region: "Tamil Nadu", count: 0, color: "lavender" },
  { name: "Malnad Gidda", region: "Karnataka", count: 0, color: "peach" },
  { name: "Nimari", region: "Madhya Pradesh", count: 0, color: "mint" },
  { name: "Nagori", region: "Rajasthan", count: 0, color: "lavender" },
  { name: "Mewati", region: "Rajasthan & Haryana", count: 0, color: "peach" },
  { name: "Malvi", region: "Madhya Pradesh", count: 0, color: "mint" },
  { name: "Kenkatha", region: "Uttar Pradesh & Madhya Pradesh", count: 0, color: "lavender" },
  { name: "Ponwar", region: "Uttar Pradesh", count: 0, color: "peach" },
  { name: "Gaolao", region: "Maharashtra & Madhya Pradesh", count: 0, color: "mint" },
  { name: "Dangi", region: "Maharashtra & Gujarat", count: 0, color: "lavender" },
  { name: "Pulikulam", region: "Tamil Nadu", count: 0, color: "peach" },
  { name: "Alambadi", region: "Tamil Nadu", count: 0, color: "mint" },
  { name: "Kasaragod Dwarf", region: "Kerala", count: 0, color: "lavender" },
  { name: "Binjharpuri", region: "Odisha", count: 0, color: "peach" },
  { name: "Motu", region: "Odisha", count: 0, color: "mint" },
  { name: "Ghumsari", region: "Odisha", count: 0, color: "lavender" },
  { name: "Khariar", region: "Odisha", count: 0, color: "peach" },
  { name: "Kosali", region: "Chhattisgarh", count: 0, color: "mint" },
  { name: "Bachaur", region: "Bihar", count: 0, color: "lavender" },
  { name: "Siri", region: "Sikkim & West Bengal", count: 0, color: "peach" },
  { name: "Gangatiri", region: "Uttar Pradesh & Bihar", count: 0, color: "mint" },
  { name: "Kherigarh", region: "Uttar Pradesh", count: 0, color: "lavender" },
  { name: "Shahabadi", region: "Bihar & Jharkhand", count: 0, color: "peach" },
  { name: "Belahi", region: "Bihar", count: 0, color: "mint" },
  { name: "Lakhimi", region: "Assam", count: 0, color: "lavender" },
  { name: "Manda", region: "Odisha", count: 0, color: "peach" },
  { name: "Thutho", region: "Nagaland", count: 0, color: "mint" },
  { name: "Vechur Cross / Mixed", region: "Mixed or crossbred", count: 0, color: "lavender" },
];

function App() {
  const { language, setLanguage, t } = useLanguage();

  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [animals, setAnimals] = useState(breedData);

  const [form, setForm] = useState({
    name: "",
    region: "",
    count: "",
  });

  const filteredBreeds = animals.filter((breed) =>
    `${breed.name} ${breed.region}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function addBreed(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.region.trim()) return;

    const newBreed = {
      name: form.name.trim(),
      region: form.region.trim(),
      count: Number(form.count) || 0,
      color: "mint",
    };

    setAnimals((previous) => [...previous, newBreed]);
    setForm({ name: "", region: "", count: "" });
    setShowForm(false);
    setActivePage("Dashboard");
  }

  function navigateTo(page) {
    setActivePage(page);
    setMenuOpen(false);
    setShowNotifications(false);
  }

  let currentPage;

  if (activePage === "Cattle Registry") {
    currentPage = (
      <CattleRegistry onBack={() => navigateTo("Dashboard")} />
    );
  } else if (activePage === "Crop Resilience") {
    currentPage = (
      <CropResilience onBack={() => navigateTo("Dashboard")} />
    );
  } else if (activePage === "Farmers") {
    currentPage = (
      <FarmerRegistration onBack={() => navigateTo("Dashboard")} />
    );
  } else if (activePage === "Service Directory") {
    currentPage = (
      <ServiceDirectory onBack={() => navigateTo("Dashboard")} />
    );
  }

  if (currentPage) {
    return (
      <>
        {currentPage}
        <FarmerChatbot />
      </>
    );
  }

  return (
    <>
      <div className="app-shell">
        <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
          <div className="brand">
            <div className="brand-icon">
              <Sprout size={25} />
            </div>
            <div>
              <h2>NativeBreed</h2>
              <span>BIOSHIELD</span>
            </div>
            <button
              className="icon-button close-menu"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="workspace-label">{t("workspace")}</div>

          <nav className="navigation">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  className={`nav-item ${
                    activePage === item.name ? "active" : ""
                  }`}
                  onClick={() => navigateTo(item.name)}
                >
                  <Icon size={19} />
                  <span>{t(item.key)}</span>
                  {activePage === item.name && (
                    <ChevronRight size={16} className="nav-arrow" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="sidebar-bottom">
            <div className="earth-card">
              <div className="earth-icon">
                <Leaf size={20} />
              </div>
              <strong>{t("growingTomorrow")}</strong>
              <p>{t("biodiversity")}</p>
            </div>

            <div className="profile">
              <div className="avatar">F</div>
              <div>
                <strong>{t("farmerPortal")}</strong>
                <span>{t("communityAccount")}</span>
              </div>
            </div>
          </div>
        </aside>

        {menuOpen && (
          <button
            className="mobile-overlay"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
          />
        )}

        <main className="main-content">
          <header className="topbar">
            <div className="topbar-left">
              <button
                className="icon-button mobile-menu"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              <div className="breadcrumb">
                {t("workspace")} <span>/</span>{" "}
                <strong>
                  {t(menuItems.find((item) => item.name === activePage)?.key || "dashboard")}
                </strong>
              </div>
            </div>

            <div className="topbar-right">
              <div className="language-switcher">
                <Languages size={18} />
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  aria-label="Choose website language"
                >
                  <option value="en">English</option>
                  <option value="te">తెలుగు</option>
                  <option value="hi">हिन्दी</option>
                  <option value="ta">தமிழ்</option>
                </select>
              </div>

              <div className="search-box">
                <Search size={18} />
                <input
                  placeholder={t("search")}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label={t("search")}
                />
              </div>

              <div className="notification-wrapper">
                <button
                  className="icon-button notification"
                  aria-label={t("notifications")}
                  aria-expanded={showNotifications}
                  onClick={() =>
                    setShowNotifications((visible) => !visible)
                  }
                >
                  <Bell size={20} />
                  <span className="notification-dot" />
                </button>

                {showNotifications && (
                  <div className="notification-popover">
                    <strong>{t("notifications")}</strong>
                    <p>{t("allCaughtUp")}</p>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="page-content">
            <section className="welcome-row">
              <div>
                <div className="eyebrow">
                  <Sprout size={15} />
                  {t("farmerLed")}
                </div>
                <h1>{t("goodDay")}</h1>
                <p className="subtitle">{t("welcomeSubtitle")}</p>
              </div>

              <button
                className="primary-button"
                onClick={() => setShowForm(true)}
              >
                <Plus size={18} />
                {t("addRecord")}
              </button>
            </section>

            <section className="hero-banner">
              <div className="hero-copy">
                <span className="hero-pill">
                  <Leaf size={14} />
                  {t("farmerLed")}
                </span>

                <h2>
                  {t("heroTitle1")}
                  <br />
                  {t("heroTitle2")}
                </h2>

                <p>{t("heroDescription")}</p>

                <button
                  className="hero-button"
                  onClick={() => navigateTo("Crop Resilience")}
                >
                  {t("exploreTrials")}
                  <ArrowUpRight size={17} />
                </button>
              </div>

              <div className="hero-art" aria-hidden="true">
                <div className="sun" />
                <div className="hill hill-back" />
                <div className="hill hill-front" />
                <div className="hero-cow">🐄</div>
                <div className="hero-plant plant-one">🌱</div>
                <div className="hero-plant plant-two">🌾</div>
              </div>
            </section>

            <section className="stats-grid">
              <StatCard
                icon={Users}
                label={t("registeredFarmers")}
                value="120"
                note={t("sampleData")}
                color="green"
              />
              <StatCard
                icon={Beef}
                label={t("animalRecords")}
                value={String(
                  animals.reduce((total, breed) => total + breed.count, 0)
                )}
                note={t("animalCountNote")}
                color="orange"
              />
              <StatCard
                icon={FlaskConical}
                label={t("cropTrials")}
                value="12"
                note={t("trialNote")}
                color="purple"
              />
              <StatCard
                icon={HeartPulse}
                label={t("healthFollowups")}
                value="24"
                note={t("followupNote")}
                color="blue"
              />
            </section>

            <section className="content-grid">
              <div className="panel breed-panel">
                <div className="panel-heading">
                  <div>
                    <h3>{t("breedRegistry")}</h3>
                    <p>{t("exploreBreeds")}</p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => navigateTo("Cattle Registry")}
                  >
                    {t("viewAll")} <ArrowUpRight size={15} />
                  </button>
                </div>

                <div className="breed-list">
                  {filteredBreeds.map((breed) => (
                    <div className="breed-row" key={breed.name}>
                      <div className={`breed-avatar ${breed.color}`}>
                        <Beef size={23} />
                      </div>

                      <div className="breed-info">
                        <strong>{breed.name}</strong>
                        <span>{breed.region}</span>
                      </div>

                      <div className="breed-count">
                        <strong>{breed.count}</strong>
                        <span>{t("records")}</span>
                      </div>
                    </div>
                  ))}

                  {filteredBreeds.length === 0 && (
                    <p className="empty-message">{t("noBreeds")}</p>
                  )}
                </div>

                <p className="small-note">{t("animalCountNote")}</p>
              </div>

              <div className="panel activity-panel">
                <div className="panel-heading">
                  <div>
                    <h3>{t("resilienceTitle")}</h3>
                    <p>{t("monitorFarm")}</p>
                  </div>
                  <span className="live-icon">
                    <Sprout size={18} />
                  </span>
                </div>

                <ActivityItem
                  icon={CloudRain}
                  iconClass="crop-icon"
                  title={t("cropStress")}
                  description={t("logStress")}
                  onClick={() => navigateTo("Crop Resilience")}
                />

                <ActivityItem
                  icon={HeartPulse}
                  iconClass="health-icon"
                  title={t("animalHealth")}
                  description={t("healthDescription")}
                  onClick={() => navigateTo("Cattle Registry")}
                />

                <ActivityItem
                  icon={Stethoscope}
                  iconClass="service-icon"
                  title={t("expertConnections")}
                  description={t("expertDescription")}
                  onClick={() => navigateTo("Service Directory")}
                />
              </div>
            </section>

            <footer>
              <span>
                <Sprout size={15} /> NativeBreed BioShield
              </span>
              <span>{t("footer")}</span>
            </footer>
          </div>
        </main>

        {showForm && (
          <div
            className="modal-overlay"
            onClick={() => setShowForm(false)}
          >
            <div
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-breed-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="modal-heading">
                <div>
                  <h2 id="add-breed-title">{t("addBreedTitle")}</h2>
                  <p>{t("addBreedDescription")}</p>
                </div>

                <button
                  className="icon-button"
                  onClick={() => setShowForm(false)}
                  aria-label={t("close")}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={addBreed}>
                <label>
                  {t("breedName")}
                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    placeholder="e.g. Ongole"
                  />
                </label>

                <label>
                  {t("region")}
                  <input
                    required
                    value={form.region}
                    onChange={(event) =>
                      setForm({ ...form, region: event.target.value })
                    }
                    placeholder="e.g. Andhra Pradesh"
                  />
                </label>

                <label>
                  {t("recordCount")}
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.count}
                    onChange={(event) =>
                      setForm({ ...form, count: event.target.value })
                    }
                    placeholder="e.g. 5"
                  />
                </label>

                <button
                  className="primary-button submit-button"
                  type="submit"
                >
                  {t("saveRecord")}
                </button>
              </form>

              <p className="small-note">{t("sampleData")}</p>
            </div>
          </div>
        )}
      </div>

      <FarmerChatbot />
    </>
  );
}

function ActivityItem({
  icon: Icon,
  iconClass,
  title,
  description,
  onClick,
}) {
  return (
    <div className="activity-item">
      <div className={`activity-icon ${iconClass}`}>
        <Icon size={21} />
      </div>

      <div className="activity-copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <button
        className="round-arrow"
        onClick={onClick}
        aria-label={`Open ${title}`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, note, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={21} />
      </div>

      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-note">{note}</span>
    </div>
  );
}

export default App;
