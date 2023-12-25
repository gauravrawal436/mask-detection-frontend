import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import smartbrain from './smartbrain.png';

const Logo = () => {
    return (
        <div className='ma4 mt0'> 
            <Tilt className='Tilt br2 sahdow-2' style={{ height: '150px', width: '150px'}}>
                <div className="Tilt-inner pa3" >
                    <img style={{paddingTop: '5px'}} alt = 'brain' src={smartbrain} />
                </div>
            </Tilt>
        </div>
    );
};

export default Logo;