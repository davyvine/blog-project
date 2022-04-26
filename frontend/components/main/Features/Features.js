import React from 'react';


const features = (props) => {
   return (
       <div class="section-features">
            <div class="row">
                <div class="col-1-of-4">
                    <div class="feature-box">
                        <i class="feature-box__icon icon-basic-webpage-img-txt"></i>
                        <h3 class="heading-tertiary u-margin-bottom-small">Demos & Prototypes</h3>
                        {/* <p class="feature-box__text">
                            Various demos and prototypes for different projects which can be presented not only to Service Provider specific customers but across other domains as well.
                        </p> */}
                    </div>
                </div>

                    <div class="col-1-of-4">
                        <div class="feature-box">
                            <i class="feature-box__icon icon-basic-heart"></i>
                            <h3 class="heading-tertiary u-margin-bottom-small">Collaboration</h3>
                            {/* <p class="feature-box__text">
                                Collaboration is at the heart of the team philosophy.                             
                            </p> */}
                        </div>
                    </div>

                <div class="col-1-of-4">
                    <div class="feature-box">
                        <i class="feature-box__icon icon-basic-pencil-ruler"></i>
                        <h3 class="heading-tertiary u-margin-bottom-small">Crosswork-Architecture</h3>
                        {/* <p class="feature-box__text">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis suscipit dolorem quisquam.
                        </p> */}
                    </div>
                </div>

                <div class="col-1-of-4">
                    <div class="feature-box">
                        <i class="feature-box__icon icon-basic-laptop"></i>
                        <h3 class="heading-tertiary u-margin-bottom-small">ADT Labs</h3>
                        {/* <p class="feature-box__text">
                            The ADT CPOC infrastructure includes network, compute, DC and virtualization component to support validations, integrations and realist demo/POV for customer.
                        </p> */}
                    </div>
                </div>
            </div>
        </div>
   )
}

export default features;