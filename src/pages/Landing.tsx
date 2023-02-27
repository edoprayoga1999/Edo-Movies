import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Tooltip, OverlayTrigger, Button, Form } from "react-bootstrap";
import type { PaginationProps, FormProps, InputProps } from 'antd';
import { Pagination } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons";
import moment from "moment"
import ReactLoading from "react-loading";
import Blank from "../components/DefaultBlankPhotos";
import { useNavigate } from "react-router-dom"
import "./pagination.css"

interface Movie {
    poster_path?: string,
    adult?: boolean,
    overview?: string,
    release_date?: string,
    genre_ids?: number[],
    id?: number,
    original_title?: string,
    original_language?: string,
    title?: string,
    backdrop_path?: string | null,
    popularity?: number,
    vote_count?: number,
    video?: boolean,
    vote_average?: number
}
interface GetMovieResult {
    page?: number,
    results?: Movie[],
    total_results?: number,
    total_pages?: number
}
interface PaginationInterface {
    current: number,
    totalData: number
}

const Landing: React.FC = () => {
    const apiKey: string = import.meta.env.VITE_API_KEY
    const navigate = useNavigate()
    const [searchInput, setSearchInput] = useState("")
    const [mode, setMode] = useState<string>("popular")
    const [movieList, setMovieList] = useState<Movie[]>([])
    const [loading, setLoading] = useState<Boolean>(true)
    const [page, setPage] = useState<PaginationInterface>({
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
        axios.get<GetMovieResult>(url)
            .then((result) => {
                setMovieList(result.data.results || [])
                setPage({
                    ...page,
                    totalData: result.data.total_results || 0
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
        axios.get<GetMovieResult>(url)
            .then((result) => {
                setPage({
                    ...page,
                    totalData: result.data.total_results || 0
                })
                setMovieList(result.data.results || [])

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
    const handleSearch: FormProps['onSubmitCapture'] = (event) => {
        event.preventDefault()
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
    const handleChange: InputProps['onChange'] = (event) => {
        setSearchInput(event.target.value)
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
                                    <Form.Control onChange={handleChange} type="text" placeholder="Press ENTER to search" />
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
                        : !movieList.length ? (
                            <Col className="align-content-center mb-4">
                                <h2 className="text-white">No Movies Found</h2>
                            </Col>
                        )
                            : movieList.map((data, index) => (
                                <Col className="align-content-center mb-4" lg={2} md={3} sm={4} xs={6} key={index}>
                                    <Card style={{ minWidth: '90%', minHeight: '100%', border: 'none' }}>
                                        <Card.Img
                                            className="bg-black"
                                            variant="top"
                                            src={data.poster_path ? `https://image.tmdb.org/t/p/w200${data.poster_path}` : "data:image/jpeg;base64," + Blank}
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
                                                        {`${data.title} (${data.original_title})`}
                                                    </Tooltip>
                                                }
                                            >
                                                <Card.Title className="text-truncate text-center text-white" >{`${data.title} (${data.original_title})`}</Card.Title>
                                            </OverlayTrigger>
                                            <Card.Text className="text-center text-white">
                                                <FontAwesomeIcon icon={faStar} style={{ color: 'orange' }} /> {data.vote_average} ({data.release_date ? moment(data.release_date, "YYYY-MM-DD").format("YYYY") : "Unknown"})
                                            </Card.Text>
                                        </Card.Body>
                                        <Card.Body className="bg-dark">
                                            <Row>
                                                <Button 
                                                    variant="warning"
                                                    onClick={() => data.id ? handleClickDetail(data.id) : alert("Movie Detail Is Not Available")}
                                                >Detail
                                                </Button>
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