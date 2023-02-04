import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import ReactLoading from "react-loading";
import axios from 'axios';
import Blank from "../components/DefaultBlankPhotos";
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const apiKey: string = "c2d05d46e415ec45bf44ae16885229f3"

const MovieDetail: React.FC = () => {
    const style = {
        titleStyle: {
            borderLeft: '3px solid yellow',
            paddingLeft: 5
        },
        posterStyle: {
            objectFit: 'contain'
        }
    }
    const navigate = useNavigate()
    const { id }: number | any = useParams()
    const [loading, setLoading] = useState(true)
    const [movieDetail, setMovieDetail] = useState(Object)
    const handleGetMoviesDetail = (movieId: number) => {
        const url: string = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
        axios.get(url)
            .then((result) => {
                console.log(result?.data)
                setMovieDetail(result?.data)
                document.title = "Edo Movies | " + result?.data?.title
            })
            .catch((error) => {
                setMovieDetail({})
                console.log(error.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        if (id) {
            handleGetMoviesDetail(id)
        }
    }, [])
    return (
        <Container fluid>
            <Row className="pt-4 mb-4">
                <Col>
                    <h3 className="text-white" style={style.titleStyle}>Movie Detail</h3>
                </Col>
            </Row>
            <Row>
                {
                    loading ? (
                        <ReactLoading type="bars" color="#ffc107" />
                    )
                        : movieDetail ? (
                            <Row>
                                <Col className='d-flex justify-content-center mb-4' lg={4} md={12}>
                                    <img
                                        src={movieDetail?.poster_path ? `https://image.tmdb.org/t/p/w300${movieDetail?.poster_path}` : "data:image/jpeg;base64," + Blank}
                                        style={{
                                            height: '350px',
                                            objectFit: 'contain'
                                        }} />
                                </Col>
                                <Col lg={8} md={12}>
                                    <div className='d-flex flex-column'>
                                        <h2 className='text-white'>{movieDetail?.original_title} (<FontAwesomeIcon icon={faStar} style={{ color: 'orange' }} /> {movieDetail?.vote_average.toFixed(2)})</h2>
                                        <h6 className='text-white'>Release Date: {movieDetail?.release_date}</h6>
                                        <h6 className='text-white'>Status: {movieDetail?.status}</h6>
                                        <h6 className='text-white'>{movieDetail?.tagline}</h6>
                                        <div className='d-flex w-50 mb-4'>
                                            <span className='text-white' style={{ marginRight: 5 }}>Genres:</span>
                                            {
                                                movieDetail?.genres?.length ? movieDetail?.genres?.map((data: any, index: number) => (
                                                    <>
                                                        <Badge
                                                            bg='warning'
                                                            text='dark'
                                                            style={{ marginLeft: index !== 0 ? 10 : undefined }}
                                                            key={index}>
                                                            {data?.name}
                                                        </Badge>{" "}
                                                    </>
                                                ))
                                                    : null
                                            }
                                        </div>
                                        <span className='text-white'>{movieDetail?.overview}</span>
                                    </div>
                                </Col>
                            </Row>
                        )
                            : (
                                <Col className="align-content-center mb-4">
                                    <h2 className="text-white">An error occured</h2>
                                </Col>
                            )
                }
            </Row>
        </Container>
    );
}
export default MovieDetail