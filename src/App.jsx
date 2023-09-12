import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Pagination, Select, MenuItem, InputAdornment, Card, CardContent, TablePagination
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';

const fetchPokemons = async () => {
  const response = await fetch("/pokemon.json");
  return await response.json();
}

const computePower = (pokemon) => {
  return pokemon.hp + pokemon.attack + pokemon.defense +
    pokemon.special_attack + pokemon.special_defense + pokemon.speed;
}

const SearchBar = ({ searchTerm, onSearchTermChange, powerThreshold, onPowerThresholdChange }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <TextField
        value={searchTerm}
        onChange={e => onSearchTermChange(e.target.value)}
        placeholder="Search "
        fullWidth
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        value={powerThreshold}
        onChange={e => onPowerThresholdChange(e.target.value)}
        placeholder="Power Threshold"
        type="number"
        fullWidth
        variant="outlined"
        style={{ marginTop: '10px' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FavoriteIcon  />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [powerThreshold, setPowerThreshold] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    (async () => {
      const data = await fetchPokemons();
      setPokemons(data);
    })();
  }, []);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const filteredPokemons = pokemons.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) && computePower(pokemon) >= powerThreshold
  );

  const paginatedPokemons = filteredPokemons.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const minPower = Math.min(...paginatedPokemons.map(computePower));
  const maxPower = Math.max(...paginatedPokemons.map(computePower));

  return (
    <div className="container">
      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchTermChange={setSearchTerm} 
            powerThreshold={powerThreshold} 
            onPowerThresholdChange={setPowerThreshold}
          />
          <div style={{ marginTop: '10px' }}>
            <span>Min Power: {minPower} | </span>
            <span>Max Power: {maxPower}</span>
          </div>
        </CardContent>
      </Card>

      <TableContainer component={Paper} style={{ maxHeight: 440, marginBottom: '20px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>HP</TableCell>
              <TableCell>Attack</TableCell>
              <TableCell>Defense</TableCell>
              <TableCell>Special Attack</TableCell>
              <TableCell>Special Defense</TableCell>
              <TableCell>Speed</TableCell>
              <TableCell>Power</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPokemons.map(pokemon => (
              <TableRow key={pokemon.id}>
                <TableCell>{pokemon.id}</TableCell>
                <TableCell>{pokemon.name}</TableCell>
                <TableCell>{pokemon.type.join(", ")}</TableCell>
                <TableCell>{pokemon.hp}</TableCell>
                <TableCell>{pokemon.attack}</TableCell>
                <TableCell>{pokemon.defense}</TableCell>
                <TableCell>{pokemon.special_attack}</TableCell>
                <TableCell>{pokemon.special_defense}</TableCell>
                <TableCell>{pokemon.speed}</TableCell>
                <TableCell>{computePower(pokemon)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <TablePagination
          component="div"
          count={filteredPokemons.length}
          page={currentPage - 1}
          onPageChange={(_, page) => setCurrentPage(page + 1)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
}

export default App;
