import React, { useState, useEffect } from 'react';
import './WorkerDashboard.css';

const WorkerDashboard = () => {
  const [requests, setRequests] = useState([]);

  
  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        
        const response = await fetch("http://localhost:5000/api/requests/myrequest", {
          method: "GET",
          headers: {
            "auth-token": token 
          }
        });

        if (response.ok) {
          const data = await response.json();
          setRequests(data); 
        } else {
          console.error("Failed to fetch requests");
        }
      } catch (error) {
        console.error("Fetch requests error:", error);
      }
    };

    fetchMyRequests();
  }, []);

  
  const handleAction = async (id, actionStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/requests/updatestatus/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        // Backend RequestSchema enum ('pending', 'accepted', 'rejected') ke hisaab se bhejenge
        body: JSON.stringify({ status: actionStatus }) 
      });

      if (response.ok) {
        // UI update
        setRequests(requests.map(req => 
          req._id === id ? { ...req, status: actionStatus } : req
        ));
      } else {
        alert(" Status update failed!");
      }
    } catch (error) {
      console.error("Update Status Error:", error);
    }
  };

  return (
    <div className="worker-dash-page">
      <div className="worker-dash-header">
        
        <h1>Welcome Back</h1>
        <p>Manage your job requests and grow your business.</p>
        
      </div>

      <div className="worker-dash-container">
        <h2>New Job Requests</h2>

        <div className="requests-container">
          {requests.map((request) => {
            
            
            const safeStatus = request.status ? request.status.toLowerCase() : 'pending';

            return (
              <div className={`request-card ${safeStatus === 'rejected' ? 'declined' : safeStatus}`} key={request._id}>
                
                <div className="request-info">
                
                  <h3>{request.client ? request.client.name : "Unknown Client"}</h3>
                  <p className="req-location">📍 {request.address}</p>
                  <p className="req-date">📅 {request.date}</p>
                  
                  <div className="req-problem">
                    <strong>Issue:</strong> {request.serviceNeeded}
                  </div>
                  
                  
                  {safeStatus === 'accepted' && request.client?.phone && (
                     <p style={{marginTop: '10px', color: '#1e7e34', fontWeight: 'bold'}}>
                       📞 Client Phone: {request.client.phone}
                     </p>
                  )}
                </div>

                <div className="request-actions">
                  {safeStatus === "pending" ? (
                    <>
                      <button className="btn-accept" onClick={() => handleAction(request._id, "accepted")}>
                        ✅ Accept
                      </button>
                      <button className="btn-decline" onClick={() => handleAction(request._id, "rejected")}>
                        ❌ Decline
                      </button>
                    </>
                  ) : (
                    <div className={`status-badge ${safeStatus === 'rejected' ? 'declined' : safeStatus}`}>
                      {request.status.toUpperCase()}
                    </div>
                  )}
                </div>

              </div>
            );
          })}

          {requests.length === 0 && (
            <p className="no-requests">No, any new booking till now. Please wait!</p>
          )}
        </div>
      </div>
    </div>
        );
};

export default WorkerDashboard;