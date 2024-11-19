import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ListModal = ({ user, type, isOpen, onClose, onUpdate }) => {

  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setList([]);

    const fetchUsers = async () => {
      const users = await Promise.all(
        user[type].map(id =>
          fetch(`http://localhost:5050/api/users/${id}`)
          .then(res => res.json())
          .then(data => data.user)
        )
      );
      setList(users);
    };
  
    fetchUsers();
  }, [user, type]);

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <Toaster position="top-right" />
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-[#EAE8E0] rounded-3xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800"
          >
            ×
          </button>

          <h3
            className="font-handwritten text-3xl mb-6"
            style={{ fontFamily: '"Just Me Again Down Here", cursive' }}
          >
            {user.username}'s {type}
          </h3>
          {!list.length && "None"}
          {list.map((user, index) => (
            <div
              key={`${user._id}-${index}`} // Add unique composite key
              onClick={() => handleUserClick(user._id)}
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  `${user.firstName[0]}${user.lastName[0]}`
                )}
              </div>
              <div className="ml-3">
                <p className="font-semibold">{`${user.firstName} ${user.lastName}`}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ListModal;