import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Initialize as empty array
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        fetchUsers();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `http://localhost:5050/api/users/search?query=${searchQuery}`
      );
      const data = await response.json();
      console.log('Search results:', data); // Add debug log
      setSearchResults(data.users || []);
      setIsDropdownOpen(true);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="pl-10 pr-4 py-2 border rounded-full w-64 focus:outline-none focus:border-yellow-500"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>
      
      {isDropdownOpen && searchResults && searchResults.length > 0 && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {searchResults.map((user, index) => (
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
      )}
    </div>
  );
};

export default SearchUsers;