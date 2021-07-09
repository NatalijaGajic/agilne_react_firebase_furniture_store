import React from 'react'
import { Link } from 'react-router-dom';

export default function Home() {

    return (
        <div className="banner">
            <div className="banner__content">
                <div className="container">
                    <div className="banner__text">
                        <h3>Dobrodošli u</h3>
                        <h1>SALON NAMEŠTAJA</h1>
                        <p>
                            koji nudi proizvode vrhunskog kvaliteta
                    </p>
                        <div className="banner__btn">
                            <Link to="/furnitures" className="btn btn-smart">
                               POGLEDAJ PONUDU</Link>
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
