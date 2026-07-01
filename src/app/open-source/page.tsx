import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { openSourceProjects } from "@/data/open-source";

export const metadata: Metadata = {
  title: "Open Source",
  description: "Open source projects from XARIV.",
};

export default function OpenSourcePage() {
  return (
    <Section className="pt-16">
      <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">
        Open Source
      </h1>
      <p className="mt-4 max-w-xl text-ink-soft">
        Core infrastructure intelligence tooling, released for the community to
        extend and validate.
      </p>

      <div className="mt-16 grid gap-8">
        {openSourceProjects.map((project) => (
          <Card key={project.name} className="p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h2 className="font-display text-xl font-medium text-ink">
                {project.name}
              </h2>
              <span className="rounded-full border border-line px-3 py-1 text-xs text-muted capitalize">
                {project.status}
              </span>
            </div>
            <p className="mt-4 max-w-2xl text-ink-soft">{project.description}</p>
            {project.roadmap && (
              <p className="mt-4 text-sm text-muted">
                <span className="font-medium text-ink-soft">Roadmap: </span>
                {project.roadmap}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={project.github} external>
                GitHub
              </Button>
              {project.docs && (
                <Button href={project.docs} variant="secondary">
                  Documentation
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
