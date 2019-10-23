import React from 'react';
import { POS_KEY } from '../constants';
import { GoogleMap, withScriptjs, withGoogleMap } from "react-google-maps"
import { AroundMarker } from './AroundMarker';

class NormalAroundMap extends React.Component {

    defaultCenter = { lat: 40.758699, lng: -73.985542 };

    getCenter = () => {
        const obj = localStorage.getItem(POS_KEY);
        const latLon = JSON.parse(obj);
        return (obj != null) ? { lat: latLon.lat, lng: latLon.lon } : this.defaultCenter;
    };

    render() {
        return (
            <GoogleMap
                defaultZoom={10}
                defaultCenter={this.getCenter()}
            >
                {
                    this.props.posts.map(post => <AroundMarker key={post.url} post={post} />)
                }
            </GoogleMap >
        );
    }
}

export const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap));