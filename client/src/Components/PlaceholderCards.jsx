import React from 'react';

const dayItems = [0,1,2,3,4,5,6];

function PlaceholderCards(props){

    return (
        <div id='day-card-container' className={props.errorState ? '' : 'hidden-container-state'}>
        <div id='empty-state' className={props.errorState ? 'empty-state-state' : ''}>
            <h1>No locations to display weather from!</h1>
            <h2>Enter a longitude and latitude or select from your current location to see weather.</h2>
        </div>
        {dayItems?.map((day, index) => (
            <div key={index} id='day-card' className={props.errorState ? '' : 'hidden-card-state'}>
                <h2 style={{ opacity: 0 }}>ASDF<br/>ASDF</h2>
                <h2 style={{ opacity: 0 }}>ASDF</h2>
                <h4 style={{ opacity: 0 }}>ASDF</h4>
                <h4 style={{ opacity: 0 }}>ASDF</h4>
            </div>
        ))}
        </div>
    )
}

export default PlaceholderCards;