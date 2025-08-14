import React from 'react';
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: { name: string };
  location: { name: string };
}

// Fetching the Rick & Morty Characters details data
const fetchCharacter = async (id: string): Promise<Character> => {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

const CharacterDetail: React.FC = () => {
  const { id } = useParams({ from: '/character/$id' });
  console.log('id.....', id);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['character', id],
    queryFn: () => fetchCharacter(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading character.</div>;

  return (
    <div>
      <h2>{data.name}</h2>
      <img src={data.image} alt={data.name} />
      <ul>
        <li>Status: {data.status}</li>
        <li>Species: {data.species}</li>
        <li>Gender: {data.gender}</li>
        <li>Origin: {data.origin.name}</li>
        <li>Location: {data.location.name}</li>
      </ul>
    </div>
  );
};

export default CharacterDetail;
