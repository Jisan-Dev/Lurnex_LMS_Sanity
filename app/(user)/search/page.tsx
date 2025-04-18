interface SearchPageProps {
  searchParams: Promise<{ term: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const term = (await searchParams).term;
  return <div>{term}</div>;
}
