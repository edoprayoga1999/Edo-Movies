import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import ReactLoading from "react-loading";
import axios from 'axios';
import Blank from "../components/DefaultBlankPhotos";
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface Genres {
    id?: number,
    name?: string
}
interface ProductionCompanies {
    name?: string,
    id?: number,
    logo_path?: string | null,
    origin_country?: string
}
interface ProductionCountries {
    iso_3166_1?: string,
    name?: string,
}
interface SpokenLanguages {
    iso_639_1?: string,
    name?: string,
}
interface MovieDetailInterface {
    adult?: boolean,
    backdrop_path?: string | null,
    belongs_to_collection?: null | object,
    budget?: number,
    genres?: Genres[],
    homepage?: string | null,
    id?: number,
    imdb_id?: string | null,
    original_language?: string,
    original_title?: string,
    overview?: string | null,
    popularity?: number,
    poster_path?: string | null,
    production_companies?: ProductionCompanies[],
    production_countries?: ProductionCountries[],
    release_date?: string,
    revenue?: number,
    runtime?: number | null,
    spoken_languages?: SpokenLanguages[],
    status?: "Rumored" | "Planned" | "In Production" | "Post Production" | "Released" | "Canceled",
    tagline?: string | null,
    title?: string,
    video?: boolean,
    vote_average?: number,
    vote_count?: number,
}

const MovieDetail: React.FC = () => {
    const apiKey: string = import.meta.env.VITE_API_KEY
    const style = {
        titleStyle: {
            borderLeft: '3px solid yellow',
            paddingLeft: 5
        },
        posterStyle: {
            objectFit: 'contain'
        }
    }
    const { id }: number | any = useParams()
    const [loading, setLoading] = useState(true)
    const [movieDetail, setMovieDetail] = useState<MovieDetailInterface | null>(null)
    const handleGetMoviesDetail = (movieId: number) => {
        const url: string = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
        axios.get<MovieDetailInterface>(url)
            .then((result) => {
                setMovieDetail(result.data)
                document.title = "Edo Movies | " + result.data.title
            })
            .catch((error) => {
                setMovieDetail(null)
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
                                        src={movieDetail.poster_path ? `https://image.tmdb.org/t/p/w300${movieDetail.poster_path}` : "data:image/jpeg;base64," + Blank}
                                        style={{
                                            height: '350px',
                                            objectFit: 'contain'
                                        }} />
                                </Col>
                                <Col lg={8} md={12}>
                                    <div className='d-flex flex-column'>
                                        <h2 className='text-white'>{movieDetail.original_title} (<FontAwesomeIcon icon={faStar} style={{ color: 'orange' }} /> {movieDetail.vote_average ? movieDetail.vote_average.toFixed(2) : "None"})</h2>
                                        <h6 className='text-white'>Release Date: {movieDetail.release_date}</h6>
                                        <h6 className='text-white'>Status: {movieDetail.status}</h6>
                                        <h6 className='text-white'>{movieDetail.tagline}</h6>
                                        <div className='d-flex w-50 mb-4'>
                                            <span className='text-white' style={{ marginRight: 5 }}>Genres:</span>
                                            {
                                                movieDetail.genres && movieDetail.genres.length ? movieDetail.genres.map((data, index) => (
                                                    <>
                                                        <Badge
                                                            bg='warning'
                                                            text='dark'
                                                            style={{ marginLeft: index !== 0 ? 10 : undefined }}
                                                            key={index}>
                                                            {data.name}
                                                        </Badge>{" "}
                                                    </>
                                                ))
                                                    : null
                                            }
                                        </div>
                                        <span className='text-white'>{movieDetail.overview}</span>
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