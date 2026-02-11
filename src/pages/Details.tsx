import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Details = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="container py-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to search
      </Link>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-data text-lg font-semibold text-foreground">{query.toUpperCase()}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Details view — connect your API to see live data.
        </p>
      </div>
    </div>
  );
};

export default Details;
