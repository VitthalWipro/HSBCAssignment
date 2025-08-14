import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

// Fetching the Rick & Morty Characters details data

const fetchCharacters = async (page: number): Promise<ApiResponse> => {
  const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

const CharacterList: React.FC = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/', select: s => s });
  const [refreshKey, setRefreshKey] = useState(0);
  const page = Number(search.page) || 1;

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['characters', page, refreshKey],
    queryFn: () => fetchCharacters(page),
    staleTime: 1000 * 60,
  });

  const columns = React.useMemo<ColumnDef<Character>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Status',
        accessorKey: 'status',
      },
      {
        header: 'Species',
        accessorKey: 'species',
      },
      {
        header: 'Gender',
        accessorKey: 'gender',
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.results ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row: Character) => String(row.id),
  });

  const handlePageChange = (newPage: number) => {
    navigate({
      to: '/',
      search: { page: newPage },
    });
  };

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading characters.</div>;

  return (
    <div>
      <button onClick={handleRefresh}>Refresh</button>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} onClick={() => navigate({ to: `/character/${row.id}` })} style={{ cursor: 'pointer' }}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
          Previous
        </button>
  <span> Page {page} of {data?.info.pages} </span>
  <button disabled={!data?.info.next} onClick={() => handlePageChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CharacterList;
