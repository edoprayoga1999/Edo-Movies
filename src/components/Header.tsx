import React from 'react'
import {
    Container,
    Navbar,
    Nav,
} from "react-bootstrap"
import { Link } from 'react-router-dom'

const Header: React.FC = () => {

    return (
        <>
            <Navbar
                bg="dark"
                variant="dark"
                expand="md"
                sticky="top"
            >
                <Container fluid>
                    <Navbar.Brand>
                        <Nav.Link as={Link} to="/">
                            Edo Movies
                        </Nav.Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav w-100">
                        <Nav style={{ marginRight: "auto" }}>
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default Header