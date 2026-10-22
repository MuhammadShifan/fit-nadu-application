import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminGyms.css';
import Sidebar from './Sidebar'; 
import Header from './Header';

const tamilNaduDistricts = {
  "Ariyalur": ["Ariyalur", "Andimadam", "Sendurai", "Udayarpalayam"],
  "Chengalpattu": ["Chengalpattu", "Cheyyur", "Madurantakam", "Pallavaram", "Tambaram", "Thiruporur", "Tirukalukundram", "Vandalur"],
  "Chennai": ["Alandur", "Ambattur", "Aminjikarai", "Ayanavaram", "Egmore", "Guindy", "Madhavaram", "Madhuravoyal", "Mambalam", "Mylapore", "Perambur", "Purasawalkam", "Sholinganallur", "Tondiarpet", "Velachery"],
  "Coimbatore": ["Coimbatore North", "Coimbatore South", "Annur", "Kinathukadavu", "Mettupalayam", "Pollachi", "Sulur", "Valparai"],
  "Cuddalore": ["Cuddalore", "Bhuvanagiri", "Chidambaram", "Kattumannarkoil", "Kurinjipadi", "Panruti", "Srimushnam", "Tittakudi", "Veppur"],
  "Dharmapuri": ["Dharmapuri", "Harur", "Karimangalam", "Nallampalli", "Palacode", "Pappireddipatti", "Pennagaram"],
  "Dindigul": ["Dindigul", "Attur", "Gujiliyamparai", "Kodaikanal", "Natham", "Nilakkottai", "Oddanchatram", "Palani", "Vedasandur"],
  "Erode": ["Erode", "Anthiyur", "Bhavani", "Gobichettipalayam", "Kodumudi", "Modakkurichi", "Nambiyur", "Perundurai", "Sathyamangalam", "Thalavadi"],
  "Kallakurichi": ["Kallakurichi", "Chinnasalem", "Kalvarayan Hills", "Sankarapuram", "Tirukkovilur", "Ulundurpet"],
  "Kanchipuram": ["Kanchipuram", "Kundrathur", "Sriperumbudur", "Uthiramerur", "Walajabad"],
  "Kanyakumari": ["Agasteeswaram", "Kalkulam", "Killiyoor", "Thiruvattar", "Thovalai", "Vilavancode"],
  "Karur": ["Karur", "Aravakurichi", "Kadavur", "Krishnarayapuram", "Kulithalai", "Manmangalam", "Pugalur"],
  "Krishnagiri": ["Krishnagiri", "Anjetty", "Bargur", "Denkanikottai", "Hosur", "Pochampalli", "Shoolagiri", "Uthangarai"],
  "Madurai": ["Madurai North", "Madurai South", "Madurai East", "Madurai West", "Kalligudi", "Melur", "Peraiyur", "Thirumangalam", "Thiruparankundram", "Usilampatti", "Vadipatti"],
  "Mayiladuthurai": ["Mayiladuthurai", "Kuthalam", "Sirkali", "Tharangambadi"],
  "Nagapattinam": ["Nagapattinam", "Kilvelur", "Thirukuvalai", "Vedaranyam"],
  "Namakkal": ["Namakkal", "Kollimalai", "Kumarapalayam", "Mohanur", "Paramathi Velur", "Rasipuram", "Sendamangalam", "Tiruchengode"],
  "Nilgiris": ["Udhagamandalam", "Coonoor", "Gudalur", "Kotagiri", "Kundah", "Pandalur"],
  "Perambalur": ["Perambalur", "Alathur", "Kunnam", "Veppanthattai"],
  "Pudukkottai": ["Pudukkottai", "Alangudi", "Aranthangi", "Avudayarkoil", "Gandarvakottai", "Iluppur", "Karambakkudi", "Kulathur", "Manamelkudi", "Ponnamaravathi", "Thirumayam", "Viralimalai"],
  "Ramanathapuram": ["Ramanathapuram", "Kadaladi", "Kamuthi", "Kezhakarai", "Mudukulathur", "Paramakudi", "Rameswaram", "Rajasingamangalam", "Tiruvadanai"],
  "Ranipet": ["Ranipet", "Arakkonam", "Arcot", "Kalavai", "Nemili", "Sholingur"],
  "Salem": ["Salem", "Salem South", "Salem West", "Attur", "Edappadi", "Gangavalli", "Kadaiyampatti", "Mettur", "Omalur", "Pethanaickenpalayam", "Sankari", "Vazhapadi", "Yercaud"],
  "Sivaganga": ["Sivaganga", "Devakottai", "Ilayangudi", "Kalaiyarkoil", "Karaikudi", "Manamadurai", "Singampunari", "Thirupuvanam", "Tirupathur"],
  "Tenkasi": ["Tenkasi", "Alangulam", "Kadayanallur", "Sankarankoil", "Shenkottai", "Thiruvengadam", "VK Pudur", "Keezhapavur"],
  "Thanjavur": ["Thanjavur", "Boothalur", "Kumbakonam", "Orathanadu", "Papanasam", "Pattukkottai", "Peravurani", "Thiruvaiyaru", "Thiruvidaimarudur"],
  "Theni": ["Theni", "Andipatti", "Bodinayakanur", "Periyakulam", "Uthamapalayam"],
  "Thoothukudi": ["Thoothukudi", "Eral", "Ettayapuram", "Kayathar", "Kovilpatti", "Ottapidaram", "Sathankulam", "Srivaikundam", "Tiruchendur", "Vilathikulam"],
  "Tiruchirappalli": ["Tiruchirappalli", "Lalgudi", "Manachanallur", "Manapparai", "Marungapuri", "Musiri", "Srirangam", "Thottiyam", "Thuraiyur"],
  "Tirunelveli": ["Tirunelveli", "Ambasamudram", "Cheranmahadevi", "Manur", "Nanguneri", "Palayamkottai", "Radhapuram", "Thisayanvilai"],
  "Tirupathur": ["Tirupathur", "Ambur", "Natrampalli", "Vaniyambadi"],
  "Tiruppur": ["Tiruppur North", "Tiruppur South", "Avinashi", "Dharapuram", "Kangeyam", "Madathukulam", "Palladam", "Tiruppur", "Udumalaipettai", "Uthukuli"],
  "Tiruvallur": ["Tiruvallur", "Avadi", "Gummidipoondi", "Madhavaram", "Maduravoyal", "Pallipattu", "Ponneri", "Poonamallee", "R.K. Pet", "Tiruttani", "Uthukkottai"],
  "Tiruvannamalai": ["Tiruvannamalai", "Arani", "Chengam", "Chetpet", "Cheyyar", "Jamunamarathur", "Kalasapakkam", "Kilpennathur", "Polur", "Thandarampattu", "Vandavasi"],
  "Tiruvarur": ["Tiruvarur", "Kodavasal", "Koothanallur", "Mannargudi", "Nannilam", "Needamangalam", "Thiruthuraipoondi", "Valangaiman"],
  "Vellore": ["Vellore", "Anaicut", "Gudiyatham", "K.V. Kuppam", "Katpadi", "Pernambut"],
  "Viluppuram": ["Viluppuram", "Gingee", "Kandachipuram", "Marakkanam", "Melmalayanur", "Thiruvennainallur", "Tindivanam", "Vanur", "Vikravandi"],
  "Virudhunagar": ["Virudhunagar", "Aruppukkottai", "Kariapatti", "Rajapalayam", "Sathur", "Sivakasi", "Srivilliputhur", "Tiruchuli", "Vembakottai", "Watrap"]
};

