import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import geoJson from "./mariupol-json.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const Map = () => {
  const mapContainerRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      // style: "mapbox://styles/mapbox/streets-v11",
      style: "mapbox://styles/mingxigu/cl99fes29001v16us6mpb9cqx",
      center: [37.5451295, 47.0969546],
      zoom: 12.5
    });

    map.on("load", () => {
      map.addSource("description", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: geoJson.features,
          },
        });;
      // map.addSource("points", {
      //     type: "geojson",
      //     data: {
      //       type: "FeatureCollection",
      //       features: geoJson.features,
      //     },
      //   });;
        map.addLayer({
        'id': 'description',
        'type': 'circle',
        'source': 'description',
        // 'source-layer': 'sf2010',
        'paint': {
        // Make circles larger as the user zooms from z12 to z22.
        'circle-radius': {
        'base': 1.75,
        'stops': [
        [12, 2],
        [22, 180]
        ]
        },
        // Color circles by ethnicity, using a `match` expression.
        'circle-color': [
        'match',
        ['get', 'description'],
        'No Damage',
        '#22262b',
        'Undamaged',
        '#22262b',
        'Damaged',
        '#FAE96F',
        'Destroyed',
        '#EE4B2B',
        /* other */ '#ccc'
        ]
        }
        });



      // Add an image to use as a custom marker
      // map.loadImage(
      //   "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
      //   function (error, image) {
      //     if (error) throw error;
      //     map.addImage("custom-marker", image);
      //     // Add a GeoJSON source with multiple points
      //     map.addSource("points", {
      //       type: "geojson",
      //       data: {
      //         type: "FeatureCollection",
      //         features: geoJson.features,
      //       },
      //     });
      //     // Add a symbol layer
      //     map.addLayer({
      //       id: "points",
      //       type: "symbol",
      //       source: "points",
      //       layout: {
      //         "icon-image": "custom-marker",
      //         // get the title name from the source's "title" property
      //         "text-field": ["get", "title"],
      //         "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      //         "text-offset": [0, 1.25],
      //         "text-anchor": "top",
      //       },
      //     });
      //   }
      // );
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default Map;
