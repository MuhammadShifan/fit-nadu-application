import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminGyms.css'; 
import Sidebar from './Sidebar'; 
import Header from './Header';

export default function AdminSupplements() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSupplement, setSelectedSupplement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [supplementsData, setSupplementsData] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    websiteUrl: '',
    status: 'Active'
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState('');

  useEffect(() => {
    fetchSupplements();
  }, []);

  const fetchSupplements = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/supplements/admin/all`);
      if (response.data.success) {
        setSupplementsData(response.data.supplements);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      name: '',
      description: '',
      websiteUrl: '',
      status: 'Active'
    });
    setImageFile(null);
    setExistingImage('');
    setShowAddModal(true);
  };

  const handleEdit = (supplement) => {
    setIsEditing(true);
    setEditId(supplement._id);
    setFormData({
      name: supplement.name,
      description: supplement.description || '',
      websiteUrl: supplement.websiteUrl || '',
      status: supplement.status
    });
    setImageFile(null);
    setExistingImage(supplement.image || '');
    setShowAddModal(true);
  };

  const openViewModal = (supplement) => {
    setSelectedSupplement(supplement);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/supplements/delete/${id}`);
        if (response.data.success) {
          fetchSupplements();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // PUTHU STAR BUTTON LOGIC (Show in Home Screen)
  const handleToggleFeatured = async (id) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/supplements/toggle-featured/${id}`);
      if (response.data.success) {
        fetchSupplements();
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
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    if (isEditing && existingImage) {
      submitData.append('existingImage', existingImage);
    }

    try {
      if (isEditing) {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/supplements/update/${editId}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.success) {
          setShowAddModal(false);
          fetchSupplements();
        }
      } else {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/supplements/add`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.success) {
          setShowAddModal(false);
          fetchSupplements();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
  };

  const filteredSupplements = supplementsData.filter(supplement => {
    const matchesSearch = supplement.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All Status' || supplement.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalBrands = supplementsData.length;
  const activeBrands = supplementsData.filter(s => s.status === 'Active').length;
  const pendingBrands = supplementsData.filter(s => s.status === 'Pending').length;
  const suspendedBrands = supplementsData.filter(s => s.status === 'Suspended').length;

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="dashboard-container container-fluid p-4">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="page-title">Supplements</h2>
              <div className="breadcrumbs">
                <span>Dashboard</span> <i className="bi bi-chevron-right mx-1"></i> <span className="active-path">Supplements</span>
              </div>
            </div>
            <button className="btn-add-new" onClick={openAddModal}>
              <i className="bi bi-plus-lg me-2"></i> Add New Supplement
            </button>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-12 col-md-3">
              <div className="stat-card">
                <div className="stat-icon-wrapper"><i className="bi bi-capsule"></i></div>
                <div className="stat-details">
                  <p className="stat-title">Total Brands</p>
                  <h3 className="stat-count">{totalBrands}</h3>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{backgroundColor: 'rgba(25, 135, 84, 0.15)', color: '#198754'}}>
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <div className="stat-details">
                  <p className="stat-title">Active Brands</p>
                  <h3 className="stat-count">{activeBrands}</h3>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{backgroundColor: 'rgba(255, 193, 7, 0.15)', color: '#ffc107'}}><i className="bi bi-clock-fill"></i></div>
                <div className="stat-details">
                  <p className="stat-title">Pending Approval</p>
                  <h3 className="stat-count">{pendingBrands}</h3>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#DC2626'}}><i className="bi bi-slash-circle"></i></div>
                <div className="stat-details">
                  <p className="stat-title">Suspended</p>
                  <h3 className="stat-count">{suspendedBrands}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="filters-bar mb-4" style={{flexWrap: 'wrap', gap: '15px'}}>
            <div className="search-filter" style={{minWidth: '250px', flexGrow: 1}}>
              <i className="bi bi-search"></i>
              <input 
                type="text" 
                placeholder="Search by brand name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-dropdowns" style={{flexWrap: 'wrap'}}>
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
            {filteredSupplements.length > 0 ? (
              filteredSupplements.map((supplement) => {
                const brandLogo = supplement.image || "https://placehold.co/150x150/18181B/FFFFFF?text=Brand";
                return (
                  <div key={supplement._id} className="col-12 col-md-6 col-lg-3">
                    <div className="gym-card d-flex flex-column h-100 position-relative pt-4">
                      <div className="gym-card-actions position-absolute top-0 end-0 p-3" style={{ zIndex: 5 }}>
                        
                        <button 
                          className="btn btn-sm me-2" 
                          style={{ backgroundColor: supplement.isFeatured ? '#DC2626' : '#27272A', color: '#FFF', border: 'none' }}
                          onClick={(e) => { e.stopPropagation(); handleToggleFeatured(supplement._id); }}
                          title={supplement.isFeatured ? "Remove from Home Screen" : "Show in Home Screen"}
                        >
                          <i className={supplement.isFeatured ? "bi bi-star-fill" : "bi bi-star"}></i>
                        </button>

                        <button className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(supplement); }}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(supplement._id); }}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>

                      <div className="p-3 d-flex flex-column align-items-center justify-content-center text-center mt-3">
                        <img 
                          src={brandLogo} 
                          alt={supplement.name} 
                          style={{
                            width: '100px', 
                            height: '100px', 
                            borderRadius: '16px', 
                            objectFit: 'contain', 
                            backgroundColor: '#FFFFFF',
                            border: '2px solid #27272A',
                            marginBottom: '15px'
                          }} 
                        />
                        <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                           <span className={`status-badge ${supplement.status.toLowerCase()}`} style={{fontSize: '10px', padding: '2px 8px'}}>{supplement.status}</span>
                        </div>
                        <h4 className="m-0 text-white" style={{fontSize: '20px', fontWeight: '600'}}>{supplement.name}</h4>
                      </div>
                      
                      <div className="p-3 pt-0 mt-auto w-100">
                        <button className="btn-view-details-custom w-100" onClick={() => openViewModal(supplement)}>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center py-5">
                <h4 style={{color: '#71717A'}}>No supplement brands found matching your search.</h4>
                <button className="btn btn-outline-danger mt-3" onClick={resetFilters}>Clear Filters</button>
              </div>
            )}
          </div>

        </div>
      </main>

      {showViewModal && selectedSupplement && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-box" style={{ maxWidth: '450px', padding: '0', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{position: 'relative', height: '120px', backgroundColor: '#18181B', borderBottom: '1px solid #27272A'}}>
              <i className="bi bi-x-lg position-absolute" style={{top: '15px', right: '15px', cursor: 'pointer', color: '#A1A1AA', zIndex: 10}} onClick={() => setShowViewModal(false)}></i>
              <div style={{position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)'}}>
                 <img 
                    src={selectedSupplement.image || "https://placehold.co/150x150/18181B/FFFFFF?text=Brand"} 
                    alt={selectedSupplement.name} 
                    style={{width: '80px', height: '80px', borderRadius: '16px', objectFit: 'contain', border: '3px solid #DC2626', backgroundColor: '#FFF'}} 
                 />
              </div>
            </div>
            
            <div style={{padding: '50px 24px 30px', textAlign: 'center'}}>
              <h3 style={{color: '#FFF', marginBottom: '5px', fontSize: '22px', fontWeight: '600'}}>{selectedSupplement.name}</h3>
              <span className={`status-badge ${selectedSupplement.status.toLowerCase()} d-inline-block mb-4`}>{selectedSupplement.status}</span>
              
              <div style={{backgroundColor: '#18181B', borderRadius: '8px', padding: '16px', textAlign: 'left', marginBottom: '20px', border: '1px solid #27272A'}}>
                 <p style={{color: '#A1A1AA', fontSize: '14px', lineHeight: '1.6', margin: '0'}}>
                   {selectedSupplement.description || "No description provided for this brand."}
                 </p>
              </div>

              {selectedSupplement.websiteUrl && (
                <div style={{textAlign: 'left'}}>
                  <p style={{color: '#71717A', fontSize: '13px', margin: '0 0 5px 0'}}><i className="bi bi-globe me-2"></i>Official Website</p>
                  <a href={selectedSupplement.websiteUrl} target="_blank" rel="noreferrer" style={{color: '#DC2626', fontSize: '14px', textDecoration: 'none', fontWeight: '500'}}>
                    {selectedSupplement.websiteUrl} <i className="bi bi-box-arrow-up-right ms-1" style={{fontSize: '12px'}}></i>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4>{isEditing ? 'Edit Supplement Brand' : 'Add New Supplement Brand'}</h4>
              <i className="bi bi-x-lg close-icon" onClick={() => setShowAddModal(false)}></i>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Brand Logo</label>
                    <div style={{border: '1px dashed #DC2626', borderRadius: '8px', padding: '20px', textAlign: 'center', backgroundColor: '#DC262610'}}>
                        <i className="bi bi-cloud-arrow-up text-danger" style={{fontSize: '24px'}}></i>
                        <p style={{color: '#E4E4E7', fontSize: '14px', margin: '10px 0 5px'}}>Click to upload brand logo</p>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{width: '100%', cursor: 'pointer'}}
                        />
                    </div>
                  </div>
                  
                  <div className="col-12 col-md-6">
                    <label className="form-label">Brand Name</label>
                    <input 
                      type="text" 
                      className="custom-input" 
                      placeholder="e.g. Nakpro, MuscleBlaze"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Official Website URL</label>
                    <input 
                      type="url" 
                      className="custom-input" 
                      placeholder="https://www.brandwebsite.com"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Brand Description</label>
                    <textarea 
                      className="custom-input" 
                      placeholder="Enter detailed brand description..."
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      style={{resize: 'none', paddingTop: '10px'}}
                    ></textarea>
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
                  <button type="submit" className="btn-save">{isEditing ? 'Update Brand' : 'Save Brand'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}