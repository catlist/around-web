import React from 'react';
import { GoogleMap, withScriptjs, withGoogleMap } from "react-google-maps"
import { AroundMarker } from './AroundMarker';

class NormalAroundMap extends React.Component {
    getMapRef = (mapInstance) => {
        this.map = mapInstance;
    }

    getCenter = () => {
        const center = this.map.getCenter();
        return {
            lat: center.lat(),
            lon: center.lng()
        };
    }

    getRadius = () => {
        const center = this.map.getCenter();
        const bounds = this.map.getBounds();
        if (center && bounds) {
            const ne = bounds.getNorthEast();
            const right = new window.google.maps.LatLng(center.lat(), ne.lng());
            return 0.001 * window.google.maps.geometry.spherical.computeDistanceBetween(center, right);
        }
    }

    reloadMarkers = () => {
        const center = this.getCenter();
        this.props.loadNearbyPosts(center, this.getRadius());
    }

    render() {
        const { lat, lng } = this.props.center;
        return (
            <GoogleMap
                ref={this.getMapRef}
                defaultZoom={10}
                defaultCenter={{ lat, lng }}
                onDragEnd={this.reloadMarkers}
                onZoomChanged={this.reloadMarkers}
            >
                {
                    this.props.posts.map(post => <AroundMarker key={post.url} post={post} />)
                }
            </GoogleMap >
        );
    }
}

export const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap));