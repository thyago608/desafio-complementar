import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { api } from "../services/api";

//propriedades de cada gênero
interface GenreResponseProps {
  id: number;
  name: "action" | "comedy" | "documentary" | "drama" | "horror" | "family";
  title: string;
}

//propriedades de cada filme - cada filme será um objeto
interface MovieProps {
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

//Tipando o Contexto
interface MovieContextProps {
  genres: GenreResponseProps[];
  handleClickButton: (id: number) => void;
  selectedGenreId: number;
  selectedGenre: GenreResponseProps;
  movies: MovieProps[];
}
//Criação do Contexto
const MovieContext = createContext<MovieContextProps>({} as MovieContextProps);

//Tipando as propriedades do Provider
interface MovieProviderProps {
  children: ReactNode;
}

export function MovieProvider({ children }: MovieProviderProps) {
  //Variável que mantém o gênero selecionado
  const [selectedGenreId, setSelectedGenreId] = useState(1);

  //Array de gêneros de filmes
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  //Array de filmes por gênero
  const [movies, setMovies] = useState<MovieProps[]>([]);

  //Objeto que contém o título do gênero selecionado
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>(
    {} as GenreResponseProps
  );

  const handleClickButton = useCallback((id: number) => {
    setSelectedGenreId(id);
  }, []);

  useEffect(() => {
    //A api retorna um array de gêneros de filmes (array de objetos)
    api.get<GenreResponseProps[]>("genres").then((response) => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    //A api retorna um array de filmes do gênero selecionado (array de objetos)
    api
      .get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`)
      .then((response) => {
        setMovies(response.data);
      });

    //Busca na api um objeto de acordo com o id do gênero selecionado (um objeto)
    api
      .get<GenreResponseProps>(`genres/${selectedGenreId}`)
      .then((response) => {
        setSelectedGenre(response.data);
      });
  }, [selectedGenreId]);
  return (
    <MovieContext.Provider
      value={{
        genres,
        handleClickButton,
        selectedGenreId,
        selectedGenre,
        movies,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovie() {
  const context = useContext(MovieContext);
  return context;
}
