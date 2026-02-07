import { FormEvent, useState } from "react";
import { Button } from "../components/foundation/Button";
import { TextInput } from "../components/foundation/TextInput";

export function SearchWidget(): JSX.Element {
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    const params = new URLSearchParams({ q: trimmed });
    window.location.href = `https://www.google.com/search?${params.toString()}`;
  }

  return (
    <form className="flex h-full flex-col justify-center gap-3" onSubmit={handleSubmit}>
      <label className="text-sm font-medium text-ink/75" htmlFor="dashboard-search">
        Google Search
      </label>
      <TextInput
        id="dashboard-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search the web..."
      />
      <Button type="submit">Search</Button>
    </form>
  );
}