export default function AdminGyms() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [gymsData, setGymsData] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedTaluk, setSelectedTaluk] = useState('All Taluks');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Strength & Fitness',
    city: '',
    taluk: '',
    owner: '',
    contact: '',
    email: '',
    established: '2026',
    address: '',
    latitude: '',
    longitude: '',
    status: 'Active',
    membersCount: '',
    trainersCount: '',
    equipmentsCount: '',
    facilities: []
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [customFacility, setCustomFacility] = useState('');

  useEffect(() => {
    fetchGyms();
  }, []);

  useEffect(() => {
    if (selectedDistrict === 'All Districts') {
      setSelectedTaluk('All Taluks');
    } else {
      setSelectedTaluk('All Taluks'); 
    }
  }, [selectedDistrict]);

  const fetchGyms = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/gyms/admin/all`);
      if (response.data.success) {
        setGymsData(response.data.gyms);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      name: '',
      type: 'Strength & Fitness',
      city: '',
      taluk: '',
      owner: '',
      contact: '',
      email: '',
      established: '2026',
      address: '',
      latitude: '',
      longitude: '',
      status: 'Active',
      membersCount: '',
      trainersCount: '',
      equipmentsCount: '',
      facilities: []
    });
    setImageFiles([]);
    setExistingImages([]);
    setCustomFacility('');
    setShowAddModal(true);
  };

  const handleEdit = (gym) => {
    setIsEditing(true);
    setEditId(gym._id);
    setFormData({
      name: gym.name,
      type: gym.type || 'Strength & Fitness',
      city: gym.city,
      taluk: gym.taluk,
      owner: gym.owner,
      contact: gym.contact,
      email: gym.email || '',
      established: gym.established || '2026',
      address: gym.address || '',
      latitude: gym.latitude || '',
      longitude: gym.longitude || '',
      status: gym.status,
      membersCount: gym.membersCount || '',
      trainersCount: gym.trainersCount || '',
      equipmentsCount: gym.equipmentsCount || '',
      facilities: gym.facilities || []
    });
    setImageFiles([]);
    setExistingImages(gym.images || (gym.image ? [gym.image] : []));
    setCustomFacility('');
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this gym?")) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/gyms/delete/${id}`);
        if (response.data.success) {
          fetchGyms();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // PUTHU STAR BUTTON LOGIC (Show in Home Screen)
  const handleToggleFeatured = async (id) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/gyms/toggle-featured/${id}`);
      if (response.data.success) {
        fetchGyms(); 
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'facilities') {
        formData.facilities.forEach(fac => {
          submitData.append('facilities', fac);
        });
      } else {
        submitData.append(key, formData[key]);
      }
    });
    
    imageFiles.forEach(file => {
      submitData.append('images', file);
    });

    if (isEditing) {
      existingImages.forEach(img => {
        submitData.append('existingImages', img);
      });
    }

    try {
      if (isEditing) {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/gyms/update/${editId}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.success) {
          setShowAddModal(false);
          fetchGyms();
        }
      } else {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/gyms/add`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.success) {
          setShowAddModal(false);
          fetchGyms();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addCustomFacility = () => {
    if(customFacility.trim() !== '' && !formData.facilities.includes(customFacility)) {
      setFormData({...formData, facilities: [...formData.facilities, customFacility.trim()]});
      setCustomFacility('');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('All Districts');
    setSelectedTaluk('All Taluks');
    setSelectedStatus('All Status');
  };

  const filteredGyms = gymsData.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          gym.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          gym.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = selectedDistrict === 'All Districts' || gym.city.toLowerCase() === selectedDistrict.toLowerCase();
    
    const matchesTaluk = selectedTaluk === 'All Taluks' || gym.taluk.toLowerCase() === selectedTaluk.toLowerCase();

    const matchesStatus = selectedStatus === 'All Status' || gym.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesDistrict && matchesTaluk && matchesStatus;
  });

  const totalGyms = gymsData.length;
  const activeGyms = gymsData.filter(g => g.status === 'Active').length;
  const pendingGyms = gymsData.filter(g => g.status === 'Pending').length;
  const suspendedGyms = gymsData.filter(g => g.status === 'Suspended').length;

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="dashboard-container container-fluid p-4">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="page-title">Gyms</h2>
              <div className="breadcrumbs">
                <span>Dashboard</span> <i className="bi bi-chevron-right mx-1"></i> <span className="active-path">Gyms</span>
              </div>
            </div>
            <button className="btn-add-new" onClick={openAddModal}>
              <i className="bi bi-plus-lg me-2"></i> Add New Gym
            </button>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-12 col-md-3">
              <div className="stat-card">
                <div className="stat-icon-wrapper"><i className="bi bi-activity"></i></div>
                <div className="stat-details">
                  <p className="stat-title">Total Gyms</p>
                  <h3 className="stat-count">{totalGyms}</h3>
                  <p className="stat-growth"><span className="text-success"><i className="bi bi-arrow-up-short"></i>+{totalGyms}</span> <span className="text-danger">(vs last month)</span></p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{backgroundColor: 'rgba(25, 135, 84, 0.15)', color: '#198754', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <i className="bi bi-check2-circle" style={{fontSize: '24px', color: '#198754'}}></i>
                </div>
                <div className="stat-details">
                  <p className="stat-title">Active Gyms</p>
                  <h3 className="stat-count">{activeGyms}</h3>
                  <p className="stat-growth"><span className="text-success"><i className="bi bi-arrow-up-short"></i>+{activeGyms}</span> <span className="text-danger">(vs last month)</span></p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{backgroundColor: 'rgba(255, 193, 7, 0.15)', color: '#ffc107'}}><i className="bi bi-clock-history"></i></div>
                <div className="stat-details">
                  <p className="stat-title">Pending Approval</p>
                  <h3 className="stat-count">{pendingGyms}</h3>
                  <p className="stat-growth"><span className="text-success"><i className="bi bi-arrow-up-short"></i>+{pendingGyms}</span> <span className="text-danger">(vs last month)</span></p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#DC2626'}}><i className="bi bi-slash-circle"></i></div>
                <div className="stat-details">
                  <p className="stat-title">Suspended</p>
                  <h3 className="stat-count">{suspendedGyms}</h3>
                  <p className="stat-growth"><span className="text-danger"><i className="bi bi-arrow-down-short"></i>-{suspendedGyms}</span> <span className="text-danger">(vs last month)</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="filters-bar mb-4">
            <div className="search-filter">
              <i className="bi bi-search"></i>
              <input 
                type="text" 
                placeholder="Search by gym name, location, or owner..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-dropdowns">
              <select 
                className="custom-select" 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="All Districts">All Districts</option>
                {Object.keys(tamilNaduDistricts).sort().map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              
              <select 
                className="custom-select" 
                value={selectedTaluk}
                onChange={(e) => setSelectedTaluk(e.target.value)}
                disabled={selectedDistrict === 'All Districts'}
              >
                <option value="All Taluks">All Taluks</option>
                {selectedDistrict !== 'All Districts' && 
                  tamilNaduDistricts[selectedDistrict].sort().map(taluk => (
                    <option key={taluk} value={taluk}>{taluk}</option>
                  ))
                }
              </select>

              <select 
                className="custom-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
              <button className="btn-reset" onClick={resetFilters}>Reset</button>
            </div>
          </div>

          <div className="row g-4">
            {filteredGyms.length > 0 ? (
              filteredGyms.map((gym) => {
                const primaryImage = (gym.images && gym.images.length > 0) ? gym.images[0] : (gym.image || "https://placehold.co/150x150/18181B/FFFFFF?text=Gym");
                return (
                  <div key={gym._id} className="col-12 col-md-6 col-lg-4">
                    <div className="gym-card">
                      <div className="gym-card-header justify-content-center">
                        <div className="gym-logo-container-large">
                          <img src={primaryImage} alt={gym.name} className="gym-card-image-large" />
                        </div>
                        <div className="gym-card-actions position-absolute top-0 end-0 p-3">
                          
                          <button 
                            className="btn btn-sm me-2" 
                            style={{ backgroundColor: gym.isFeatured ? '#DC2626' : '#27272A', color: '#FFF', border: 'none' }}
                            onClick={() => handleToggleFeatured(gym._id)}
                            title={gym.isFeatured ? "Remove from Home Screen" : "Show in Home Screen"}
                          >
                            <i className={gym.isFeatured ? "bi bi-star-fill" : "bi bi-star"}></i>
                          </button>

                          <button className="edit-btn" onClick={() => handleEdit(gym)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="delete-btn" onClick={() => handleDelete(gym._id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="gym-card-body text-center">
                        <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                          <h4 className="gym-card-title m-0">{gym.name}</h4>
                          <span className={`status-badge ${gym.status.toLowerCase()}`}>{gym.status}</span>
                        </div>
                        <div className="gym-card-details justify-content-center">
                          <p className="justify-content-center"><i className="bi bi-geo-alt text-danger"></i> {gym.city}, {gym.taluk}</p>
                          <p className="justify-content-center"><i className="bi bi-person text-danger"></i> {gym.owner}</p>
                        </div>
                      </div>
                      <div className="gym-card-footer">
                        <button className="btn-view-details-custom w-100" onClick={() => navigate(`/gym-details/${gym._id}`)}>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center py-5">
                <h4 style={{color: '#71717A'}}>No gyms found matching your search.</h4>
                <button className="btn btn-outline-danger mt-3" onClick={resetFilters}>Clear Filters</button>
              </div>
            )}
          </div>

        </div>
      </main>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h4>{isEditing ? 'Edit Gym' : 'Add New Gym'}</h4>
              <i className="bi bi-x-lg close-icon" onClick={() => setShowAddModal(false)}></i>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Gym Images (Select multiple)</label>
                    <input 
                      type="file" 
                      className="custom-input" 
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Gym Name</label>
                    <input 
                      type="text" 
                      className="custom-input" 
                      placeholder="Enter gym name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Gym Type</label>
                    <input 
                      type="text" 
                      className="custom-input" 
                      placeholder="Strength & Fitness"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  
                  <div className="col-12 col-md-6">
                    <label className="form-label">Location (District)</label>
                    <select 
                      className="custom-input custom-select-modal"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required 
                    >
                      <option value="" disabled>Select District</option>
                      {Object.keys(tamilNaduDistricts).sort().map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Taluka / Area</label>
                    {formData.city && tamilNaduDistricts[formData.city] ? (
                      <select 
                        className="custom-input custom-select-modal"
                        name="taluk"
                        value={formData.taluk}
                        onChange={handleInputChange}
                        required 
                      >
                        <option value="" disabled>Select Taluk</option>
                        {tamilNaduDistricts[formData.city].sort().map(taluk => (
                          <option key={taluk} value={taluk}>{taluk}</option>
                        ))}
                      </select>
                    ) : (
                      <input 
                        type="text" 
                        className="custom-input" 
                        placeholder="Select district first"
                        disabled
                      />
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Owner Name</label>
                    <input 
                      type="text" 
                      className="custom-input" 
                      placeholder="Enter owner name"
                      name="owner"
                      value={formData.owner}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Contact Number</label>
                    <input 
                      type="text" 
                      className="custom-input" 
                      placeholder="+91"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="custom-input" 
                      placeholder="email@example.com"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Established Year</label>
                    <input 
                      type="text" 
                      className="custom-input" 
                      placeholder="2026"
                      name="established"
                      value={formData.established}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Full Address</label>
                    <input 
                      type="text" 
                      className="custom-input" 
                      placeholder="Enter full address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="col-12 mt-4 mb-1">
                    <h5 style={{color: '#E4E4E7', fontSize: '15px', borderBottom: '1px solid #27272A', paddingBottom: '8px'}}>Stats & Counts</h5>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Total Members</label>
                    <input type="number" className="custom-input" placeholder="e.g. 245" name="membersCount" value={formData.membersCount} onChange={handleInputChange} />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Total Trainers</label>
                    <input type="number" className="custom-input" placeholder="e.g. 8" name="trainersCount" value={formData.trainersCount} onChange={handleInputChange} />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Total Equipments</label>
                    <input type="number" className="custom-input" placeholder="e.g. 36" name="equipmentsCount" value={formData.equipmentsCount} onChange={handleInputChange} />
                  </div>

                  <div className="col-12 mt-4 mb-1">
                    <h5 style={{color: '#E4E4E7', fontSize: '15px', borderBottom: '1px solid #27272A', paddingBottom: '8px'}}>Facilities & Amenities</h5>
                  </div>
                  <div className="col-12">
                     <div className="d-flex flex-wrap gap-3">
                       {['Personal Training', 'Locker Room', 'Shower', 'Parking', 'AC', 'Cardio Zone', 'Free Weights'].map(fac => (
                         <label key={fac} style={{display: 'flex', alignItems: 'center', gap: '6px', color: '#A1A1AA', fontSize: '13px', cursor: 'pointer'}}>
                           <input 
                             type="checkbox" 
                             checked={formData.facilities.includes(fac)}
                             onChange={(e) => {
                               if (e.target.checked) {
                                 setFormData({...formData, facilities: [...formData.facilities, fac]});
                               } else {
                                 setFormData({...formData, facilities: formData.facilities.filter(f => f !== fac)});
                               }
                             }}
                             style={{accentColor: '#DC2626'}}
                           />
                           {fac}
                         </label>
                       ))}
                     </div>
                  </div>
                  <div className="col-12 mt-2">
                    <div className="d-flex gap-2">
                      <input 
                        type="text" 
                        className="custom-input" 
                        placeholder="Add custom facility (e.g. Diet Plan, Sauna)" 
                        value={customFacility}
                        onChange={(e) => setCustomFacility(e.target.value)}
                        onKeyDown={(e) => {
                           if(e.key === 'Enter') {
                             e.preventDefault();
                             addCustomFacility();
                           }
                        }}
                      />
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        style={{backgroundColor: '#27272A', border: '1px solid #3F3F46', color: '#FFF'}}
                        onClick={addCustomFacility}
                      >Add</button>
                    </div>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {formData.facilities.filter(f => !['Personal Training', 'Locker Room', 'Shower', 'Parking', 'AC', 'Cardio Zone', 'Free Weights'].includes(f)).map(fac => (
                        <div key={fac} style={{backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#DC2626', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                          {fac}
                          <i className="bi bi-x-circle-fill" style={{cursor: 'pointer'}} onClick={() => {
                             setFormData({...formData, facilities: formData.facilities.filter(f => f !== fac)});
                          }}></i>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-12 mt-4 mb-1">
                    <h5 style={{color: '#E4E4E7', fontSize: '15px', borderBottom: '1px solid #27272A', paddingBottom: '8px'}}>Location & Status</h5>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Status</label>
                    <select 
                      className="custom-input custom-select-modal"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Latitude (Optional)</label>
                    <input 
                      type="text" 
                      className="custom-input" 
                      placeholder="e.g. 10.7870"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Longitude (Optional)</label>
                    <input 
                      type="text" 
                      className="custom-input" 
                      placeholder="e.g. 79.1378"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="modal-footer-btns mt-4">
                  <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn-save">{isEditing ? 'Update Gym' : 'Save Gym'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}