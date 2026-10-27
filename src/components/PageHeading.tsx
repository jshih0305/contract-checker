type PageHeadingProps = {
  eyebrow: string;
  title: string;
  body?: string;
};

export default function PageHeading({ eyebrow, title, body }: PageHeadingProps) {
  return (
    <header className="flex flex-col gap-3">
      <p className="eyebrow flex items-center gap-3">
        <span className="h-px w-6 bg-accent" />
        {eyebrow}
      </p>
      <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {body && <p className="leading-7 text-ink-soft">{body}</p>}
    </header>
  );
}
