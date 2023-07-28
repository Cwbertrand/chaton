import React from 'react'
import { Button, Container, Menu } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';


function NavBar() {
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header >
                <img src='/assets/logo.png' alt='logo' style={{marginRight: '10px'}} />
                    ChatOn
                </Menu.Item>
                <Menu.Item name="Activities" as={NavLink} to='/activities' />
                <Menu.Item>
                    <Button as={NavLink} to='/createActivity' positive content="Create Activity" />
                </Menu.Item>
            </Container>
        </Menu>
    )
}

export default NavBar