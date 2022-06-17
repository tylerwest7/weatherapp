import React from 'react';
import moment from 'moment';

function CardDetail(props){

    return (
        <div style={{display: props.cardDetailVisible ? 'flex' : 'none'}} id='card-detail-container'>
            <div id='card-detail'>
                <h3>{moment.unix(props.dailyDetails.moonset).format('MMMM Do YYYY')}</h3>
                <div id='temperature'>
                    <h1>H:{JSON.stringify(props.dailyDetails.temp?.day)}<span>&#8457;</span></h1>
                    <h1>L:{JSON.stringify(props.dailyDetails.temp?.night)}<span>&#8457;</span></h1>
                </div>
                <h3>Pressure: {props.dailyDetails.pressure}</h3>
                <h3>Humidity: {props.dailyDetails.humidity}</h3>
                <h3>Moonrise: {moment.unix(props.dailyDetails.moonrise).format('h:mm:ss a')}</h3>
                <h3>Moonset: {moment.unix(props.dailyDetails.moonset).format('h:mm:ss a')}</h3>
                <button onClick={props.handleCardClose()}>Close</button>
            </div>
        </div>
    )

}

export default CardDetail;