import React from 'react';


const book = (props) => {
   return (
      
      <div class="section-book">
                <div class="row">
                    <div class="book">
                        <div class="book__form">
                            <form action="#" class="form">
                                <div class="u-margin-bottom-medium">
                                    <h2 class="heading-secondary">
                                        Start booking now
                                    </h2>
                                </div>

                                <div class="form__group">
                                    <input type="text" class="form__input" placeholder="Full Name" id="name" required />
                                    <label for="name" class="form__label">Full name</label>
                                </div>

                                <div class="form__group">
                                    <input type="email" class="form__input" placeholder="Email addrress" id="email" required/>
                                    <label for="email" class="form__label">Email addrress</label>
                                </div>

                                <div class="form__group">
                                    <button class="btn btn--green">Next step &rarr;</button>      
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
   )
}

export default book;