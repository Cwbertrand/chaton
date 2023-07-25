import React from 'react'
import { Button, Container, Menu } from 'semantic-ui-react'

interface OpenNewForm {
    openForm: () => void;
}

function NavBar({openForm}: OpenNewForm) {
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                <img src='/assets/logo.png' alt='logo' style={{marginRight: '10px'}} />
                    ChatOn
                </Menu.Item>
                <Menu.Item name="Activities" />
                <Menu.Item>
                    <Button onClick={openForm} positive content="Create Activity" />
                </Menu.Item>
            </Container>
        </Menu>
    )
}

export default NavBar