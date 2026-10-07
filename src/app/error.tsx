"use client";

export default function HomeError({ reset }: { error: Error; reset: () => void }) {
  return (
    <article className="quiet">
      <h1>Home could not open just now.</h1>
      <p className="lede">Nothing was lost. You can try again when you want.</p>
      <button type="button" className="retry" onClick={reset}>
        Try again
      </button>
    </article>
  );
}
