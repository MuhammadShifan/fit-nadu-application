import React, { useState, useEffect, useRef } from 'react';
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

const trainerSpecializations = [
  "Strength & Conditioning",
  "Weight Loss & Fitness",
  "Muscle Building",
  "Yoga & Flexibility",
  "CrossFit Training",
  "Functional Training",
  "Personal Training",
  "Zumba & Aerobics",
  "Sports Rehabilitation"
];

export default function AdminTrainers() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [trainersData, setTrainersData] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedTaluk, setSelectedTaluk] = useState('All Taluks');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  
  const [formData, setFormData] = useState({
    name: '',
    specialization: 'General Fitness',
    age: '',
    gender: 'Male',
    city: '',
    taluk: '',
    contact: '',
    email: '',
    instagram: '',
    experience: '',
    status: 'Active'
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    fetchTrainers();
  }, []);

  useEffect(() => {
    if (selectedDistrict === 'All Districts') {
      setSelectedTaluk('All Taluks');
    } else {
      setSelectedTaluk('All Taluks'); 
    }
  }, [selectedDistrict]);

  const fetchTrainers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/trainers/admin/all`);
      if (response.data.success) {
        setTrainersData(response.data.trainers);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleExperienceChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if(val.length <= 2) { 
        setFormData({ ...formData, experience: val ? `${val}+ years` : '' });
    }
  };

  const handleContactChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if(val.length <= 10) {
        setFormData({ ...formData, contact: val ? `+91 ${val}` : '' });
    }
  };

  const handleAgeChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if(val.length <= 2) {
      setFormData({ ...formData, age: val });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragStart = (e, index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const _existingImages = [...existingImages];
      const draggedItemContent = _existingImages.splice(dragItem.current, 1)[0];
      _existingImages.splice(dragOverItem.current, 0, draggedItemContent);
      
      dragItem.current = null;
      dragOverItem.current = null;
      setExistingImages(_existingImages);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      name: '',
      specialization: 'Strength & Conditioning',
      age: '',
      gender: 'Male',
      city: '',
      taluk: '',
      contact: '+91 ',
      email: '',
      instagram: '',
      experience: '1+ years',
      status: 'Active'
    });
    setImageFiles([]);
    setExistingImages([]);
    setShowAddModal(true);
  };

  const handleEdit = (trainer) => {
    setIsEditing(true);
    setEditId(trainer._id);
    
    let parsedExperience = '';
    if (trainer.experience) {
      parsedExperience = trainer.experience.toString().replace(/[^0-9]/g, '');
    }

    let parsedContact = '';
    if (trainer.contact) {
      parsedContact = trainer.contact.replace('+91', '').trim();
    }

    setFormData({
      name: trainer.name || '',
      specialization: trainer.specialization || 'Strength & Conditioning',
      age: trainer.age ? trainer.age.toString() : '',
      gender: trainer.gender || 'Male',
      city: trainer.city || '',
      taluk: trainer.taluk || '',
      contact: parsedContact ? `+91 ${parsedContact}` : '+91 ',
      email: trainer.email || '',
      instagram: trainer.instagram || '',
      experience: parsedExperience ? `${parsedExperience}+ years` : '1+ years',
      status: trainer.status || 'Active'
    });
    setImageFiles([]);
    setExistingImages(trainer.images && trainer.images.length > 0 ? trainer.images : (trainer.image ? [trainer.image] : []));
    setShowAddModal(true);
  };

  const openViewModal = (trainer) => {
    setSelectedTrainer(trainer);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this trainer?")) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/trainers/delete/${id}`);
        if (response.data.success) {
          fetchTrainers();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/trainers/toggle-featured/${id}`);
      if (response.data.success) {
        fetchTrainers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    imageFiles.forEach(file => {
        submitData.append('images', file);
    });

    submitData.append('existingImages', JSON.stringify(existingImages));

    try {
      if (isEditing) {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/trainers/update/${editId}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.success) {
          setShowAddModal(false);
          fetchTrainers();
        }
      } 
      else {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/trainers/add`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.success) {
          setShowAddModal(false);
          fetchTrainers();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('All Districts');
    setSelectedTaluk('All Taluks');
    setSelectedSpecialization('All Specializations');
    setSelectedStatus('All Status');
  };

  const filteredTrainers = trainersData.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistrict === 'All Districts' || trainer.city.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesTaluk = selectedTaluk === 'All Taluks' || trainer.taluk.toLowerCase() === selectedTaluk.toLowerCase();
    const matchesSpec = selectedSpecialization === 'All Specializations' || trainer.specialization === selectedSpecialization;
    const matchesStatus = selectedStatus === 'All Status' || trainer.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesDistrict && matchesTaluk && matchesSpec && matchesStatus;
  });

  const totalTrainers = trainersData.length;
  const activeTrainers = trainersData.filter(t => t.status === 'Active').length;
  const pendingTrainers = trainersData.filter(t => t.status === 'Pending').length;
  const suspendedTrainers = trainersData.filter(t => t.status === 'Suspended').length;

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="dashboard-container container-fluid p-4">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="page-title">Trainers</h2>
              <div className="breadcrumbs">
                <span>Dashboard</span> <i className="bi bi-chevron-right mx-1"></i> <span className="active-path">Trainers</span>
              </div>
            </div>
            <button className="btn-add-new" onClick={openAddModal}>
              <i className="bi bi-plus-lg me-2"></i> Add New Trainer
            </button>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-12 col-md-3">
              <div className="stat-card">
                <div className="stat-icon-wrapper"><i className="bi bi-people-fill"></i></div>
                <div className="stat-details">
                  <p className="stat-title">Total Trainers</p>
                  <h3 className="stat-count">{totalTrainers}</h3>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{backgroundColor: 'rgba(25, 135, 84, 0.15)', color: '#198754'}}>
                  <i className="bi bi-person-check-fill"></i>
                </div>
                <div className="stat-details">
                  <p className="stat-title">Active Trainers</p>
                  <h3 className="stat-count">{activeTrainers}</h3>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{backgroundColor: 'rgba(255, 193, 7, 0.15)', color: '#ffc107'}}><i className="bi bi-person-dash-fill"></i></div>
                <div className="stat-details">
                  <p className="stat-title">Pending</p>
                  <h3 className="stat-count">{pendingTrainers}</h3>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#DC2626'}}><i className="bi bi-person-x-fill"></i></div>
                <div className="stat-details">
                  <p className="stat-title">Suspended</p>
                  <h3 className="stat-count">{suspendedTrainers}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="filters-bar mb-4" style={{flexWrap: 'wrap', gap: '15px'}}>
            <div className="search-filter" style={{minWidth: '250px'}}>
              <i className="bi bi-search"></i>
              <input 
                type="text" 
                placeholder="Search by name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-dropdowns" style={{flexWrap: 'wrap'}}>
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
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
              >
                <option value="All Specializations">All Specializations</option>
                {trainerSpecializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>

              <button className="btn-reset" onClick={resetFilters}>Reset</button>
            </div>
          </div>

          <div className="row g-4">
            {filteredTrainers.length > 0 ? (
              filteredTrainers.map((trainer) => {
                const profileImage = trainer.images && trainer.images.length > 0 ? trainer.images[0] : (trainer.image || "https://placehold.co/150x150/18181B/FFFFFF?text=Trainer");
                return (
                  <div key={trainer._id} className="col-12 col-md-6 col-lg-4">
                    <div className="gym-card">
                      <div className="gym-card-header justify-content-center pt-4">
                        <div className="gym-logo-container-large" style={{borderRadius: '50%'}}>
                          <img src={profileImage} alt={trainer.name} className="gym-card-image-large" />
                        </div>
                        <div className="gym-card-actions position-absolute top-0 end-0 p-3" style={{ zIndex: 5 }}>
                          
                          <button 
                            className="btn btn-sm me-2" 
                            style={{ backgroundColor: trainer.isFeatured ? '#DC2626' : '#27272A', color: '#FFF', border: 'none' }}
                            onClick={(e) => { e.stopPropagation(); handleToggleFeatured(trainer._id); }}
                            title={trainer.isFeatured ? "Remove from Home Screen" : "Show in Home Screen"}
                          >
                            <i className={trainer.isFeatured ? "bi bi-star-fill" : "bi bi-star"}></i>
                          </button>

                          <button className="edit-btn" onClick={() => handleEdit(trainer)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="delete-btn" onClick={() => handleDelete(trainer._id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="gym-card-body text-center pb-2">
                        <div className="d-flex flex-column justify-content-center align-items-center gap-1 mb-3">
                          <h4 className="gym-card-title m-0">{trainer.name}</h4>
                          <span className={`status-badge ${trainer.status.toLowerCase()}`}>{trainer.status}</span>
                        </div>
                        <div className="gym-card-details text-start px-3" style={{color: '#A1A1AA', fontSize: '13px'}}>
                          <p className="mb-2"><i className="bi bi-award text-danger me-2"></i> {trainer.specialization}</p>
                          <p className="mb-2"><i className="bi bi-geo-alt text-danger me-2"></i> {trainer.city}, {trainer.taluk}</p>
                          <p className="mb-0"><i className="bi bi-briefcase text-danger me-2"></i> {trainer.experience ? trainer.experience.toString().replace(/[^0-9]/g, '') : '0'}+ years experience</p>
                        </div>
                      </div>
                      <div className="gym-card-footer p-3">
                        <button className="btn-view-details-custom w-100" onClick={() => openViewModal(trainer)}>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center py-5">
                <h4 style={{color: '#71717A'}}>No trainers found matching your criteria.</h4>
                <button className="btn btn-outline-danger mt-3" onClick={resetFilters}>Clear Filters</button>
              </div>
            )}
          </div>

        </div>
      </main>

      {showViewModal && selectedTrainer && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-box position-relative" style={{ maxWidth: '400px', textAlign: 'center', padding: '40px 20px 30px' }} onClick={e => e.stopPropagation()}>
            <i className="bi bi-x-lg position-absolute" style={{top: '15px', right: '15px', cursor: 'pointer', color: '#A1A1AA', fontSize: '20px'}} onClick={() => setShowViewModal(false)}></i>
            
            <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', padding: '10px', marginBottom: '15px', justifyContent: (selectedTrainer.images && selectedTrainer.images.length > 1) ? 'flex-start' : 'center' }}>
              {(selectedTrainer.images && selectedTrainer.images.length > 0) ? (
                selectedTrainer.images.map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`${selectedTrainer.name} ${index + 1}`} 
                    style={{width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #DC2626', flexShrink: 0}} 
                  />
                ))
              ) : (
                <img 
                  src={selectedTrainer.image || "https://placehold.co/150x150/18181B/FFFFFF?text=Trainer"} 
                  alt={selectedTrainer.name} 
                  style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #DC2626'}} 
                />
              )}
            </div>
            
            <h3 style={{color: '#FFF', marginBottom: '5px', fontSize: '20px'}}>{selectedTrainer.name}</h3>
            <p style={{color: '#DC2626', fontWeight: '500', fontSize: '14px', marginBottom: '20px'}}>{selectedTrainer.specialization}</p>

            <div style={{backgroundColor: '#18181B', borderRadius: '8px', padding: '15px', textAlign: 'left', marginBottom: '20px'}}>
               <p style={{color: '#A1A1AA', fontSize: '13px', margin: '0 0 10px 0'}}>
                 <i className="bi bi-person text-danger me-2"></i> 
                 {selectedTrainer.age ? `${selectedTrainer.age} years old` : 'Age N/A'}, {selectedTrainer.gender ? selectedTrainer.gender : 'Gender N/A'}
               </p>
               <p style={{color: '#A1A1AA', fontSize: '13px', margin: '0 0 10px 0'}}><i className="bi bi-geo-alt text-danger me-2"></i> {selectedTrainer.taluk}, {selectedTrainer.city}</p>
               <p style={{color: '#A1A1AA', fontSize: '13px', margin: '0 0 10px 0'}}><i className="bi bi-briefcase text-danger me-2"></i> {selectedTrainer.experience} Experience</p>
               <p style={{color: '#A1A1AA', fontSize: '13px', margin: '0'}}><i className="bi bi-clock-history text-danger me-2"></i> Status: <span style={{color: selectedTrainer.status === 'Active' ? '#10B981' : '#F59E0B'}}>{selectedTrainer.status}</span></p>
            </div>

            <div className="d-flex justify-content-center gap-3">
              <a href={`tel:${selectedTrainer.contact ? selectedTrainer.contact.replace(/\s+/g, '') : ''}`} style={{backgroundColor: '#18181B', border: '1px solid #27272A', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', textDecoration: 'none', transition: '0.2s'}}>
                <i className="bi bi-telephone-fill" style={{fontSize: '18px', color: '#10B981'}}></i>
              </a>
              
              <a href={`mailto:${selectedTrainer.email || ''}`} style={{backgroundColor: '#18181B', border: '1px solid #27272A', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', textDecoration: 'none', transition: '0.2s'}}>
                <i className="bi bi-envelope-fill" style={{fontSize: '18px', color: '#F59E0B'}}></i>
              </a>

              {selectedTrainer.instagram && (
                <a href={`https://instagram.com/${selectedTrainer.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" style={{backgroundColor: '#18181B', border: '1px solid #27272A', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', textDecoration: 'none', transition: '0.2s'}}>
                  <i className="bi bi-instagram" style={{fontSize: '18px', color: '#E1306C'}}></i>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box position-relative" style={{ maxWidth: '700px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4>{isEditing ? 'Edit Trainer' : 'Add New Trainer'}</h4>
              <i className="bi bi-x-lg close-icon position-absolute" style={{top: '20px', right: '20px'}} onClick={() => setShowAddModal(false)}></i>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '10px' }}>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Profile Images (Select multiple)</label>
                    <input 
                      type="file" 
                      className="custom-input" 
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                    />
                  </div>

                  {existingImages.length > 0 && (
                    <div className="col-12">
                      <label className="form-label">Drag to reorder existing images</label>
                      <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', padding: '10px 0' }}>
                        {existingImages.map((img, index) => (
                          <div
                            key={`img-${index}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnter={(e) => handleDragEnter(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                            style={{ position: 'relative', cursor: 'grab' }}
                          >
                            <img src={img} alt={`Existing ${index}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #27272A' }} />
                            <button type="button" onClick={() => removeExistingImage(index)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', border: 'none', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}>X</button>
                            {index === 0 && <span style={{ position: 'absolute', bottom: '0', left: '0', background: 'green', color: 'white', fontSize: '10px', padding: '2px 5px', borderBottomLeftRadius: '8px' }}>Main</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {imageFiles.length > 0 && (
                    <div className="col-12">
                      <label className="form-label">New Images to Upload</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {imageFiles.map((file, index) => (
                          <div key={index} style={{ position: 'relative' }}>
                            <img src={URL.createObjectURL(file)} alt={`New ${index}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px dashed #DC2626' }} />
                            <button type="button" onClick={() => removeNewImage(index)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', border: 'none', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}>X</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="col-12 col-md-6">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="custom-input" 
                      placeholder="Enter trainer's name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Specialization</label>
                    <select 
                      className="custom-input custom-select-modal"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      required 
                    >
                      <option value="" disabled>Select Specialization</option>
                      {trainerSpecializations.map(spec => (
                         <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-6 col-md-3">
                    <label className="form-label">Age</label>
                    <input 
                      type="text" 
                      className="custom-input" 
                      placeholder="e.g. 28"
                      name="age"
                      value={formData.age}
                      onChange={handleAgeChange}
                      required 
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label">Gender</label>
                    <select 
                      className="custom-input custom-select-modal"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required 
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
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
                    <label className="form-label">Experience</label>
                    <input 
                      type="text" 
                      className="custom-input" 
                      placeholder="e.g. 5+ years"
                      name="experience"
                      value={formData.experience}
                      onChange={handleExperienceChange}
                      required 
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Contact Number</label>
                    <input 
                      type="text" 
                      className="custom-input" 
                      placeholder="+91 9876543210"
                      name="contact"
                      value={formData.contact}
                      onChange={handleContactChange}
                      required 
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Email Address</label>
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
                    <label className="form-label">Instagram Username</label>
                    <div className="d-flex align-items-center" style={{ backgroundColor: '#121214', border: '1px solid #27272A', borderRadius: '8px', padding: '0 10px' }}>
                      <span style={{ color: '#DC2626', fontSize: '14px', paddingRight: '8px', borderRight: '1px solid #27272A' }}>@</span>
                      <input 
                        type="text" 
                        className="custom-input border-0 bg-transparent flex-grow-1 p-0 m-0 ps-2" 
                        placeholder="username"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        style={{ height: '40px', boxShadow: 'none' }}
                      />
                    </div>
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
                </div>
                <div className="modal-footer-btns mt-4">
                  <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn-save">{isEditing ? 'Update Trainer' : 'Save Trainer'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}