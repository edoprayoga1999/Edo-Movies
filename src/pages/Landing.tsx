import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Tooltip, OverlayTrigger, Button, Form } from "react-bootstrap";
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons";
import moment from "moment"
import ReactLoading from "react-loading";
import Blank from "../components/DefaultBlankPhotos";
import { useNavigate } from "react-router-dom"
import "./pagination.css"


const Landing: React.FC = () => {
    const apiKey: string = import.meta.env.VITE_API_KEY
    const navigate = useNavigate()
    const initialMovie: any[] = []
    const [searchInput, setSearchInput] = useState("")
    const [mode, setMode] = useState("popular")
    const [movieList, setMovieList] = useState(initialMovie)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState({
        current: 1,
        totalData: 0
    })
    const style = {
        titleStyle: {
            borderLeft: '3px solid yellow',
            paddingLeft: 5
        }
    }
    const onChange: PaginationProps['onChange'] = (pageNumber) => {
        setPage({
            ...page,
            current: pageNumber
        })
    };
    const getPopularMovie = (pageNumber: number) => {
        setMode("popular")
        setLoading(true)
        const url: string = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`
        axios.get(url)
            .then((result) => {
                setMovieList(result?.data?.results)
                setPage({
                    ...page,
                    totalData: result?.data?.total_results
                })
            })
            .catch((error) => {
                setMovieList([])
                setPage({
                    current: 1,
                    totalData: 0
                })
                console.log(error.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    const searchMovie = (keyword: string, pageNumber: number) => {
        setMode("search")
        setMovieList([])
        setLoading(true)
        const url: string = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&page=${pageNumber}&query=${encodeURIComponent(keyword)}`
        axios.get(url)
            .then((result) => {
                setPage({
                    ...page,
                    totalData: result?.data?.total_results
                })
                setMovieList(result?.data?.results)

            })
            .catch((error) => {
                setPage({
                    current: 1,
                    totalData: 0
                })
                setMovieList([])
                console.log(error.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    const handleSearch = (e: any) => {
        e.preventDefault()
        setPage({
            current: 1,
            totalData: 0
        })
        if (!searchInput) {
            getPopularMovie(1)
        } else {
            searchMovie(searchInput, 1)
        }
    }
    const handleChange = (e: any) => {
        setSearchInput(e.target.value)
    }
    const handleClickDetail = (movieId: number) => {
        navigate("/detail/" + movieId)
    }
    useEffect(() => {
        document.title = "Edo Movies | Home"
        getPopularMovie(page.current)
    }, [])
    useEffect(() => {
        if (mode === "popular") {
            getPopularMovie(page.current)
        } else {
            searchMovie(searchInput, page.current)
        }
    }, [page.current])
    return (
        <Container fluid>
            <Row className="pt-4 mb-4">
                <Col>
                    <h3 className="text-white" style={style.titleStyle}>Movie List</h3>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col >
                    <Form onSubmit={handleSearch}>
                        <Row>
                            <Col sm={12} md={4}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label className="text-white">Search Movie</Form.Label>
                                    <Form.Control onChange={handleChange} type="text" placeholder="Enter movie title" />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row className="mb-4" >
                {
                    loading ? (
                        <ReactLoading type="bars" color="#ffc107" />
                    )
                        : !movieList?.length ? (
                            <Col className="align-content-center mb-4">
                                <h2 className="text-white">No Movies Found</h2>
                            </Col>
                        )
                            : movieList?.map((data: any, index: number) => (
                                <Col className="align-content-center mb-4" lg={2} md={3} sm={4} xs={6} key={index}>
                                    <Card style={{ minWidth: '90%', minHeight: '100%', border: 'none' }}>
                                        <Card.Img
                                            className="bg-black"
                                            variant="top"
                                            src={data?.poster_path ? `https://image.tmdb.org/t/p/w200${data?.poster_path}` : "data:image/jpeg;base64," + Blank}
                                            style={{
                                                width: "100%",
                                                height: '300px'
                                            }}
                                        />
                                        <Card.Body className="bg-dark">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-top">
                                                        {`${data?.title} (${data?.original_title})`}
                                                    </Tooltip>
                                                }
                                            >
                                                <Card.Title className="text-truncate text-center text-white" >{`${data?.title} (${data?.original_title})`}</Card.Title>
                                            </OverlayTrigger>
                                            <Card.Text className="text-center text-white">
                                                <FontAwesomeIcon icon={faStar} style={{ color: 'orange' }} /> {data?.vote_average} ({moment(data?.release_date, "YYYY-MM-DD").format("YYYY")})
                                            </Card.Text>
                                        </Card.Body>
                                        <Card.Body className="bg-dark">
                                            <Row>
                                                <Button variant="warning" onClick={() => { handleClickDetail(data?.id) }}>Detail</Button>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                }
            </Row>
            <div className="d-flex align-items-center">
                <Pagination
                    className="text-white bg-dark"
                    showQuickJumper
                    current={page.current}
                    total={page.totalData}
                    onChange={onChange}
                    showSizeChanger={false}
                    defaultPageSize={20}
                />
            </div>
        </Container>
    )
}

export default Landing