import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ExerciseRunner } from "@/components/ExerciseRunner";
import { exercises, getExercise } from "@/data/content";

export function generateStaticParams() {
  return exercises.map((e) => ({ id: e.id }));
}

export default function ExercisePage({ params }: { params: { id: string } }) {
  const exercise = getExercise(params.id);

  if (!exercise) {
    return (
      <div className="page page-anim">
        <div className="soon">
          <div className="soon-mark" style={{ background: "rgba(255,93,77,0.12)", color: "var(--bad)", borderColor: "rgba(255,93,77,0.3)" }}>
            <Icon name="alert" size={28} />
          </div>
          <h2>Oefening niet gevonden</h2>
          <p>De oefening &ldquo;{params.id}&rdquo; bestaat niet (meer).</p>
          <Link href="/oefeningen" className="btn btn-primary" style={{ textDecoration: "none" }}>
            <Icon name="list" size={16} />
            Naar de oefeningen
          </Link>
        </div>
      </div>
    );
  }

  // key forces a fresh ExerciseRunner per exercise so file/editor state never
  // carries over from a previously opened exercise.
  return <ExerciseRunner key={exercise.id} exercise={exercise} />;
}
