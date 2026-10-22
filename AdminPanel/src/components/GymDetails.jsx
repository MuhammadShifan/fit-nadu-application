import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; 
import './GymDetails.css';
import Sidebar from './Sidebar';
import Header from './Header';

const customMapIcon = new L.DivIcon({
  className: 'custom-map-pin',
  html: '<div style="background-color: #DC2626; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #FFF; box-shadow: 0 0 10px #DC2626;"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

export default function GymDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gym, setGym] = useState(null);
  const [images, setImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [mapCoords, setMapCoords] = useState([10.7870, 79.1378]);

  useEffect(() => {
    fetchGymDetails();
  }, [id]);

  useEffect(() => {
    if (gym) {
      if (gym.latitude && gym.longitude && gym.latitude.trim() !== '' && gym.longitude.trim() !== '') {
        setMapCoords([parseFloat(gym.latitude), parseFloat(gym.longitude)]);
      } else {
        fetchCoordinates();
      }
    }
  }, [gym]);

  const fetchGymDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/gyms/details/${id}`);
      if (response.data.success) {
        const gymData = response.data.gym;
        setGym(gymData);
        const gymImages = (gymData.images && gymData.images.length > 0) ? gymData.images : [gymData.image || "https://placehold.co/800x400/18181B/18181B?text=%20"];
        setImages(gymImages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCoordinates = async () => {
    try {
      const query = `${gym.taluk || ''}, ${gym.city || 'Thanjavur'}, Tamil Nadu, India`;
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      
      if (res.data && res.data.length > 0) {
        setMapCoords([parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)]);
      }
    } catch (err) {
      console.error("Map coordinates fetch error:", err);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedItemIndex === null) return;

    const updatedImages = [...images];
    const draggedImage = updatedImages[draggedItemIndex];
    updatedImages.splice(draggedItemIndex, 1);
    updatedImages.splice(targetIndex, 0, draggedImage);

    setImages(updatedImages);
    setActiveImageIndex(targetIndex);
    setDraggedItemIndex(null);

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/gyms/update/${id}`, {
        name: gym.name,
        type: gym.type,
        city: gym.city,
        taluk: gym.taluk,
        owner: gym.owner,
        contact: gym.contact,
        status: gym.status,
        existingImages: updatedImages
      });
    } catch (error) {
      console.error("Failed to update image order", error);
    }
  };

  if (!gym) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <main className="main-content">
          <Header />
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        </main>
      </div>
    );
  }

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="dashboard-container container-fluid p-4">
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="page-title m-0">Gym Details</h2>
              <div className="breadcrumbs mt-2">
                <span onClick={() => navigate('/dashboard')} className="breadcrumb-link">Dashboard</span> 
                <i className="bi bi-chevron-right mx-2 text-danger"></i> 
                <span onClick={() => navigate('/gyms')} className="breadcrumb-link">Gyms</span> 
                <i className="bi bi-chevron-right mx-2 text-danger"></i> 
                <span className="active-path">Gym Details</span>
              </div>
            </div>
          </div>

          <div className="gym-details-header">
            <div className="gallery-section">
              <div className="thumbnail-list">
                <button className="nav-btn-up"><i className="bi bi-chevron-up text-danger"></i></button>
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`thumbnail ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, idx)}
                    title="Drag and drop to reorder image"
                  >
                    <img src={img} alt={`Thumb ${idx}`} />
                  </div>
                ))}
                <button className="nav-btn-down"><i className="bi bi-chevron-down text-danger"></i></button>
              </div>
              <div className="main-image-display">
                <img src={images[activeImageIndex]} alt="Main Display" />
                <button className="nav-btn-left" onClick={prevImage}><i className="bi bi-chevron-left text-danger"></i></button>
                <button className="nav-btn-right" onClick={nextImage}><i className="bi bi-chevron-right text-danger"></i></button>
                <div className="image-counter">{activeImageIndex + 1} / {images.length}</div>
              </div>
            </div>
            
            <div className="info-section">
              <div className="d-flex align-items-center mb-4">
                <h1 className="gym-main-title m-0">{gym.name}</h1>
                <span className={`status-badge-sm ms-3 ${gym.status.toLowerCase()}`}>{gym.status}</span>
              </div>
              
              <div className="basic-info-row mb-2">
                <i className="bi bi-geo-alt text-danger"></i>
                <span>{gym.city}, {gym.taluk}</span>
              </div>
              
              <div className="basic-info-row mb-2">
                <i className="bi bi-person text-danger"></i>
                <span>{gym.owner}</span>
              </div>

              <div className="basic-info-row mb-1">
                <i className="bi bi-clock text-danger"></i>
                <span>Mon – Sat: 5:00 AM – 10:00 PM</span>
              </div>
              <div className="basic-info-row mb-4" style={{ paddingLeft: '28px' }}>
                <span>Sunday: 6:00 AM – 12:00 PM</span>
              </div>
              
              <div className="stats-grid">
                <div className="stat-item">
                  <i className="bi bi-people text-danger"></i>
                  <span className="stat-value">{gym.membersCount || '0'}</span>
                  <span className="stat-label">Members</span>
                </div>
                <div className="stat-item">
                  <i className="bi bi-person-badge text-danger"></i>
                  <span className="stat-value">{gym.trainersCount || '0'}</span>
                  <span className="stat-label">Trainers</span>
                </div>
                <div className="stat-item">
                  <i className="bi bi-activity text-danger"></i>
                  <span className="stat-value">{gym.equipmentsCount || '0'}</span>
                  <span className="stat-label">Equipment</span>
                </div>
                <div className="stat-item">
                  <i className="bi bi-calendar-event text-danger"></i>
                  <span className="stat-value">{gym.established || '2026'}</span>
                  <span className="stat-label">Since</span>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-12 col-lg-4">
              <div className="dark-card h-100">
                <h3 className="card-title-sm mb-4">Gym Information</h3>
                <div className="info-table">
                  <div className="info-row">
                    <span className="info-key">Gym Name</span>
                    <span className="info-val">{gym.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-key">Gym Type</span>
                    <span className="info-val">{gym.type || 'Strength & Fitness'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-key">Owner</span>
                    <span className="info-val">{gym.owner}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-key">Contact</span>
                    <span className="info-val">{gym.contact}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-key">Email</span>
                    <span className="info-val">{gym.email || `${gym.name.replace(/\s+/g, '').toLowerCase()}@example.com`}</span>
                  </div>
                  <div className="info-row border-0">
                    <span className="info-key">Established</span>
                    <span className="info-val">{gym.established || '2026'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-12 col-lg-4">
              <div className="dark-card h-100">
                <h3 className="card-title-sm mb-4">
                  <i className="bi bi-geo-alt me-2 text-danger"></i>Address & Location
                </h3>
                <div className="address-box mb-4">
                  <p className="m-0 text-light">
                    {gym.address || '123, Big Temple Road'},<br/>
                    {gym.taluk}, {gym.city},<br/>
                    Tamil Nadu - 612001, India
                  </p>
                </div>
                <div className="map-placeholder" style={{ zIndex: 0, position: 'relative' }}>
                  <MapContainer 
                    key={`${mapCoords[0]}-${mapCoords[1]}`} 
                    center={mapCoords} 
                    zoom={14} 
                    zoomControl={false} 
                    style={{ width: '100%', height: '100%', borderRadius: '8px' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    <Marker 
                      position={mapCoords} 
                      icon={customMapIcon}
                      eventHandlers={{
                        click: () => {
                          window.open(`https://www.google.com/maps/dir/?api=1&destination=${mapCoords[0]},${mapCoords[1]}`, '_blank');
                        }
                      }}
                    >
                      <Popup>
                        <b style={{color: '#000'}}>{gym.name}</b><br/>{gym.taluk}, {gym.city}
                      </Popup>
                    </Marker>
                  </MapContainer>

                  <button 
                    onClick={() => {
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${mapCoords[0]},${mapCoords[1]}`, '_blank');
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      zIndex: 1000,
                      backgroundColor: '#DC2626',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.4)',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                  >
                    <i className="bi bi-cursor-fill"></i> Get Directions
                  </button>
                </div>
              </div>
            </div>
            
            <div className="col-12 col-lg-4">
              <div className="dark-card h-100">
                <h3 className="card-title-sm mb-4">Facilities & Amenities</h3>
                <div className="amenities-grid">
                  {gym.facilities && gym.facilities.length > 0 ? (
                    gym.facilities.map((fac, idx) => (
                      <div key={idx} className="amenity-badge">
                        <i className="bi bi-check-circle text-danger"></i> {fac}
                      </div>
                    ))
                  ) : (
                    <span className="text-secondary small">No facilities added yet.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}