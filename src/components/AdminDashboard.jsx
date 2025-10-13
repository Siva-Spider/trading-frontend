import React, { useState, useEffect } from "react";

function AdminDashboard({ user, onBackToLogin }) {
  const [users, setUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [newRegistrations, setNewRegistrations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPending, setSelectedPending] = useState(null);
  
  const selectedUserListType = () => {
  if (!selectedUser) return null;
  if (users.some(u => u.username === selectedUser.username)) return "user";
  if (pendingUsers.some(u => u.username === selectedUser.username)) return "pending";
  if (rejectedUsers.some(u => u.username === selectedUser.username)) return "rejected";
  return null;
  };

  const API_URL = "https://trading-backend-1-l859.onrender.com";
  
  useEffect(() => {
  const fetchUsers = () => {
    fetch("${API_URL}/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setRejectedUsers(data.rejected);
        setPendingUsers(data.pending);
        setNewRegistrations(data.newRegistrations || []);
      });
  };

  fetchUsers(); // initial fetch
  const interval = setInterval(fetchUsers, 5000); // every 5 seconds
  return () => clearInterval(interval);
}, []);


  const handleApprove = (username) => {
    fetch(`${API_URL}/api/admin/approve/${username}`, { method: "POST" }).then(() => {
      const userObj = pendingUsers.find((u) => u.username === username);
      setUsers([...users, userObj]);
      setPendingUsers(pendingUsers.filter((u) => u.username !== username));
      setSelectedPending(null);
       // Send email to user about approval
      fetch(`${API_URL}/api/admin/send_email/${username}?status=approved`, { method: "POST" });
    });
  };

  const handleReject = (username) => {
    fetch(`${API_URL}/api/admin/reject/${username}`, { method: "POST" }).then(() => {
      const userObj = pendingUsers.find((u) => u.username === username);
      setRejectedUsers([...rejectedUsers, userObj]);
      setPendingUsers(pendingUsers.filter((u) => u.username !== username));
      setSelectedPending(null);
      // Send email to user about rejection
      fetch(`${API_URL}/api/admin/send_email/${username}?status=rejected`, { method: "POST" });
    });
  };

  const handleDeleteRejectedUser = (username) => {
  fetch(`${API_URL}/api/admin/delete-rejected/${username}`, { method: "DELETE" })
    .then(() => {
      setRejectedUsers(rejectedUsers.filter((u) => u.username !== username));
      setSelectedUser(null);
    })
    .catch((err) => console.error("Error deleting rejected user:", err));
  };

  const handleResetPassword = async (username) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/reset-password/${username}`, {
      method: "POST",
    });
    const result = await response.json();
    if (result.success) {
      alert(`✅ ${result.message}`);
    } else {
      alert(`❌ ${result.message}`);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Server error resetting password");
  }
  };

  const handleDeleteUser = async (username) => {
    if (!window.confirm(`Are you sure you want to delete ${username}?`)) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/delete-user/${username}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        alert(`✅ ${result.message}`);
        // Refresh user list
        fetchUsers();
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error deleting user");
    }
  };
  
  return (
    <div className="min-h-screen p-4 space-y-4 bg-gray-100" >
      {/* Count Section */}
      <div className="flex justify-around p-2 bg-blue-200 rounded" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', flexWrap: 'nowrap', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' , background: '#f2acca'}}>
        <div style={{ marginLeft: '50px'}}>Total Users: {users.length}</div>
        <div style={{ marginLeft: '60px'}}>Total Rejected: {rejectedUsers.length}</div>
        <div style={{ marginLeft: '60px'}}>Total Pending: {pendingUsers.length}</div>
         <div style={{ marginLeft: '400px'}}>
        <button onClick={onBackToLogin} 
        style = {{background: '#4288f1ff', marginLeft: '10px' }}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
        Back to Login
        </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex space-x-4 w-full" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', flexWrap: 'nowrap', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
        {/* Left: Users & Rejected */}
        <div className="w-1/4 p-2 bg-green-100 rounded space-y-4" style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', flexWrap: 'nowrap', border: '1px solid #ccc', padding: '15px', borderRadius: '5px', background: '#8ded7e' }}>
          <h3 className="font-bold mb-2">Users</h3>
          <ul className="space-y-1">
            {users.map((u) => (
              <li
                key={u.username}
                onClick={() => setSelectedUser(u)}
                className="cursor-pointer hover:bg-green-200 p-1 rounded"
              >
                {u.username}
              </li>
            ))}
          </ul>
          </div>
          <div className="w-1/4 p-2 bg-green-100 rounded space-y-4" style={{ marginLeft: '30px', display: 'flex', alignItems: 'center', flexWrap: 'nowrap', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' , background: '#fc4c4c'}}>
          <h3 className="font-bold mb-2">Rejected Users</h3>
          <ul className="space-y-1">
            {rejectedUsers.map((u) => (
              <li key={u.username} 
              onClick={() => setSelectedUser(u)}
              className="p-1 rounded bg-red-100">
                {u.username}
              </li>
            ))}
          </ul>
          </div>

        {/* Middle: User Details */}
        <div className="w-1/2 p-4 bg-yellow-100 rounded" style={{ marginLeft: '30px', display: 'flex', alignItems: 'center', flexWrap: 'nowrap', border: '1px solid #ccc', padding: '15px', borderRadius: '5px', background: '#fcf7f7ff' }}>
          {selectedUser ? (
            <div>
              <h3 className="font-bold mb-2">User Details</h3>
              <p><b>User Name    :</b> {selectedUser.username}</p>
              <p><b>Email        :</b> {selectedUser.email}</p>
              <p><b>Mobile Number:</b> {selectedUser.mobilenumber}</p>
              <p><b>Role         :</b> {selectedUser.role}</p>

              {/* Action Buttons */}
              <div className="mt-4 space-x-2">
                {selectedUserListType() === "user" && (
                  <>
                    <button
                      onClick={() => handleResetPassword(selectedUser)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      style={{ marginLeft: '5px', background : '#4288f1ff' }}
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={() => handleDeleteUser(selectedUser.username)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      style={{ marginLeft: '5px', background : '#fc1d0dff' }}
                    >
                      Delete User
                    </button>
                  </>
                )}

                {selectedUserListType() === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedUser.username)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      style={{ marginLeft: '5px', background : '#0dfc0dff' }}
                      
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(selectedUser.username)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      style={{ marginLeft: '5px', background : '#fc1d0dff' }}
                    >
                      Reject
                    </button>
                  </>
                )}
                {selectedUserListType() === "rejected" && (
                  <button
                    onClick={() => handleDeleteRejectedUser(selectedUser.username)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    style={{ marginLeft: '5px', background: '#d11a2a' }}
                  >
                    Delete User
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="text-gray-500">Select a user to see details</div>
          )}
        </div>

        {/* Right: Pending Registrations */}
        <div className="w-1/4 p-2 bg-purple-100 rounded space-y-2" style={{  marginLeft: '30px', display: 'flex', alignItems: 'center', flexWrap: 'nowrap', border: '1px solid #ccc', padding: '15px', borderRadius: '5px', background: '#a7b9f3ff'}}>
          
          <h3 className="font-bold mb-2">Pending Registrations</h3>
          <button
            onClick={() => {
                fetch("${API_URL}/api/admin/users")
                .then((res) => res.json())
                .then((data) => {
                    setUsers(data.users);
                    setRejectedUsers(data.rejected);
                    setPendingUsers(data.pending);
                    setNewRegistrations(data.newRegistrations || []);
                });
            }}
            className="bg-gray-300 text-black px-2 py-1 rounded"
            style={{  marginLeft: '30px',marginBottom: '45px', marginRight:'0px', display: 'flex', border: '1px solid #ccc', padding: '1px', borderRadius: '5px', background: '#fafca0ff'}}
            >
            Refresh
          </button>

          {/* Dropdown for new registrations */}
          {newRegistrations.length > 0 && (
            <select
              className="w-full p-1 rounded bg-white border"
              onChange={(e) => {
                const u = newRegistrations.find((u) => u.username === e.target.value);
                setSelectedUser(u);
              }}
            >
              <option value="">Select new registration</option>
              {newRegistrations.map((u) => (
                <option key={u.username} value={u.username}>
                  {u.username}
                </option>
              ))}
            </select>
          )}

          <ul className="space-y-1 mt-2">
            {pendingUsers.map((u) => (
              <li
                key={u.username}
                onClick={() => setSelectedUser(u)}
                className={`cursor-pointer p-1 rounded hover:bg-purple-200 ${
                  selectedPending?.username === u.username ? "bg-purple-300" : ""
                }`}
              >
                {u.username}
              </li>
            ))}
          </ul>

          {/* Approve/Reject buttons */}
          {selectedPending && (
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleApprove(selectedPending.username)}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(selectedPending.username)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
