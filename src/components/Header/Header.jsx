import React, { useContext, useEffect, useRef, useState } from 'react';
import { useGetLeaderboardMutation } from '../../services/phpService';
import face from '../../img/face.webp'

import { GameInfoContext } from '../../helpers/context';

const Header = ({ user }) => {


   
   
    /* Styles */

    const buttonStyle = {
		display: 'flex',
		alignItems: 'center',
		border: '1px solid #ccc',
		padding: '8px 12px',
		borderRadius: '4px',
		textDecoration: 'none',
		cursor: 'pointer',
		color: '#fff',
		transition: 'background-color 0.3s ease',
		background: 'linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6)',
		boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
    };

	const titleStyle = {
		color: '#fff',
		fontSize: '32px',
		fontWeight: 700,
		lineHeight: '100%',
		marginTop: '27px',
		textAlign: 'center',
	};

    const header = {
        padding: '0 12px',
        display: 'flex',
        justifyContent: 'space-between',
        height: '64px',
        alignItems: 'center',
    }

    const faceBox = {
        width:'44px',
        height: '44px',
        border: '2px solid #1c2520',
        borderRadius: '62px',
        background: '#80c27d'
    }
    const faceImg = {
        width:'100%',
        height:'100%'
    }

    const btnGroup = {

    }

    const socialBtns = {

    }

    const menuBtn = {

    }

    const socialBtn = {
        
    }
    return (
        <header style={header}>
            <div style={faceBox}>
                <img style={faceImg} src={face} alt="logo"/>
            </div>

            <div style={btnGroup}>
                <div style={socialBtns}>
                    <button style={socialBtn}>

                    </button>
                    <button style={socialBtn}>
                        
                    </button>
                </div>
                <div>
                    <button style={menuBtn}>

                    </button>
                </div>
            </div>
				{/* <div>
					<a style={buttonStyle} onClick={openLeaderboard}>
						Leadboard  
					</a>
				</div>
				<div>
					<a
						style={buttonStyle}
						onClick={openReferral}
					>
						Referral  
					</a>
				</div> */}
            
		</header>
    );
}

export default Header;