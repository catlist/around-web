import React from 'react';
import { Marker, InfoWindow } from 'react-google-maps';

export class AroundMarker extends React.Component {
    defaultCenter = { lat: 40.758699, lng: -73.985542 };

    state = {
        isOpen: false,
        clickOpen: false
    }

    toggleOpen = () => {
        this.setState((prevState) => {
            return {
                isOpen: !prevState.isOpen
            }
        });
    }
    clickOpen = () => {
        this.setState((prevState) => {
            return {
                clickOpen: !prevState.clickOpen
            }
        });
    }

    onCloseClick = () => {
        this.setState((prevState) => {
            return {
                isOpen: false,
                clickOpen: false
            }
        });
    }

    render() {
        const { location: { lat, lon: lng }, user, message, url } = this.props.post;
        return (
            <Marker
                position={{ lat, lng }}
                onMouseOver={this.toggleOpen}
                onMouseOut={this.toggleOpen}
                onClick={this.clickOpen}
            >
                {
                    this.state.isOpen || this.state.clickOpen ?
                        (
                            <InfoWindow onCloseClick={this.onCloseClick}>
                                <div>
                                    <img
                                        className="around-marker-image"
                                        src={url}
                                        alt={message}
                                    />
                                    <p />
                                    {`${user} : ${message}`}
                                </div>
                            </InfoWindow>
                        ) : null
                }

            </Marker >
        );
    }
}