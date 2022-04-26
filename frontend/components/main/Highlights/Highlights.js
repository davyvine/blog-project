import React from 'react';
import Link from 'next/link';
import '../../../static/sass/main.scss';


const highlights = () => {
   return (

      <div className="highlights" id="highlights">
                <div className="u-center-text u-margin-bottom-big">
                    <h2 className="heading-secondary">
                        Demo & Prototype Highlights
                    </h2>
                </div>

                <div className="row">
                    <div className="col-1-of-3">
                        <div className="card">
                            <div className="card__side card__side--front-1">
                                <div className="card__picture card__picture--1">
                                    &nbsp;
                                </div>
                                {/* <h4 className="card__heading">
                                    <span className="card__heading-span card__heading-span--1">Yet Another Presentation</span>
                                </h4> */}
                                <div className="card__details">
                                    <h2 className="card__head">Yet Another Presentation</h2>
                                    <p className="card__text"> 
                                        Yet Another Presentation (YAP) is a general purpose presentation tool created for interactive automation demos, easy to customise, suitable for demos when we lack an actual product to drive the experience.
                                    </p>

                                    <div className="card__btn">
                                        <Link href="#" className="btn btn--white ">
                                            <a>Demo Details</a>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-1-of-3">
                        <div className="card">
                            <div className="card__side card__side--front-2">
                                <div className="card__picture card__picture--2">
                                    &nbsp;
                                </div>
                                {/* <h4 className="card__heading">
                                    <span className="card__heading-span card__heading-span--2">E2E SR orchestration with NSO</span>
                                </h4> */}
                                <div className="card__details">
                                    <h2 className="card__head">SR orchestration with NSO</h2>
                                    <p className="card__text"> 
                                    This demo uses the YAP tool to orchestrate a transport/DC slicing solution using T-SDN & DC-SDN NSO CFS, where SR handoff is the key component stitching the two domains.
                                    </p>

                                    <div className="card__btn">
                                        <Link href="/" className="btn btn--white ">
                                           <a>Demo Details</a> 
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-1-of-3">
                        <div className="card">
                            <div className="card__side card__side--front-3">
                                <div className="card__picture card__picture--3">
                                    &nbsp;
                                </div>
                                {/* <h4 className="card__heading">
                                    <span className="card__heading-span card__heading-span--3">IPoEoF Route Analysis</span>
                                </h4> */}
                                <div className="card__details">
                                    <h2 className="card__head">IPoEoF Route Analysis</h2>
                                    <p className="card__text"> 
                                        This project aims to prototype a tool that can – to a certain degree of confidence – estimate these critical parameters so that Cisco can confidently position the solution over 3rd party DWDM.
                                    </p>

                                    <div className="card__btn">
                                        <Link href="#" className="btn btn--white ">
                                            <a>Demo Details</a>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="u-center-text u-margin-top-huge">
                    <Link href="/catalog" className="btn btn--green">
                        <a>View all demos & prototypes</a>
                    </Link>
                </div>

            </div>
    
   )
}

export default highlights;