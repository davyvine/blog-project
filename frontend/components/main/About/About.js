import React from 'react';
import '../../../static/sass/main.scss';

const about = (props) => {
   return (
      <section className="section-about">
                <div id="about" className="u-center-text u-margin-bottom-big">
                    <h2 className="heading-secondary">
                        ABOUT ADT
                    </h2>
                </div>

                <div className="row">
                    <div className="col-1-of-2">
                        <p className="paragraph">
                            The Agile Development Team (ADT) aims to reduce the friction in the Cisco sale cycle. <br/>
                            As a team, we combine practical domain knowledge with innovating programmability and automation approaches. The results are interactive & reusable applications/platforms to present an use case or drive an RFP. <br/><br/>
                            An initial professional low cost demo/POV, increases the chance of geetting a formal paid POV engagement and it help steering Cisco's product roadmaps in the account.
                        </p>

                        <h3 className="heading-tertiary u-margin-bottom-small">The goal</h3>
                        <p className="paragraph">
                            Bring to life new ideas and concepts from Powerpoint decks and whiteboarding sessions to code.
                        </p>

                        {/* <a href="#" className="btn-text">Learn more &rarr;</a> */}
                    </div>

                    <div className="col-1-of-2">
                        <div className="composition">
                            <img src='/static/images/assets/adt-1.jpg' alt="Photo 1"  className="composition__photo composition__photo--p1" />
                            <img src='/static/images/assets/adt-2.jpg' alt="Photo 2" className="composition__photo composition__photo--p2" />
                            <img src='/static/images/assets/adt-3.jpg' alt="Photo 3" className="composition__photo composition__photo--p3" />
                        </div>
                    </div>
                </div>
            </section>
   )
}

export default about;