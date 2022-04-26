// useState are use to set state in functional components
import React, { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import { signout, isAuth } from '../../actions/auth';
import {withRouter} from 'next/router';
// component
import Search from '../blog/Search';
import { APP_NAME } from '../../config';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';

// nprogress - progress bar , need the css as well two options 1. cdn 2. node_modules
Router.onRouteChangeStart = url => NProgress.start(); // start progress bar
Router.onRouteChangeComplete = url => NProgress.done(); // completed
Router.onRouteChangeError = url => NProgress.done(); // error

// navigation bar
const Navigation = ({router}) => {
   // setup state - this.state is not used only the variable
   const [isOpen, setIsOpen] = useState(false)

   const toggle = () => {
      setIsOpen(!isOpen);
   }

   return (
      <React.Fragment>
      <Navbar color="light" light expand="md" style={{ cursor: 'pointer' }}>

        <Link href="/">
          <NavLink className="font-weight-bold">
            <img src='/static/images/assets/icon.png' alt="Logo" className="header__logo" />
          </NavLink>
        </Link>

        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem className="mr-2">
              <Link href="#about">
                <NavLink>
                  About Us
                </NavLink>
              </Link>
            </NavItem>
            <NavItem className="mr-2">
              <Link href="/">
                <NavLink> 
                  What's new
                </NavLink>
              </Link>
            </NavItem>
            <NavItem className="mr-2">
              <Link href="/">
                <NavLink> 
                  Know How's
                </NavLink>
              </Link>
            </NavItem>
            {/* <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Option 1
                </DropdownItem>
                <DropdownItem>
                  Option 2
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  Reset
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown> */}
          </Nav>
        
            {/* if not authenticated show signin and signup links */}
              {!isAuth() && 
                <React.Fragment>
                  <Link href="/signin">
                    <NavLink>
                      Signin
                    </NavLink>
                  </Link>
           
           
                  <Link href="/signup">
                    <NavLink>
                      Signup
                    </NavLink>
                  </Link>
                </React.Fragment>
              }

              {/* if authenticated and role is 0 show user dashboard */}
              { isAuth() && isAuth().role === 0 && (
                <Link href='/user'>
                  <NavLink>
                    {`${isAuth().name}'s Dashboard`}
                  </NavLink>
                </Link>
              )
              }

              {/* if authenticated and role is 1 show admin dashboard */}
              { isAuth() && isAuth().role === 1 && (
                <Link href='/admin'>
                  <NavLink>
                    {`${isAuth().name}'s Dashboard`}
                  </NavLink>
                </Link>
              )
              }

              {/* if authenticated show signout link */}
              {isAuth() && (
                  <NavLink  style={{ cursor: 'pointer' }} onClick={() => signout( () => Router.replace(`/signin`) ) }>
                    Signout
                  </NavLink>
              )}

 
              <Link href="/user/crud/blog">
                <NavLink className="btn btn-primary text-light">
                  Write a blog
                </NavLink>
              </Link>

              
            
          {/* <NavbarText>Simple Text</NavbarText> */}
        </Collapse>
      </Navbar>

      {router.pathname === '/blogs' && (<Search />)}

    </React.Fragment>
   )
}


export default withRouter(Navigation); 