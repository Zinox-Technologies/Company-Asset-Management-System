import { useState, useEffect } from "react";
import "./App.css";
import asset1 from "./assets/asset1.jpg";
function App() {
  const [activePage, setActivePage] = useState("Dashboard");
const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("All Categories");
const [selectedStatus, setSelectedStatus] = useState("All Statuses");
const [showAssetForm, setShowAssetForm] = useState(false);
const [newAsset, setNewAsset] = useState({
  name: "",
  category: "",
  serial: "",
  assignedTo: "",
  department: "",
  location: "",
  status: "",
});
const handleSaveAsset = () => {
  const handleDeleteAsset = (assetId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this asset?"
  );

  if (!confirmDelete) {
    return;
  }

  const updatedAssets = assets.filter((asset) => asset.id !== assetId);

  setAssets(updatedAssets);
};
  if (
  !newAsset.name ||
  !newAsset.category ||
  !newAsset.serial ||
  !newAsset.status
) {
  alert("Please fill in all required fields.");
  return;
}
  const assetToAdd = {
    id: `ZNX-${Date.now()}`,
    name: newAsset.name,
    category: newAsset.category,
    serial: newAsset.serial,
    assignedTo: newAsset.assignedTo,
    department: newAsset.department,
    location: newAsset.location,
   status: newAsset.status,
  };

  setAssets([...assets, assetToAdd]);

  setNewAsset({
    name: "",
    category: "",
    serial: "",
    assignedTo: "",
    department: "",
    location: "",
    status: "",
  });

  setShowAssetForm(false);
};
const [assets, setAssets] = useState(() => {
  const savedAssets = localStorage.getItem("companyAssets");

  if (savedAssets) {
    return JSON.parse(savedAssets);
  }

  return [
    {
      id: "ZNX-LAP-00125",
      name: "HP ProBook 450",
      category: "Laptop",
      serial: "5CD1234ABC",
      assignedTo: "John Doe",
      department: "IT",
      location: "Lagos Office",
      status: "Assigned",
    },
    {
      id: "ZNX-MON-00042",
      name: "Dell P2422H",
      category: "Monitor",
      serial: "CN0P2422H123",
      assignedTo: "Jane Smith",
      department: "Finance",
      location: "Abuja Head Office",
      status: "Assigned",
    },
    {
      id: "ZNX-PRT-00018",
      name: "HP LaserJet Pro",
      category: "Printer",
      serial: "VNB1234567",
      assignedTo: "Support Department",
      department: "Support",
      location: "Lagos Office",
      status: "Under Maintenance",
    },
    {
      id: "ZNX-LAP-00126",
      name: "Dell Latitude 5420",
      category: "Laptop",
      serial: "DL5420XYZ89",
      assignedTo: "Not Assigned",
      department: "IT",
      location: "Lagos Office",
      status: "Available",
    },
  ];
});
useEffect(() => {
  localStorage.setItem("companyAssets", JSON.stringify(assets));
}, [assets]);

  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Assets", icon: "▣" },
    { name: "Employees", icon: "♙" },
    { name: "Departments", icon: "▤" },
    { name: "Transfers", icon: "⇄" },
    { name: "Maintenance", icon: "⚙" },
    { name: "Reports", icon: "▥" },
  ];

  const renderAssetsPage = () => {
    const filteredAssets = assets.filter((asset) => {
  const matchesSearch =
    asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.serial.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "All Categories" ||
    asset.category === selectedCategory;

  const matchesStatus =
    selectedStatus === "All Statuses" ||
    asset.status === selectedStatus;

  return matchesSearch && matchesCategory && matchesStatus;
});
    return (
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Company Assets</h2>
            <p>View and manage all registered company assets.</p>
          </div>

          <button
  className="primary-button"
  onClick={() => setShowAssetForm(true)}
>
  Register New Asset
</button>
{showAssetForm && (
  <div className="asset-form">
    <h2>Register New Asset</h2>

    <input
      type="text"
     placeholder="Asset Name"
     value={newAsset.name}
     onChange={(e) =>
    setNewAsset({ ...newAsset, name: e.target.value })
  }
/>

    <input
       type="text"
       placeholder="Category"
       value={newAsset.category}
       onChange={(e) =>
         setNewAsset({ ...newAsset, category: e.target.value })
  }
    />

    <input
      type="text"
  placeholder="Serial Number"
  value={newAsset.serial}
  onChange={(e) =>
    setNewAsset({ ...newAsset, serial: e.target.value })
  }
    />

    <input
      type="text"
  placeholder="Assigned To"
  value={newAsset.assignedTo}
  onChange={(e) =>
    setNewAsset({ ...newAsset, assignedTo: e.target.value })
  }
    />

  <input
  type="text"
  placeholder="Department"
  value={newAsset.department}
  onChange={(e) =>
    setNewAsset({ ...newAsset, department: e.target.value })
  }
/>

    <input
  type="text"
  placeholder="Location"
  value={newAsset.location}
  onChange={(e) =>
    setNewAsset({ ...newAsset, location: e.target.value })
  }
/>
<select
  value={newAsset.status}
  onChange={(e) =>
    setNewAsset({ ...newAsset, status: e.target.value })
  }
>
  <option value="">Select Asset Status</option>
  <option value="Available">Available</option>
  <option value="Assigned">Assigned</option>
  <option value="Under Maintenance">Under Maintenance</option>
</select>

    <button onClick={handleSaveAsset}>Save Asset</button>

        <button onClick={() => setShowAssetForm(false)}>
      Cancel
    </button>
    </div>
  
)}
        </div>

        <div className="asset-summary">
          <div>
            <span>Total Assets</span>
            <strong>{assets.length}</strong>
          </div>

          <div>
            <span>Assigned</span>
            <strong>
              {assets.filter((asset) => asset.status === "Assigned").length}
            </strong>
          </div>

          <div>
            <span>Available</span>
            <strong>
              {assets.filter((asset) => asset.status === "Available").length}
            </strong>
          </div>

          <div>
            <span>Maintenance</span>
            <strong>
              {
                assets.filter(
                  (asset) => asset.status === "Under Maintenance"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="asset-toolbar">
          <input
            type="text"
            placeholder="Search by Asset ID, name or serial number..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
/>

         <select value={selectedCategory}
  onChange={(event) => setSelectedCategory(event.target.value)}
>
            <option>All Categories</option>
            <option>Laptop</option>
            <option>Monitor</option>
            <option>Printer</option>
            <option>Desktop</option>
            <option>Phone</option>
          </select>

          <select
  value={selectedStatus}
  onChange={(event) => setSelectedStatus(event.target.value)}
>
            <option>All Statuses</option>
            <option>Available</option>
            <option>Assigned</option>
            <option>Under Maintenance</option>
            <option>Lost</option>
            <option>Damaged</option>
            <option>Disposed</option>
            <option>Pending Transfer</option>
          </select>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Asset</th>
                <th>Category</th>
                <th>Serial Number</th>
                <th>Assigned To</th>
                <th>Department</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id}>
                  <td className="asset-id">{asset.id}</td>

                  <td>
                    <div className="asset-name">
                      <strong>{asset.name}</strong>
                      <span>{asset.category}</span>
                    </div>
                  </td>

                  <td>{asset.category}</td>

                  <td>{asset.serial}</td>

                  <td>{asset.assignedTo}</td>

                  <td>{asset.department}</td>

                  <td>{asset.location}</td>

                  <td>
                    <span
                      className={`status ${
                        asset.status === "Assigned"
                          ? "assigned"
                          : asset.status === "Available"
                          ? "available"
                          : "maintenance"
                      }`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td>
  <button
    onClick={() => handleDeleteAsset(asset.id)}
  >
    Delete
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  const renderPageContent = () => {
    if (activePage === "Assets") {
      return renderAssetsPage();
    }

    if (activePage === "Employees") {
      return (
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Employees</h2>
              <p>Manage employees and their assigned assets.</p>
            </div>

            <button className="primary-button">Add Employee</button>
          </div>

          <div className="page-placeholder">
            <h3>Employee Management</h3>
            <p>
              Employee registration and assigned asset information will be
              built here.
            </p>
          </div>
        </section>
      );
    }

    if (activePage === "Departments") {
      return (
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Departments</h2>
              <p>View departments and the assets assigned to them.</p>
            </div>

            <button className="primary-button">Add Department</button>
          </div>

          <div className="page-placeholder">
            <h3>Department Management</h3>
            <p>
              Department registration and employee relationships will be built
              here.
            </p>
          </div>
        </section>
      );
    }

    if (activePage === "Transfers") {
      return (
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Transfers</h2>
              <p>Track asset ownership and assignment transfers.</p>
            </div>

            <button className="primary-button">New Transfer</button>
          </div>

          <div className="page-placeholder">
            <h3>Asset Transfer Management</h3>
            <p>
              Transfer requests, previous owners, new owners, approval status,
              and transfer history will be built here.
            </p>
          </div>
        </section>
      );
    }

    if (activePage === "Maintenance") {
      return (
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Maintenance</h2>
              <p>Track repairs, servicing, and maintenance history.</p>
            </div>

            <button className="primary-button">Add Record</button>
          </div>

          <div className="page-placeholder">
            <h3>Maintenance Management</h3>
            <p>
              Maintenance records, repair details, service dates, and asset
              conditions will be built here.
            </p>
          </div>
        </section>
      );
    }

    if (activePage === "Reports") {
      return (
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Reports</h2>
              <p>Generate reports based on company asset information.</p>
            </div>

            <button className="primary-button">Generate Report</button>
          </div>

          <div className="page-placeholder">
            <h3>Asset Reports</h3>
            <p>
              Date, employee, department, location, category, and status
              filters will be added here.
            </p>
          </div>
        </section>
      );
    }

    return (
      <>
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Total Assets</span>
              <div className="stat-icon red-icon">▣</div>
            </div>

            <h2>{assets.length}</h2>
            <p className="stat-note">All registered company assets</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Assigned Assets</span>
              <div className="stat-icon blue-icon">♙</div>
            </div>

            <h2>
              {assets.filter((asset) => asset.status === "Assigned").length}
            </h2>
            <p className="stat-note">Currently assigned assets</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Available Assets</span>
              <div className="stat-icon green-icon">✓</div>
            </div>

            <h2>
              {assets.filter((asset) => asset.status === "Available").length}
            </h2>
            <p className="stat-note">Ready for assignment</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Under Maintenance</span>
              <div className="stat-icon orange-icon">⚙</div>
            </div>

            <h2>
              {
                assets.filter(
                  (asset) => asset.status === "Under Maintenance"
                ).length
              }
            </h2>
            <p className="stat-note">Currently under maintenance</p>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Recent Assets</h2>
              <p>Recently registered or updated company assets.</p>
            </div>

            <button
              className="primary-button"
              onClick={() => setActivePage("Assets")}
            >
              View All Assets
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Asset</th>
                  <th>Category</th>
                  <th>Assigned To</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {assets.slice(0, 3).map((asset) => (
                  <tr key={asset.id}>
                    <td className="asset-id">{asset.id}</td>

                    <td>
                      <div className="asset-name">
                        <strong>{asset.name}</strong>
                        <span>{asset.category}</span>
                      </div>
                    </td>

                    <td>{asset.category}</td>

                    <td>{asset.assignedTo}</td>

                    <td>{asset.location}</td>

                    <td>
                      <span
                        className={`status ${
                          asset.status === "Assigned"
                            ? "assigned"
                            : asset.status === "Available"
                            ? "available"
                            : "maintenance"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">A</div>

          <div className="brand-text">
            <h2>Asset Management</h2>
            <span>Tracking System</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-title">MAIN MENU</p>

          {menuItems.slice(0, 4).map((item) => (
            <button
              key={item.name}
              className={`nav-link ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}

          <p className="nav-title management-title">MANAGEMENT</p>

          {menuItems.slice(4).map((item) => (
            <button
              key={item.name}
              className={`nav-link ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span>Company Asset System</span>
          <small>Version 1.0</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div>
            <p className="breadcrumb">
              ZINOX TECHNOLOGIES/ {activePage.toUpperCase()}
            </p>

            <h1>{activePage}</h1>

            <p className="page-description">
              {activePage === "Dashboard"
                ? "Overview of company assets and their current status."
                : `Manage and monitor company ${activePage.toLowerCase()}.`}
            </p>
          </div>

          <div className="header-right">
            <button className="notification-button">♧</button>

            <div className="user-profile">
              <div className="user-avatar">A</div>

              <div className="user-details">
                <strong>Administrator</strong>
                <span>System Admin</span>
              </div>
            </div>
          </div>
        </header>

        {renderPageContent()}
      </main>
    </div>
  );
}

export default App;