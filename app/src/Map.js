import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import geoJson from "./mariupol.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoicGcyMSIsImEiOiJjbDlhNXFieGQxODgwM3Vtdjh5ZzJoZ3htIn0.0hmO0R_Vgtm1Zvk5PA-jMw";

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
      // make an initial directions request that
      // starts and ends at the same location
      getRoute(start);

      // Add starting point to the map
      map.addLayer({
        id: 'point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: start
                }
              }
            ]
          }
        },
        paint: {
          'circle-radius': 10,
          'circle-color': '#3887be'
        }
      });

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

        'circle-radius': {
        'base': 1.75,
        'stops': [
        [12, 2],
        [22, 180]
        ]
        },

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
    });


    const start = [37.552951, 47.104167];
    // create a function to make a directions request
    async function getRoute(end) {
      // make a directions request using cycling profile
      // an arbitrary start will always be the same
      // only the end or destination will change
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };
      // if the route already exists on the map, we'll reset it using setData
      if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }
      // add turn instructions here at the end
    }

    map.on('click', (event) => {
      const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
      const end = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: coords
            }
          }
        ]
      };
      if (map.getLayer('end')) {
        map.getSource('end').setData(end);
      } else {
        map.addLayer({
          id: 'end',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: coords
                  }
                }
              ]
            }
          },
          paint: {
            'circle-radius': 10,
            'circle-color': '#f30'
          }
        });
      }
      getRoute(coords);
    });
    

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default Map;
