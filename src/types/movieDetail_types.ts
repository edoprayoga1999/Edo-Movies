type Genres = {
    id?: number
    name?: string
}
type ProductionCompanies = {
    name?: string
    id?: number
    logo_path?: string | null
    origin_country?: string
}
type ProductionCountries = {
    iso_3166_1?: string
    name?: string
}
type SpokenLanguages = {
    iso_639_1?: string
    name?: string
}
export type MovieDetailInterface = {
    adult?: boolean
    backdrop_path?: string | null
    belongs_to_collection?: null | object
    budget?: number
    genres?: Genres[],
    homepage?: string | null
    id?: number
    imdb_id?: string | null
    original_language?: string
    original_title?: string
    overview?: string | null
    popularity?: number
    poster_path?: string | null
    production_companies?: ProductionCompanies[]
    production_countries?: ProductionCountries[]
    release_date?: string
    revenue?: number
    runtime?: number | null
    spoken_languages?: SpokenLanguages[]
    status?: "Rumored" | "Planned" | "In Production" | "Post Production" | "Released" | "Canceled"
    tagline?: string | null
    title?: string
    video?: boolean
    vote_average?: number
    vote_count?: number
}