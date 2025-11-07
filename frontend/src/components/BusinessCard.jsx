import React from 'react';

const BusinessCard = ({ business }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{business.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{business.description}</p>
      
      <div className="mb-3">
        <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded">
          {business.category}
        </span>
      </div>

      {business.address && (
        <div className="text-sm text-gray-600 mb-2">
          <p>
            {business.address.street && `${business.address.street}, `}
            {business.address.city && `${business.address.city}, `}
            {business.address.state} {business.address.zipCode}
          </p>
        </div>
      )}

      {business.contact && (
        <div className="text-sm space-y-1">
          {business.contact.phone && (
            <p className="text-gray-600">
              <span className="font-semibold">Phone:</span> {business.contact.phone}
            </p>
          )}
          {business.contact.email && (
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {business.contact.email}
            </p>
          )}
          {business.contact.website && (
            <a
              href={business.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline block"
            >
              Visit Website
            </a>
          )}
        </div>
      )}

      <div className="mt-3 pt-3 border-t text-xs text-gray-500">
        Owner: {business.owner?.displayName || 'Unknown'}
      </div>
    </div>
  );
};

export default BusinessCard;
