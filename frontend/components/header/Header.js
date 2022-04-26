import React from 'react';
// import icon from '../../public/assets/icon.png';
// import working from '../../assets/workingInProgress.png';
import '../../static/sass/main.scss';

const Header = (props) => {
   return (

      <div className="header">

            <div className="header__text-box">
                <h1 className="heading-primary">
                    <span className="heading-primary--main">APJ-ADT</span>
                    <span className="heading-primary--sub">Agile Development Team</span>
                </h1>

                <a href="#highlights" className="buttn buttn--white btn--animated">View Demos & Prototypes</a>
            </div>
        </div>
        
   )
}

export default Header;

