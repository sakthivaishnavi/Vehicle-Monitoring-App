import React, { createContext, useContext, useState } from 'react';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    return (
        <VehicleContext.Provider value={{ selectedVehicle, setSelectedVehicle }}>
            {children}
        </VehicleContext.Provider>
    );
};

export const useVehicle = () => useContext(VehicleContext);
