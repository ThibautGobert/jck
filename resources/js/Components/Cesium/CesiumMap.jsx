import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';

const CesiumMap = () => {
    const cesiumContainer = useRef(null);

    useEffect(() => {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ZTcwMzIwNS00ZTk3LTQ4YjYtYWZkMi1mMGUzY2M3Y2ZiZGMiLCJpZCI6MTk3NzQ1LCJpYXQiOjE3MDg4NzQwNzh9.0Un4OhoXkGJxH51L8qpNB4M-yCL2gZ0FHSV2gVW80yg';
        const viewer = new Cesium.Viewer(cesiumContainer.current);
        return () => {
            viewer && viewer.destroy();
        };
    }, []);

    return <div id="cesiumContainer" ref={cesiumContainer} style={{ width: '100%', height: '100vh' }}></div>;
};

export default CesiumMap;
