import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import './AdminReports.css';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminReports() {
  const [downloading, setDownloading] = useState(null);
  const [exportLogs, setExportLogs] = useState([]);

  const addExportLog = (reportName, category, format) => {
    const newLog = {
      id: Date.now(),
      reportName,
      category,
      requestedBy: 'Admin (Super Admin)',
      format,
      dateTime: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' }),
      status: 'Completed'
    };
    setExportLogs(prevLogs => [newLog, ...prevLogs].slice(0, 10));
  };

  const generatePDF = (title, columns, data, category) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.setTextColor(220, 38, 38);
    doc.text(`FitNadu - ${title}`, 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report Generated on: ${new Date().toLocaleString()}`, 14, 30);

    autoTable(doc, {
      startY: 38,
      head: [columns],
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    const fileName = `${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    doc.save(fileName);
    addExportLog(fileName, category, 'PDF');
  };

  const downloadGymsReport = async () => {
    setDownloading("Gyms Detailed Report");
    try {
      // Changed to IP Address
      const response = await axios.get('https://fit-nadu-backend.onrender.com/api/gyms/admin/all');
      if (response.data.success) {
        const tableData = response.data.gyms.map((gym, index) => [
          index + 1, 
          gym.name, 
          `${gym.taluk}, ${gym.city}`, 
          gym.owner, 
          gym.contact, 
          gym.status
        ]);
        generatePDF('Registered Gyms Detailed Report', ['S.No', 'Gym Name', 'Location', 'Owner', 'Contact', 'Status'], tableData, 'Gyms');
      }
    } catch (error) {
      console.error("Gyms Report Error:", error);
      alert("Failed to generate Gyms Report. Check server connection or browser console.");
    } finally {
      setDownloading(null);
    }
  };

  const downloadTrainersReport = async () => {
    setDownloading("Trainers Detailed Report");
    try {
      // Changed to IP Address
      const response = await axios.get('https://fit-nadu-backend.onrender.com/api/trainers/admin/all');
      if (response.data.success) {
        const tableData = response.data.trainers.map((trainer, index) => [
          index + 1, 
          trainer.name, 
          trainer.specialization, 
          `${trainer.taluk}, ${trainer.city}`, 
          trainer.experience, 
          trainer.contact, 
          trainer.status
        ]);
        generatePDF('Professional Trainers Report', ['S.No', 'Trainer Name', 'Specialization', 'Location', 'Experience', 'Contact', 'Status'], tableData, 'Trainers');
      }
    } catch (error) {
      console.error("Trainers Report Error:", error);
      alert("Failed to generate Trainers Report. Check server connection or browser console.");
    } finally {
      setDownloading(null);
    }
  };

  const downloadBrandsReport = async () => {
    setDownloading("Brands & Supplements Report");
    try {
      // Changed to IP Address
      const response = await axios.get('https://fit-nadu-backend.onrender.com/api/supplements/admin/all');
      if (response.data.success) {
        const tableData = response.data.supplements.map((brand, index) => [
          index + 1, 
          brand.name, 
          brand.websiteUrl || 'N/A', 
          brand.status
        ]);
        generatePDF('Active Brands and Supplements', ['S.No', 'Brand Name', 'Official Website', 'Status'], tableData, 'Brands');
      }
    } catch (error) {
      console.error("Brands Report Error:", error);
      alert("Failed to generate Brands Report. Check server connection or browser console.");
    } finally {
      setDownloading(null);
    }
  };

  const downloadOverallReport = async () => {
    setDownloading("Overall Platform Summary Report");
    try {
      // Changed to IP Address
      const response = await axios.get('https://fit-nadu-backend.onrender.com/api/dashboard/stats');
      if (response.data.success) {
        const stats = response.data.stats;
        const tableData = [
          ['Total Gyms', stats.gyms.total.toString(), stats.gyms.active.toString(), stats.gyms.pending.toString(), stats.gyms.suspended.toString()],
          ['Total Trainers', stats.trainers.total.toString(), stats.trainers.active.toString(), '-', '-'],
          ['Total Supplements', stats.supplements.total.toString(), stats.supplements.active.toString(), '-', '-'],
          ['Total Users', stats.users.total.toString(), 'All Active', '-', '-']
        ];

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.setTextColor(220, 38, 38);
        doc.text('FitNadu - Master Platform Summary', 14, 22);
        
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

        autoTable(doc, {
          startY: 40,
          head: [['Category', 'Total Count', 'Active', 'Pending', 'Suspended']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [220, 38, 38] },
          styles: { fontSize: 12, cellPadding: 6 }
        });

        const fileName = `Master_Platform_Metrics_${Date.now()}.pdf`;
        doc.save(fileName);
        addExportLog(fileName, 'Overall', 'PDF');
      }
    } catch (error) {
      console.error("Overall Report Error:", error);
      alert("Failed to generate Overall Summary Report.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="admin-layout">
      
      <Sidebar />

      <main className="main-content">
        
        <Header />

        <div className="dashboard-container container-fluid">
          
          <div className="page-header-row mb-4">
            <div className="page-header-text">
              <h2 className="page-title">Reports & Analytics</h2>
              <div className="breadcrumbs">
                <span>Dashboard</span> <i className="bi bi-chevron-right mx-1"></i> <span className="active-path">Reports</span>
              </div>
            </div>
            <button className="btn-add-new" onClick={downloadOverallReport} disabled={downloading !== null}>
              <i className="bi bi-download me-2"></i> {downloading === "Overall Platform Summary Report" ? "Generating..." : "Download Overall Report"}
            </button>
          </div>

          <h4 className="section-heading mb-3">Individual Module Reports</h4>
          <div className="row g-4 mb-4">
            
            <div className="col-12 col-md-6 col-xl-3">
              <div className="report-card">
                <div className="report-icon-box text-danger" style={{backgroundColor: 'rgba(220, 38, 38, 0.1)'}}>
                  <i className="bi bi-building"></i>
                </div>
                <h5 className="report-title">Gyms Report</h5>
                <p className="report-desc">Detailed analytics of registered gyms, active status, taluka-wise breakdown, and revenue stats.</p>
                <button className="btn-download-report" onClick={downloadGymsReport} disabled={downloading !== null}>
                  <i className="bi bi-download me-2"></i> {downloading === "Gyms Detailed Report" ? "Downloading..." : "Download Gyms Report"}
                </button>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="report-card">
                <div className="report-icon-box text-warning" style={{backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
                  <i className="bi bi-person-badge"></i>
                </div>
                <h5 className="report-title">Trainers Report</h5>
                <p className="report-desc">Comprehensive list of professional trainers, specialization performance, experience, and contacts.</p>
                <button className="btn-download-report" onClick={downloadTrainersReport} disabled={downloading !== null}>
                  <i className="bi bi-download me-2"></i> {downloading === "Trainers Detailed Report" ? "Downloading..." : "Download Trainers Report"}
                </button>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="report-card">
                <div className="report-icon-box text-success" style={{backgroundColor: 'rgba(25, 135, 84, 0.1)'}}>
                  <i className="bi bi-capsule"></i>
                </div>
                <h5 className="report-title">Brands & Supplements</h5>
                <p className="report-desc">Inventory status, active supplement brands, official website listings, and brand popularity metrics.</p>
                <button className="btn-download-report" onClick={downloadBrandsReport} disabled={downloading !== null}>
                  <i className="bi bi-download me-2"></i> {downloading === "Brands & Supplements Report" ? "Downloading..." : "Download Brands Report"}
                </button>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="report-card featured-report">
                <div className="report-icon-box text-white" style={{backgroundColor: 'rgba(220, 38, 38, 0.8)'}}>
                  <i className="bi bi-pie-chart-fill"></i>
                </div>
                <h5 className="report-title text-white">Overall Summary</h5>
                <p className="report-desc">Master consolidated report covering users, gyms, trainers, brands, revenue, and growth indexes.</p>
                <button className="btn-download-primary" onClick={downloadOverallReport} disabled={downloading !== null}>
                  <i className="bi bi-file-earmark-pdf me-2"></i> {downloading === "Overall Platform Summary Report" ? "Generating PDF..." : "Download Master Report"}
                </button>
              </div>
            </div>

          </div>

          <div className="table-card p-4">
            <h5 className="mb-3 text-white fw-bold" style={{fontSize: '16px'}}>Recent Export Activity Logs</h5>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Category</th>
                    <th>Requested By</th>
                    <th>Format</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {exportLogs.length > 0 ? (
                    exportLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="text-white">{log.reportName}</td>
                        <td>
                          <span className={log.category === 'Overall' ? 'text-primary' : 'text-danger'}>
                            {log.category}
                          </span>
                        </td>
                        <td className="text-secondary">{log.requestedBy}</td>
                        <td>{log.format}</td>
                        <td style={{ color: '#E4E4E7' }}>{log.dateTime}</td>
                        <td><span className="status-badge active">{log.status}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-secondary py-5">
                        No recent reports downloaded yet. Your download history will appear here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}